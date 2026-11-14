import { z } from 'zod';
export declare const ScrapeTargetSchema: z.ZodObject<{
    productId: z.ZodOptional<z.ZodString>;
    targetUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    targetUrl: string;
    productId?: string | undefined;
}, {
    targetUrl: string;
    productId?: string | undefined;
}>;
export declare const TriggerSyncSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
}, {
    limit?: number | undefined;
}>;
export type ScrapeTargetInput = z.infer<typeof ScrapeTargetSchema>;
export type TriggerSyncInput = z.infer<typeof TriggerSyncSchema>;
//# sourceMappingURL=scraper.schemas.d.ts.map