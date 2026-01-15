import { Router } from 'express';
import { AccessController } from '../app/access/access.controller';
import {
  authenticate,
  authorizeSetPermission,
} from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { shareSetSchema } from '../validations/access.schema';

const router = Router();

router.use(authenticate);
router.post('/', validate(shareSetSchema), AccessController.share);
router.get('/set/:id/permission', AccessController.getCurrentSetPermission);
router.get(
  '/set/:id',
  authorizeSetPermission('OWNER'),
  AccessController.getShared
);
router.delete('/:id', AccessController.removeAccess);

export default router;
