import mongoose, { mongo } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
