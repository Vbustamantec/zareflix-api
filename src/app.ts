import express, { Request, Response } from "express";
import Database from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (_req: Request, res: Response) => {
	try {
		const db = Database.getInstance();
		await db.connect();
		res.send("MongoDB connection successful!");
	} catch (error) {
		res.status(500).send("Failed to connect to MongoDB");
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
