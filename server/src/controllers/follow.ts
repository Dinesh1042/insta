import { Request, Response } from 'express';

import FollowService from '../services/follow';

const follow = async (
  req: Request<{}, {}, { userId: number }>,
  res: Response
) => {
  try {
    const currentUserId = req.user.id;
    const followUserId = req.body.userId;

    const followed = await FollowService.follow(currentUserId, followUserId);

    res.status(201).json(followed);
  } catch (error) {
    res.json(error);
  }
};

const unFollow = async (req: Request<{}, {}, { userId: number }>, res: Response) => {
  try {
    const currentUserId = req.user.id;
    const unFollowUserId = req.body.userId;

    const followed = await FollowService.unFollow(currentUserId, unFollowUserId);

    res.status(201).json(followed);
  } catch (error) {
    res.json(error);
  }
};

export default {
  follow,
  unFollow,
};
