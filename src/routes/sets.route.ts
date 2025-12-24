import { Router } from 'express';
import { SetsController } from '../app/sets/sets.controller';
import { validate } from '../middlewares/validate.middleware';
import { createSetSchema } from '../validations/set.schema';

const router = Router();

router.post('/', validate(createSetSchema), SetsController.create);
router.get('/:id', SetsController.getById);
router.put('/:id', SetsController.updateSet);
router.delete('/:id', SetsController.deleteSet);

export default router;
