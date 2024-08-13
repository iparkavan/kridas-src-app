import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import AddIcon from '../../../assets/icons/add-icon.svg?react';
import { Dispatch, SetStateAction, useState } from 'react';
import IllustrationEmail from '../../../assets/images/illustration_email.jpg';
import RoleSelectMenu from './role-select-menu';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AddMemberFields, addMemberSchema } from '../schemas/add-member-schema';
import { zodResolver } from '@hookform/resolvers/zod';

type AddMemberDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const AddMemberDialog = ({
  isDialogOpen,
  setIsDialogOpen,
}: AddMemberDialogProps) => {
  const [isRoleAddedPending, setIsRoleAddedPending] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset: formReset,
    formState: { errors },
  } = useForm<AddMemberFields>({
    resolver: zodResolver(addMemberSchema),
    mode: 'onBlur',
  });

  const onAddMember: SubmitHandler<AddMemberFields> = (value) => {
    console.log('Add Member : ', value);
    setIsRoleAddedPending(!isRoleAddedPending);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setIsRoleAddedPending(false);
    formReset();
    setIsDialogOpen(isOpen);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <div className="flex w-fit items-center gap-2 rounded-full">
          <AddIcon /> <span className="text-mint">Add Members</span>
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogTitle className="">Invite a new member</DialogTitle>
        {isRoleAddedPending ? (
          <div
            className={
              'flex w-full flex-col items-center justify-center gap-10'
            }
          >
            <img
              src={IllustrationEmail}
              alt="#mail-verification"
              className="h-36 w-48"
            />
            <p className="font-medium text-gray70">
              Invitation sent to their email.
            </p>
            <Button
              className="bg-deepForest px-8 py-3.5 text-white ring-deepForest"
              onClick={() => setIsRoleAddedPending(false)}
            >
              Add invite
            </Button>
          </div>
        ) : (
          <form id="reset-password" onSubmit={handleSubmit(onAddMember)}>
            <div className="space-y-6">
              <div className="">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray70"
                >
                  Email *
                </label>
                <Input
                  className="mt-2.5"
                  type="email"
                  id="email"
                  {...register('email')}
                  errorMessage={errors.email?.message}
                />
              </div>
              <div className="flex w-full flex-col gap-2.5">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray70"
                >
                  Role *
                </label>
                <RoleSelectMenu
                  control={control}
                  errorMessage={errors.role?.message}
                />
              </div>
            </div>

            <div className="mt-12 text-end">
              <Button
                className="bg-deepForest px-8 py-3.5 text-sm font-normal text-white ring-deepForest"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { AddMemberDialog };
