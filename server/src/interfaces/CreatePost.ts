import { PostMedia } from '@prisma/client';

export default interface CreatePost {
  description: string;
  medias: Omit<PostMedia, 'id' | 'postId'>[];
  mentions: { userId: number }[];
}
