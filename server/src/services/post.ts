import { Post } from '@prisma/client';
import user from '../controllers/user';

import prisma from '../database';
import CreatePost from '../interfaces/CreatePost';

const create = (userId: number, post: CreatePost) => {
  return prisma.post.create({
    data: {
      userId,
      description: post.description,
      postMedias: {
        createMany: {
          data: post.medias,
        },
      },
      postMentions: {
        createMany: {
          data: post.mentions,
        },
      },
    },
    include: {
      postMedias: true,
    },
  });
};

const getAll = async (userId: number) => {
  return await prisma.post.findMany({
    where: {
      userId: {
        in: await prisma.follower
          .findMany({
            where: {
              followerId: userId,
            },
            select: {
              userId: true,
            },
          })
          .then((r) => r.map((r) => r.userId)),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      postMedias: true,
      instaUser: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
};

const get = (postId: number) => {
  return prisma.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      postMedias: true,
      instaUser: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
};

const hasAccessToView = async (userId: number, post: Post) => {
  try {
    if (userId === post.userId) return true;

    const postUserAccount = await prisma.instaUser.findFirst({
      where: {
        id: post.userId,
      },
    });

    if (postUserAccount && !postUserAccount.private) return true;

    const isUserFollows = await prisma.follower.findFirst({
      where: {
        followerId: userId,
        userId: post.userId,
      },
    });

    return !!isUserFollows;
  } catch (error) {
    throw new Error('Something went wrong');
  }
};

const hasAccessToDelete = (userId: number, post: Post) => {
  return new Promise<boolean>((resolve) => resolve(userId === post.userId));
};

const deletePost = ( postId: number) => {
  return prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export default {
  create,
  getAll,
  get,
  hasAccessToView,
  hasAccessToDelete,
  deletePost,
};
