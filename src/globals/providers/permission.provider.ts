import { PermissionModel } from '~/features/permission/models/permission.model';
import { mapUrlToPermission } from '../utils/map-url-to-permission';

class PermissionProvider {
  public async initPermission(routes: IRoutePayload[]) {
    await PermissionModel.deleteMany();

    for (const route of routes) {
      const permissionName = mapUrlToPermission(route);
      const permission = new PermissionModel({
        name: permissionName,
        method: route.method,
        path: route.path
      });
      await permission.save();
    }
  }
}

export const permissionProvider: PermissionProvider = new PermissionProvider();
