import { z } from 'zod';
import { isAxiosError } from 'axios';
import { passwordValidations } from '../features/authentication/constants';
import { ApiErrorRes } from '../types/api-types';

const genericErrorMessage = (errorAction: string) =>
  `${errorAction} failed. Please try again.`;

const getErrorMessage = (
  isError: boolean,
  error: Error | null,
  errorAction: string
) => {
  let errorMessage = '';
  if (isError) {
    if (isAxiosError<ApiErrorRes>(error) && error.response) {
      const { status, data } = error.response;
      if (status === 500) {
        errorMessage = genericErrorMessage(errorAction);
      } else {
        errorMessage = data.message;
      }
    }
    if (!errorMessage) {
      errorMessage = genericErrorMessage(errorAction);
    }
  }
  return errorMessage;
};

const convertToPascalCase = (inputString: string) => {
  const words = inputString.trim().split(' ');
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  });
  return capitalizedWords.join(' ');
};

const getPasswordSchema = () =>
  z.string().superRefine((password, ctx) => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    if (!(uppercaseRegex.test(password) && lowercaseRegex.test(password))) {
      ctx.addIssue({
        code: 'custom',
        message: passwordValidations[0].message,
        path: [passwordValidations[0].path],
      });
    }

    if (password.length < 8) {
      ctx.addIssue({
        code: 'custom',
        message: passwordValidations[1].message,
        path: [passwordValidations[1].path],
      });
    }

    const numberRegex = /[0-9]/;
    const symbolRegex = /[!@#$%^&*]/;
    if (!(numberRegex.test(password) && symbolRegex.test(password))) {
      ctx.addIssue({
        code: 'custom',
        message: passwordValidations[2].message,
        path: [passwordValidations[2].path],
      });
    }
  });

export {
  genericErrorMessage,
  getErrorMessage,
  convertToPascalCase,
  getPasswordSchema,
};
