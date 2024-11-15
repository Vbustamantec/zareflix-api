import { Router } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { checkJwt } from "../middlewares/auth.middleware";

import userRoutes from "./user.routes";
import favoritesRoutes from "./favorites.routes";
import { handleError } from "../utils/errorHandler";

const router = Router();

router.get(
	"/",
	checkJwt,
	asyncHandler(async (req, res, next) => {
		res.status(200).send({ message: "This is a private route 1" });
	})
);

router.get(
	"/private-route",
	checkJwt,
	asyncHandler(async (req, res, next) => {
		res.status(200).send({ message: "This is a private route 2" });
	})
);

router.get(
	"/protected",
	checkJwt,
	asyncHandler(async (req, res, next) => {
		res.status(200).send({ message: "This is a private route 3" });
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
