import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { useAuth } from '../../../store';
import { environmentLabels } from '../constants';
import {
  EnvironmentState as EnvironmentSelectProps,
  Environment,
} from '../types/environment-types';

const EnvironmentSelect = ({
  environment,
  setEnvironment,
}: EnvironmentSelectProps) => {
  const { auth } = useAuth();

  // Check if better way to handle this
  const companyName = auth?.company.companyName as string;

  return (
    <Select
      value={environment}
      onValueChange={(val: Environment) => setEnvironment(val)}
    >
      <SelectTrigger className="h-11 w-fit" aria-label="Environments">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <EnvironmentSelectItem
          value="STG"
          companyName={companyName}
          environment={environmentLabels.STG}
        />
        <SelectSeparator className="h-px bg-grayGreen100" />
        <EnvironmentSelectItem
          value="DEV"
          companyName={companyName}
          environment={environmentLabels.DEV}
        />
        <SelectSeparator className="h-px bg-grayGreen100" />
        <EnvironmentSelectItem
          value="PRD"
          companyName={companyName}
          environment={environmentLabels.PRD}
        />
      </SelectContent>
    </Select>
  );
};

type EnvironmentSelectItemProps = ComponentPropsWithoutRef<
  typeof SelectItem
> & {
  companyName: string;
  environment: string;
  value: Environment;
};

const EnvironmentSelectItem = forwardRef<
  ElementRef<typeof SelectItem>,
  EnvironmentSelectItemProps
>(({ companyName, environment, value, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className="p-5 data-[highlighted]:bg-tealLight data-[highlighted]:outline-none"
    value={value}
    {...props}
  >
    <SelectItemContent companyName={companyName} environment={environment} />
  </SelectItem>
));

const SelectItemContent = ({
  companyName,
  environment,
}: {
  companyName: string;
  environment: string;
}) => (
  <div className="flex items-center">
    <span className="max-w-[75px] truncate font-medium sm:max-w-[200px] lg:max-w-[125px] xl:max-w-[200px]">
      {companyName}
    </span>
    <span className="ml-2 rounded-xl bg-teal px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white sm:ml-4">
      {environment}
    </span>
  </div>
);

export { EnvironmentSelect };
