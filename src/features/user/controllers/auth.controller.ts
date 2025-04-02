import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { UserModel } from '../models/user.model';

class AuthController {
  public async signUp(req: Request, res: Response) {
    const data = await authService.signUp(req.body);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Sign Up Successfully',
      data
    });
  }

  public async signIn(req: Request, res: Response) {
    const data = await authService.signIn(req.body);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Sign In Successfully',
      data
    });
  }

  public async getCurrentUser(req: Request, res: Response) {}

  public async logout(req: Request, res: Response) {}
}

export const authController: AuthController = new AuthController();
