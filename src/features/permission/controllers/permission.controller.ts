import { Request, Response } from 'express';
import { permissionService } from '../services/permission.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class PermissionController {
  public async seedData(req: Request, res: Response) {
    await permissionService.seedData();

    return res.status(HTTP_STATUS.OK).json({ message: 'Seed data successfully' });
  }
}

export const permissionController: PermissionController = new PermissionController();
