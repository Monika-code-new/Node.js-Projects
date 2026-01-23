import { z } from 'zod';

export const getPropertiesQuerySchema = z.object({
  destinationId: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined)), 
});
