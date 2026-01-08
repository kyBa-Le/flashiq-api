import { messaging } from '../../config/firebase';
import {
  getUserFCMTokens,
  deactivateToken,
  saveFCMToken,
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

    const result = await messaging.sendEachForMulticast(message);

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
