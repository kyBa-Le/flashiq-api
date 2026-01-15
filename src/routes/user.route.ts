import { Router } from 'express';
import { SetController } from '../app/sets/set.controller';
import { getCurrentUser } from '../app/users/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { registerFCMToken } from '../app/notifications/notification.controller';
import { validate } from '../middlewares/validate.middleware';
import { userParamsSchema } from '../validations/user.schema';

const router = Router();

router.get('/:userId/sets', authenticate, SetController.getSetByUser);
router.get(
  '/:userId/shared-sets',
  authenticate,
  validate(userParamsSchema, 'params'),
  SetController.getSharedSets
);
router.get('/me', authenticate, getCurrentUser);
router.post('/fcm-token', authenticate, registerFCMToken);

export default router;
