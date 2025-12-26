import { Router } from 'express';
import { SetController } from '../app/sets/set.controller';
import { validate } from '../middlewares/validate.middleware';
import { createSetSchema } from '../validations/set.schema';
import {
  createBulkCardsController,
  createCardController,
  getAllCards,
} from '../app/cards/card.controller';
import { bulkCardSchema, singleCardSchema } from '../validations/card.schema';
import { authenticateAccessToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', validate(createSetSchema), SetController.create);
router.get('/:id', SetController.getById);
router.put('/:id', SetController.updateSet);
router.delete('/:id', SetController.deleteSet);

router.get('/:id/cards', authenticateAccessToken, getAllCards);
router.post(
  '/:id/card/bulk',
  authenticateAccessToken,
  validate(bulkCardSchema),
  createBulkCardsController
);
router.post(
  '/:id/card',
  validate(singleCardSchema),
  authenticateAccessToken,
  createCardController
);

export default router;
