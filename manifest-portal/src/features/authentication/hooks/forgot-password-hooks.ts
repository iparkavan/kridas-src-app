import { useMutation } from '@tanstack/react-query';
import {
  confirmForgotPassword,
  requestForgotPassword,
} from '../api/forgot-password-api';
import {
  ForgotPasswordConfirmation,
  ForgotPasswordRequest,
} from '../schemas/forgot-password-schema';

const useRequestForgotPassword = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordRequest) => requestForgotPassword(data),
  });

const useConfirmForgotPassword = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordConfirmation) =>
      confirmForgotPassword(data),
  });

export { useRequestForgotPassword, useConfirmForgotPassword };
