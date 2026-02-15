import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AuthLayout } from "../components/ui/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthService from "../services/AuthService";
import toast from "react-hot-toast";
import axios from "axios";
import { PASSWORD_MIN_LENGTH } from "../constants/validation_constants";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      );
      return;
    }

    setPasswordError("");

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    try {
      setLoading(true);
      const res = await AuthService.resetPassword(token, password);
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      let errorMsg = "Password reset failed";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password */}
        <div className="relative">
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />

          {passwordError && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {passwordError}
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-9.5 flex items-center justify-center p-1 text-gray-500 hover:text-gray-900 transition-colors"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            text={loading ? "Resetting..." : "Reset Password"}
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </AuthLayout>
  );
};
