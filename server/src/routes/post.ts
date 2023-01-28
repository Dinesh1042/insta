import express from 'express';

import PostController from '../controllers/post';

const router = express.Router();

router.route('/').post(PostController.createPost);

export default router;
