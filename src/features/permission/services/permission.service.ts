import { NotFoundException } from '~/globals/cores/error.core';
import { PermissionModel } from '../models/permission.model';

class PermissionService {
  public async seedData() {
    const p1 = new PermissionModel({
      name: 'VIEW_DASHBOARD'
    });

    const p2 = new PermissionModel({
      name: 'VIEW_PROFILE'
    });

    const p3 = new PermissionModel({
      name: 'ADD_CLASS'
    });

    const p4 = new PermissionModel({
      name: 'DELETE_CLASS'
    });

    const p5 = new PermissionModel({
      name: 'VIEW_CLASS'
    });

    [p1, p2, p3, p4, p5].map(async (p) => await p.save());
  }

  public async getAll() {
    const permissions = await PermissionModel.find();

    return permissions;
  }

  public async updateName(requestBody: any, permissionId: string) {
    const { name } = requestBody;
    const permission = await PermissionModel.findById(permissionId);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    permission.name = name;
    await permission.save();

    return permission;
  }
}

export const permissionService: PermissionService = new PermissionService();
