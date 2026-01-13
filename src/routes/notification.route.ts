import { Router } from 'express';
import { getNotification } from '../app/notifications/notification.controller';
import { authenticateAccessToken } from '../middlewares/auth.middleware';
const router = Router();

router.get('/', authenticateAccessToken, getNotification);
export default router;
