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

    const post = await PostService.createPost(req.user.id, newPost);

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

    const posts = await PostService.getAllPosts(user.id);

    res.json(posts);
  } catch (error) {
    console.log(error);
  }
};

export default {
  createPost,
  getAllPost,
};
