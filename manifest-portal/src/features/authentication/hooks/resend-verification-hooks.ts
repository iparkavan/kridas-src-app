import { useMutation } from '@tanstack/react-query';
import { resendVerificationMail } from '../api/resend-verification-api';

const useResendVerificationMail = () =>
  useMutation({
    mutationFn: (email: string) => resendVerificationMail(email),
  });

export { useResendVerificationMail };
