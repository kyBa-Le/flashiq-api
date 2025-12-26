import { Router } from 'express';
import authRoutes from './auth.route';
import usersRoutes from './user.route';
import setRoutes from './set.route';
import cardRoutes from './card.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/sets', setRoutes);
router.use('/cards', cardRoutes);

export default router;
