import { NextFunction, Request, Response } from 'express';
import { BadRequestException, UnAuthorizedException } from '../cores/error.core';
import { jwtProvider } from '../providers/jwt.provider';

class AuthMiddleware {
  public async verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!req.headers.authorization || !token) {
      throw new UnAuthorizedException('You are not logged');
    }

    try {
      const decodedUser = await jwtProvider.verifyJWT(token);

      next();
    } catch (error) {
      throw new UnAuthorizedException('Please login again!');
    }
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
