import express from 'express';
import { permissionController } from '../controllers/permission.controller';

const permissionRoute = express.Router();

permissionRoute.get('/', permissionController.getAll);

export default permissionRoute;
