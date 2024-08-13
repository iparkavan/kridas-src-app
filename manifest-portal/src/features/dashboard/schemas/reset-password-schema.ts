import { z } from 'zod';
import { getPasswordSchema } from '../../../constants/utils';

const resetPasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: getPasswordSchema(),
});

type ResetPasswordFields = z.infer<typeof resetPasswordSchema>;

export { resetPasswordSchema };
export type { ResetPasswordFields };
