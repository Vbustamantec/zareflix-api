export interface SentimentAnalysisResponse {
	sentiment: "positive" | "negative" | "neutral";
	score: number;
}

export interface HuggingFaceResponse {
	label: string;
	score: number;
}
