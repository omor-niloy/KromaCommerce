import dotenv from 'dotenv';
dotenv.config();

import { CatalogApp } from './app';

const port = Number(process.env['PORT']) || 8002;
const catalogApp = new CatalogApp();

const server = catalogApp.app.listen(port, () => {
  console.log(`Catalog Service listening on port ${port}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`[CatalogService] Received ${signal}. Closing server...`);
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(0);
  }, 1500).unref();
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
