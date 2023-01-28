import prisma from '../database';
import CreatePost from '../interfaces/CreatePost';

const createPost = (userId: number, post: CreatePost) => {
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

const getAllPosts = async (userId: number) => {
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

export default {
  createPost,
  getAllPosts,
};
