import { Router } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import userRoutes from "./user.routes";
import favoritesRoutes from "./favorites.routes";
import { handleError } from "../utils/errorHandler";
import { syncUser } from "../middlewares/userSync.middleware";

const router = Router();

router.get(
	"/public",
	asyncHandler(async (req, res) => {
		res.status(200).json({
			success: true,
			message: "Public route",
		});
	})
);

router.post(
	"/sync",
	syncUser,
	asyncHandler(async (req, res) => {
		const userId = res.locals.userId;

		res.status(200).json({
			success: true,
			message: "User synchronized successfully",
			data: {
				userId: userId,
			},
		});
	})
);

router.use("/user", userRoutes);
router.use("/favorites", favoritesRoutes);

router.use((err: any, req: any, res: any, next: any) => {
	const error = handleError(err);
	res.status(error.status).json({
		success: false,
		error: error.message,
		code: error.code,
	});
});

export default router;
