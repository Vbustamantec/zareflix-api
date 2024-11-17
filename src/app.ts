import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { checkJwt } from "./middlewares/auth.middleware";
import Database from "./config/database";
import routes from "./routes/index";
import recommendationsRoutes from "./routes/recommendations.routes";
import { syncUser } from "./middlewares/userSync.middleware";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
	cors({
		origin: [
			"https://dev.d1fqa93qe94bl.amplifyapp.com",
			"http://localhost:3000",
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Authorization", "Content-Type"],
		exposedHeaders: ["Authorization"],
	})
);

app.get("/", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "Welcome to the API",
	});
});

app.use("/recommendations", recommendationsRoutes);

app.use("/api", checkJwt, routes);

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

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
