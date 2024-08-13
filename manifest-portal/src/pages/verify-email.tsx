import { useSearchParams } from 'react-router-dom';
import { ManifestLogoSmall } from '../assets/manifest-logo-small';
import EmailIllustration from '../assets/images/illustration_email.jpg';
import { Button } from '../components/ui/button';
import { Link } from '../components/ui/link';
import { useResendVerificationMail } from '../features/authentication/hooks/resend-verification-hooks';
import { getErrorMessage } from '../constants/utils';
import { routes } from '../constants/routes';
import { ErrorMessage } from '../components/ui/error-message';

const VerifyEmail = () => {
  const { mutate, isPending, isSuccess, isError, error, data } =
    useResendVerificationMail();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const handleResendMail = () => {
    if (email) {
      mutate(email);
    }
  };

  const errorMessage = getErrorMessage(isError, error, 'Resend email');

  return (
    <main className="p-6 sm:p-10 md:px-12 md:py-8 lg:px-24">
      <section className="mx-auto max-w-[600px]">
        <div className="md:hidden">
          <ManifestLogoSmall />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-deepForest md:text-3xl md:text-coco">
          One last thing...
        </h2>
        <h1 className="mt-3 text-center text-sm md:text-lg md:text-cocoGray">
          Click the link in the email we sent to verify your email address.
        </h1>
        <img
          src={EmailIllustration}
          alt="Email"
          className="mx-auto my-14 w-[75%] max-w-[350px] md:my-16"
        />

        {isSuccess && (
          <p className="mb-4 text-center text-sm md:text-lg md:text-cocoGray">
            {data}
          </p>
        )}

        {isError && (
          <ErrorMessage className="mb-4 text-center text-sm md:text-lg">
            {errorMessage}
          </ErrorMessage>
        )}

        <Button
          type="button"
          variant="primary"
          className="w-full rounded-lg text-xl font-medium md:py-2 md:text-lg"
          isLoading={isPending}
          onClick={handleResendMail}
        >
          Resend email
        </Button>

        <Link to={routes.index} className="mx-auto mt-4 block w-fit text-mint">
          Log in
        </Link>
      </section>
    </main>
  );
};

export { VerifyEmail };
