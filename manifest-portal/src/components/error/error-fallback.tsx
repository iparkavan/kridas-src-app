import { FallbackProps } from 'react-error-boundary';
import { ManifestLogoSmall } from '../../assets/manifest-logo-small';
import { routes } from '../../constants/routes';
import { Button } from '../ui/button';

const ErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <main className="min-h-screen bg-grayGreen30">
      <header>
        <nav className="flex h-24 flex-col justify-center px-10">
          <a href={routes.index}>
            <ManifestLogoSmall />
          </a>
        </nav>
      </header>
      {/* Calculated min-h based on the navbar height of 96px */}
      <section className="min-h-[calc(100vh-96px)] p-10">
        <div className="mx-auto w-fit text-center">
          <h1 className="mb-2 text-3xl font-bold text-deepForest">
            Something went wrong..
          </h1>
          <p>Click the button below to get back to the homepage.</p>
          <Button
            variant="primary"
            className="mt-7 w-full rounded-lg text-base font-medium"
            onClick={resetErrorBoundary}
          >
            Back to home
          </Button>
        </div>
      </section>
    </main>
  );
};

export { ErrorFallback };
