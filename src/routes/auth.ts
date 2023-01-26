import express from 'express';
import AuthController from '../controllers/auth';

const router = express.Router();

router.post('/register', AuthController.register);

export default router;
