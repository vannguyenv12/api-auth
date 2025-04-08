import express, { Application, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import appRoutes from './globals/routes/appRoutes';
import { CustomError, NotFoundException } from './globals/cores/error.core';
import HTTP_STATUS from './globals/constants/http.constant';
import mongoose from 'mongoose';
import cors from 'cors';
import { getAllRoutes } from './globals/utils/log-route';
import { mapUrlToPermission } from './globals/utils/map-url-to-permission';
import { permissionProvider } from './globals/providers/permission.provider';

class Server {
  private app: Application;

  constructor() {
    this.app = express();
  }

  public start(): void {
    this.setupMiddleware();
    this.setupRoutes();
    this.setupGlobalError();
    this.listenServer();
    this.setupDatabase();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL! || '*',
        credentials: true // enabled cookie
      })
    );
  }

  private async setupRoutes(): Promise<void> {
    appRoutes(this.app);
    // const routes = getAllRoutes(this.app);
    // await permissionProvider.initPermission(routes);
    // await permissionProvider.addAllPermsToAdmin();
  }

  private setupGlobalError(): void {
    this.app.all(/(.*)/, (req, res, next) => {
      next(new NotFoundException(`The URL ${req.originalUrl} not found with method ${req.method}`));
    });

    // Global Error
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      console.log('check error', error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }

      return res.status(HTTP_STATUS.INTERNAL_SERVER).json({
        message: 'Something went wrong!'
      });
    });
  }

  private async setupDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL!);
      console.log('Connect to DB successfully!');
    } catch (error) {
      console.log('Error to connect DB');
    }
  }

  private listenServer() {
    const port = process.env.PORT || 5050;

    this.app.listen(port, () => {
      console.log(`Connected to server with port ${port}`);
    });
  }
}

export default Server;
