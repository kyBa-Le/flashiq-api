import { Request, Response } from 'express';
import {
  registerFCMTokenService,
  getNotificationsForUser,
  updateNotificationStatus,
} from './notification.service';

export const registerFCMToken = async (req: Request, res: Response) => {
  const { fcmToken } = req.body;
  const userId = (req as any).user?.id;

  await registerFCMTokenService(userId, fcmToken);
  return res.status(200).json({ success: true });
};

export const getNotification = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const notifications = await getNotificationsForUser(userId);
  return res.status(200).json({ notifications });
};

export const markNotificationRead = async (req: Request, res: Response) => {
  const { notificationId } = req.params;
  await updateNotificationStatus(notificationId);
  return res.status(200).json({ success: true });
};
