import { FavoriteMovieRepository } from "../repositories/favoriteMovie.repository";
import { UserRepository } from "../repositories/user.repository";

declare global {
	namespace Express {
		interface Auth0JwtPayload extends JwtPayload {
			sub: string;
			email?: string;
			nickname?: string;
			[key: string]: any;
		}

		interface Request {
			userRepository?: UserRepository;
			favoriteMovieRepository?: FavoriteMovieRepository;
			userId?: string;
			auth?: {
				payload: Auth0JwtPayload;
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
