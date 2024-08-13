import { useState } from 'react';
import { isAxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthState } from '../../../pages/auth-index';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Link } from '../../../components/ui/link';
import { Login as LoginFields, loginSchema } from '../schemas/login-schema';
import { useAuth } from '../../../store';
import { useLogin } from '../hooks/authentication-hooks';
import { ApiErrorRes } from '../../../types/api-types';
import { genericErrorMessage } from '../../../constants/utils';
import { routes } from '../../../constants/routes';
import { ErrorMessage } from '../../../components/ui/error-message';

type LoginProps = {
  setAuthType: React.Dispatch<React.SetStateAction<AuthState>>;
};

const Login = ({ setAuthType }: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const { mutate, isPending, isError, error } = useLogin();

  const onSubmit: SubmitHandler<LoginFields> = async ({ email, password }) => {
    mutate(
      { email: email.toLowerCase(), password },
      {
        onSuccess: (data) => {
          login(location, navigate, data);
        },
      }
    );
  };

  let errorMessage = '';
  if (isError) {
    if (isAxiosError<ApiErrorRes>(error) && error.response) {
      const { status, data } = error.response;
      if (status === 500) {
        errorMessage = genericErrorMessage('Login');
      } else if (status === 401) {
        errorMessage = 'The email or password was incorrect.';
      } else {
        errorMessage = data.message;
      }
    }
    if (!errorMessage) {
      errorMessage = genericErrorMessage('Login');
    }
  }

  return (
    <section className="flex-1 bg-grayGreen30 px-6 py-10 sm:p-10 md:px-12 md:pt-28 lg:px-20">
      <div className="mx-auto flex max-w-[450px] flex-col gap-5">
        <Button
          className="rounded-lg bg-teal text-xl font-medium text-white hover:bg-teal/95 focus:ring-teal md:py-2 md:text-lg"
          onClick={() => setAuthType('register')}
        >
          Get started
        </Button>

        <div className="flex items-center gap-2">
          <hr className="flex-1 text-[#C9C9C9]" />
          <p className="text-sm text-black">or</p>
          <hr className="flex-1 text-[#C9C9C9]" />
        </div>

        <h1 className="text-center text-xl font-medium text-black">Log in</h1>

        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            id="email"
            label="Email"
            {...register('email')}
            errorMessage={errors.email?.message}
            wrapperClassName="mb-5"
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            label="Password"
            {...register('password')}
            errorMessage={errors.password?.message}
            wrapperClassName="mb-3"
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
          />

          <Link to={routes.forgotPassword} className="text-sm text-mint">
            Forgot password?
          </Link>
        </form>

        {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <Button
          type="submit"
          form="login-form"
          variant="primary"
          className="rounded-lg text-xl font-medium md:py-2 md:text-lg"
          isLoading={isPending}
        >
          Log in
        </Button>

        <p className="text-sm text-coco/70">
          By logging in, I agree to the{' '}
          {/* Change below as links or buttons? */}
          <span className="cursor-pointer text-mint">Terms of Service </span>
          and <span className="cursor-pointer text-mint">Privacy Policy.</span>
        </p>
      </div>
    </section>
  );
};

export { Login };
