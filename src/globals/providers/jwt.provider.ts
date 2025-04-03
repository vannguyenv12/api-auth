import JWT from 'jsonwebtoken';

interface JwtPayload {
  _id: string;
  name: string;
  email: string;
}

class JwtProvider {
  public async generateJWT(payload: JwtPayload) {
    return JWT.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }

  public async generateRefreshToken(payload: JwtPayload) {
    return JWT.sign(payload, process.env.RT_SECRET!, { expiresIn: '7d' });
  }

  public async verifyJWT(token: string) {
    return JWT.verify(token, process.env.JWT_SECRET!) as UserPayload;
  }
}

export const jwtProvider: JwtProvider = new JwtProvider();
