import { FavoriteMovieRepository } from "../repositories/favoriteMovie.repository";
import Database from "../config/database";

import "./setup";

async function testRepository() {
	try {
		console.log("Testing with MongoDB URI:", process.env.MONGODB_URI);

		const db = Database.getInstance();
		await db.connect();
		console.log("Connected to database successfully");

		const repository = new FavoriteMovieRepository();

		const testMovie = await repository.create("test-user-id", {
			movieId: "tt1234567",
			title: "Test Movie",
			poster: "http://example.com/poster.jpg",
			year: "2024",
		});
		console.log("Created movie:", testMovie);

		const userMovies = await repository.findByUserId("test-user-id");
		console.log("User movies:", userMovies);

		if (testMovie._id) {
			const updated = await repository.update(
				testMovie._id.toString(),
				"test-user-id",
				{
					personalNotes: "Great movie!",
				}
			);
			console.log("Updated movie:", updated);
		}

		if (testMovie._id) {
			const deleted = await repository.delete(
				testMovie._id.toString(),
				"test-user-id"
			);
			console.log("Delete result:", deleted);
		}

		await db.disconnect();
		process.exit(0);
	} catch (error) {
		console.error("Test failed:", error);
		process.exit(1);
	}
}

testRepository();
