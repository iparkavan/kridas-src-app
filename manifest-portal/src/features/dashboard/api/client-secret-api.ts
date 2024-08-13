import { axiosPrivate } from '../../../lib/axios';
import { ApiSuccessRes } from '../../../types/api-types';
import {
  ClientSecret,
  ClientSecretReq,
  ClientSecretCreateReq,
  ClientSecretUpdateReq,
} from '../types/client-secret-types';

const getClientSecret = async ({ environment, companyId }: ClientSecretReq) => {
  const { data } = await axiosPrivate.get<ApiSuccessRes<ClientSecret | null>>(
    `/clientSecret?env=${environment}&companyId=${companyId}`
  );
  return data.data;
};

const createClientSecret = async (clientSecretData: ClientSecretCreateReq) => {
  await axiosPrivate.post('/clientSecret', clientSecretData);
};

const resetClientSecret = async (clientSecretData: ClientSecretReq) => {
  await axiosPrivate.post('/clientSecret/resetSecret', clientSecretData);
};

const updateClientSecret = async (clientSecretData: ClientSecretUpdateReq) => {
  await axiosPrivate.post('/clientSecret/approve', clientSecretData);
};

export {
  getClientSecret,
  createClientSecret,
  resetClientSecret,
  updateClientSecret,
};
