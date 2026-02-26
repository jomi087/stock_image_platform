import { Outlet } from 'react-router-dom';
import { AuthHeader } from '../header/AuthHeader';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />

      {/* content area gets remaining height */}
      <main className="flex-1 flex">
        <Outlet />
      </main>
    </div>
  );
};