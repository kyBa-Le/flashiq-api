import { User } from '@prisma/client';
import { prisma } from '../../utils/prisma';

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const updateUserById = async (userId: string, user: User) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: user,
  });
};
