import express from 'express';
import { roleController } from '../controllers/role.controller';

const roleRoute = express.Router();

roleRoute.post('/seed-data', roleController.seedData);

export default roleRoute;
