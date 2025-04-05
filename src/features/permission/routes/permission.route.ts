import express from 'express';
import { permissionController } from '../controllers/permission.controller';

const permissionRoute = express.Router();

permissionRoute.post('/seed-data', permissionController.seedData);

export default permissionRoute;
