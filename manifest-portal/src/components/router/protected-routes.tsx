import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../store';
import { routes } from '../../constants/routes';
import { useIsSuperAdmin } from '../../hooks/super-admin-hooks';

const ProtectedRoutes = () => {
  const { auth } = useAuth();
  const location = useLocation();

  const isSuperAdmin = useIsSuperAdmin();

  if (!auth) {
    return (
      <Navigate to={routes.index} state={{ from: location }} replace={true} />
    );
  }

  if (location.pathname === routes.admin && !isSuperAdmin) {
    throw Error('Unauthorized');
  }

  return <Outlet />;
};

export { ProtectedRoutes };
