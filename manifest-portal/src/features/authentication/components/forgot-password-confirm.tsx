import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  forgotPasswordConfirmationSchema,
  ForgotPasswordConfirmation as ForgotPasswordConfirmFields,
} from '../schemas/forgot-password-schema';
import { useConfirmForgotPassword } from '../hooks/forgot-password-hooks';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { PasswordValidations } from './password-validations';
import { getErrorMessage } from '../../../constants/utils';
import { ErrorMessage } from '../../../components/ui/error-message';

type ForgotPasswordConfirmProps = {
  email: string;
};

const ForgotPasswordConfirm = ({ email }: ForgotPasswordConfirmProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    reset,
  } = useForm<ForgotPasswordConfirmFields>({
    resolver: zodResolver(forgotPasswordConfirmationSchema),
    mode: 'onBlur',
    defaultValues: {
      email,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, isSuccess, isError, error } =
    useConfirmForgotPassword();

  const onSubmit: SubmitHandler<ForgotPasswordConfirmFields> = async (
    values
  ) => {
    mutate(values, {
      onSuccess: () => reset(),
    });
  };

  const errorMessage = getErrorMessage(isError, error, 'Forgot password');

  return (
    <>
      {!isSuccess && (
        <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            id="email"
            label="Email"
            {...register('email')}
            errorMessage={errors.email?.message}
            wrapperClassName="mb-5"
            disabled={true}
          />

          <Input
            type="number"
            id="resetCode"
            label="Reset Code"
            {...register('verificationCode')}
            errorMessage={errors.verificationCode?.message}
            wrapperClassName="mb-5"
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            label="Password"
            {...register('newPassword', {
              onChange: () => trigger('newPassword'),
            })}
            rightIcon={
              showPassword ? (
                <LuEyeOff size="18" className="text-deepForest" />
              ) : (
                <LuEye size="18" className="text-deepForest" />
              )
            }
            onRightIconClick={() => {
              setShowPassword(!showPassword);
            }}
            rightIconTooltipContent={showPassword ? 'Hide' : 'Show'}
            error={!!errors.newPassword}
            wrapperClassName="mb-3"
          />
          {(getValues('newPassword') || errors.newPassword) && (
            <PasswordValidations currentError={errors.newPassword} />
          )}
        </form>
      )}

      {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {isSuccess && (
        <p className="my-4">
          Your password has been reset successfully. Please login to continue.
        </p>
      )}

      {!isSuccess && (
        <Button
          type="submit"
          form="forgot-password-form"
          variant="primary"
          className="rounded-lg text-xl font-medium md:py-2 md:text-lg"
          isLoading={isPending}
        >
          Reset password
        </Button>
      )}
    </>
  );
};

export { ForgotPasswordConfirm };
