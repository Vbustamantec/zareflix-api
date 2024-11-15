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
			await this.ensureConnection();
			return await this.collection.find({ userId }).toArray();
		} catch (error) {
			console.error("Error fetching favorites:", error);
			throw new Error("Error fetching favorites from database");
		}
	}

	async findByUserAndMovie(
		userId: string,
		movieId: string
	): Promise<FavoriteMovie | null> {
		try {
			await this.ensureConnection();
			return await this.collection.findOne({ userId, movieId });
		} catch (error) {
			console.error("Error checking favorite:", error);
			throw new Error("Error checking favorite status");
		}
	}

	async create(
		userId: string,
		movieData: AddFavoriteDTO
	): Promise<FavoriteMovie> {
		try {
			await this.ensureConnection();
			const favorite: Omit<FavoriteMovie, "_id"> = {
				userId,
				...movieData,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const result = await this.collection.insertOne(favorite);
			return { ...favorite, _id: result.insertedId };
		} catch (error) {
			console.error("Error creating favorite:", error);
			throw new Error("Error creating favorite");
		}
	}

	async update(
		id: string,
		userId: string,
		movieData: UpdateFavoriteDTO
	): Promise<FavoriteMovie | null> {
		try {
			await this.ensureConnection();
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
			console.error("Error updating favorite:", error);
			throw new Error("Error updating favorite");
		}
	}

	async delete(id: string, userId: string): Promise<boolean> {
		try {
			await this.ensureConnection();
			const result = await this.collection.deleteOne({
				_id: new ObjectId(id),
				userId,
			});
			return result.deletedCount > 0;
		} catch (error) {
			console.error("Error deleting favorite:", error);
			throw new Error("Error deleting favorite");
		}
	}
}
