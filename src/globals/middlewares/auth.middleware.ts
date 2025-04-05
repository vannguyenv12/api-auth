import { NextFunction, Request, Response } from 'express';
import { ForbiddenException, UnAuthorizedException } from '../cores/error.core';
import { jwtProvider } from '../providers/jwt.provider';
import JWT from 'jsonwebtoken';

class AuthMiddleware {
  public async verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!req.headers.authorization || !token) {
      throw new UnAuthorizedException('NO_TOKEN');
    }

    try {
      const decodedUser = await jwtProvider.verifyJWT(token);

      req.currentUser = {
        _id: decodedUser._id,
        name: decodedUser.name,
        email: decodedUser.email,
        roles: decodedUser.roles
      };

      next();
    } catch (error) {
      if (error instanceof JWT.TokenExpiredError) {
        // 1) Token Expired
        throw new UnAuthorizedException('TOKEN_EXPIRED');
      }

      if (error instanceof JWT.JsonWebTokenError) {
        // 2) Token invalid (modified token, "abc")
        throw new ForbiddenException('TOKEN_INVALID');
      }

      throw new UnAuthorizedException('Please login again!');
    }
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
