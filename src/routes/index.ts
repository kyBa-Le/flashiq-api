import { Router } from 'express';
import authRoutes from './auth.route';
import setsRoutes from './sets.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/sets', setsRoutes);

export default router;
