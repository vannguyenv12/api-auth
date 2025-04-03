import { NextFunction, Request, Response } from 'express';
import { BadRequestException, UnAuthorizedException } from '../cores/error.core';

class AuthMiddleware {
  public async verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!req.headers.authorization || !token) {
      throw new UnAuthorizedException('You are not logged');
    }

    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
