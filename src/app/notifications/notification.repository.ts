import { prisma } from '../../utils/prisma';

export const saveFCMToken = async (userId: string, token: string) => {
  return await prisma.fCMToken.upsert({
    where: { token },
    update: {
      userId,
      isActive: true,
    },
    create: {
      userId,
      token,
      isActive: true,
    },
  });
};

export const getUserFCMTokens = async (userId: string) => {
  return await prisma.fCMToken.findMany({
    where: {
      userId,
      isActive: true,
    },
    select: {
      token: true,
    },
  });
};

export const deactivateToken = async (token: string) => {
  return await prisma.fCMToken.updateMany({
    where: { token },
    data: { isActive: false },
  });
};
