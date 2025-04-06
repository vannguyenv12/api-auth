import { Request, Response } from 'express';
import { permissionService } from '../services/permission.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class PermissionController {
  public async seedData(req: Request, res: Response) {
    await permissionService.seedData();

    return res.status(HTTP_STATUS.OK).json({ message: 'Seed data successfully' });
  }

  public async getAll(req: Request, res: Response) {
    const data = await permissionService.getAll();

    return res.status(HTTP_STATUS.OK).json({ message: 'Get all permissions', data });
  }

  public async updateName(req: Request, res: Response) {
    const data = await permissionService.updateName(req.body, req.params.id);
    return res.status(HTTP_STATUS.OK).json({ message: 'Update permission successfully', data });
  }

  public async addPermissionsToRole(req: Request, res: Response) {
    await permissionService.addPermissionsToRole(req.body, req.params.roleId);
    return res.status(HTTP_STATUS.OK).json({ message: 'Add permission to role successfully' });
  }
}

export const permissionController: PermissionController = new PermissionController();
