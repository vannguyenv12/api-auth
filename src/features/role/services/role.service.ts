import { PermissionModel } from '~/features/permission/models/permission.model';
import { RoleModel } from '../models/role.model';
import { NotFoundException } from '~/globals/cores/error.core';
import { UserModel } from '~/features/user/models/user.model';

class RoleService {
  public async seedData() {
    const p1 = await PermissionModel.findOne({ name: 'VIEW_DASHBOARD' });
    const p2 = await PermissionModel.findOne({ name: 'VIEW_PROFILE' });
    const p3 = await PermissionModel.findOne({ name: 'ADD_CLASS' });
    const p4 = await PermissionModel.findOne({ name: 'DELETE_CLASS' });
    const p5 = await PermissionModel.findOne({ name: 'VIEW_CLASS' });

    const r1 = new RoleModel({
      name: 'admin'
    });
    r1.permissions = [p1!, p2!, p3!, p4!, p5!];

    const r2 = new RoleModel({
      name: 'manager'
    });
    r2.permissions = [p2!, p3!, p4!, p5!];

    const r3 = new RoleModel({
      name: 'teacher'
    });
    r3.permissions = [p3!, p4!, p5!];

    [r1, r2, r3].map(async (r) => await r.save());
  }

  public async addRoleToUser(requestBody: any, userId: string) {
    const { roles } = requestBody;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Clear previous role
    user.roles = [];
    await user.save();

    // Add role to user
    for (const roleName of roles) {
      // manager
      const role = await RoleModel.findOne({ name: roleName });
      if (!role) {
        throw new NotFoundException(`The role ${roleName} not found`);
      }

      user.roles.push(role);
    }

    await user.save();
  }
}

export const roleService: RoleService = new RoleService();
