import { BadRequestException, NotFoundException } from '~/globals/cores/error.core';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import { jwtProvider } from '~/globals/providers/jwt.provider';
import crypto from 'crypto';
import { mailProvider } from '~/globals/providers/mail.provider';
import { RoleModel } from '~/features/role/models/role.model';
import { UserSessionModel } from '../models/user-session.model';

class AuthService {
  public async signUp(requestBody: any, device: string) {
    const { name, email, password } = requestBody;

    const userByEmail = await UserModel.findOne({ email });

    if (userByEmail) {
      throw new BadRequestException('Email already exist!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacherRole = await RoleModel.findOne({ name: 'admin' });
    if (!teacherRole) {
      throw new NotFoundException('Role does not exist');
    }

    const user = new UserModel({
      name,
      email,
      password: hashedPassword
    });
    user.roles = [teacherRole];
    await user.save();

    const roles = user.roles.map((role) => role.name);
    const jwtPayload = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      isEnabled2FA: user.isEnabled2FA,
      roles
    };
    let userSession = await UserSessionModel.findOne({ user: jwtPayload._id });
    if (!userSession) {
      userSession = await UserSessionModel.create({
        // This is invalid session => PLEASE ENTER OTP to access page
        isValid: false,
        device,
        user: jwtPayload._id
      });
    }

    const accessToken = await jwtProvider.generateJWT(jwtPayload);
    const refreshToken = await jwtProvider.generateRefreshToken(jwtPayload);

    return { accessToken: accessToken, refreshToken, user: jwtPayload, userSession };
  }

  public async signIn(requestBody: any, device: string) {
    const { email, password } = requestBody;
    const userByEmail = await UserModel.findOne({ email }).populate('roles');
    if (!userByEmail) {
      throw new BadRequestException('Email or password is wrong');
    }

    // Check password in userByEmail.password and password
    const isMatchPassword = await bcrypt.compare(password, userByEmail.password);
    if (!isMatchPassword) {
      throw new BadRequestException('Email or password is wrong');
    }

    const roles = userByEmail.roles.map((role) => role.name);
    const jwtPayload = {
      _id: userByEmail._id.toString(),
      name: userByEmail.name,
      email: userByEmail.email,
      isActive: userByEmail.isActive,
      isEnabled2FA: userByEmail.isEnabled2FA,
      roles
    };

    let userSession = await UserSessionModel.findOne({ user: jwtPayload._id });
    if (!userSession) {
      userSession = await UserSessionModel.create({
        // This is invalid session => PLEASE ENTER OTP to access page
        isValid: false,
        device,
        user: jwtPayload._id
      });
    }

    const accessToken = await jwtProvider.generateJWT(jwtPayload);
    const refreshToken = await jwtProvider.generateRefreshToken(jwtPayload);

    return { accessToken: accessToken, refreshToken, user: jwtPayload, session: userSession };
  }

  public async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Please provide refresh token!');
    }

    const userDecoded = await jwtProvider.verifyRefreshToken(refreshToken);

    const user = await UserModel.findById(userDecoded._id).populate('roles');
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Generate new access token
    const roles = user.roles.map((role) => role.name);
    const jwtPayload = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      roles
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

    const resetLink = `http://localhost:5173/reset-password?email=${user.email}&resetToken=${resetPasswordToken}`;

    const html = `
      <h1>Your Reset Password Request</h1>
      <p>Please click into this link to reset the password: <a href=${resetLink}>Click here</a></p>
    `;

    // Send email
    await mailProvider.sendEmail({ to: user.email, subject: 'Your Reset Password Request', html });
  }

  // 7:00 => expired: 7:10
  // 7:11 >  7:10

  public async resetPassword(requestBody: any) {
    const { email, resetToken, newPassword, confirmNewPassword } = requestBody;

    const user = await UserModel.findOne({ email, resetPasswordToken: resetToken });

    if (!user?.resetPasswordToken || !user?.resetPasswordExpired) {
      throw new BadRequestException('Please forgot password again!');
    }

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (Date.now() > user.resetPasswordExpired!) {
      throw new BadRequestException('Your reset password request already expired. Please try again!');
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords are not the same');
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  public async updateProfile(requestBody: any, currentUser: UserPayload) {
    const { name } = requestBody;

    const user = await UserModel.findById(currentUser._id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.name = name;
    await user.save();

    return user;
  }
}

export const authService: AuthService = new AuthService();
