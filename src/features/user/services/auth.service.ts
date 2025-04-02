import { BadRequestException } from '~/globals/cores/error.core';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';

class AuthService {
  public async signUp(requestBody: any) {
    const { name, email, password } = requestBody;

    const userByEmail = await UserModel.findOne({ email });

    if (userByEmail) {
      throw new BadRequestException('Email already exist!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword
    });
    await user.save();

    return user;
  }

  public async signIn(requestBody: any) {}
}

export const authService: AuthService = new AuthService();
