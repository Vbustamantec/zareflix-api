import express from "express";
import { checkJwt } from "../middlewares/auth.middleware";
import { syncUser } from "../middlewares/userSync.middleware";
import { FavoriteMovieRepository } from "../repositories/favoriteMovie.repository";
import { AppError } from "../utils/errorHandler";

const router = express.Router();
const repository = new FavoriteMovieRepository();

router.use(checkJwt, syncUser);

// GET /api/favorites
router.get("/", async (req, res, next) => {
	try {
		const userId = res.locals.userId;
		const favorites = await repository.findByUserId(userId);

		res.json({
			success: true,
			data: favorites,
		});
	} catch (error) {
		next(error);
	}
});

// POST /api/favorites
router.post("/", async (req, res, next) => {
	try {
		const userId = res.locals.userId;
		const { movieId, title, poster, year } = req.body;

		// Validar datos requeridos
		if (!movieId || !title) {
			throw new AppError(400, "Missing required fields");
		}

		// Verificar si ya existe
		const existing = await repository.findByUserAndMovie(userId, movieId);
		if (existing) {
			throw new AppError(400, "Movie already in favorites");
		}

		const favorite = await repository.create(userId, {
			movieId,
			title,
			poster,
			year,
			personalNotes: req.body.personalNotes,
		});

		res.status(201).json({
			success: true,
			data: favorite,
		});
	} catch (error) {
		next(error);
	}
});

// PUT /api/favorites/:id
router.put("/:id", async (req, res, next) => {
	try {
		const userId = res.locals.userId;
		const { id } = req.params;
		const { title, personalNotes } = req.body;

		const updated = await repository.update(id, userId, {
			title,
			personalNotes,
		});

		if (!updated) {
			throw new AppError(404, "Favorite not found");
		}

		res.json({
			success: true,
			data: updated,
		});
	} catch (error) {
		next(error);
	}
});

// DELETE /api/favorites/:id
router.delete("/:id", async (req, res, next) => {
	try {
		const userId = res.locals.userId;
		const { id } = req.params;

		const deleted = await repository.delete(id, userId);
		if (!deleted) {
			throw new AppError(404, "Favorite not found");
		}

		res.json({
			success: true,
			message: "Favorite removed successfully",
		});
	} catch (error) {
		next(error);
	}
});

export default router;
