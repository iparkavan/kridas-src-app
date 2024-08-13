import { z } from 'zod';
import { getPasswordSchema } from '../../../constants/utils';

const forgotPasswordRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
});

const forgotPasswordConfirmationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  verificationCode: z.string().min(1, 'Reset code is required'),
  newPassword: getPasswordSchema(),
});

type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
type ForgotPasswordConfirmation = z.infer<
  typeof forgotPasswordConfirmationSchema
>;

export { forgotPasswordRequestSchema, forgotPasswordConfirmationSchema };
export type { ForgotPasswordRequest, ForgotPasswordConfirmation };
