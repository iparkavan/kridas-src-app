import { axiosPrivate } from '../../../lib/axios';
import { ApiSuccessRes } from '../../../types/api-types';
import { Users } from '../types/user-types';

const getUsers = async (companyId: string) => {
  const { data } = await axiosPrivate.get<ApiSuccessRes<Users>>(
    `https://api.development.usemanifest.com/portalUser?companyId=${companyId}`
  );
  return data.data;
};

export { getUsers };
