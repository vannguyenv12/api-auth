import express from 'express';
import { permissionController } from '../controllers/permission.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { authMiddleware } from '~/globals/middlewares/auth.middleware';

const permissionRoute = express.Router();

permissionRoute.use(authMiddleware.verifyUser); // authentication

permissionRoute.get('/', authMiddleware.verifyPermission, asyncWrapper(permissionController.getAll));
permissionRoute.put('/:id', authMiddleware.verifyPermission, asyncWrapper(permissionController.updateName));
permissionRoute.post(
  '/add-role/:roleId',
  authMiddleware.verifyPermission,
  asyncWrapper(permissionController.addPermissionsToRole)
);

export default permissionRoute;
