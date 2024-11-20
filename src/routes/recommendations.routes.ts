import { Router } from "express";
import { RecommendationService } from "../services/recommendation.service";

const router = Router();
const recommendationService = new RecommendationService();

router.get("/:movieId", async (req, res) => {
	try {
		const movieId = req.params.movieId;

		if (!movieId) {
			return res.status(400).json({
				success: false,
				error: "Missing movieId parameter",
			});
		}

		const data = await recommendationService.getRecommendations(movieId);

		res.json({
			success: true,
			data,
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({
			success: false,
			error: "Failed to get recommendations",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

export default router;
