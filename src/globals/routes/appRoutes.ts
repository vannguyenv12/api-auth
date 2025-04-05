import { Application } from 'express';
import permissionRoute from '~/features/permission/routes/permission.route';
import roleRoute from '~/features/role/routes/role.route';
import authRoute from '~/features/user/routes/auth.route';

function appRoutes(app: Application) {
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/permissions', permissionRoute);
  app.use('/api/v1/roles', roleRoute);
}

export default appRoutes;
