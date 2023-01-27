import express from 'express';

import UserController from '../controllers/user';

const router = express.Router();

router.get('/me', UserController.getCurrentUser);

export default router;
