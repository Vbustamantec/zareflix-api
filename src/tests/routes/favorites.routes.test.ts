import express from "express";
import request from "supertest";
import favoritesRoutes from "../../routes/favorites.routes";
import Database from "../../config/database";

jest.mock("../../middlewares/auth.middleware");

const app = express();
app.use(express.json());
app.use("/api/favorites", favoritesRoutes);

describe("Favorites Routes", () => {
	beforeAll(async () => {
		process.env.NODE_ENV = "test";
		await Database.getInstance().connect();
	});

	afterAll(async () => {
		await Database.getInstance().disconnect();
	});

	beforeEach(async () => {
		const db = Database.getInstance().getDb();
		await db.collection("favorites").deleteMany({});
		await db.collection("users").deleteMany({});
	});

	test("should add a favorite movie", async () => {
		const response = await request(app).post("/api/favorites").send({
			movieId: "tt0111161",
			title: "The Shawshank Redemption",
			poster: "http://example.com/poster.jpg",
			year: "1994",
			personalNotes: "Amazing movie!",
		});
		expect(response.status).toBe(201);
		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveProperty("_id");
		expect(response.body.data.title).toBe("The Shawshank Redemption");
	});

	test("should return favorite movies for a user", async () => {
		await request(app).post("/api/favorites").send({
			movieId: "tt0111161",
			title: "The Shawshank Redemption",
			poster: "http://example.com/poster.jpg",
			year: "1994",
			personalNotes: "Amazing movie!",
		});

		const response = await request(app).get("/api/favorites");
		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data.length).toBeGreaterThan(0);
		expect(response.body.data[0].title).toBe("The Shawshank Redemption");
	});

	test("should update a favorite movie", async () => {
		const addResponse = await request(app).post("/api/favorites").send({
			movieId: "tt0068646",
			title: "The Godfather",
			poster: "http://example.com/poster.jpg",
			year: "1972",
			personalNotes: "Great movie!",
		});

		const favoriteId = addResponse.body.data._id;

		const response = await request(app)
			.put(`/api/favorites/${favoriteId}`)
			.send({
				title: "The Godfather Updated",
				personalNotes: "Even better after rewatching!",
			});
		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data.title).toBe("The Godfather Updated");
		expect(response.body.data.personalNotes).toBe(
			"Even better after rewatching!"
		);
	});

	test("should delete a favorite movie", async () => {
		const addResponse = await request(app).post("/api/favorites").send({
			movieId: "tt0071562",
			title: "The Godfather: Part II",
			poster: "http://example.com/poster.jpg",
			year: "1974",
			personalNotes: "Another classic!",
		});

		const favoriteId = addResponse.body.data._id;

		const response = await request(app).delete(`/api/favorites/${favoriteId}`);
		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe("Favorite removed successfully");
	});
});
