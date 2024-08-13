import { Environment } from './environment-types';
import { RequestStatus } from './request-status-types';

type AllUsersReq = {
  searchWords: string;
  environment: string;
  startDate: string;
  endDate: string;
  status: string;
  limit: number;
  nextToken: string | null;
};

type AllUsersRes = {
  items: {
    environment: Environment;
    createdDate: string;
    companyName: string;
    companyId: string;
    usageDesc?: string;
    noOfTransfers?: string;
    createdBy: string;
    requestStatus: RequestStatus;
  }[];
  nextToken: string | null;
  totalPages: number;
};

export type { AllUsersReq, AllUsersRes };
