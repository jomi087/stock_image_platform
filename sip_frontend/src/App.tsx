import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SignIn } from './page/SignIn';
import { SignUp } from './page/SignUp';
import { ForgotPassword } from './page/ForgotPassword';
import { ResetPassword } from './page/ResetPassword';
import { Layout } from './components/layout/Layout';
import { Toaster } from 'react-hot-toast';

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        // { path: '/', element: <Home /> },
        { path: '/login', element: <SignIn /> },
        { path: '/signup', element: <SignUp /> },
        { path: '/forgot-password', element: <ForgotPassword /> },
        { path: '/reset-password', element: <ResetPassword /> },
      ],
    },
  ]);
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
