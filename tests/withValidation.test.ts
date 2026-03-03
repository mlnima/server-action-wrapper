import { withValidation } from '../src/utils/withValidation';
import { z } from 'zod';
import { ActionError } from '../src/utils/error';

describe('withValidation', () => {
  it('should validate input and pass to handler', async () => {
    const schema = z.object({ name: z.string() });
    const handler = jest.fn().mockResolvedValue({ success: true, data: {} });

    const action = withValidation(schema, handler);
    const result = await action({ name: 'test' });

    expect(handler).toHaveBeenCalledWith({ name: 'test' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid input', async () => {
    const schema = z.object({ email: z.string().email() });
    const handler = jest.fn();

    const action = withValidation(schema, handler);
    const result = await action({ email: 'invalid' } as any);

    expect(handler).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.validationErrors).toHaveLength(1);
  });

  it('should handle ActionError in handler', async () => {
    const schema = z.object({ id: z.string() });
    const handler = jest.fn().mockRejectedValue(new ActionError('Not found', 'NOT_FOUND'));

    const action = withValidation(schema, handler);
    const result = await action({ id: '123' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Not found');
  });
});
