import { z } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export type ValidationErrors = ValidationError[];

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: ValidationErrors;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: unknown | null;
}

export interface ServerActionOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
  onValidationError?: (errors: ValidationErrors) => void;
}

export type ServerAction<TArgs, TReturn> = (
  args: TArgs
) => Promise<ActionResult<TReturn>>;

export type ValidatedAction<TSchema extends z.ZodType, TReturn> = (
  input: z.infer<TSchema>
) => Promise<ActionResult<TReturn>>;

export interface ActionState<T> {
  data: T | null;
  error: string | null;
  validationErrors: ValidationErrors | null;
  isLoading: boolean;
  execute: (input: unknown) => Promise<ActionResult<T>>;
  reset: () => void;
}
