import { BadRequestException, NotFoundException } from '~/globals/cores/error.core';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import { jwtProvider } from '~/globals/providers/jwt.provider';

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

    const jwtPayload = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email
    };

    const accessToken = await jwtProvider.generateJWT(jwtPayload);
    const refreshToken = await jwtProvider.generateRefreshToken(jwtPayload);

    return { accessToken: accessToken, refreshToken, user: jwtPayload };
  }

  public async signIn(requestBody: any) {
    const { email, password } = requestBody;
    const userByEmail = await UserModel.findOne({ email });
    if (!userByEmail) {
      throw new BadRequestException('Email or password is wrong');
    }

    // Check password in userByEmail.password and password
    const isMatchPassword = await bcrypt.compare(password, userByEmail.password);
    if (!isMatchPassword) {
      throw new BadRequestException('Email or password is wrong');
    }

    const jwtPayload = {
      _id: userByEmail._id.toString(),
      name: userByEmail.name,
      email: userByEmail.email
    };

    const accessToken = await jwtProvider.generateJWT(jwtPayload);
    const refreshToken = await jwtProvider.generateRefreshToken(jwtPayload);

    return { accessToken: accessToken, refreshToken, user: jwtPayload };
  }

  public async refreshToken(requestBody: any) {
    const { refreshToken } = requestBody;
    if (!refreshToken) {
      throw new BadRequestException('Please provide refresh token!');
    }

    const userDecoded = await jwtProvider.verifyRefreshToken(refreshToken);

    const user = await UserModel.findById(userDecoded._id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Generate new access token
    const jwtPayload = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email
    };

    const accessToken = await jwtProvider.generateJWT(jwtPayload);

    return { accessToken, user: jwtPayload };
  }
}

export const authService: AuthService = new AuthService();
