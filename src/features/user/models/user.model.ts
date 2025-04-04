import mongoose, { mongo } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpired?: number;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpired: { type: Number, default: null }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
