import express from 'express';

import authenticate from '../middlewares/authenticate';
import authRoutes from './auth';
import postRoutes from './post';
import userRoutes from './user';
import followRoutes from './follow';

const appRoutes = express.Router();

appRoutes.use('/auth', authRoutes);

appRoutes.use(authenticate);

appRoutes.use('/users', userRoutes);
appRoutes.use('/post', postRoutes);
appRoutes.use('/', followRoutes);

export default appRoutes;
