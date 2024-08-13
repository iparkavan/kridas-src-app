import { userRoleLabels, userStatusLabels } from '../constants';

type UserStatus = keyof typeof userStatusLabels;

type UserRole = keyof typeof userRoleLabels;

type User = {
  companyId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  userId: string;
  userStatus: UserStatus;
};

type Users = User[];

export type { Users, UserStatus };
