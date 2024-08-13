import { axiosPrivate } from '../../../lib/axios';
import { ResetPassword } from '../types/reset-password-types';

const resetPassword = async (resetPasswordData: ResetPassword) => {
  await axiosPrivate.post('/changePassword', resetPasswordData);
};

export { resetPassword };
