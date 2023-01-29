import express from 'express';

import PostController from '../controllers/post';

const router = express.Router();

router
  .route('/')
  .get(PostController.getAllPost)
  .post(PostController.createPost);

router
  .route('/:id')
  .get(PostController.getPost)
  .delete(PostController.deletePost);

export default router;
