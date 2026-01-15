import { Router } from 'express';
import {
  getNotification,
  markNotificationRead,
} from '../app/notifications/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';
const router = Router();

router.get('/', authenticate, getNotification);
router.post('/:notificationId/read', authenticate, markNotificationRead);
export default router;
