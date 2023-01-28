import express from 'express';

import FollowController from '../controllers/follow';

const router = express.Router();

router.post('/follow', FollowController.follow);
router.delete('/un-follow', FollowController.unFollow);

export default router;
