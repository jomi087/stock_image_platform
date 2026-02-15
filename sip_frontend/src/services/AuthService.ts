import { API_ROUTES } from '../constants/api_constants';
import axiosInstance from './axiosConfig';

const { AUTH } = API_ROUTES;
class AuthService {
  sigup(email: string, mobile: string, password: string) {
    return axiosInstance.post(AUTH.SIGNIN, { email, mobile, password });
  }
  login(email: string, password: string) {
    return axiosInstance.post(AUTH.LOGIN, { email, password });
  }

  forgetPassword(email: string) {
    return axiosInstance.post(AUTH.FORGOT_PASSWORD, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return axiosInstance.post(AUTH.RESET_PASSWORD, { token, newPassword });
  }
}

export default new AuthService();
