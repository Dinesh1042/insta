import { NextFunction, Request, RequestHandler, Response } from 'express';

import CreatePost from '../interfaces/CreatePost';
import PostService from '../services/post';
import UploadService from '../services/upload';
import appMulter from '../utils/appMulter';

const parsePosts = appMulter.array('media', 9);

const savePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageUrls = await UploadService.uploadPosts(
      req.files as Express.Multer.File[]
    );

    const newPost: CreatePost = {
      description: req.body.description,
      medias: imageUrls.map((imageUrl, index) => ({
        mediaUrl: imageUrl,
        sort: index + 1,
      })),
      mentions: [],
    };

    const post = await PostService.create(req.user.id, newPost);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createPost: RequestHandler[] = [parsePosts, savePost];

// This Api we get post of users with the currentUser follows
const getAllPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const posts = await PostService.getAll(user.id);

    res.json(posts);
  } catch (error) {
    console.log(error);
  }
};

const getPost = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const postId = +req.params.id;
    const userId = req.user.id;

    const post = await PostService.get(postId);

    if (!post) return res.status(404).json({ message: 'No post found' });

    const hasAccess = await PostService.hasAccessToView(userId, post);

    if (!hasAccess) return res.status(403).json({ message: 'Access denied' });

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deletePost = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.id;

    const post = await PostService.get(postId);

    if (!post) return res.status(404).json({ message: 'No post found' });

    const hasAccess = await PostService.hasAccessToDelete(userId, post);

    if (!hasAccess) return res.status(401).json({ message: 'Access denied' });

    await PostService.deletePost(postId);
    res.status(200).json({ message: 'Post has Removed' });
  } catch (error) {
    res.status(500).json(error);
  }
};

const likePost = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.id;
    const post = await PostService.get(postId);

    if (!post) return res.status(404).json({ message: 'No post found' });

    const hasAccess = await PostService.hasAccessToView(userId, post);

    if (!hasAccess) return res.status(403).json({ message: 'Access denied' });

    await PostService.like(userId, post.id);

    res.status(201).json({ message: 'Post has been liked' });
  } catch (error) {
    res.status(500).json(error);
  }
};

const unLikePost = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.id;
    const post = await PostService.get(postId);

    if (!post) return res.status(404).json({ message: 'No post found' });

    const hasAccess = await PostService.hasAccessToView(userId, post);
    console.log(hasAccess);

    if (!hasAccess) return res.status(403).json({ message: 'Access denied' });

    await PostService.unLike(userId, post.id);

    res.status(201).json({ message: 'Post has been disliked' });
  } catch (error) {
    res.status(500).json(error);
  }
};

export default {
  createPost,
  getAllPost,
  getPost,
  deletePost,
  likePost,
  unLikePost,
};
