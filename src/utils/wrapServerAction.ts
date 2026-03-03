import type { ServerAction, ServerActionOptions, ActionResult } from '../types';
import { ActionError, handleActionError } from './error';

export const wrapServerAction = <TArgs, TReturn>(
  action: ServerAction<TArgs, TReturn>,
  options?: ServerActionOptions
): ServerAction<TArgs, TReturn> => {
  const wrappedAction = async (args: TArgs): Promise<ActionResult<TReturn>> => {
    try {
      const result = await action(args);

      if (result.success && options?.onSuccess) {
        options.onSuccess(result.data as TReturn);
      }

      if (!result.success && result.validationErrors && options?.onValidationError) {
        options.onValidationError(result.validationErrors);
      }

      if (!result.success && result.error && options?.onError) {
        options.onError(result.error);
      }

      return result;
    } catch (error) {
      const errorMessage = handleActionError(error);
      throw new ActionError(errorMessage, 'WRAPPER_ERROR');
    }
  };
  return wrappedAction;
};
