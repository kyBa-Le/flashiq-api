import { Router } from 'express';
import {
  bulkUpdateCards,
  deleteCard,
  getSingleCardById,
  updateCard,
} from '../app/cards/card.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  bulkUpdateCardsSchema,
  singleCardSchema,
} from '../validations/card.schema';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.put(
  '/bulk',
  authenticate,
  validate(bulkUpdateCardsSchema),
  bulkUpdateCards
);

router.get('/:id', authenticate, getSingleCardById);
router.delete('/:id', authenticate, deleteCard);
router.put('/:id', validate(singleCardSchema), authenticate, updateCard);
export default router;
