import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { authMiddleware } from '~/globals/middlewares/auth.middleware';
import { userController } from '../controllers/user.controller';

const userRoute = express.Router();

// userRoute.use(authMiddleware.verifyUser); // authentication

userRoute.get('/', asyncWrapper(userController.getAll));

export default userRoute;
