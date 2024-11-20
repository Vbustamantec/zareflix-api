import { Router } from "express";
import { sentimentService } from "../services/sentiment.service";
import { validators } from "../validators/zod.validators";

const router = Router();

router.post("/analyze", validators.sentiment.analyze, async (req, res) => {
	try {
		const { text } = req.body;

		if (!text) {
			return res.status(400).json({
				success: false,
				error: "Text is required",
			});
		}

		const analysis = await sentimentService.analyzeSentiment(text);

		res.json({
			success: true,
			data: analysis,
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({
			success: false,
			error: "Failed to analyze sentiment",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

export default router;
