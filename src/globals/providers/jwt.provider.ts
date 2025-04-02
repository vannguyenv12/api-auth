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
}

export const jwtProvider: JwtProvider = new JwtProvider();
