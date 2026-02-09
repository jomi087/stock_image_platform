import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthRepository } from '../repositories/AuthRepository';
import { AuthServiceV1 } from '../services/AuthService';
import { loginSchema } from '../validation/auth/loginSchema';
import { validateRequest } from '../middleware/validateRequest';
import { signinSchema } from '../validation/auth/signinSchema';
import { forgotPasswordSchema } from '../validation/auth/forgotPasswordSchema';
import { resetPasswordSchema } from '../validation/auth/resetPasswordSchema';
// import { signinSchema } from '../validation/auth/signinSchema';

const authRepository = new AuthRepository();
const authService = new AuthServiceV1(authRepository);
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
