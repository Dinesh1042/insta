import { NextFunction, Request, Response } from 'express';
import { pick } from 'lodash';

import AuthTokenPayload from '../interfaces/AuthTokenPayload';
import { verifyAccessToken } from '../services/authToken';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken)
      return res.status(400).json({ message: 'Access token is required' });

    const accessToken = bearerToken.replace(/Bearer\s/, '');

    const authTokenPayload = verifyAccessToken(accessToken);

    req.user = pick(authTokenPayload, [
      'id',
      'name',
      'username',
      'email',
    ]) as AuthTokenPayload;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default authenticate;
