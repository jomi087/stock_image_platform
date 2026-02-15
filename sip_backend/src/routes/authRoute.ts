import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthRepository } from '../repositories/AuthRepository';
import { AuthService } from '../services/AuthService';
import { loginSchema } from '../validation/auth/loginSchema';
import { validateRequest } from '../middleware/validateRequest';
import { signinSchema } from '../validation/auth/signinSchema';
import { forgotPasswordSchema } from '../validation/auth/forgotPasswordSchema';
import { resetPasswordSchema } from '../validation/auth/resetPasswordSchema';
import { NodemailerEmailService } from '../infrastructure/email/NodemailerEmailService';
// import { signinSchema } from '../validation/auth/signinSchema';

const authRepository = new AuthRepository();
const emailService = new NodemailerEmailService();
const authService = new AuthService(authRepository, emailService);
const authController = new AuthController(authService);

const router = Router();

router.post('/signin', validateRequest(signinSchema), authController.signin);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post(
  '/forgot-password',
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

export default router;
