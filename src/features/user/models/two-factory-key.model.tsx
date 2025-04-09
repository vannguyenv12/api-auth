import mongoose, { mongo } from 'mongoose';
import { IRole } from '~/features/role/models/role.model';
import { IUser } from './user.model';

interface ITwoFactorKey {
  key: string;
  user: IUser;
}

const twoFactorKeySchema = new mongoose.Schema<ITwoFactorKey>({
  key: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User' }
});

export const TwoFactorKeyModel = mongoose.model<ITwoFactorKey>('TwoFactorKey', twoFactorKeySchema);
