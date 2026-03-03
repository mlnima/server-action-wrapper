'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ActionState, ActionResult } from '../types';

export const useActionState = <T>(initialData: T | null = null) => {
  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const executeRef = useRef<Function>(() => Promise.resolve({ success: false }));

  const execute = useCallback(async (input: unknown) => {
    setIsLoading(true);
    setError(null);
    setValidationErrors(null);

    try {
      const result = await executeRef.current(input);
      setData(result.success ? result.data : null);

      if (!result.success) {
        setError(result.error ?? null);
        setValidationErrors(result.validationErrors ?? null);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setValidationErrors(null);
    setIsLoading(false);
  }, [initialData]);

  useEffect(() => {
    executeRef.current = execute;
  }, [execute]);

  return {
    data,
    error,
    validationErrors,
    isLoading,
    execute,
    reset,
  };
};
