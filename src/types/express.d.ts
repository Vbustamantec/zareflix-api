import { FavoriteMovieRepository } from "../repositories/favoriteMovie.repository";
import { UserRepository } from "../repositories/user.repository";

export interface Auth0JwtPayload extends JwtPayload {
	sub: string;
	email?: string;
	nickname?: string;
	[key: string]: any;
}

declare global {
	namespace Express {
		interface Request {
			userRepository?: UserRepository;
			favoriteMovieRepository?: FavoriteMovieRepository;
			userId?: string;
			auth?: {
				payload: Auth0JwtPayload;
			};
			body: {
				email: string;
				nickname?: string;
			};
		}

		interface Response {
			locals: {
				userId?: string;
				[key: string]: any;
			};
		}
	}
}
