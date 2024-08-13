import { ComponentPropsWithRef } from 'react';
import { NavLink } from 'react-router-dom';
import UserIcon from '../../../../assets/icons/user-icon.svg?react';
import UsersIcon from '../../../../assets/icons/users-icon.svg?react';
import VerifiedShieldIcon from '../../../../assets/icons/verified-shield-icon.svg?react';
import { routes } from '../../../../constants/routes';
import { cn } from '../../../../lib/cn';

const settingsLinks = [
  {
    title: 'Team',
    icon: <UsersIcon />,
    to: routes.settingsTeam,
  },
  {
    title: 'Profile',
    icon: <UserIcon />,
    to: routes.settingsProfile,
  },
  {
    title: 'Security',
    icon: <VerifiedShieldIcon />,
    to: routes.settingsSecurity,
  },
];

const Sidebar = () => {
  return (
    <aside className="min-h-[inherit] w-[35%] max-w-[350px] border-r border-grayGreen100 hidden md:block">
      <h1 className="mb-10 ml-24 mt-10 text-2xl font-medium">Settings</h1>
      {settingsLinks.map((link) => (
        <CustomSettingsLink key={link.to} to={link.to}>
          <div className="flex h-full items-center gap-4 pl-24">
            {link.icon}
            <p className="font-medium text-deepForest">{link.title}</p>
          </div>
        </CustomSettingsLink>
      ))}
    </aside>
  );
};

export const CustomSettingsLink = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof NavLink>) => {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'block h-20 hover:bg-grayGreen50',
          className,
          isActive && 'bg-tealLight hover:bg-tealLight'
        )
      }
      {...props}
    />
  );
};

export { Sidebar };
