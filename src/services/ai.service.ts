import { HfInference } from "@huggingface/inference";

class AIService {
	private hf: HfInference;

	constructor() {
		const apiKey = process.env.HUGGINGFACE_API_KEY;
		if (!apiKey) {
			throw new Error("HUGGINGFACE_API_KEY is not defined");
		}
		this.hf = new HfInference(apiKey);
	}

	async getMovieRecommendations(
		movieTitle: string,
		genre?: string
	): Promise<string[]> {
		try {
			const prompt = `Given the movie "${movieTitle}"${
				genre ? ` (${genre})` : ""
			}, recommend 5 similar movies in the following format:
1. Movie Name (Year) - Brief reason for recommendation
2. Movie Name (Year) - Brief reason for recommendation
3. Movie Name (Year) - Brief reason for recommendation
4. Movie Name (Year) - Brief reason for recommendation
5. Movie Name (Year) - Brief reason for recommendation`;

			const response = await this.hf.textGeneration({
				model: "gpt2",
				inputs: prompt,
				parameters: {
					max_length: 250,
					num_return_sequences: 1,
					temperature: 0.7,
					top_k: 50,
					top_p: 0.95,
				},
			});

			const recommendations = response.generated_text
				.split("\n")
				.filter((line) => line.match(/^\d\./))
				.map((line) => line.replace(/^\d\.\s/, "").trim());

			return recommendations;
		} catch (error) {
			console.error("Error getting movie recommendations:", error);
			throw new Error("Failed to get movie recommendations");
		}
	}
}

export const aiService = new AIService();
