import dotenv from 'dotenv';
dotenv.config();

import { ScraperApp } from './app';

const port = Number(process.env['PORT']) || 8004;
const scraperApp = new ScraperApp();

const server = scraperApp.app.listen(port, () => {
  console.log(`Scraper Service listening on port ${port}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`[ScraperService] Received ${signal}. Closing server...`);
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(0);
  }, 1500).unref();
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
