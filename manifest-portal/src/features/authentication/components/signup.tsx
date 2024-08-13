import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { isAxiosError } from 'axios';
import { AuthState } from '../../../pages/auth-index';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';
import { Signup as SignupFields, signUpSchema } from '../schemas/signup-schema';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/authentication-hooks';
import {
  convertToPascalCase,
  genericErrorMessage,
} from '../../../constants/utils';
import { routes } from '../../../constants/routes';
import { ErrorMessage } from '../../../components/ui/error-message';
import { PasswordValidations } from './password-validations';
import { ApiErrorRes } from '../../../types/api-types';

type SignupProps = {
  setAuthType: React.Dispatch<React.SetStateAction<AuthState>>;
};

const Signup = ({ setAuthType }: SignupProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
  } = useForm<SignupFields>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, isError, error } = useSignup();

  const onSubmit: SubmitHandler<SignupFields> = async ({
    firstName,
    lastName,
    companyName,
    email,
    ...otherValues
  }) => {
    const values = {
      firstName: convertToPascalCase(firstName),
      lastName: convertToPascalCase(lastName),
      companyName: convertToPascalCase(companyName),
      email: email.toLowerCase(),
      ...otherValues,
    };
    mutate(values, {
      onSuccess: (_data, variables) => {
        navigate({
          pathname: routes.verifyEmail,
          search: `?email=${variables.email}`,
        });
      },
    });
  };

  let errorMessage = '';
  if (isError) {
    if (isAxiosError<ApiErrorRes>(error) && error.response) {
      const { status, data } = error.response;
      if (
        data.message ===
        'User validation failed due to Lambda trigger configuration.'
      ) {
        errorMessage = 'Company name already exists.';
      } else if (status === 500) {
        errorMessage = genericErrorMessage('Signup');
      } else {
        errorMessage = data.message;
      }
    }
    if (!errorMessage) {
      errorMessage = genericErrorMessage('Signup');
    }
  }

  return (
    <section className="flex-1 bg-grayGreen30 p-6 py-10 sm:p-10 md:px-12 md:pt-20 lg:px-20">
      <div className="mx-auto flex max-w-[450px] flex-col gap-5">
        <h1 className="text-center text-xl font-medium text-black">Sign up</h1>

        <form
          id="signup-form"
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="md:flex md:gap-5">
            <Input
              type="text"
              id="firstName"
              label="Legal first name"
              {...register('firstName')}
              errorMessage={errors.firstName?.message}
              wrapperClassName="mb-6 md:mb-0 md:w-full"
            />

            <Input
              type="text"
              id="lastName"
              label="Last name"
              {...register('lastName')}
              errorMessage={errors.lastName?.message}
              wrapperClassName="md:w-full"
            />
          </div>

          <Input
            type="text"
            id="companyName"
            label="Company name"
            {...register('companyName')}
            errorMessage={errors.companyName?.message}
          />

          <Input
            type="text"
            id="email"
            label="Email"
            {...register('email')}
            errorMessage={errors.email?.message}
          />

          <div>
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              label="Password"
              {...register('password', {
                onChange: () => trigger('password'),
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
              error={!!errors.password}
              wrapperClassName="mb-2"
            />
            {(getValues('password') || errors.password) && (
              <PasswordValidations currentError={errors.password} />
            )}
          </div>
        </form>

        <div className="md:mt-2">
          <Checkbox
            form="signup-form"
            id="tAndC"
            label="By checking the box, I agree to the Manifest Terms of Service, Privacy
          Policy and User Agreement."
            {...register('tAndC')}
            error={!!errors.tAndC}
          />
        </div>

        {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <Button
          type="submit"
          form="signup-form"
          variant="primary"
          className="rounded-lg text-xl font-medium md:py-2 md:text-lg"
          isLoading={isPending}
        >
          Get started
        </Button>

        <p className="flex items-baseline gap-3 self-center md:mt-[-10px]">
          <span className="text-coco md:hidden">or</span>
          <span className="hidden w-full text-coco md:block">
            Already have an account?
          </span>
          <Button
            variant="link"
            className="text-base font-medium text-mint underline"
            onClick={() => setAuthType('login')}
          >
            Log in
          </Button>
        </p>
      </div>
    </section>
  );
};

export { Signup };
