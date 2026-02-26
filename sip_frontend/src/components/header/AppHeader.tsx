import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../constants/app_constants';
import { useState } from 'react';

export const AppHeader = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-white">
      <h1 className="text-xl font-bold">{APP_NAME}</h1>

      {token ? (
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      ) : (
        <Link
          to="/"
          className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Sign In
        </Link>
      )}
    </header>
  );
};
