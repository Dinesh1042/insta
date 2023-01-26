import jwt from 'jsonwebtoken';

import prisma from '../database';
import AuthTokenPayload from '../interfaces/AuthTokenPayload';

const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

const getJwtToken = (
  payload: jwt.JwtPayload,
  secretKey: string,
  options?: jwt.SignOptions
) => {
  return jwt.sign(payload, secretKey, options);
};

const verifyJwtToken = (
  token: string,
  secretKey: string,
  options: jwt.SignOptions = {}
) => {
  return jwt.verify(token, secretKey, options);
};

export const getAccessToken = (payload: AuthTokenPayload) => {
  return getJwtToken(payload, ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15s',
  });
};

export const getRefreshToken = (payload: AuthTokenPayload) => {
  return getJwtToken(payload, REFRESH_TOKEN_SECRET as string);
};

export const getAccessAndRefreshToken = (payload: AuthTokenPayload) => {
  return {
    accessToken: getAccessToken(payload),
    refreshToken: getRefreshToken(payload),
  };
};

export const saveRefreshToken = (token: string) => {
  return prisma.refreshToken.create({
    data: {
      token,
    },
  });
};

export const isRefreshTokenSaved = (token: string) => {
  return prisma.refreshToken
    .findFirst({
      where: {
        token,
      },
    })
    .then((refreshToken) => !!refreshToken);
};

export const verifyRefreshToken = (token: string) => {
  return verifyJwtToken(
    token,
    REFRESH_TOKEN_SECRET as string
  ) as AuthTokenPayload;
};

export const verifyAccessToken = (token: string) => {
  return verifyJwtToken(
    token,
    ACCESS_TOKEN_SECRET as string
  ) as AuthTokenPayload;
};

export default {
  getAccessAndRefreshToken,
  saveRefreshToken,
  isRefreshTokenSaved,
  verifyAccessToken,
};
