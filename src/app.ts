import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Database } from "./config/database";

dotenv.config();

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);
app.use(express.json());

app.get("/health", (_, res) => {
	res.json({ status: "ok", timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;

Database.getInstance()
	.connect()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Failed to connect to database:", error);
		process.exit(1);
	});

export default app;
