import { Router } from 'express';
import { submitCardAnswer } from '../app/study_records/study_record.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { submitAnswerSchema } from '../validations/studyRecord.schema';
const router = Router();

router.put('/', authenticate, validate(submitAnswerSchema), submitCardAnswer);

export default router;
