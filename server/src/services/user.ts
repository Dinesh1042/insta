import prisma from '../database';
import RegisterUser from '../interfaces/RegisterUser';

export const createUser = (user: RegisterUser) => {
  const { username, email, password } = user;
  return prisma.instaUser.create({
    data: { username, email, password, name: username },
  });
};

export const getUserByEmail = (email: string) => {
  return prisma.instaUser.findFirst({
    where: {
      email,
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

export const getUser = (id: number) => {
  return prisma.instaUser.findFirst({
    where: {
      id,
    },
  });
};
