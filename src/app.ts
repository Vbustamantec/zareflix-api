import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import { checkJwt } from "./middlewares/auth.middleware";
import Database from "./config/database";
import routes from "./routes/index";
import recommendationsRoutes from "./routes/recommendations.routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
	cors({
		origin: `*`,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(specs, {
		customCssUrl:
			"https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-material.css",
	})
);

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
			console.log(
				`API Documentation available on http://localhost:${PORT}/api-docs`
			);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
