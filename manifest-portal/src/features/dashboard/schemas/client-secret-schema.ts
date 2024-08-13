import { z } from 'zod';

const clientSecretDevSchema = z.object({
  usageDesc: z.string().min(1, 'Usage description is required'),
});

const clientSecretProdSchema = z.object({
  noOfTransfers: z.string().min(1, 'Transfers per month is required'),
});

type ClientSecretDevFields = z.infer<typeof clientSecretDevSchema>;
type ClientSecretProdFields = z.infer<typeof clientSecretProdSchema>;

type ClientSecretReqFields = ClientSecretDevFields & ClientSecretProdFields;

export { clientSecretDevSchema, clientSecretProdSchema };
export type {
  ClientSecretDevFields,
  ClientSecretProdFields,
  ClientSecretReqFields,
};
