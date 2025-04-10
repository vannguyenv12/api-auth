import JWT from 'jsonwebtoken';
import { BadRequestException } from '../cores/error.core';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../redis';

interface JwtPayload {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  roles: string[];
}

class JwtProvider {
  public async revokeTokens(userId: string) {
    // Revoke Token
    const allValuesAccessToken = await redisClient.sMembers(`users:${userId}:access_tokens`);
    const allValuesRefreshToken = await redisClient.sMembers(`users:${userId}:refresh_tokens`);

    const allStringKeysToDelete = [
      ...allValuesAccessToken.map((jwtId) => `access_token:${jwtId}`),
      ...allValuesRefreshToken.map((jwtId) => `refresh_token:${jwtId}`)
    ];
    await redisClient.del(allStringKeysToDelete);

    await redisClient.del(`users:${userId}:access_tokens`);
    await redisClient.del(`users:${userId}:refresh_tokens`);
  }

  public async generateJWT(payload: JwtPayload) {
    const jwtId = uuidv4();
    await redisClient.SET(`access_token:${jwtId}`, 'valid', {
      EX: 60 * 60 // secs
    });
    await redisClient.SADD(`users:${payload._id}:access_tokens`, jwtId);

    return JWT.sign({ ...payload, jwtId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }

  public async generateRefreshToken(payload: JwtPayload) {
    const jwtId = uuidv4();
    await redisClient.SET(`refresh_token:${jwtId}`, 'valid');
    await redisClient.SADD(`users:${payload._id}:refresh_tokens`, jwtId);

    return JWT.sign({ ...payload, jwtId }, process.env.RT_SECRET!, { expiresIn: '7d' });
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
