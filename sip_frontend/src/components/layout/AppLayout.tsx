import { Outlet } from 'react-router-dom';
import { AppHeader } from '../header/AppHeader';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      {/* dashboard content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};
