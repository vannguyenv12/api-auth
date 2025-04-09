import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { authMiddleware } from '~/globals/middlewares/auth.middleware';
import { userController } from '../controllers/user.controller';

const userRoute = express.Router();

userRoute.use(authMiddleware.verifyUser); // authentication

userRoute.get('/', authMiddleware.verifyPermission, asyncWrapper(userController.getAll));
userRoute.get('/get-2fa-qr', asyncWrapper(userController.getTwoFaQR));
userRoute.post('/verify-2fa-qr', asyncWrapper(userController.verifyTwoFaQR));

export default userRoute;
