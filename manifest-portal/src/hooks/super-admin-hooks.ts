import { useAuth } from '../store';

const useIsSuperAdmin = () => {
  const { decodedToken } = useAuth();

  const isSuperAdmin = decodedToken?.['cognito:groups']?.find(
    (group) => group === 'admin'
  );

  return !!isSuperAdmin;
};

export { useIsSuperAdmin };
