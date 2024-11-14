import { ObjectId } from "bson";

export interface FavoriteMovie {
	_id?: ObjectId;
	userId: string;
	movieId: string;
	title: string;
	poster: string;
	year: string;
	personalNotes?: string;
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
}
