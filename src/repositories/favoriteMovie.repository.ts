import { ObjectId } from "mongodb";
import { BaseRepository } from "./base.repository";
import {
	FavoriteMovie,
	AddFavoriteDTO,
	UpdateFavoriteDTO,
} from "../interfaces/movie.interface";

export class FavoriteMovieRepository extends BaseRepository<FavoriteMovie> {
	constructor() {
		super("favorites");
	}

	async findByUserId(userId: string): Promise<FavoriteMovie[]> {
		try {
			return await this.collection.find({ userId }).toArray();
		} catch (error) {
			throw new Error("Error fetching favorites from database");
		}
	}

	async findByUserAndMovie(
		userId: string,
		movieId: string
	): Promise<FavoriteMovie | null> {
		try {
			return await this.collection.findOne({ userId, movieId });
		} catch (error) {
			throw new Error("Error checking favorite status");
		}
	}

	async create(
		userId: string,
		movieData: AddFavoriteDTO
	): Promise<FavoriteMovie> {
		try {
			const favorite: Omit<FavoriteMovie, "_id"> = {
				userId,
				...movieData,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const result = await this.collection.insertOne(favorite);

			return { ...favorite, _id: result.insertedId };
		} catch (error) {
			throw new Error("Error checking favorite status");
		}
	}

	async update(
		id: string,
		userId: string,
		movieData: UpdateFavoriteDTO
	): Promise<FavoriteMovie | null> {
		try {
			const result = await this.collection.findOneAndUpdate(
				{ _id: new ObjectId(id), userId },
				{
					$set: {
						...movieData,
						updatedAt: new Date(),
					},
				},
				{ returnDocument: "after" }
			);

			return result.value;
		} catch (error) {
			throw new Error("Error updating favorite");
		}
	}

	async delete(id: string, userId: string): Promise<boolean> {
		try {
			const result = await this.collection.deleteOne({
				_id: new ObjectId(id),
				userId,
			});
			return result.deletedCount > 0;
		} catch (error) {
			throw new Error("Error deleting favorite");
		}
	}
}
