import express from 'express';
import { permissionController } from '../controllers/permission.controller';

const permissionRoute = express.Router();

permissionRoute.get('/', permissionController.getAll);
permissionRoute.put('/:id', permissionController.updateName);
permissionRoute.post('/add-role/:roleId', permissionController.addPermissionsToRole);

export default permissionRoute;
