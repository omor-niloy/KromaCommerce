import { PrismaClient } from '@prisma/client';

/**
 * Singleton database client wrapper managing Prisma connection pool lifecycle.
 */
export class DatabaseConnection {
  private static instance: PrismaClient | null = null;

  /**
   * Retrieves or initializes the shared PrismaClient instance.
   */
  public static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      const rawUrl = process.env['DATABASE_URL']?.trim();
      const cleanUrl = rawUrl ? rawUrl.replace(/^["']+|["']+$/g, '').trim() : undefined;
      if (cleanUrl) {
        process.env['DATABASE_URL'] = cleanUrl;
      }

      DatabaseConnection.instance = new PrismaClient({
        ...(cleanUrl ? { datasources: { db: { url: cleanUrl } } } : {}),
        log: process.env['NODE_ENV'] === 'development' ? ['warn', 'error'] : ['error']
      });
    }
    return DatabaseConnection.instance;
  }

  /**
   * Gracefully disconnects Prisma client.
   */
  public static async disconnect(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.$disconnect();
      DatabaseConnection.instance = null;
    }
  }
}

export const prisma = DatabaseConnection.getInstance();
