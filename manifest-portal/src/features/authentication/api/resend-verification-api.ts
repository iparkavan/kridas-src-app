import { axios } from '../../../lib/axios';
import { ApiSuccessRes } from '../../../types/api-types';

const resendVerificationMail = async (email: string) => {
  const { data } = await axios.post<ApiSuccessRes<string>>(
    '/resendVerification',
    { email }
  );
  return data.data;
};

export { resendVerificationMail };
