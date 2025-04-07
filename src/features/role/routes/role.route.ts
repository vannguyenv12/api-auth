import express from 'express';
import { roleController } from '../controllers/role.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { authMiddleware } from '~/globals/middlewares/auth.middleware';

const roleRoute = express.Router();

roleRoute.use(authMiddleware.verifyUser); // authentication

roleRoute.post('/seed-data', authMiddleware.verifyPermission, roleController.seedData);
roleRoute.post('/add-role/:userId', authMiddleware.verifyPermission, asyncWrapper(roleController.addRoleToUser));
roleRoute.get('/', authMiddleware.verifyPermission, asyncWrapper(roleController.getAll));
roleRoute.get('/:id', authMiddleware.verifyPermission, asyncWrapper(roleController.getDetail));

export default roleRoute;
