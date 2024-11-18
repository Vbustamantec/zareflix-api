

export interface FavoriteMovie {
	_id: string;
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

export interface RecommendedMovie {
	Title: string;
	Year: string;
	Genre: string;
	Plot: string;
	[key: string]: any;
}


