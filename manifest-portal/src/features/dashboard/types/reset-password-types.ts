import { ResetPasswordFields } from '../schemas/reset-password-schema';

type ResetPassword = ResetPasswordFields & {
  accessToken: string;
};

export type { ResetPassword };
