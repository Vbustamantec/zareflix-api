import { Router } from "express";

import userRoutes from "./user.routes";
import favoritesRoutes from "./favorites.routes";
import { handleError } from "../utils/errorHandler";

const router = Router();

router.get("/private", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "This is a private route",
	});
});

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
