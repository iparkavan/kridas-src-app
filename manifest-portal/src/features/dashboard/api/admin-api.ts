import { axiosPrivate } from '../../../lib/axios';
import { ApiSuccessRes } from '../../../types/api-types';
import { AllUsersReq, AllUsersRes } from '../types/admin-types';

const getAllUsers = async (usersRequestData: AllUsersReq) => {
  const { data } = await axiosPrivate.post<ApiSuccessRes<AllUsersRes>>(
    '/portal/admin/getClientCredentialList',
    usersRequestData
  );
  return data.data;
};

export { getAllUsers };
