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
      DatabaseConnection.instance = new PrismaClient({
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
