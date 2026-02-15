import { useState } from 'react';
import { AuthLayout } from '../components/ui/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
} from '../constants/validation_constants';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';

interface FormErrors {
  email?: string;
  mobile?: string;
  password?: string;
}

export const SignUp = () => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
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

    if (!mobile) {
      newErrors.mobile = 'Mobile is required';
    } else if (mobile.length != 10) {
      newErrors.mobile = 'Invalid Mobile No';
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
      const res = await AuthService.sigup(email, mobile, password);
      toast.success(res.data.message);
      navigate('/login');
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
    <AuthLayout title="Sign Up">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <Input
            label="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {errors.mobile}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword ? 'Hide password' : 'Show password'
            }
            className="absolute right-3 top-9.5 flex items-center justify-center p-1 text-gray-500 hover:text-gray-900 transition-colors"
          >
            {showPassword ? (
              <FiEyeOff size={18} />
            ) : (
              <FiEye size={18} />
            )}
          </button>

          {errors.password && (
            <p className="mt-0 text-sm text-red-500 font-medium">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            text={loading ? 'Creating A/c...' : 'Create Account'}
            type="submit"
            disabled={loading}
          />
        </div>
      </form>

      <div className="mt-3 pt-2 border-t border-gray-200 text-center text-sm text-gray-500">
        Alredy have an account?{' '}
        <Link
          to="/login"
          className="text-indigo-500 hover:text-purple-600 font-semibold transition-colors"
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};
