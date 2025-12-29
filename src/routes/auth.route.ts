import { Router } from 'express';
import {
  login,
  logout,
  refresh,
  register,
  resendVerificationEmail,
  verifyEmail,
} from '../app/auth/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendEmailSchema,
} from '../validations/auth.schema';
const router = Router();

router.post('/register', validate(registerSchema), register);
router.get('/verify-email', verifyEmail);
router.post(
  '/resend-verification',
  validate(resendEmailSchema),
  resendVerificationEmail
);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.get('/logout', logout);

export default router;
