import { Router } from 'express';
import { SetController } from '../app/sets/set.controller';

const router = Router();

router.get('/:userId/sets', SetController.getSetByUser);

export default router;
