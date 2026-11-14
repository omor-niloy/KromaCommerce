"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerSyncSchema = exports.ScrapeTargetSchema = void 0;
const zod_1 = require("zod");
exports.ScrapeTargetSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid('Invalid product ID').optional(),
    targetUrl: zod_1.z.string().url('Target URL must be a valid URL')
});
exports.TriggerSyncSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().default(10)
});
//# sourceMappingURL=scraper.schemas.js.map