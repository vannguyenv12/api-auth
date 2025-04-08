import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '~/globals/middlewares/auth.middleware';

const authRoute = express.Router();

authRoute.post('/signup', asyncWrapper(authController.signUp));
authRoute.post('/sign-in', asyncWrapper(authController.signIn));
authRoute.post('/refresh-token', asyncWrapper(authController.refreshToken));
authRoute.post('/forgot-password', asyncWrapper(authController.forgotPassword));
authRoute.post('/reset-password', asyncWrapper(authController.resetPassword));

authRoute.use(authMiddleware.verifyUser); // authentication

authRoute.get('/me', authMiddleware.verifyPermission, asyncWrapper(authController.getCurrentUser));
authRoute.post('/logout', authMiddleware.verifyPermission, asyncWrapper(authController.logout));
authRoute.get('/protected', authMiddleware.verifyPermission, asyncWrapper(authController.protected));
authRoute.put('/update-profile', authMiddleware.verifyPermission, asyncWrapper(authController.updateProfile));

export default authRoute;
