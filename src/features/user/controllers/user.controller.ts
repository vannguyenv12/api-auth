import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { UserModel } from '../models/user.model';
import { userService } from '../services/user.service';

class UserController {
  public async getAll(req: Request, res: Response) {
    const data = await userService.getAll();

    return res.status(HTTP_STATUS.OK).json({ message: 'Get all users', data });
  }
}

export const userController: UserController = new UserController();
