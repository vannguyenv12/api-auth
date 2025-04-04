import { BadRequestException, NotFoundException } from '~/globals/cores/error.core';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import { jwtProvider } from '~/globals/providers/jwt.provider';
import crypto from 'crypto';

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

  public async refreshToken(refreshToken: string) {
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

  public async sendForgotPasswordToEmail(requestBody: any) {
    const { email } = requestBody;
    // Make userByEmail exist
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    // Create a resetPasswordToken (random string, number,...)
    // Store resetPasswordExpired (10m)
    const resetPasswordToken = crypto.randomBytes(10).toString('hex');
    const resetPasswordExpired = Date.now() + 10 * 1000 * 60;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpired = resetPasswordExpired;
    await user.save();

    console.log('check user', user);
    // Send email
  }
}

export const authService: AuthService = new AuthService();
