import { Link } from '../../../components/ui/link';
import { routes } from '../../../constants/routes';

const ClientSecretPending = () => {
  return (
    <div className="mt-7 rounded-md border border-grayGreen100 bg-white px-7 py-28">
      <p className="text-center leading-7">
        Your request was successfully submitted. If you have any questions,
        <br className="hidden sm:inline" /> please reach out to us at{' '}
        <Link
          to={routes.mailToDevelopers}
          className="font-normal text-teal no-underline"
        >
          developers@usemanifest.com
        </Link>
      </p>
    </div>
  );
};

export { ClientSecretPending };
