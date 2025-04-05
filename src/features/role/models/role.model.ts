import mongoose from 'mongoose';
import { IPermission } from '~/features/permission/models/permission.model';

export interface IRole {
  name: string;
  description?: string;
  permissions: IPermission[];
}

const roleSchema = new mongoose.Schema<IRole>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{ type: mongoose.Types.ObjectId, ref: 'Permission' }]
});

export const RoleModel = mongoose.model<IRole>('Role', roleSchema);
