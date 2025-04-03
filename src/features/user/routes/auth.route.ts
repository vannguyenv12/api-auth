import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '~/globals/middlewares/auth.middleware';

const authRoute = express.Router();

authRoute.post('/signup', asyncWrapper(authController.signUp));
authRoute.post('/sign-in', asyncWrapper(authController.signIn));
authRoute.get('/me', asyncWrapper(authController.getCurrentUser));
authRoute.post('/logout', asyncWrapper(authController.logout));
authRoute.get('/protected', authMiddleware.verifyUser, asyncWrapper(authController.protected));
authRoute.post('/refresh-token', asyncWrapper(authController.refreshToken));

export default authRoute;
