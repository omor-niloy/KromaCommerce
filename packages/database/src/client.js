"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.DatabaseConnection = void 0;
const client_1 = require("@prisma/client");
/**
 * Singleton database client wrapper managing Prisma connection pool lifecycle.
 */
class DatabaseConnection {
    static instance = null;
    /**
     * Retrieves or initializes the shared PrismaClient instance.
     */
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new client_1.PrismaClient({
                log: process.env['NODE_ENV'] === 'development' ? ['warn', 'error'] : ['error']
            });
        }
        return DatabaseConnection.instance;
    }
    /**
     * Gracefully disconnects Prisma client.
     */
    static async disconnect() {
        if (DatabaseConnection.instance) {
            await DatabaseConnection.instance.$disconnect();
            DatabaseConnection.instance = null;
        }
    }
}
exports.DatabaseConnection = DatabaseConnection;
exports.prisma = DatabaseConnection.getInstance();
//# sourceMappingURL=client.js.map