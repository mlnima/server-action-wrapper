import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../src/actions/ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Hello</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders fallback on error', () => {
    const TestComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={({ error }) => (
        <div data-testid="fallback">{error.message}</div>
      )}>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('calls onError callback', () => {
    const onError = jest.fn();
    const TestComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary onError={onError}>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });

  it('reset clears error', () => {
    const TestComponent = () => {
      throw new Error('Test error');
    };

    const { getByRole, getByText, queryByText } = render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    const resetButton = getByRole('button');
    resetButton.click();

    expect(queryByText('Oops!')).not.toBeInTheDocument();
  });
});
