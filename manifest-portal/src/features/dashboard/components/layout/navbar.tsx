import { ComponentPropsWithoutRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ManifestLogoSmall } from '../../../../assets/manifest-logo-small';
import { EnvironmentSelect } from '../environment-select';
import { cn } from '../../../../lib/cn';
import { EnvironmentState as NavbarProps } from '../../types/environment-types';
import { AvatarMenu } from '../avatar-menu';
import { routes } from '../../../../constants/routes';
import { Link } from '../../../../components/ui/link';
import { useIsSuperAdmin } from '../../../../hooks/super-admin-hooks';
import { NavbarMenu } from './navbar-menu';

const Navbar = (props: NavbarProps) => {
  const isSuperAdmin = useIsSuperAdmin();

  return (
    <header>
      <nav className="grid h-24 grid-cols-[auto,auto] items-center gap-4 border-b border-grayGreen70 bg-white px-7 md:px-10 lg:grid-cols-[auto,auto,auto] xl:grid-cols-[1fr,2fr,1fr]">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to={routes.credentials}>
            <ManifestLogoSmall />
          </Link>
          <EnvironmentSelect {...props} />
        </div>

        <ul className="hidden gap-16 justify-self-center lg:flex">
          <li>
            <CustomNavLink to={routes.credentials}>Credentials</CustomNavLink>
          </li>
          <li>
            <CustomNavLink to={routes.webhooks}>Webhooks</CustomNavLink>
          </li>
          <li>
            <CustomNavLink to={routes.activity}>Activity</CustomNavLink>
          </li>
          {isSuperAdmin && (
            <li>
              <CustomNavLink to={routes.admin}>Admin</CustomNavLink>
            </li>
          )}
        </ul>

        <div className="justify-self-end">
          <div className="flex lg:hidden">
            <NavbarMenu />
          </div>
          <div className="hidden lg:block">
            <AvatarMenu />
          </div>
        </div>
      </nav>
    </header>
  );
};

const CustomNavLink = (props: ComponentPropsWithoutRef<typeof NavLink>) => (
  <NavLink
    className={({ isActive }) =>
      cn(
        'text-lg font-medium focus:outline-offset-4 focus:outline-deepForest',
        isActive && 'text-teal'
      )
    }
    {...props}
  />
);

export { Navbar };
