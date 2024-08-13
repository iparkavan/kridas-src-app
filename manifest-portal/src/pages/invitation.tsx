import { useState } from 'react';
import { Input } from '../components/ui/input';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Signup as SignupFields,
  signUpSchema,
} from '../features/authentication/schemas/signup-schema';
import { PasswordValidations } from '../features/authentication/components/password-validations';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { routes } from '../constants/routes';
import { convertToPascalCase } from '../constants/utils';
import { Link } from '../components/ui/link';
import { ManifestLogoSmall } from '../assets/manifest-logo-small';

const Invitation = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? ' ';
  const navigate = useNavigate();

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
  const onSubmit: SubmitHandler<Omit<SignupFields, 'companyName'>> = async ({
    firstName,
    lastName,
  }) => {
    const values = {
      firstName: convertToPascalCase(firstName),
      lastName: convertToPascalCase(lastName),
    };
    console.log('the values are', values);
  };

  return (
    <main className="min-h-screen bg-grayGreen30">
      <header>
        <nav className="flex h-24 items-center border-b border-[#E3E5E4] bg-white px-10">
          <div className="m-h-[954px] flex items-center gap-4 sm:gap-6">
            <Link to={routes.credentials}>
              <ManifestLogoSmall />
            </Link>
            <div className="h-8 w-px bg-gray50" />
            <h1 className="select-none text-xl font-normal text-teal">
              Client{' '}
              <span className="text-xl font-normal text-gray70">
                ’s Dashboard
              </span>
            </h1>
          </div>
        </nav>
      </header>
      <section className="flex-1 p-6 py-10 sm:p-10 md:px-12 md:pt-20 lg:px-20">
        <div className="mx-auto flex max-w-[450px] flex-col gap-9">
          <h1 className="text-center text-xl font-medium text-gray">
            Accept your invitation to sign up
          </h1>
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
              id="email"
              label="Email"
              disabled={true}
              value={email}
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
                error={!!errors.password}
                wrapperClassName="mb-2"
              />
              {(getValues('password') || errors.password) && (
                <PasswordValidations currentError={errors.password} />
              )}
            </div>
            <div className="md:mt-2">
              <Checkbox
                form="signup-form"
                id="tAndC"
                label="By checking the box, I agree to the Manifest Terms of Service, Privacy
        Policy and User Agreement."
              />
            </div>
            <Button
              type="submit"
              form="signup-form"
              className="bg-deepForest py-3 text-xl text-white hover:bg-deepForest/95 focus:ring-deepForest disabled:bg-deepForest/80 md:py-2 md:text-lg"
            >
              Sign up
            </Button>
          </form>
          <>
            <p className="flex items-baseline gap-2 self-center md:mt-[-10px]">
              <span className="text-coco md:hidden">or</span>
              <span className="hidden w-full text-coco md:block">
                Already have an account?
              </span>
              <Button
                className="py-0 text-mint underline"
                onClick={() => {
                  navigate({
                    pathname: routes.index,
                  });
                }}
              >
                Log in
              </Button>
            </p>
          </>
        </div>
      </section>
    </main>
  );
};

export { Invitation };
