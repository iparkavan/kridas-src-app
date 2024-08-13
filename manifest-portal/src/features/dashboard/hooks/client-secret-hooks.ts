import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createClientSecret,
  getClientSecret,
  resetClientSecret,
  updateClientSecret,
} from '../api/client-secret-api';
import {
  ClientSecretReq,
  ClientSecretCreateReq,
  ClientSecretUpdateReq,
} from '../types/client-secret-types';
import { baseAllUsersKey } from './admin-hooks';

const getClientSecretKey = ({ companyId, environment }: ClientSecretReq) => [
  'client-secret',
  companyId,
  environment,
];

const useGetClientSecret = (clientSecretData: ClientSecretReq) =>
  useQuery({
    queryKey: getClientSecretKey(clientSecretData),
    queryFn: () => getClientSecret(clientSecretData),
  });

const useCreateClientSecret = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientSecretData: ClientSecretCreateReq) =>
      createClientSecret(clientSecretData),
    onSuccess: (_data, clientSecretVariables) => {
      queryClient.invalidateQueries({
        queryKey: getClientSecretKey(clientSecretVariables),
      });
    },
  });
};

const useResetClientSecret = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientSecretData: ClientSecretReq) =>
      resetClientSecret(clientSecretData),
    onSuccess: (_data, clientSecretVariables) => {
      queryClient.invalidateQueries({
        queryKey: getClientSecretKey(clientSecretVariables),
      });
    },
  });
};

const useUpdateClientSecret = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientSecretData: ClientSecretUpdateReq) =>
      updateClientSecret(clientSecretData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [baseAllUsersKey],
      });
    },
  });
};

export {
  useGetClientSecret,
  useCreateClientSecret,
  useResetClientSecret,
  useUpdateClientSecret,
};
