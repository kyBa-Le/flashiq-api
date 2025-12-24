import { Router } from 'express';
import {
  createBulkCardsController,
  createCardController,
} from '../app/cards/card.controller';
import { validate } from '../middlewares/validate.middleware';
import { bulkCardSchema, singleCardSchema } from '../validations/card.schema';

const router = Router();

router.post(
  '/:id/card/bulk',
  validate(bulkCardSchema),
  createBulkCardsController
);
router.post('/:id/card', validate(singleCardSchema), createCardController);

export default router;
