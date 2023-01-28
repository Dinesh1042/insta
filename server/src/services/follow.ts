import prisma from '../database';

const follow = (userId: number, followUserId: number) => {
  return prisma.follower.create({
    data: {
      userId: followUserId,
      followerId: userId,
    },
  });
};

const unFollow = (userId: number, followUserId: number) => {
  return prisma.follower.delete({
    where: {
      userId_followerId: {
        followerId: userId,
        userId: followUserId,
      },
    },
  });
};

export default {
  follow,
  unFollow,
};
