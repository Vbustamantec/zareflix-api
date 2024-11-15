import express, { Request, Response, NextFunction } from "express";
import { checkJwt } from "../middlewares/auth.middleware";
import { AppError } from "../utils/errorHandler";
import { attachUserRepository } from "../middlewares/repository.middleware";
import { UserRepository } from "../repositories/user.repository";

const router = express.Router();

interface ReqLocal extends Request {
	userRepository?: UserRepository;
}

router.use(attachUserRepository, checkJwt);

router.get(
	"/me",
	checkJwt,
	async (req: ReqLocal, res: Response, next: NextFunction) => {
		try {
			const repository = req.userRepository!;
			const auth0Id = req.auth?.payload.sub;

			if (!auth0Id) {
				throw new AppError(401, "No auth0Id found");
			}

			const user = await repository.findByAuth0Id(auth0Id);

			if (!user) {
				throw new AppError(404, "User not found");
			}

			res.json({
				success: true,
				data: user,
			});
		} catch (error) {
			next(error);
		}
	}
);

router.post(
	"/sync",
	checkJwt,
	async (req: ReqLocal, res: Response, next: NextFunction) => {
		try {
			const repository = req.userRepository!;
			const auth0User = req.auth?.payload;

			if (!auth0User?.sub) {
				throw new AppError(401, "No auth0Id found");
			}

			let user = await repository.findByAuth0Id(auth0User.sub);

			if (!user) {
				user = await repository.createUser({
					auth0Id: auth0User.sub,
					email: auth0User.email as string,
					nickname: auth0User.nickname as string,
				});
			} else {
				await repository.updateLastLogin(auth0User.sub);
			}

			res.json({
				success: true,
				data: user,
			});
		} catch (error) {
			next(error);
		}
	}
);

export default router;
