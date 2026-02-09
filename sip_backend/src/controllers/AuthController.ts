import { NextFunction, Request, Response } from 'express';
import { SUCCESS_MESSAGES } from '../messages/success_messages';
import { HTTP_STATUS } from '../constants/http_constants';

import { IAuthService } from '../services/AuthServiceInterface';
import { loginRequest } from '../validation/auth/loginSchema';
import { signinRequest } from '../validation/auth/signinSchema';
import { ForgotPasswordRequest } from '../validation/auth/forgotPasswordSchema';
import { resetPasswordRequest } from '../validation/auth/resetPasswordSchema';

export class AuthController {
  constructor(private readonly _authService: IAuthService) {}

  signin = async (
    req: Request<unknown, unknown, signinRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, mobile, password } = req.body;

      await this._authService.signin(email, mobile, password);

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.ACCOUNT_CREATED,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request<unknown, unknown, loginRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = req.body;

      const token = await this._authService.login(email, password);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (
    req: Request<unknown, unknown, ForgotPasswordRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;
      await this._authService.forgotPassword(email);

      res.status(HTTP_STATUS.OK).json({
        message: 'Reset password email sent',
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request<unknown, unknown, resetPasswordRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { token, newPassword } = req.body;
      await this._authService.resetPassword(token, newPassword);

      res.status(HTTP_STATUS.OK).json({
        message: 'Password reset successful',
      });
    } catch (error) {
      next(error);
    }
  };
}
