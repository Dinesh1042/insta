import { Request, Response } from 'express';

import { getUser } from '../services/user';

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    const user = await getUser(currentUser.id);
    
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


export default {
    getCurrentUser
}