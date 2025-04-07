import express from 'express';
import { permissionController } from '../controllers/permission.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { authMiddleware } from '~/globals/middlewares/auth.middleware';

const permissionRoute = express.Router();

permissionRoute.get(
  '/',
  authMiddleware.verifyUser,
  authMiddleware.verifyPermission,
  asyncWrapper(permissionController.getAll)
);
permissionRoute.put('/:id', asyncWrapper(permissionController.updateName));
permissionRoute.post('/add-role/:roleId', asyncWrapper(permissionController.addPermissionsToRole));

export default permissionRoute;
