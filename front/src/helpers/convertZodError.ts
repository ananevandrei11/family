import { IStringMap } from '@/types/common';
import { ZodError } from 'zod';

export const convertZodError = (error: ZodError): IStringMap => {
  const errors = error.issues.reduce((acc: IStringMap, issue) => {
    acc[issue.path[0]] = issue.message;
    return acc;
  }, {});
  return errors;
};
