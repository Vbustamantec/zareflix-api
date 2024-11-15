import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";

declare module "express" {
	interface Request {
		auth?: {
			payload: {
				sub: string;
				email?: string;
				nickname?: string;
				[key: string]: any;
			};
		};
	}
}

export const syncUser = (req: Request, res: Response, next: NextFunction) => {
	try {
		const auth0User = req.auth?.payload;

		if (!auth0User?.sub) {
			return next();
		}

		const userRepo = new UserRepository();

		userRepo
			.findByAuth0Id(auth0User.sub)
			.then((user) => {
				if (!user) {
					return userRepo.createUser({
						auth0Id: auth0User.sub,
						email: auth0User.email as string,
						nickname: auth0User.nickname as string,
					});
				}
				return userRepo.updateLastLogin(auth0User.sub).then(() => user);
			})
			.then((user) => {
				res.locals.userId = user._id;
				next();
			})
			.catch(next);
	} catch (error) {
		next(error);
	}
};
