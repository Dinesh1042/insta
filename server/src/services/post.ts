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

export default {
  createPost,
};
