import { Router } from 'express';
import {
  deleteCard,
  getAllCards,
  getSingleCardById,
  updateCard,
} from '../app/cards/card.controller';
import { validate } from '../middlewares/validate.middleware';
import { singleCardSchema } from '../validations/card.schema';

const router = Router();

router.get('/', getAllCards);
router.get('/:id', getSingleCardById);
router.delete('/:id', deleteCard);
router.put('/:id', validate(singleCardSchema), updateCard);
export default router;
