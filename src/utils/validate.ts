import { z } from 'zod';
import type { ValidationErrors } from '../types';

export const validateInput = <T extends z.ZodType>(
  schema: T,
  data: unknown
): ValidationErrors => {
  const errors: ValidationErrors = [];

  try {
    schema.parse(data);
    return errors;
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        const message = err.message;
        errors.push({ field, message });
      });
    }
    return errors;
  }
};

export const createValidationSchema = <T extends z.ZodType>(
  schema: T
) => schema;
