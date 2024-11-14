import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import {
	checkJwt,
	extractUserId,
	errorHandler,
} from "./middlewares/auth.middleware";
import Database from "./config/database";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
	cors({
		origin: "*" /* [
			process.env.PROD_FRONTEND_URL || "",
			process.env.DEV_FRONTEND_URL || "",
		] */,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

app.get('/api/public', (req, res) => {
	res.json({ message: 'This is a public endpoint' });
  });

app.get("/api/protected", checkJwt, extractUserId, (req, res) => {
	res.json({
		message: "You are authenticated!",
		userId: req.userId,
	});
});

app.use(errorHandler);

const startServer = async () => {
	try {
		const db = Database.getInstance();
		await db.connect();
		console.log("Connected to MongoDB");

		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
