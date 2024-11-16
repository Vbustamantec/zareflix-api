import express, { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errorHandler";
import { attachFavoriteMovieRepository } from "../middlewares/repository.middleware";
import { FavoriteMovieRepository } from "../repositories/favoriteMovie.repository";
import { syncUser } from "../middlewares/userSync.middleware";

interface ReqLocal extends Request {
	favoriteMovieRepository?: FavoriteMovieRepository;
}

const router = express.Router();

router.use(attachFavoriteMovieRepository, syncUser);

router.get("/", async (req: ReqLocal, res: Response, next: NextFunction) => {
	try {
		const repository = req.favoriteMovieRepository!;
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

router.post("/", async (req: ReqLocal, res: Response, next: NextFunction) => {
	try {
		const repository = req.favoriteMovieRepository!;

		const { movieId, title, poster, year, userId } = req.body;

		if (!movieId || !title) {
			throw new AppError(400, "Missing required fields");
		}

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

router.put("/:id", async (req: ReqLocal, res: Response, next: NextFunction) => {
	try {
		const repository = req.favoriteMovieRepository!;
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

router.delete(
	"/:id",
	async (req: ReqLocal, res: Response, next: NextFunction) => {
		try {
			const repository = req.favoriteMovieRepository!;
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
	}
);

export default router;
