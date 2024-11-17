import { HfInference } from "@huggingface/inference";
import { getMovieById } from "./movie.service";
import { RecommendedMovie } from "../interfaces/movie.interface";
import { GENRE_FALLBACKS } from "../constants/fallbacks";

export class RecommendationService {
	private hf: HfInference;
	private readonly genreFallbacks: Record<string, string[]> = GENRE_FALLBACKS;

	constructor() {
		const apiKey = process.env.HUGGINGFACE_API_KEY;
		if (!apiKey) {
			throw new Error("HUGGINGFACE_API_KEY is not defined");
		}
		this.hf = new HfInference(apiKey);
	}

	private getFallbackRecommendations(genres: string[]): string[] {
		for (const genre of genres) {
			const normalizedGenre = genre.trim();
			if (this.genreFallbacks[normalizedGenre]) {
				return this.genreFallbacks[normalizedGenre];
			}
		}
		return this.genreFallbacks.default;
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

	private processRecommendations(rawText: string): string[] {
		return rawText
			.split("\n")
			.map((line) => line.trim())
			.filter(
				(line) => /^\d\./.test(line) && line.includes("(") && line.includes(")")
			)
			.map((line, index) => {
				let cleanLine = line
					.replace(/\\/g, "")
					.replace(/"/g, "")
					.replace(/\s+/g, " ")
					.trim();
				return `${index + 1}. ${cleanLine.replace(/^\d+\.\s*/, "")}`;
			})
			.slice(0, 5);
	}

	private completeRecommendations(
		recommendations: string[],
		genres: string[]
	): string[] {
		const fallbackRecommendations = this.getFallbackRecommendations(genres);

		const neededFallbacks = fallbackRecommendations
			.slice(0, 5 - recommendations.length)
			.map((fallback, index) => {
				const number = recommendations.length + index + 1;
				return `${number}. ${fallback.replace(/^\d+\.\s*/, "")}`;
			});

		return [...recommendations, ...neededFallbacks];
	}

	public async getRecommendations(
		movieId: string
	): Promise<{ movie: Partial<RecommendedMovie>; recommendations: string[] }> {
		const movie = await getMovieById(movieId);

		if (!movie) {
			throw new Error("Movie not found");
		}

		const { Title, Year, Genre, Plot } = movie;
		const prompt = this.generatePrompt(Title, Year, Genre, Plot);

		try {
			const result = await this.hf.textGeneration({
				model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
				inputs: prompt,
				parameters: {
					max_length: 500,
					temperature: 0.7,
					top_p: 0.95,
					repetition_penalty: 1.2,
					do_sample: true,
					early_stopping: true,
					num_beams: 5,
				},
			});

			let recommendations = this.processRecommendations(result.generated_text);

			if (recommendations.length > 0 && recommendations.length < 5) {
				const genres = Genre.split(",").map((g: string) => g.trim());
				recommendations = this.completeRecommendations(recommendations, genres);
			} else if (recommendations.length === 0) {
				const genres = Genre.split(",").map((g: string) => g.trim());
				recommendations = this.getFallbackRecommendations(genres);
			}

			return {
				movie: {
					title: Title,
					genre: Genre,
					year: Year,
				},
				recommendations,
			};
		} catch (error) {
			console.error("Error during recommendation generation:", error);
			const genres = Genre.split(",").map((g: string) => g.trim());
			return {
				movie: {
					title: Title,
					genre: Genre,
					year: Year,
				},
				recommendations: this.getFallbackRecommendations(genres),
			};
		}
	}
}
