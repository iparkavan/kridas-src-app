import { ClientSecret } from '../types/client-secret-types';
import CopyIcon from '../../../assets/icons/copy-icon.svg?react';
import RefreshIcon from '../../../assets/icons/refresh-icon.svg?react';
// import EditIcon from '../../../assets/icons/edit-icon.svg?react';
import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { useAuth } from '../../../store';
import { useResetClientSecret } from '../hooks/client-secret-hooks';
import { Environment } from '../types/environment-types';
import { useToast } from '../../../hooks/toast-hooks';
import { genericErrorMessage } from '../../../constants/utils';
import { useClipboard } from '../../../hooks/clipboard-hooks';
import { IconButton } from '../../../components/ui/icon-button';

type ClientSecretApprovedProps = {
  clientSecretData: ClientSecret;
  companyId: string;
  environment: Environment;
};

const ClientSecretApproved = ({
  clientSecretData,
  companyId,
  environment,
}: ClientSecretApprovedProps) => {
  const { auth } = useAuth();
  const clientId = auth?.company.clientId as string;

  const { clientSecret } = clientSecretData;
  const [showClientSecret, setShowClientSecret] = useState(false);

  const { onCopy } = useClipboard(clientId);
  const toast = useToast();
  const { mutate } = useResetClientSecret();

  const handleResetClientSecret = () => {
    mutate(
      { companyId, environment },
      {
        onSuccess: () =>
          toast({ title: 'Client secret has been reset.', variant: 'success' }),
        onError: () =>
          toast({
            title: genericErrorMessage('Reset client secret'),
            variant: 'error',
          }),
      }
    );
  };

  const handleCopyClientId = () => {
    onCopy();
    toast({
      title: 'Client id has been copied.',
      duration: 2000,
    });
  };

  return (
    <>
      <div className="mt-7 max-w-[850px] rounded-md border border-grayGreen100 bg-white">
        <div className="p-6 md:pr-10">
          <div className="text-sm font-medium text-gray70">CLIENT ID</div>
          <div className="mt-2 flex items-center justify-between gap-4 text-lg font-medium">
            <p className="[overflow-wrap:anywhere]">{clientId}</p>
            <IconButton tooltipContent="Copy" onClick={handleCopyClientId}>
              <CopyIcon />
            </IconButton>
          </div>
        </div>
        <hr className="text-grayGreen100" />
        <div className="p-6 md:pr-10">
          <div className="text-sm font-medium text-gray70">CLIENT SECRET</div>
          <div className="mt-2 flex items-center justify-between gap-4 text-lg font-medium">
            <p className="[overflow-wrap:anywhere]">
              {showClientSecret
                ? clientSecret
                : Array.from(clientSecret, () => '*').join('')}
            </p>
            <div className="flex gap-7">
              <IconButton
                onClick={() => setShowClientSecret(!showClientSecret)}
                tooltipContent={showClientSecret ? 'Hide' : 'Show'}
              >
                {showClientSecret ? (
                  <LuEyeOff size="24" className="text-deepForest" />
                ) : (
                  <LuEye size="24" className="text-deepForest" />
                )}
              </IconButton>
              <IconButton
                tooltipContent="Reset"
                onClick={handleResetClientSecret}
              >
                <RefreshIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      {/* <h2 className="mt-10 text-2xl font-medium text-deepForest80">
        Redirect URIs
      </h2>
      <div className="mt-7 border border-grayGreen100 rounded-md bg-white max-w-[600px]">
        <div className="p-6 pr-10 flex justify-between items-center">
          <div className="mt-2 text-lg text-gray font-medium">
            https://employer.usemanifest.com/
          </div>
          <EditIcon />
        </div>
      </div> */}
    </>
  );
};

export { ClientSecretApproved };
