import { TwoFactorKeyModel } from '../models/two-factory-key.model';
import { UserModel } from '../models/user.model';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

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
}

export const userService: UserService = new UserService();
