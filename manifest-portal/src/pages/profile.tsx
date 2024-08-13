import { useState } from 'react';
import ResetPasswordDialog from '../features/dashboard/components/reset-password-dialog';
import { useAuth } from '../store';

const Profile = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { decodedToken } = useAuth();
  const userEmail = decodedToken?.email;

  return (
    <div className="max-w-[600px] rounded-md border border-grayGreen100 bg-white">
      <div className="border-b border-grayGreen100 p-7 font-medium">
        <label className="text-sm text-gray70">EMAIL</label>
        <p className="mt-3 text-lg">{userEmail}</p>
      </div>
      <div className="flex items-center justify-between p-7">
        <div className="font-medium">
          <label className="text-sm text-gray70">PASSWORD</label>
          <p className="mt-3 text-lg">********************</p>
        </div>

        <ResetPasswordDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </div>
  );
};

export { Profile };
