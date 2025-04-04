import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { UserModel } from '../models/user.model';

class AuthController {
  public async signUp(req: Request, res: Response) {
    const data = await authService.signUp(req.body);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true, // Prevent access cookie from client
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict', // prevent access cookie from another website
      secure: process.env.NODE_ENV === 'production' // HTTPS
    });

    return res.status(HTTP_STATUS.OK).json({
      message: 'Sign Up Successfully',
      data: {
        accessToken: data.accessToken,
        user: data.user
      }
    });
  }

  public async signIn(req: Request, res: Response) {
    const data = await authService.signIn(req.body);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true, // Prevent access cookie from client
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict', // prevent access cookie from another website
      secure: process.env.NODE_ENV === 'production' // HTTPS
    });

    return res.status(HTTP_STATUS.OK).json({
      message: 'Sign In Successfully',
      data: {
        accessToken: data.accessToken,
        user: data.user
      }
    });
  }

  public async protected(req: Request, res: Response) {
    return res.status(HTTP_STATUS.OK).json({
      message: `This is a protected route`,
      data: req.currentUser
    });
  }

  public async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    const data = await authService.refreshToken(refreshToken);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Generate a new access token',
      data
    });
  }

  public async getCurrentUser(req: Request, res: Response) {}

  public async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');

    res.status(HTTP_STATUS.OK).json({ message: 'Logout Successfully' });
  }

  public async forgotPassword(req: Request, res: Response) {
    await authService.sendForgotPasswordToEmail(req.body);
  }
}

export const authController: AuthController = new AuthController();
