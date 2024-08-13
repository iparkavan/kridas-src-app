import { ClientSecretReqFields } from '../schemas/client-secret-schema';
import { Environment } from './environment-types';
import { RequestStatus } from './request-status-types';

type ClientSecret = {
  clientId: string;
  clientSecret: string;
  companyId: string;
  environment: Environment;
  requestStatus: RequestStatus;
};

type ClientSecretReq = {
  environment: Environment;
  companyId: string;
};

type ClientSecretCreateReq = {
  environment: Environment;
  companyId: string;
} & ClientSecretReqFields;

type ClientSecretUpdateReq = {
  environment: Environment;
  companyId: string;
  requestStatus: RequestStatus;
};

export type {
  ClientSecret,
  ClientSecretReq,
  ClientSecretCreateReq,
  ClientSecretUpdateReq,
};
