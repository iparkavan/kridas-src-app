import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import MeatballsMenuIcon from '../../../assets/icons/meatballs-menu-icon.svg?react';

const TeamActionMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="align-middle">
        <MeatballsMenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        {/* Show this item only when the user has not accepted the invite */}
        <DropdownMenuItem className="pl-5 pr-8 text-sm">
          Resend Invite
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="pl-5 pr-8 text-sm text-tomato">
          Delete member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { TeamActionMenu };
