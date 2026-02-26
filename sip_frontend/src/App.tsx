import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import { AuthLayout } from './components/layout/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

// auth pages

// dashboard pages
import MyImagesPage from './page/dashboard/MyImagesPage';
import { SignIn } from './page/auth/SignIn';
import { SignUp } from './page/auth/SignUp';
import { ForgotPassword } from './page/auth/ForgotPassword';
import { ResetPassword } from './page/auth/ResetPassword';
import { AppLayout } from './components/layout/AppLayout';
import PublicRoute from './components/PublicRoute';

function App() {
  const router = createBrowserRouter([
    // AUTH AREA
    {
      element: <AuthLayout />,
      children: [
        {
          path: '/',
          element: (
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          ),
        },
        {
          path: '/signup',
          element: (
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          ),
        },
        {
          path: '/forgot-password',
          element: (
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          ),
        },
        {
          path: '/reset-password',
          element: (
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          ),
        },
      ],
    },

    // APP AREA
    {
      element: <AppLayout />,
      children: [
        {
          path: '/dashboard',
          element: (
            <ProtectedRoute>
              <MyImagesPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
