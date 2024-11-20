import { HfInference } from "@huggingface/inference";
import { getMovieById, searchMovies } from "./movie.service";
import {
	MovieRecommendation,
	RecommendationResponse,
} from "../interfaces/movie.interface";
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

	private extractMovieTitles(recommendations: string[]): string[] {
		return recommendations
			?.map((recommendation) => {
				const match = recommendation.match(/^\d+\.\s+(.*?)\s+\(\d{4}\)/);
				return match ? match[1].trim() : "";
			})
			.filter(Boolean);
	}

	public async getRecommendations(
		movieId: string
	): Promise<RecommendationResponse> {
		try {
			// 1. Obtener detalles de la película original
			const movie = await getMovieById(movieId);
			if (!movie) {
				throw new Error("Movie not found");
			}

			const { Title, Year, Genre, Plot } = movie;

			// 2. Generar y obtener recomendaciones AI
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

			// 3. Procesar recomendaciones AI
			const recommendations = result.generated_text
				.split("\n")
				.filter((line) => /^\d+\./.test(line));

			const movieTitles = this.extractMovieTitles(recommendations);
			const movieDetailsPromises = movieTitles?.map((title) =>
				this.getMovieDetailsFromOMDB(title)
			);

			let movieDetails = await Promise.all(movieDetailsPromises);
			let validMovieDetails = movieDetails
				.filter((movie): movie is MovieRecommendation => movie !== null)
				.slice(0, 5);

			// 4. Si no hay suficientes recomendaciones AI, usar fallbacks basados en géneros
			if (validMovieDetails.length < 5) {
				const genres: string[] = Genre.split(",").map((genre: string) =>
					genre.trim()
				);
				const existingTitles = new Set(validMovieDetails.map((m) => m.Title));

				for (const genre of genres) {
					const fallbackTitles = this.genreFallbacks[genre] || [];

					for (const title of fallbackTitles) {
						if (validMovieDetails.length >= 5) break;
						if (existingTitles.has(title)) continue; // Evitar duplicados

						const movieDetail = await this.getMovieDetailsFromOMDB(title);
						if (movieDetail) {
							validMovieDetails.push(movieDetail);
							existingTitles.add(title);
						}
					}

					if (validMovieDetails.length >= 5) break;
				}

				// 5. Si aún faltan recomendaciones, usar fallbacks de 'default'
				if (validMovieDetails.length < 5) {
					const fallbackTitles = this.genreFallbacks["default"];
					for (const title of fallbackTitles) {
						if (validMovieDetails.length >= 5) break;
						if (existingTitles.has(title)) continue; // Evitar duplicados

						const movieDetail = await this.getMovieDetailsFromOMDB(title);
						if (movieDetail) {
							validMovieDetails.push(movieDetail);
							existingTitles.add(title);
						}
					}
				}
			}

			// Asegurarse de que siempre haya 5 recomendaciones
			validMovieDetails = validMovieDetails.slice(0, 5);

			return {
				movie: {
					title: Title,
					genre: Genre,
					year: Year,
				},
				recommendations: validMovieDetails,
			};
		} catch (error) {
			console.error("Error getting recommendations:", error);
			throw error;
		}
	}
}
