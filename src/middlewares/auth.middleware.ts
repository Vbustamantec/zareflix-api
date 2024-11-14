import { Request, Response, NextFunction } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { AppError } from '../utils/errorHandler';

export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

export const extractUserId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.auth?.payload.sub;
    if (!userId) {
      throw new AppError(401, 'User ID not found in token');
    }
    req.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
  next(err);
};