import { checkJwt } from "../../middlewares/auth.middleware";
import express from "express";
import request from "supertest";

const app = express();
app.get("/protected", checkJwt, (req, res) => {
	res.status(200).json({ message: "You have access" });
});

describe("Auth Middleware", () => {
	test("should deny access without token", async () => {
		const response = await request(app).get("/protected");
		expect(response.status).toBe(401);
	});
});
