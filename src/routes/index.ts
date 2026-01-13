import { Router } from 'express';
import authRoutes from './auth.route';
import usersRoutes from './user.route';
import setRoutes from './set.route';
import cardRoutes from './card.route';
import studyRecordRoutes from './studyRecord.route';
import accessRoutes from './access.route';
import notificationRoutes from './notification.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/sets', setRoutes);
router.use('/cards', cardRoutes);
router.use('/study-records', studyRecordRoutes);
router.use('/access', accessRoutes);
router.use('/notifications', notificationRoutes);

export default router;
