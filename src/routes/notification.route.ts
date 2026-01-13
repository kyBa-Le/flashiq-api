import { Router } from 'express';
import {
  getNotification,
  markNotificationRead,
} from '../app/notifications/notification.controller';
import { authenticateAccessToken } from '../middlewares/auth.middleware';
const router = Router();

router.get('/', authenticateAccessToken, getNotification);
router.post(
  '/:notificationId/read',
  authenticateAccessToken,
  markNotificationRead
);
export default router;
