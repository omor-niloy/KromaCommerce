import { PrismaClient } from '@prisma/client';
/**
 * Singleton database client wrapper managing Prisma connection pool lifecycle.
 */
export declare class DatabaseConnection {
    private static instance;
    /**
     * Retrieves or initializes the shared PrismaClient instance.
     */
    static getInstance(): PrismaClient;
    /**
     * Gracefully disconnects Prisma client.
     */
    static disconnect(): Promise<void>;
}
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
//# sourceMappingURL=client.d.ts.map