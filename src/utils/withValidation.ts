import { z } from 'zod';
import { validateInput } from './validate';
import type { ValidatedAction, ActionResult, ValidationErrors } from '../types';
import { ActionError } from './error';

export const withValidation = <TSchema extends z.ZodType, TReturn>(
  schema: TSchema,
  action: ValidatedAction<TSchema, TReturn>
): ValidatedAction<TSchema, TReturn> => {
  return async (input: z.infer<TSchema>): Promise<ActionResult<TReturn>> => {
    const errors = validateInput(schema, input);

    if (errors.length > 0) {
      return {
        success: false,
        validationErrors: errors,
      };
    }

    try {
      const result = await action(input);
      return result;
    } catch (error) {
      if (error instanceof ActionError) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };
};
