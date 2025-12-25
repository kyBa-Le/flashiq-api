import { Router } from 'express';
import { SetController } from '../app/sets/set.controller';
import { validate } from '../middlewares/validate.middleware';
import { createSetSchema } from '../validations/set.schema';

const router = Router();

router.post('/', validate(createSetSchema), SetController.create);
router.get('/:id', SetController.getById);
router.put('/:id', SetController.updateSet);
router.delete('/:id', SetController.deleteSet);

export default router;
