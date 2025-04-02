import { Application } from 'express';
import authRoute from '~/features/user/routes/auth.route';

function appRoutes(app: Application) {
  app.use('/api/v1/auth', authRoute);
}

export default appRoutes;
