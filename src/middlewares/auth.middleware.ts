import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";

export const checkJwt = auth({
	audience: process.env.AUTH0_AUDIENCE,
	issuerBaseURL: process.env.AUTH0_ISSUER,
});

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.name === "UnauthorizedError") {
		return res.status(401).json({
			error: "Unauthorized",
			message: "Invalid or missing authentication token",
		});
	}
	next(err);
};
