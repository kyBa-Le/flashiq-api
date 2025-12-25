import { Router } from 'express';
import { SetController } from '../app/sets/sets.controller';

const router = Router();

router.get('/:userId/sets', SetController.getSetByUser);

export default router;
