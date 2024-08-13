import { useState } from 'react';
import StatusChip from '../features/dashboard/components/status-chip';
import { useUsers } from '../features/dashboard/hooks/user-hooks';
import { useAuth } from '../store';
import { userRoleLabels } from '../features/dashboard/constants';
import { TeamActionMenu } from '../features/dashboard/components/team-action-menu';
import { AddMemberDialog } from '../features/dashboard/components/add-member-dialog';
import { Skeleton } from '../components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const Team = () => {
  const { decodedToken } = useAuth();
  const companyId = decodedToken?.['custom:companyId'] as string;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: usersData, isPending, isSuccess } = useUsers(companyId);

  return (
    <div className="rounded-md border border-grayGreen100 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-7">Member</TableHead>
            <TableHead className="py-7">Role</TableHead>
            <TableHead className="py-7">Status</TableHead>
            <TableHead className="py-7">MFA</TableHead>
            <TableHead className="sr-only py-7">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && (
            <TableRow>
              <TableCell className="w-fit max-w-[400px]">
                <Skeleton className="h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5" />
              </TableCell>
            </TableRow>
          )}

          {isSuccess &&
            usersData.map((user) => (
              <TableRow key={user.userId}>
                <TableCell className="w-fit max-w-[400px] truncate py-7 font-medium">
                  {user.email}
                </TableCell>
                <TableCell className="py-7 font-medium">
                  {userRoleLabels[user.role]}
                </TableCell>
                <TableCell className="py-7">
                  <StatusChip type="user" userStatus={user.userStatus} />
                </TableCell>
                <TableCell className="py-7">
                  <div className="w-fit rounded-full bg-pink px-3 py-1.5 text-sm">
                    Disabled
                  </div>
                </TableCell>
                <TableCell className="py-7">
                  <TeamActionMenu />
                </TableCell>
              </TableRow>
            ))}

          <TableRow>
            <TableCell className="py-7">
              <AddMemberDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export { Team };
