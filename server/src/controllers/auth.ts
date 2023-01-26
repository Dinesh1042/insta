import { Request, Response } from 'express';
import { pick } from 'lodash';

import AuthTokenPayload from '../interfaces/AuthTokenPayload';
import RegisterUser from '../interfaces/RegisterUser';
import SignIn from '../interfaces/SignIn';
import {
  getAccessAndRefreshToken,
  saveRefreshToken,
} from '../services/authToken';
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from '../services/user';
import { compare, hash } from '../utils/password';

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

    const { refreshToken, accessToken } = getAccessAndRefreshToken(
      pick(user, ['id', 'name', 'username', 'email']) as AuthTokenPayload
    );

    await saveRefreshToken(refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });

    res.status(201).json({ accessToken });
  } catch (error) {
    res.json(error);
  }
};

const signIn = async (req: Request<{}, {}, SignIn>, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (!user) return res.status(404).json({ message: 'Invalid email' });

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json({ message: 'Invalid password' });

    const { refreshToken, accessToken } = getAccessAndRefreshToken(
      pick(user, ['id', 'name', 'username', 'email']) as AuthTokenPayload
    );

    await saveRefreshToken(refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.json(error);
  }
};

export default {
  register,
  signIn,
};
