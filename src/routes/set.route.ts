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
import { getStudyRecords } from '../app/study_records/study_record.controller';
import { getQuiz } from '../app/quiz/quiz.controller';

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

router.get('/:id/study-records', authenticateAccessToken, getStudyRecords);

router.get('/:id/quiz', getQuiz);

export default router;
