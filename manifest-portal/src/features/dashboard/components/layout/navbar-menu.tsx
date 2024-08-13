import {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
  forwardRef,
} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Accordion from '@radix-ui/react-accordion';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { LuMenu, LuX, LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { NavLink } from 'react-router-dom';
import { IconButton } from '../../../../components/ui/icon-button';
import { routes } from '../../../../constants/routes';
import { cn } from '../../../../lib/cn';
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar';
import { useAuth } from '../../../../store';
import { useIsSuperAdmin } from '../../../../hooks/super-admin-hooks';

const NavbarMenu = () => {
  const { auth, decodedToken, logout } = useAuth();
  const isSuperAdmin = useIsSuperAdmin();

  const avatarInitial = decodedToken?.given_name.charAt(0);
  const companyName = auth?.company.companyName;
  const userEmail = decodedToken?.email;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild className="group">
        <IconButton>
          <LuMenu
            size="24"
            className="group-data-[state=closed]:block group-data-[state=open]:hidden"
          />
          <LuX
            size="24"
            className="group-data-[state=open]:block group-data-[state=closed]:hidden"
          />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          // Calculate dynamically using calc and css variables
          sideOffset={36}
          className={cn(
            'w-screen border border-grayGreen100 bg-white',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
          )}
        >
          <ScrollArea>
            <div className="flex items-center gap-5 px-7 py-4">
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

            <DropdownMenu.Item asChild>
              <CustomNavLink to={routes.credentials}>Credentials</CustomNavLink>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <CustomNavLink to={routes.webhooks}>Webhooks</CustomNavLink>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <CustomNavLink to={routes.activity}>Activity</CustomNavLink>
            </DropdownMenu.Item>

            {isSuperAdmin && (
              <DropdownMenu.Item asChild>
                <CustomNavLink to={routes.admin}>Admin</CustomNavLink>
              </DropdownMenu.Item>
            )}

            <Accordion.Root type="single" collapsible={true}>
              <Accordion.Item value="settings">
                <DropdownMenu.Item onSelect={(e) => e.preventDefault()} asChild>
                  <Accordion.Trigger className="group flex w-full items-center gap-4 px-7 py-3 text-start text-lg font-medium">
                    Settings
                    <LuChevronDown
                      size={20}
                      className="group-data-[state=closed]:block group-data-[state=open]:hidden"
                    />
                    <LuChevronUp
                      size={20}
                      className="group-data-[state=open]:block group-data-[state=closed]:hidden"
                    />
                  </Accordion.Trigger>
                </DropdownMenu.Item>

                <Accordion.Content
                  className={cn(
                    'overflow-hidden pl-6',
                    'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
                  )}
                >
                  <DropdownMenu.Item asChild>
                    <CustomNavLink to={routes.settingsTeam}>Team</CustomNavLink>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <CustomNavLink to={routes.settingsProfile}>
                      Profile
                    </CustomNavLink>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <CustomNavLink to={routes.settingsSecurity}>
                      Security
                    </CustomNavLink>
                  </DropdownMenu.Item>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>

            <DropdownMenu.Item asChild>
              <CustomNavLink to={routes.stopLightDocs} target="_blank">
                API Docs
              </CustomNavLink>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="px-7 py-3 text-lg font-medium"
              onSelect={logout}
            >
              Logout
            </DropdownMenu.Item>
          </ScrollArea>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const CustomNavLink = forwardRef<
  ElementRef<typeof NavLink>,
  ComponentPropsWithoutRef<typeof NavLink>
>((props, ref) => (
  <NavLink
    className={({ isActive }) =>
      cn(
        'inline-block w-full px-7 py-3 text-lg font-medium',
        isActive && 'text-teal'
      )
    }
    ref={ref}
    {...props}
  />
));

const ScrollArea = ({ children }: { children: ReactNode }) => (
  <ScrollAreaPrimitive.Root className="h-[var(--radix-dropdown-menu-content-available-height)] overflow-hidden">
    <ScrollAreaPrimitive.Viewport className="h-full w-full">
      {children}
      <ScrollAreaPrimitive.Scrollbar />
    </ScrollAreaPrimitive.Viewport>
  </ScrollAreaPrimitive.Root>
);

export { NavbarMenu };
