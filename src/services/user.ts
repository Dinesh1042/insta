import RegisterUser from '../interfaces/RegisterUser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = (user: RegisterUser) => {
  const { username, email, password } = user;
  return prisma.instaUser.create({
    data: { username, email, password, name: username},
  });
};

export const getUserByEmail = (email: string) => {
  return prisma.instaUser.findFirst({
    where: {
      email
    },
  });
};

export const getUserByUsername = (username: string) => {
  return prisma.instaUser.findFirst({
    where: {
      username,
    },
  });
};