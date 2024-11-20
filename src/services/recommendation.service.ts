import { HfInference } from "@huggingface/inference";
import { getMovieById, searchMovies } from "./movie.service";
import {
	MovieRecommendation,
	RecommendationResponse,
} from "../interfaces/movie.interface";
import { GENRE_FALLBACKS } from "../constants/fallbacks";

export class RecommendationService {
	private hf: HfInference;

	constructor() {
		const apiKey = process.env.HUGGINGFACE_API_KEY;
		if (!apiKey) {
			throw new Error("HUGGINGFACE_API_KEY is not defined");
		}
		this.hf = new HfInference(apiKey);
	}

	private async getMovieDetailsFromOMDB(
		title: string
	): Promise<MovieRecommendation | null> {
		try {
			const searchResult = await searchMovies(title);
			if (searchResult.Search && searchResult.Search.length > 0) {
				return searchResult.Search[0];
			}
			return null;
		} catch (error) {
			console.error(`Error fetching details for movie: ${title}`, error);
			return null;
		}
	}

	private generatePrompt(
		title: string,
		year: string,
		genre: string,
		plot: string
	): string {
		return `You are a movie expert specializing in animated films and family entertainment. For the movie "${title}" (${year}), which is a ${genre} film, please recommend 5 similar movies.

The movie is about: ${plot}

Provide recommendations in this EXACT format: 1. Movie Title (Year), 2. Movie Title (Year), 3. Movie Title (Year), 4. Movie Title (Year), 5. Movie Title (Year)

Remember:
- only provide the requested number of recommendations and no more data, do it always in a list format and only the title and year of the movie no more information

`;
	}

	private async getFallbackRecommendations(
		genres: string[],
		existingTitles: Set<string>
	): Promise<MovieRecommendation[]> {
		const recommendations: MovieRecommendation[] = [];

		for (const genre of genres) {
			if (recommendations.length >= 5) break;

			const fallbacks = GENRE_FALLBACKS[genre] || [];
			for (const title of fallbacks) {
				if (recommendations.length >= 5) break;
				if (existingTitles.has(title)) continue;

				const movieDetail = await this.getMovieDetailsFromOMDB(title);
				if (movieDetail) {
					recommendations.push(movieDetail);
					existingTitles.add(title);
				}
			}
		}

		if (recommendations.length < 5) {
			for (const title of GENRE_FALLBACKS.default) {
				if (recommendations.length >= 5) break;
				if (existingTitles.has(title)) continue;

				const movieDetail = await this.getMovieDetailsFromOMDB(title);
				if (movieDetail) {
					recommendations.push(movieDetail);
					existingTitles.add(title);
				}
			}
		}

		return recommendations;
	}

	public async getRecommendations(
		movieId: string
	): Promise<RecommendationResponse> {
		const movie = await getMovieById(movieId);
		if (!movie) throw new Error("Movie not found");

		const { Title, Year, Genre, Plot } = movie;
		const genres = Genre.split(",").map((genre: string) => genre.trim());

		const prompt = this.generatePrompt(Title, Year, Genre, Plot);
		const result = await this.hf.textGeneration({
			model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
			inputs: prompt,
			parameters: {
				max_length: 500,
				temperature: 0.7,
				top_p: 0.95,
				repetition_penalty: 1.2,
				do_sample: true,
			},
		});

		const aiTitles = result.generated_text
			.split("\n")
			.filter((line) => /^\d+\./.test(line))
			.map((line) => {
				const match = line.match(/^\d+\.\s+(.*?)\s+\(\d{4}\)/);
				return match ? match[1].trim() : "";
			})
			.filter(Boolean);

		const existingTitles = new Set<string>();
		let recommendations: MovieRecommendation[] = [];

		for (const title of aiTitles) {
			if (recommendations.length >= 5) break;
			const movieDetail = await this.getMovieDetailsFromOMDB(title);
			if (movieDetail) {
				recommendations.push(movieDetail);
				existingTitles.add(title);
			}
		}

		if (recommendations.length < 5) {
			const fallbacks = await this.getFallbackRecommendations(
				genres,
				existingTitles
			);
			recommendations = [...recommendations, ...fallbacks].slice(0, 5);
		}

		return {
			movie: { title: Title, genre: Genre, year: Year },
			recommendations,
		};
	}
}
