import { Router } from 'express';
import authRoutes from './auth.route';
import setRoutes from './set.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/sets', setRoutes);

export default router;
