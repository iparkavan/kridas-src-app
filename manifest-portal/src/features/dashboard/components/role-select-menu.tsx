import { Control, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { AddMemberFields } from '../schemas/add-member-schema';
import { ErrorMessage } from '../../../components/ui/error-message';

type RoleSelectMenuProps = {
  control: Control<AddMemberFields>;
  errorMessage?: string;
};

const RoleSelectMenu = ({ control, errorMessage }: RoleSelectMenuProps) => {
  return (
    <Controller
      control={control}
      name="role"
      render={({ field }) => {
        return (
          <div>
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errorMessage && (
              <ErrorMessage className="mt-1 text-sm text-tomato">
                {errorMessage}
              </ErrorMessage>
            )}
          </div>
        );
      }}
    />
  );
};

export default RoleSelectMenu;
