import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { isAxiosError } from 'axios';
import {
  ResetPasswordFields,
  resetPasswordSchema,
} from '../schemas/reset-password-schema';
import { useResetPassword } from '../hooks/reset-password-hooks';
import { useAuth } from '../../../store';
import { PasswordValidations } from '../../authentication/components/password-validations';
import { ApiErrorRes } from '../../../types/api-types';
import { genericErrorMessage } from '../../../constants/utils';
import { ErrorMessage } from '../../../components/ui/error-message';
import { useToast } from '../../../hooks/toast-hooks';

type ResetPasswordDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const ResetPasswordDialog = ({
  isDialogOpen,
  setIsDialogOpen,
}: ResetPasswordDialogProps) => {
  const {
    mutate,
    isPending,
    isError,
    error,
    reset: mutationReset,
  } = useResetPassword();
  const { auth } = useAuth();
  const toast = useToast();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    reset: formReset,
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<ResetPasswordFields> = (values) => {
    mutate(
      {
        // Check if there is a better way to handle this
        accessToken: auth?.accessToken as string,
        ...values,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: 'Your password has been reset.',
            variant: 'success',
          });
        },
      }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    formReset();
    mutationReset();
    setIsDialogOpen(isOpen);
  };

  let errorMessage = '';
  if (isError) {
    if (isAxiosError<ApiErrorRes>(error) && error.response) {
      const { status, data } = error.response;
      if (status === 500) {
        errorMessage = genericErrorMessage('Reset password');
      } else if (status === 400) {
        errorMessage = 'The old password was incorrect.';
      } else {
        errorMessage = data.message;
      }
    }
    if (!errorMessage) {
      errorMessage = genericErrorMessage('Reset password');
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
          Reset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Reset password</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label
            htmlFor="oldPassword"
            className="text-sm font-medium text-gray70"
          >
            Old password *
          </label>
          <Input
            wrapperClassName="mb-5 mt-2"
            type={showOldPassword ? 'text' : 'password'}
            id="oldPassword"
            {...register('oldPassword')}
            errorMessage={errors.oldPassword?.message}
            rightIcon={
              showOldPassword ? (
                <LuEyeOff size="18" className="text-deepForest" />
              ) : (
                <LuEye size="18" className="text-deepForest" />
              )
            }
            onRightIconClick={() => {
              setShowOldPassword(!showOldPassword);
            }}
          />

          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-gray70"
          >
            New password *
          </label>
          <Input
            wrapperClassName="my-2"
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            {...register('newPassword', {
              onChange: () => trigger('newPassword'),
            })}
            errorMessage={errors?.newPassword?.message}
            rightIcon={
              showNewPassword ? (
                <LuEyeOff size="18" className="text-deepForest" />
              ) : (
                <LuEye size="18" className="text-deepForest" />
              )
            }
            onRightIconClick={() => {
              setShowNewPassword(!showNewPassword);
            }}
            error={!!errors.newPassword}
          />
          {(getValues('newPassword') || errors.newPassword) && (
            <PasswordValidations currentError={errors.newPassword} />
          )}

          {isError && (
            <ErrorMessage className="-mb-4 mt-4">{errorMessage}</ErrorMessage>
          )}

          <div className="mt-10 text-end">
            <Button type="submit" variant="primary" isLoading={isPending}>
              Reset
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
