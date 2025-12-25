import { Router } from 'express';
import authRoutes from './auth.route';
import setsRoutes from './set.route';
import usersRoutes from './user.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/sets', setsRoutes);
router.use('/users', usersRoutes);

export default router;
