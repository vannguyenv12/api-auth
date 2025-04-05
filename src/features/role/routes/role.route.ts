import express from 'express';
import { roleController } from '../controllers/role.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { authMiddleware } from '~/globals/middlewares/auth.middleware';

const roleRoute = express.Router();

roleRoute.post('/seed-data', roleController.seedData);
roleRoute.post('/add-role/:userId', asyncWrapper(roleController.addRoleToUser));

export default roleRoute;
