# server-action-wrapper

Professional Server Action wrappers for Next.js 16+ with loading states, Zod validation, and error boundaries.

## Features

- **Loading State Management**: Built-in hooks for tracking action execution states
- **Zod Validation**: Type-safe input validation with detailed error reporting
- **Error Boundaries**: React error boundaries for graceful error handling
- **Dual Package**: ESM and CJS support for maximum compatibility
- **TypeScript First**: Full type definitions included
- **Server Action Wrappers**: Elegant composition for Next.js Server Actions

## Installation

```bash
npm install server-action-wrapper next@16 react@19 zod
```

## Peer Dependencies

- `next >= 16.0.0`
- `react >= 19.0.0`
- `zod ^3.23.0`

## Quick Start

### 1. Create a Validated Server Action

```typescript
import { z } from 'zod';
import { withValidation, ActionError } from 'server-action-wrapper';

const createTodoSchema = z.object({
  title: z.string().min(1).max(100),
  completed: z.boolean().default(false),
});

export const createTodo = withValidation(createTodoSchema, async (input) => {
  const todo = await db.todos.create({ data: input });
  return { success: true, data: todo };
});
```

### 2. Use in Client Components

```typescript
'use client';

import { useActionState } from 'server-action-wrapper';
import { createTodo } from '@/actions/todos';

export function TodoForm() {
  const { execute, isLoading, error, reset } = useActionState();

  const handleSubmit = async (formData: FormData) => {
    const result = await execute({
      title: formData.get('title'),
      completed: false,
    });

    if (result.success) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" disabled={isLoading} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
}
```

## API Reference

### `withValidation`

Wrap Server Actions with Zod schema validation.

```typescript
const action = withValidation(schema, handler);
```

**Parameters:**
- `schema: ZodType` - Validation schema
- `handler: (input) => Promise<ActionResult>` - Action handler

**Returns:** Validated action function

### `wrapServerAction`

Add lifecycle callbacks to Server Actions.

```typescript
const wrapped = wrapServerAction(action, {
  onSuccess: (data) => console.log('Success!', data),
  onError: (error) => console.error('Error:', error),
  onValidationError: (errors) => console.log('Validation errors:', errors),
});
```

### `useActionState`

React hook for managing Server Action execution state.

```typescript
const { execute, isLoading, error, data, reset } = useActionState(initialData);
```

**Properties:**
- `execute(input)` - Execute the action
- `isLoading` - Loading state boolean
- `error` - Error message or null
- `data` - Result data or null
- `validationErrors` - Validation errors or null
- `reset()` - Reset state

### `ActionError`

Custom error class for action-specific errors.

```typescript
throw new ActionError('Invalid input', 'VALIDATION_ERROR', { field: 'email' });
```

### `ErrorBoundary`

React error boundary for component trees.

```typescript
import { ErrorBoundary } from 'server-action-wrapper';

<ErrorBoundary fallback={({ error, reset }) => (
  <div>
    <h3>Oops!</h3>
    <p>{error.message}</p>
    <button onClick={reset}>Try Again</button>
  </div>
)}>
  <YourComponent />
</ErrorBoundary>
```

### `validateInput`

Manual validation utility.

```typescript
const errors = validateInput(schema, input);
if (errors.length > 0) {
  // Handle validation errors
}
```

## TypeScript Support

Full TypeScript support included. No additional configuration needed.

```typescript
import { useActionState } from 'server-action-wrapper';

const { execute } = useActionState<Todo>();

execute({ title: 'Test' }); // Fully typed
```

## Examples

### Form with Validation

```typescript
import { z } from 'zod';
import { withValidation } from 'server-action-wrapper';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const login = withValidation(loginSchema, async (input) => {
  const user = await auth.login(input);
  return { success: true, data: user };
});
```

### Complex Nested Validation

```typescript
const orderSchema = z.object({
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ),
});

export const createOrder = withValidation(orderSchema, async (input) => {
  const order = await db.orders.create({ data: input });
  return { success: true, data: order };
});
```

### Loading States

```typescript
function UserProfile() {
  const { execute, isLoading, data } = useActionState<UserProfile>();

  return (
    <div>
      {isLoading && <Spinner />}
      {data && <UserProfileView user={data} />}
    </div>
  );
}
```

## Testing

```bash
npm test
npm run test:watch
npm run test:coverage
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build

# Type check
npm run lint
```

## License

MIT
