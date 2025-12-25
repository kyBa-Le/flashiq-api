import { Router } from 'express';
import authRoutes from './auth.route';
import setsRoutes from './sets.route';
import usersRoutes from './users.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/sets', setsRoutes);
router.use('/users', usersRoutes);

export default router;
