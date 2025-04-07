import { UserModel } from '../models/user.model';

class UserService {
  public async getAll() {
    const users = await UserModel.find().select('-password -resetPasswordToken -resetPasswordExpired -__v').populate({
      path: 'roles',
      select: '-permissions -__v'
    });

    return users;
  }
}

export const userService: UserService = new UserService();
