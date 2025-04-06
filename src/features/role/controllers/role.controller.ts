import { Request, Response } from 'express';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { roleService } from '../services/role.service';

class RoleController {
  public async seedData(req: Request, res: Response) {
    await roleService.seedData();

    return res.status(HTTP_STATUS.OK).json({ message: 'Seed data successfully' });
  }

  public async getAll(req: Request, res: Response) {
    const data = await roleService.getAll();

    return res.status(HTTP_STATUS.OK).json({ message: 'Get all roles', data });
  }

  public async getDetail(req: Request, res: Response) {
    const data = await roleService.getDetail(req.params.id);
    return res.status(HTTP_STATUS.OK).json({ message: 'Get role detail', data });
  }

  public async addRoleToUser(req: Request, res: Response) {
    await roleService.addRoleToUser(req.body, req.params.userId);

    return res.status(HTTP_STATUS.OK).json({ message: 'Add role to user successfully' });
  }
}

export const roleController: RoleController = new RoleController();
