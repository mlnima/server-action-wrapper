import { validateInput } from '../src/utils/validate';
import { z } from 'zod';

describe('validateInput', () => {
  it('should return empty array for valid input', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const result = validateInput(schema, { name: 'John', age: 30 });
    expect(result).toEqual([]);
  });

  it('should return validation errors for invalid input', () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(18),
    });

    const result = validateInput(schema, { email: 'invalid', age: 15 });
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('field');
    expect(result[0]).toHaveProperty('message');
  });

  it('should handle nested schemas', () => {
    const schema = z.object({
      user: z.object({
        profile: z.object({
          bio: z.string().min(10),
        }),
      }),
    });

    const result = validateInput(schema, { user: { profile: { bio: 'hi' } } });
    expect(result).toHaveLength(1);
    expect(result[0].field).toBe('user.profile.bio');
  });
});
