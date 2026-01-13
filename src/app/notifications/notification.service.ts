import { getMessaging } from '../../config/firebase';
import {
  getUserFCMTokens,
  deactivateToken,
  saveFCMToken,
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
} from './notification.repository';
import { BaseException } from '../../errors/BaseException';

export const sendNotificationToUser = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  try {
    const fcmTokens = await getUserFCMTokens(userId);
    const tokens = fcmTokens.map((t) => t.token);

    if (tokens.length === 0) return null;

    const message = {
      notification: { title, body },
      data,
      tokens,
    };

    const result = await getMessaging().sendEachForMulticast(message);

    if (result.failureCount > 0) {
      const invalidTokens = result.responses
        .map((response, index) => ({ response, token: tokens[index] }))
        .filter(
          ({ response }) =>
            response.error?.code ===
              'messaging/registration-token-not-registered' ||
            response.error?.code === 'messaging/invalid-registration-token'
        )
        .map(({ token }) => token);

      await Promise.all(invalidTokens.map((token) => deactivateToken(token)));
    }

    return result;
  } catch (error) {
    console.error('Error sending notification to user:', error);
    throw new BaseException(500, 'Failed to send notification');
  }
};

export const registerFCMTokenService = async (
  userId: string,
  fcmToken: string
) => {
  try {
    if (!userId || !fcmToken) {
      throw new BaseException(400, 'User ID and FCM token are required');
    }

    return await saveFCMToken(userId, fcmToken);
  } catch (error) {
    console.error('Error registering FCM token:', error);

    if (error instanceof BaseException) {
      throw error;
    }

    throw new BaseException(500, 'Failed to register FCM token');
  }
};

export const saveNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: any
) => {
  try {
    return await createNotification(userId, type, title, message, data);
  } catch (error) {
    console.error('Error saving notification:', error);
    throw new BaseException(500, 'Failed to save notification');
  }
};

export const getNotificationsForUser = async (userId: string) => {
  try {
    return await getUserNotifications(userId);
  } catch (error) {
    console.error('Error retrieving notifications for user:', error);
    throw new BaseException(500, 'Failed to retrieve notifications');
  }
};

export const updateNotificationStatus = async (notificationId: string) => {
  try {
    return await markNotificationAsRead(notificationId);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new BaseException(500, 'Failed to mark notification as read');
  }
};
