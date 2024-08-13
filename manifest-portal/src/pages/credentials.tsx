import { environmentLabels } from '../features/dashboard/constants';
import { useEnvironment } from '../features/dashboard/hooks/environment-hooks';
import { useAuth } from '../store';
import { useGetClientSecret } from '../features/dashboard/hooks/client-secret-hooks';
import { ClientSecretRequest } from '../features/dashboard/components/client-secret-request';
import { ClientSecretPending } from '../features/dashboard/components/client-secret-pending';
import { ClientSecretApproved } from '../features/dashboard/components/client-secret-approved';
import { ClientSecret } from '../features/dashboard/types/client-secret-types';
import { ClientSecretSkeleton } from '../features/dashboard/components/client-secret-skeleton';
import { EnvironmentChip } from '../features/dashboard/components/environment-chip';

const Credentials = () => {
  const { environment } = useEnvironment();
  const environmentLabel = environmentLabels[environment];

  const { auth, decodedToken } = useAuth();

  const companyName = auth?.company.companyName;
  const companyId = decodedToken?.['custom:companyId'] as string;

  const {
    data: clientSecretData,
    isSuccess: isClientSecretSuccess,
    isPending: isClientSecretLoading,
  } = useGetClientSecret({ companyId, environment });

  let isClientSecretRequested = false,
    isClientSecretPending = false,
    isClientSecretApproved = false;
  if (isClientSecretSuccess) {
    if (clientSecretData) {
      isClientSecretPending = clientSecretData.requestStatus === 'PEND';
      isClientSecretApproved = clientSecretData.requestStatus === 'APRD';
      isClientSecretRequested = true;
    } else {
      isClientSecretRequested = false;
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-medium text-deepForest80">
          {companyName}
        </h2>
        <EnvironmentChip environmentLabel={environmentLabel} />
      </div>

      {isClientSecretLoading && <ClientSecretSkeleton />}

      {isClientSecretSuccess && !isClientSecretRequested && (
        <ClientSecretRequest environment={environment} />
      )}

      {isClientSecretPending && <ClientSecretPending />}

      {isClientSecretApproved && (
        <ClientSecretApproved
          clientSecretData={clientSecretData as ClientSecret}
          environment={environment}
          companyId={companyId}
        />
      )}
    </div>
  );
};

export { Credentials };
