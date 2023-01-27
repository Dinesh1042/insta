import express from 'express';
import AuthController from '../controllers/auth';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/sign-in', AuthController.signIn);
router.post('/refresh-token', AuthController.getAccessTokenByRefreshToken);

export default router;
