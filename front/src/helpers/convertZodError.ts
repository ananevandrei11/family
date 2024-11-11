import { ZodError } from 'zod';

export const convertZodError = <T extends object>(error: ZodError<T>) => {
  const errors = error.issues.reduce((acc: { [Property in keyof T]?: string }, issue) => {
    if (typeof issue.path[0] === 'string') {
      acc[issue.path[0] as keyof T] = issue.message;
    }
    return acc;
  }, {});
  return errors;
};
