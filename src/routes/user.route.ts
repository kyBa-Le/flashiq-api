import { Router } from 'express';
import { SetController } from '../app/sets/set.controller';
import { getCurrentUser } from '../app/users/user.controller';
import { authenticateAccessToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:userId/sets', SetController.getSetByUser);
router.get('/me', authenticateAccessToken, getCurrentUser);

export default router;
