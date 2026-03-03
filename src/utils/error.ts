export class ActionError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'ACTION_ERROR',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ActionError';
  }
}

export const handleActionError = (error: unknown): string => {
  if (error instanceof ActionError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isActionError = (error: unknown): error is ActionError => error instanceof ActionError;
