import JWT from 'jsonwebtoken';
import { BadRequestException } from '../cores/error.core';

interface JwtPayload {
  _id: string;
  name: string;
  email: string;
  roles: string[];
}

class JwtProvider {
  public async generateJWT(payload: JwtPayload) {
    return JWT.sign(payload, process.env.JWT_SECRET!, { expiresIn: '5s' });
  }

  public async generateRefreshToken(payload: JwtPayload) {
    return JWT.sign(payload, process.env.RT_SECRET!, { expiresIn: '7d' });
  }

  public async verifyJWT(token: string) {
    return JWT.verify(token, process.env.JWT_SECRET!) as UserPayload;
  }

  public async verifyRefreshToken(token: string) {
    try {
      return JWT.verify(token, process.env.RT_SECRET!) as UserPayload;
    } catch (error) {
      throw new BadRequestException('Refresh token is not valid');
    }
  }
}

export const jwtProvider: JwtProvider = new JwtProvider();
