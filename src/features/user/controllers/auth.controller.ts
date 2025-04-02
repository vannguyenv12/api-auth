import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { UserModel } from '../models/user.model';

class AuthController {
  public async signUp(req: Request, res: Response) {
    // await authService.signUp('abc');

    const newUser = new UserModel({
      name: 'John',
      email: 'john@gmail.com',
      password: 'test1234'
    });
    await newUser.save();
  }

  public async signIn(req: Request, res: Response) {}

  public async getCurrentUser(req: Request, res: Response) {}

  public async logout(req: Request, res: Response) {}
}

export const authController: AuthController = new AuthController();
