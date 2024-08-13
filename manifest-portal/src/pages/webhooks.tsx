import WebhooksIllustration from '../assets/images/illustration_webhooks.png';
import { Link } from '../components/ui/link';
import { routes } from '../constants/routes';

const Webhooks = () => {
  return (
    <div>
      <h1 className="text-2xl font-medium">Webhooks</h1>
      <div className="mt-7 rounded-md border border-grayGreen100 bg-white px-4 py-12">
        <div className="mx-auto max-w-[450px]">
          <img src={WebhooksIllustration} alt="Webhook Illustration" />
          <p className="mt-8 text-center">
            To learn more, please reach out to us at{' '}
            <Link
              className="text-center text-teal no-underline"
              to={routes.mailToDevelopers}
            >
              developers@usemanifest.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { Webhooks };
