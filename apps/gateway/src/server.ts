import dotenv from 'dotenv';
dotenv.config();

import { GatewayApp } from './app';

const port = Number(process.env['PORT']) || 8000;
const gatewayApp = new GatewayApp();

const server = gatewayApp.app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`[Gateway] Received ${signal}. Closing server...`);
  server.close(() => {
    console.log('[Gateway] Server closed.');
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(0);
  }, 1500).unref();
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

