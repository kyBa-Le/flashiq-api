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
import {
  authenticate,
  authorizeSetPermission,
} from '../middlewares/auth.middleware';
import { getStudyRecords } from '../app/study_records/study_record.controller';
import { getQuiz } from '../app/quiz/quiz.controller';
import { generateStory } from '../app/ai_tools/ai.controller';
import { aiStorySchema } from '../validations/ai_tools.schema';

const router = Router();

router.get('/trending', SetController.getTrending);
router.get('/search', SetController.search);

router.post('/', authenticate, validate(createSetSchema), SetController.create);

router.get(
  '/:id',
  authenticate,
  authorizeSetPermission('VIEW'),
  SetController.getById
);

router.get('/:id/quiz', authenticate, authorizeSetPermission('VIEW'), getQuiz);

router.get(
  '/:id/cards',
  authenticate,
  authorizeSetPermission('VIEW'),
  getAllCards
);

router.post(
  '/:id/card/bulk',
  authenticate,
  authorizeSetPermission('EDIT'),
  validate(bulkCardSchema),
  createBulkCardsController
);

router.post(
  '/:id/card',
  authenticate,
  authorizeSetPermission('EDIT'),
  validate(singleCardSchema),
  createCardController
);

router.get(
  '/:id/study-records',
  authenticate,
  authorizeSetPermission('VIEW'),
  getStudyRecords
);

router.post(
  '/:id/generate-story',
  authenticate,
  authorizeSetPermission('VIEW'),
  validate(aiStorySchema),
  generateStory
);

router.put(
  '/:id',
  authenticate,
  authorizeSetPermission('EDIT'),
  SetController.updateSet
);

router.delete(
  '/:id',
  authenticate,
  authorizeSetPermission('OWNER'),
  SetController.deleteSet
);

export default router;
