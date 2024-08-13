import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ForgotPasswordType } from '../../../pages/forgot-password';
import {
  ForgotPasswordRequest as ForgotPasswordRequestFields,
  forgotPasswordRequestSchema,
} from '../schemas/forgot-password-schema';
import { useRequestForgotPassword } from '../hooks/forgot-password-hooks';
import { getErrorMessage } from '../../../constants/utils';
import { ErrorMessage } from '../../../components/ui/error-message';

type ForgotPasswordRequestProps = {
  setForgotPasswordType: React.Dispatch<
    React.SetStateAction<ForgotPasswordType>
  >;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

const ForgotPasswordRequest = ({
  setForgotPasswordType,
  setEmail,
}: ForgotPasswordRequestProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequestFields>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    mode: 'onBlur',
  });

  const { mutate, isPending, isError, error } = useRequestForgotPassword();

  const onSubmit: SubmitHandler<ForgotPasswordRequestFields> = async (
    values
  ) => {
    mutate(values, {
      onSuccess: () => {
        setEmail(values.email);
        setForgotPasswordType('confirm');
      },
    });
  };

  const errorMessage = getErrorMessage(isError, error, 'Forgot password');

  return (
    <>
      <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          id="email"
          label="Email"
          {...register('email')}
          errorMessage={errors.email?.message}
          wrapperClassName="mb-5"
        />
      </form>

      {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <Button
        type="submit"
        form="forgot-password-form"
        variant="primary"
        className="rounded-lg text-xl font-medium md:py-2 md:text-lg"
        isLoading={isPending}
      >
        Get reset code
      </Button>
    </>
  );
};

export { ForgotPasswordRequest };
