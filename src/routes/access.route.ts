import { Router } from 'express';
import { AccessController } from '../app/access/access.controller';
import { authenticateAccessToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { shareSetSchema } from '../validations/access.schema';

const router = Router();

router.use(authenticateAccessToken);
router.post('/', validate(shareSetSchema), AccessController.share);
router.get('/set/:setId', AccessController.getShared);
router.delete('/:id', AccessController.removeAccess);

export default router;
