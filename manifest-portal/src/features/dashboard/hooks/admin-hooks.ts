import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../api/admin-api';
import { AllUsersReq } from '../types/admin-types';

const baseAllUsersKey = 'all-users';

const getAllUsersKey = (usersRequesetData: AllUsersReq) => [
  baseAllUsersKey,
  usersRequesetData,
];

const useGetAllUsers = (usersRequesetData: AllUsersReq) =>
  useQuery({
    queryKey: getAllUsersKey(usersRequesetData),
    queryFn: () => getAllUsers(usersRequesetData),
    placeholderData: keepPreviousData,
  });

export { baseAllUsersKey, useGetAllUsers };
