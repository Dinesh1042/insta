import { Request, Response } from 'express';

import RegisterUser from '../interfaces/RegisterUser';
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from '../services/user';
import { hash } from '../utils/password';

const register = async (req: Request<{}, {}, RegisterUser>, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const isExistingUser = Boolean(await getUserByEmail(email));

    if (isExistingUser)
      return res.status(409).json({ message: 'User already exists' });

    const isExistingUsername = Boolean(await getUserByUsername(username));

    if (isExistingUsername)
      return res.status(409).json({ message: 'Username already exists' });

    const hashedPassword = await hash(password);

    const user = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

export default {
  register,
};
