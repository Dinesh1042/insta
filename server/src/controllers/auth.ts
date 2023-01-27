import { Request, Response } from 'express';
import _, { pick } from 'lodash';
import { ZodError } from 'zod';

import AuthTokenPayload from '../interfaces/AuthTokenPayload';
import RegisterUser from '../interfaces/RegisterUser';
import SignIn from '../interfaces/SignIn';
import {
  getAccessAndRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
  isRefreshTokenSaved,
  getAccessToken,
} from '../services/authToken';
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from '../services/user';
import { compare, hash } from '../utils/password';
import Validators from '../validators';

const register = async (req: Request<{}, {}, RegisterUser>, res: Response) => {
  try {
    const { username, email, password } = Validators.RegisterUser.parse(
      req.body
    );

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
    const isValidationError = error instanceof ZodError;

    res
      .status(isValidationError ? 400 : 500)
      .json(isValidationError ? error.flatten().fieldErrors : 500);
  }
};

const signIn = async (req: Request<{}, {}, SignIn>, res: Response) => {
  try {
    const { email, password } = Validators.SignUser.parse(req.body);

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
    const isValidationError = error instanceof ZodError;

    res
      .status(isValidationError ? 400 : 500)
      .json(isValidationError ? error.flatten().fieldErrors : 500);
  }
};

const getAccessTokenByRefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken as string | undefined;

    if (!refreshToken)
      return res.status(400).json({ error: 'Refresh token is required' });

    const authTokenPayload = verifyRefreshToken(refreshToken);

    const isTokenSaved = await isRefreshTokenSaved(refreshToken);

    if (!isTokenSaved)
      return res.status(400).json({ message: 'Refresh token is invalid.' });

    console.log(authTokenPayload);

    const accessToken = getAccessToken(
      pick(authTokenPayload, [
        'id',
        'name',
        'username',
        'email',
      ]) as AuthTokenPayload
    );

    return res.json({ accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
};

export default {
  register,
  signIn,
  getAccessTokenByRefreshToken,
};
