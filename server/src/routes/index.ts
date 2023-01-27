import express from 'express';
import authenticate from '../middlewares/authenticate';

import authRoutes from './auth';

const appRoutes = express.Router();

appRoutes.use('/auth', authRoutes);

appRoutes.use(authenticate);

export default appRoutes;
