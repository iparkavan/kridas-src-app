import { useState } from 'react';
import { ForgotPasswordRequest } from '../features/authentication/components/forgot-password-request';
import { ForgotPasswordConfirm } from '../features/authentication/components/forgot-password-confirm';
import { Link } from '../components/ui/link';
import { routes } from '../constants/routes';

export type ForgotPasswordType = 'request' | 'confirm';

const ForgotPassword = () => {
  const [forgotPasswordType, setForgotPasswordType] =
    useState<ForgotPasswordType>('request');
  const [email, setEmail] = useState('');

  return (
    <section className="flex-1 bg-grayGreen30 px-6 py-10 sm:p-10 md:px-12 md:pt-28 lg:px-20">
      <div className="mx-auto flex max-w-[450px] flex-col gap-5">
        <h1 className="text-center text-xl font-medium text-black">
          Forgot password
        </h1>
        {forgotPasswordType === 'request' ? (
          <ForgotPasswordRequest
            setForgotPasswordType={setForgotPasswordType}
            setEmail={setEmail}
          />
        ) : (
          <ForgotPasswordConfirm email={email} />
        )}
        <Link to={routes.index} className="mx-auto inline-block text-mint">
          Log in
        </Link>
      </div>
    </section>
  );
};

export { ForgotPassword };
