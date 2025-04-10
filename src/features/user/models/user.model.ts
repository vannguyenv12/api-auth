import mongoose, { mongo } from 'mongoose';
import { IRole } from '~/features/role/models/role.model';

export interface IUser {
  name: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpired?: number;
  isEnabled2FA: boolean;
  isActive: boolean;
  roles: IRole[];
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpired: { type: Number, default: null },
  isEnabled2FA: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  roles: [{ type: mongoose.Types.ObjectId, ref: 'Role' }]
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
