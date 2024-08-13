import { Control, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { ClientSecretReqFields } from '../schemas/client-secret-schema';
import { transferValues } from '../constants';

type TransfersSelectProps = {
  control: Control<ClientSecretReqFields>;
};

const TransfersSelect = ({ control }: TransfersSelectProps) => {
  return (
    <Controller
      control={control}
      name="noOfTransfers"
      render={({ field }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ref: _ref, ...otherFields } = field;
        return (
          <Select onValueChange={field.onChange} {...otherFields}>
            <SelectTrigger aria-label="Transfers per month" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {transferValues.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    />
  );
};

export { TransfersSelect };
