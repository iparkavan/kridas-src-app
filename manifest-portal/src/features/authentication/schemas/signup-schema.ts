import { z } from 'zod';
import { getPasswordSchema } from '../../../constants/utils';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(150, 'Company name must be less than 150 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: getPasswordSchema(),
  tAndC: z.literal(true),
});

type Signup = z.infer<typeof signUpSchema>;

export { signUpSchema };
export type { Signup };
