import { HfInference } from "@huggingface/inference";

class SentimentService {
	private hf: HfInference;

	constructor() {
		const apiKey = process.env.HUGGINGFACE_API_KEY;
		if (!apiKey) {
			throw new Error("HUGGINGFACE_API_KEY is not defined");
		}
		this.hf = new HfInference(apiKey);
	}

	async analyzeSentiment(text: string): Promise<{
		sentiment: "positive" | "negative" | "neutral";
		score: number;
	}> {
		try {
			const response = await this.hf.textClassification({
				model: "nlptown/bert-base-multilingual-uncased-sentiment",
				inputs: text,
			});

			const label = response[0].label;
			const score = parseInt(label.split(" ")[0]);

			let sentiment: "positive" | "negative" | "neutral";
			if (score >= 4) {
				sentiment = "positive";
			} else if (score <= 2) {
				sentiment = "negative";
			} else {
				sentiment = "neutral";
			}

			return {
				sentiment,
				score: score / 5,
			};
		} catch (error) {
			console.error("Error analyzing sentiment:", error);
			return {
				sentiment: "neutral",
				score: 0.5,
			};
		}
	}
}

export const sentimentService = new SentimentService();
