import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";
import { FavoriteMovieRepository } from "../repositories/favoriteMovie.repository";

interface RepositoryRequest extends Request {
	userRepository?: UserRepository;
	favoriteMovieRepository?: FavoriteMovieRepository;
}

export const attachUserRepository = (
	req: RepositoryRequest,
	res: Response,
	next: NextFunction
) => {
	req.userRepository = new UserRepository();
	next();
};

export const attachFavoriteMovieRepository = (
	req: RepositoryRequest,
	res: Response,
	next: NextFunction
) => {
	req.favoriteMovieRepository = new FavoriteMovieRepository();
	next();
};
