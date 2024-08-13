import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Login } from '../features/authentication/components/login';
import { Signup } from '../features/authentication/components/signup';
import { useAuth } from '../store';
import { routes } from '../constants/routes';

export type AuthState = 'login' | 'register';

const AuthIndex = () => {
  const [authType, setAuthType] = useState<AuthState>('login');

  const { auth } = useAuth();

  if (auth) {
    return <Navigate to={routes.credentials} replace={true} />;
  }

  return authType === 'login' ? (
    <Login setAuthType={setAuthType} />
  ) : (
    <Signup setAuthType={setAuthType} />
  );
};

export { AuthIndex };
