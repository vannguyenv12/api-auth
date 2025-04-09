import { BadRequestException, NotFoundException } from '~/globals/cores/error.core';
import { TwoFactorKeyModel } from '../models/two-factory-key.model';
import { UserModel } from '../models/user.model';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { UserSessionModel } from '../models/user-session.model';

class UserService {
  public async getAll() {
    const users = await UserModel.find().select('-password -resetPasswordToken -resetPasswordExpired -__v').populate({
      path: 'roles',
      select: '-permissions -__v'
    });

    return users;
  }

  public async getTwoFaQR(currentUser: UserPayload) {
    let twoFactorKey = await TwoFactorKeyModel.findOne({ user: currentUser._id });

    if (!twoFactorKey) {
      twoFactorKey = await TwoFactorKeyModel.create({
        key: authenticator.generateSecret(),
        user: currentUser._id
      });
    }

    // Generate QR Image
    const otpAuth = authenticator.keyuri(currentUser.name, 'Auth - Van nguyen', twoFactorKey.key);
    return qrcode.toDataURL(otpAuth);
  }

  public async verifyTwoFaQR(requestBody: any, device: string, currentUser: UserPayload) {
    const { otp } = requestBody;

    const user = await UserModel.findById(currentUser._id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const twoFactorKey = await TwoFactorKeyModel.findOne({ user: user._id });
    if (!twoFactorKey) {
      throw new NotFoundException(`Key not found`);
    }

    const isValid = authenticator.check(otp, twoFactorKey.key);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    // After verify success, we need to update user (enabled 2fa)
    user.isEnabled2FA = true;
    await user.save();

    // Create a session
    const session = await UserSessionModel.create({
      // this is a valid session, and user can perform the action like normal (don't need to logout)
      isValid: true,
      device,
      user: user._id
    });

    const data = {
      user,
      session
    };

    return data;
  }
}

export const userService: UserService = new UserService();
