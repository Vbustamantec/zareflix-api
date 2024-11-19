import express from "express";
import request from "supertest";
import recommendationsRoutes from "../../routes/recommendations.routes";
import Database from "../../config/database";

jest.mock("../../middlewares/auth.middleware");

jest.mock("@huggingface/inference");

jest.mock("../../services/movie.service", () => ({
	getMovieById: jest.fn(),
}));

import { getMovieById } from "../../services/movie.service";
import { HfInference } from "@huggingface/inference";

(HfInference as jest.Mock).mockImplementation(() => {
	return {
		textGeneration: jest.fn().mockResolvedValue({
			generated_text: `1. Mock Movie 1 (2021)\n2. Mock Movie 2 (2022)\n3. Mock Movie 3 (2023)\n4. Mock Movie 4 (2024)\n5. Mock Movie 5 (2025)`,
		}),
		textClassification: jest.fn().mockResolvedValue([
			{
				label: "5 stars",
			},
		]),
	};
});

const app = express();
app.use(express.json());
app.use("/recommendations", recommendationsRoutes);

describe("Recommendations Routes", () => {
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

		(getMovieById as jest.Mock).mockResolvedValue({
			Title: "The Shawshank Redemption",
			Year: "1994",
			Genre: "Drama",
			Plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
		});
	});

	test("should return recommendations for a valid movieId", async () => {
		const response = await request(app).get("/recommendations/tt0111161");
		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveProperty("recommendations");
		expect(response.body.data.recommendations.length).toBe(5);
		expect(response.body.data.recommendations[0]).toBe(
			"1. Grave of the Fireflies (1988)"
		);
	});

	test("should return 404 if movieId is missing", async () => {
		const response = await request(app).get("/recommendations/");
		expect(response.status).toBe(404);
	});
});
