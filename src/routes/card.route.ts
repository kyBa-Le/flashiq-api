import { Router } from 'express';
import {
  deleteCard,
  getSingleCardById,
  updateCard,
} from '../app/cards/card.controller';
import { validate } from '../middlewares/validate.middleware';
import { singleCardSchema } from '../validations/card.schema';
import { authenticateAccessToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:id', authenticateAccessToken, getSingleCardById);
router.delete('/:id', authenticateAccessToken, deleteCard);
router.put(
  '/:id',
  validate(singleCardSchema),
  authenticateAccessToken,
  updateCard
);
export default router;
