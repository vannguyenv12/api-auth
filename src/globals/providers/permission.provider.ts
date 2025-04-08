import { PermissionModel } from '~/features/permission/models/permission.model';
import { mapUrlToPermission } from '../utils/map-url-to-permission';
import { RoleModel } from '~/features/role/models/role.model';
import { NotFoundException } from '../cores/error.core';

const ignoredPaths = ['auth/sign-in', 'auth/signup', 'auth/refresh-token', 'roles/by'];

class PermissionProvider {
  public async initPermission(routes: IRoutePayload[]) {
    await PermissionModel.deleteMany();

    for (const route of routes) {
      if (ignoredPaths.some((path) => path === route.path)) {
        continue;
      }
      const permissionName = mapUrlToPermission(route);
      const permission = new PermissionModel({
        name: permissionName,
        method: route.method,
        path: route.path
      });
      await permission.save();
    }
  }
  public async addAllPermsToAdmin() {
    const permissions = await PermissionModel.find();
    const adminRole = await RoleModel.findOne({ name: 'admin' });

    if (!adminRole) {
      throw new NotFoundException(`No admin role found`);
    }

    adminRole.permissions = [];

    adminRole.permissions.push(...permissions);
    await adminRole.save();
    console.log('Add all permission to admin successfully!');
  }
}

export const permissionProvider: PermissionProvider = new PermissionProvider();
