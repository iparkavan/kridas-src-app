import { Outlet } from 'react-router-dom';
import { AuthContent } from '../auth-content';

const AuthLayout = () => {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <AuthContent />
      <Outlet />
    </main>
  );
};

export { AuthLayout };
