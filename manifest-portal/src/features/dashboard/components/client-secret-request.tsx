import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/text-area';
import { environmentLabels, transferValues } from '../constants';
import { Environment } from '../types/environment-types';
import {
  ClientSecretReqFields,
  clientSecretDevSchema,
  clientSecretProdSchema,
} from '../schemas/client-secret-schema';
import { useCreateClientSecret } from '../hooks/client-secret-hooks';
import { useAuth } from '../../../store';
import { Link } from '../../../components/ui/link';
import { routes } from '../../../constants/routes';
import { TransfersSelect } from './transfers-select';
import { useToast } from '../../../hooks/toast-hooks';
import { genericErrorMessage } from '../../../constants/utils';

type ClientSecretRequestProps = {
  environment: Environment;
};

const ClientSecretRequest = ({ environment }: ClientSecretRequestProps) => {
  const isSandboxEnvironment = environment === 'STG';
  const isDevEnvironment = environment === 'DEV';

  const resolverSchema =
    !isSandboxEnvironment && environment === 'DEV'
      ? clientSecretDevSchema
      : clientSecretProdSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ClientSecretReqFields>({
    resolver: zodResolver(resolverSchema),
    mode: 'onBlur',
    defaultValues: {
      noOfTransfers: transferValues[0].value,
    },
  });

  const { mutate, isPending } = useCreateClientSecret();

  const toast = useToast();
  const { decodedToken } = useAuth();
  const companyId = decodedToken?.['custom:companyId'] as string;

  const onSubmit: SubmitHandler<ClientSecretReqFields> = async (values) => {
    mutate(
      { companyId, environment, ...values },
      {
        onError: () =>
          toast({
            title: genericErrorMessage('Request for credentials'),
            variant: 'error',
          }),
      }
    );
  };

  return isSandboxEnvironment ? (
    <div className="mt-7 rounded-md border border-grayGreen100 bg-white px-7 py-28">
      <p className="text-center leading-7">
        You can not request access for sandbox currently. If you have any
        questions,
        <br className="hidden sm:inline" />
        please reach out to us at{' '}
        <Link
          to={routes.mailToDevelopers}
          className="font-normal text-teal no-underline"
        >
          developers@usemanifest.com
        </Link>
      </p>
    </div>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-7 rounded-md border border-grayGreen100 bg-white px-7 py-7 md:px-9">
        <h2 className="text-[1.375rem] font-medium">
          You need to request access to manage this page.
        </h2>
        <label
          className="mb-2 mt-6 inline-block text-sm text-deepForest"
          htmlFor="environmentName"
        >
          Environment name
        </label>
        <Input
          className="max-w-[300px] text-sm uppercase"
          value={environmentLabels[environment]}
          id="environmentName"
          disabled={true}
        />

        {isDevEnvironment ? (
          <>
            <label
              className="mb-2 mt-6 inline-block text-sm text-deepForest"
              htmlFor="usageDescription"
            >
              Usage Description
            </label>
            <div className="max-w-[700px]">
              <p className="mb-4 text-sm text-gray70">
                * Please let us know how you plan to use it. Will this be used
                for one-off testing post-production, or do you plan to run
                automated tests on this environment?
              </p>
              <Textarea
                {...register('usageDesc')}
                errorMessage={errors.usageDesc?.message}
              />
            </div>
          </>
        ) : (
          <>
            <label
              className="mb-2 mt-6 inline-block text-sm text-deepForest"
              htmlFor="usageDescription"
            >
              Estimated transfers per month
            </label>
            <div className="max-w-[300px]">
              <TransfersSelect control={control} />
            </div>
          </>
        )}
      </div>
      <div className="mt-4 text-end">
        <Button variant="secondary" type="button" onClick={() => reset()}>
          Reset
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="ml-4"
          isLoading={isPending}
        >
          Request
        </Button>
      </div>
    </form>
  );
};

export { ClientSecretRequest };
