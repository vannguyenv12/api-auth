import mongoose from 'mongoose';
import { IUser } from './user.model';

interface IUserSession {
  isValid: boolean;
  device: string;
  user: IUser;
}

const userSessionSchema = new mongoose.Schema<IUserSession>({
  isValid: { type: Boolean, required: true },
  device: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User' }
});

export const TwoFactorKeyModel = mongoose.model<IUserSession>('UserSession', userSessionSchema);
