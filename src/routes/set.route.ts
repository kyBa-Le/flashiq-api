import { Router } from 'express';
import {
  createBulkCardsController,
  createCardController,
  getAllCards,
} from '../app/cards/card.controller';
import { validate } from '../middlewares/validate.middleware';
import { bulkCardSchema, singleCardSchema } from '../validations/card.schema';
import { authenticateAccessToken } from '../middlewares/auth.middleware';

const router = Router();

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
