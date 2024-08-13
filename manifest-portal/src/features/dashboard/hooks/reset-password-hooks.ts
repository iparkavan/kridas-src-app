import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../api/reset-password-api';
import { ResetPassword } from '../types/reset-password-types';

const useResetPassword = () =>
  useMutation({
    mutationFn: (data: ResetPassword) => resetPassword(data),
  });

export { useResetPassword };
