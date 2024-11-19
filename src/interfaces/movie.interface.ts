import { ObjectId } from "bson";

export interface FavoriteMovie {
	_id?: ObjectId;
	userId: string;
	movieId: string;
	title: string;
	poster: string;
	year: string;
	personalNotes?: string;
	sentiment?: {
		sentiment: string;
		score: number;
	};
	createdAt: Date;
	updatedAt: Date;
}

export interface RecommendedMovie {
	Title: string;
	Year: string;
	Genre: string;
	Plot: string;
	[key: string]: any;
}

export interface AddFavoriteDTO {
	movieId: string;
	title: string;
	poster: string;
	year: string;
	personalNotes?: string;
}

export interface UpdateFavoriteDTO {
	title?: string;
	personalNotes?: string;
	sentiment?: {
		sentiment: "positive" | "negative" | "neutral";
		score: number;
	};
}

export interface MovieRecommendation {
	Title: string;
	Year: string;
	imdbID: string;
	Poster: string;
	Type: string;
}

export interface RecommendationResponse {
	movie: {
		title: string;
		genre: string;
		year: string;
	};
	recommendations: MovieRecommendation[];
}
