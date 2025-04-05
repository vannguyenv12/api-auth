import mongoose, { mongo } from 'mongoose';
import { IRole } from '~/features/role/models/role.model';

interface IUser {
  name: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpired?: number;
  roles: IRole[];
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpired: { type: Number, default: null },
  roles: [{ type: mongoose.Types.ObjectId, ref: 'Role' }]
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
