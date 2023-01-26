import express from 'express';

import authRoutes from './auth';

const appRoutes = express.Router();

appRoutes.use('/auth', authRoutes);

export default appRoutes;
