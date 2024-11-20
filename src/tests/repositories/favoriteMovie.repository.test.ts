import { FavoriteMovieRepository } from "../../repositories/favoriteMovie.repository";
import Database from "../../config/database";

describe("FavoriteMovieRepository", () => {
	let favoriteMovieRepository: FavoriteMovieRepository;

	beforeAll(async () => {
		await Database.getInstance().connect();
		favoriteMovieRepository = new FavoriteMovieRepository();
	});

	afterAll(async () => {
		await Database.getInstance().disconnect();
	});

	test("should create a favorite movie", async () => {
		const movieData = {
			movieId: "tt0111161",
			title: "The Shawshank Redemption",
			poster: "http://example.com/poster.jpg",
			year: "1994",
			personalNotes: "Amazing movie!",
		};

		const favorite = await favoriteMovieRepository.create("user123", movieData);
		expect(favorite).toHaveProperty("_id");
		expect(favorite.title).toBe(movieData.title);
	});

	test("should find favorite movies by userId", async () => {
		const userId = "user123";
		const favorites = await favoriteMovieRepository.findByUserId(userId);
		expect(favorites.length).toBeGreaterThan(0);
	});

	test("should delete a favorite movie", async () => {
		const userId = "user123";
		const favorites = await favoriteMovieRepository.findByUserId(userId);
		const movieIdToDelete = favorites[0]._id;
		const deleted = await favoriteMovieRepository.delete(
			movieIdToDelete as any,
			userId
		);
		expect(deleted).toBe(true);
	});
});
