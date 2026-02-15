import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../constants/app_constants';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, []);

  const hideAuthButtons = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Logo / App name */}
      <h3 className="text-lg font-bold text-gray-800 tracking-tight">
        {APP_NAME}
      </h3>

      {/* Auth actions */}
      {!hideAuthButtons &&
        (token ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Sign In
          </Link>
        ))}
    </header>
  );
};
