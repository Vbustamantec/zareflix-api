import { Router } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { checkJwt } from "../middlewares/auth.middleware";

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

export default router;
