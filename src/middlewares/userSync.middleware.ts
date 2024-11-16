import { Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";

interface UserRequest {
	userRepository?: UserRepository;
	auth?: {
		payload: any;
	};
	body: {
		email?: string;
		nickname?: string;
	};
}

export const syncUser = async (
	req: UserRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const auth0User = req.auth?.payload;

		if (!auth0User?.sub) {
			return next();
		}

		const userRepo = new UserRepository();
		let user = await userRepo.findByAuth0Id(auth0User.sub);

		if (!user) {
			user = await userRepo.createUser({
				auth0Id: auth0User.sub,
				email: auth0User.email as string,
				nickname: auth0User.nickname as string,
			});
		} else {
			await userRepo.updateLastLogin(auth0User.sub);
		}

		res.locals.userId = auth0User.sub;
		next();
	} catch (error) {
		next(error);
	}
};
