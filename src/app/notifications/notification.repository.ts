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

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: any
) => {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data: data ? JSON.stringify(data) : undefined,
    },
  });
};

export const getUserNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};
