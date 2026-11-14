import { z } from 'zod';

export const ScrapeTargetSchema = z.object({
  productId: z.string().uuid('Invalid product ID').optional(),
  targetUrl: z.string().url('Target URL must be a valid URL')
});

export const TriggerSyncSchema = z.object({
  limit: z.number().int().positive().optional().default(10)
});

export type ScrapeTargetInput = z.infer<typeof ScrapeTargetSchema>;
export type TriggerSyncInput = z.infer<typeof TriggerSyncSchema>;
