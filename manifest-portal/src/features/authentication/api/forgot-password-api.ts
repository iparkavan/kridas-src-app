import { axios } from '../../../lib/axios';
import {
  ForgotPasswordConfirmation,
  ForgotPasswordRequest,
} from '../schemas/forgot-password-schema';

const requestForgotPassword = async (passwordData: ForgotPasswordRequest) => {
  await axios.post('/forgotPassword', passwordData);
};

const confirmForgotPassword = async (
  passwordData: ForgotPasswordConfirmation
) => {
  await axios.post('/forgotPassword/confirm', passwordData);
};

export { requestForgotPassword, confirmForgotPassword };
