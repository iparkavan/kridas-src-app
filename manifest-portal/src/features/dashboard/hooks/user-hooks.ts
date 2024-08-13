import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/user-api';

const getUsersKey = (companyId: string) => ['users', companyId];

const useUsers = (companyId: string) =>
  useQuery({
    queryKey: getUsersKey(companyId),
    queryFn: () => getUsers(companyId),
  });

export { useUsers };
