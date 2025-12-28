import { Router } from 'express';
import { submitCardAnswer } from '../app/study_records/study_record.controller';
import { authenticateAccessToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { submitAnswerSchema } from '../validations/studyRecord.schema';
const router = Router();

router.put(
  '/',
  authenticateAccessToken,
  validate(submitAnswerSchema),
  submitCardAnswer
);

export default router;
