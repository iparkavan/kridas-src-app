import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store';
import SettingsIcon from '../../../assets/icons/settings-icon.svg?react';
import DocumentIcon from '../../../assets/icons/document-icon.svg?react';
import LogoutIcon from '../../../assets/icons/logout-icon.svg?react';
import { routes } from '../../../constants/routes';

const AvatarMenu = () => {
  const navigate = useNavigate();
  const { auth, decodedToken, logout } = useAuth();

  const avatarInitial = decodedToken?.given_name.charAt(0);
  const companyName = auth?.company.companyName;
  const userEmail = decodedToken?.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-deepForest">
        <Avatar>
          <AvatarFallback>{avatarInitial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[320px] max-w-[400px]" align="end">
        <div className="flex items-center gap-5 px-6 py-5">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-3xl">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <p className="mb-1 truncate font-medium">{companyName}</p>
            <p className="truncate">{userEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(routes.settingsTeam)}>
          <SettingsIcon className="ml-11 mr-7" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => open(routes.stopLightDocs)}>
          <DocumentIcon className="ml-11 mr-7" />
          API Docs
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogoutIcon className="ml-11 mr-7" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { AvatarMenu };
