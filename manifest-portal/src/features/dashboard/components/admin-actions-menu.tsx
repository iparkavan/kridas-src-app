import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import MeatballsMenuIcon from '../../../assets/icons/meatballs-menu-icon.svg?react';
import { useUpdateClientSecret } from '../hooks/client-secret-hooks';
import { RequestStatus } from '../types/request-status-types';
import { Environment } from '../types/environment-types';
import { useToast } from '../../../hooks/toast-hooks';
import { genericErrorMessage } from '../../../constants/utils';

type AdminActionsMenuProps = {
  companyId: string;
  environment: Environment;
};

const AdminActionsMenu = ({
  companyId,
  environment,
}: AdminActionsMenuProps) => {
  const toast = useToast();
  const { mutate } = useUpdateClientSecret();

  const handleUpdateRequest = (requestStatus: RequestStatus) => {
    mutate(
      {
        environment,
        companyId,
        requestStatus,
      },
      {
        onError: () =>
          toast({
            title: genericErrorMessage('Update client secret'),
            variant: 'error',
          }),
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="align-middle">
        <MeatballsMenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleUpdateRequest('APRD')}
          className="pl-5 pr-10 text-sm"
        >
          Accept
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleUpdateRequest('DENY')}
          className="pl-5 pr-10 text-sm text-tomato"
        >
          Deny
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { AdminActionsMenu };
