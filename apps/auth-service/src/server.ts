import dotenv from 'dotenv';
dotenv.config();

import { AuthApp } from './app';

const port = Number(process.env['PORT']) || 8001;
const authApp = new AuthApp();

const server = authApp.app.listen(port, () => {
  console.log(`Auth Service listening on port ${port}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`[AuthService] Received ${signal}. Closing server...`);
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(0);
  }, 1500).unref();
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
