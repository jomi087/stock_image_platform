import { useState } from 'react';
import { AuthLayout } from '../components/ui/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
// import styles from './SignIn.module.css';
import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
} from '../constants/validation_constants';
import AuthService from '../services/AuthService';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FormErrors {
  email?: string;
  password?: string;
}

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < PASSWORD_MIN_LENGTH) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await AuthService.login(email, password);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      let errorMsg = 'Login failed';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="Enter your email"
        />

        <div className="relative mb-4">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Enter your password"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword ? 'Hide password' : 'Show password'
            }
            className="absolute right-3 top-9.5 flex items-center p-1 text-gray-500 hover:text-gray-900 transition-colors"
          >
            {showPassword ? (
              <FiEyeOff size={20} />
            ) : (
              <FiEye size={20} />
            )}
          </button>
        </div>

        <Button
          text={loading ? 'Signing in...' : 'Sign In'}
          type="submit"
          disabled={loading}
        />

        <div className="mt-5 text-center">
          <Link
            to="/forgot-password"
            className="text-indigo-500 hover:text-purple-600 text-sm font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-indigo-500 hover:text-purple-600 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
