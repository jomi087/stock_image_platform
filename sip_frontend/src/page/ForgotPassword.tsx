import { useState } from 'react';
import { AuthLayout } from '../components/ui/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import AuthService from '../services/AuthService';
import toast from 'react-hot-toast';
import axios from 'axios';
import { EMAIL_REGEX } from '../constants/validation_constants';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await AuthService.forgetPassword(email);
      toast.success(res.data.message);
      navigate('/reset-password');
    } catch (error) {
      let errorMsg = 'forget Password request failed';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          {emailError && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {emailError}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            text={loading ? 'Sending...' : 'Send Reset Link'}
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </AuthLayout>
  );
};
