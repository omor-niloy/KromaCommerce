import dotenv from 'dotenv';
dotenv.config();

import { OrderApp } from './app';

const port = Number(process.env['PORT']) || 8003;
const orderApp = new OrderApp();

const server = orderApp.app.listen(port, () => {
  console.log(`Order Service listening on port ${port}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`[OrderService] Received ${signal}. Closing server...`);
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(0);
  }, 1500).unref();
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
