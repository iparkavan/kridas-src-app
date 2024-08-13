// import { Button } from '../components/ui/button';
// import { Input } from '../components/ui/input';
// import SearchIcon from '../assets/icons/search-icon.svg?react';
// import DropdownIcon from '../assets/icons/dropdown-icon.svg?react';
// import CalendarIcon from '../assets/icons/calendar-icon.svg?react';
import { useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { AdminActionsMenu } from '../features/dashboard/components/admin-actions-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { EnvironmentChip } from '../features/dashboard/components/environment-chip';
import { useGetAllUsers } from '../features/dashboard/hooks/admin-hooks';
import {
  environmentLabels,
  transferValues,
} from '../features/dashboard/constants';
import StatusChip from '../features/dashboard/components/status-chip';
import { IconButton } from '../components/ui/icon-button';

const Admin = () => {
  const [prevTokens, setPrevTokens] = useState<(string | null)[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);

  const { data, isSuccess } = useGetAllUsers({
    searchWords: '',
    environment: '',
    startDate: '',
    endDate: '',
    status: '',
    limit: 6,
    nextToken: nextToken,
  });

  const currentPageNo = prevTokens.length + 1;

  return (
    <div>
      {/* <div className="flex flex-wrap items-center justify-end gap-16 md:flex-nowrap md:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-5 lg:flex-nowrap">
          <Input
            leftIcon={<SearchIcon />}
            placeholder="Search for words"
            className="text-sm"
          />
          <Input
            rightIcon={<DropdownIcon />}
            placeholder="Environment"
            className="text-sm"
          />
          <Input
            leftIcon={<CalendarIcon />}
            placeholder="Start date"
            className="text-sm"
          />
          <Input
            leftIcon={<CalendarIcon />}
            placeholder="Start date"
            className="text-sm"
          />
          <Input
            rightIcon={<DropdownIcon />}
            placeholder="Status"
            className="text-sm"
          />
        </div>
        <Button className="bg-deepForest px-8 py-3 text-white ring-deepForest">
          Filter
        </Button>
      </div> */}

      <div className="rounded-md border border-grayGreen100 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isSuccess &&
              data.items.map((item) => {
                const transferDesc =
                  item.noOfTransfers &&
                  transferValues.find(
                    ({ value }) => value === item.noOfTransfers
                  )?.label;

                return (
                  <TableRow key={item.createdDate}>
                    <TableCell>{item.companyName}</TableCell>
                    <TableCell>{item.createdBy}</TableCell>
                    <TableCell>
                      <EnvironmentChip
                        environmentLabel={environmentLabels[item.environment]}
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {/* Need to format date */}
                      {item.createdDate.slice(0, 10)}
                    </TableCell>
                    <TableCell>{item.usageDesc || transferDesc}</TableCell>
                    <TableCell>
                      <StatusChip
                        type="request"
                        requestStatus={item.requestStatus}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <AdminActionsMenu
                        companyId={item.companyId}
                        environment={item.environment}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {isSuccess && (
        <div className="mt-5 flex items-center gap-3 text-right">
          <span className="ml-auto text-sm">
            {currentPageNo} of {data.totalPages}
          </span>
          <IconButton
            onClick={() => {
              const lastToken = prevTokens.pop();
              setPrevTokens([...prevTokens]);
              setNextToken(lastToken ?? null);
            }}
            disabled={prevTokens.length === 0}
          >
            <LuChevronLeft size={20} />
          </IconButton>
          <IconButton
            onClick={() => {
              setPrevTokens([...prevTokens, nextToken]);
              setNextToken(data.nextToken);
            }}
            disabled={!data.nextToken}
          >
            <LuChevronRight size={20} />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export { Admin };
