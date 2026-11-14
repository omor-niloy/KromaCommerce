#!/usr/bin/env node

/**
 * Robust Development Runner for KromaCommerce.
 * Manages API Gateway (tsx watch) and Next.js Storefront (next dev) concurrently
 * with seamless hot-reload, zero-delay Ctrl+C teardown, and automated port cleanup.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const gatewayDir = path.resolve(rootDir, 'apps/gateway');
const webDir = path.resolve(rootDir, 'apps/web');

function freePorts() {
  try {
    execSync('fuser -k 3000/tcp 8000/tcp 8001/tcp 8002/tcp 8003/tcp 8004/tcp 2>/dev/null || true', {
      stdio: 'ignore'
    });
  } catch {
    // Ignore errors if ports are already free
  }
}

// Ensure ports are completely clean before starting
freePorts();

console.log('\x1b[1m\x1b[36m[KromaCommerce]\x1b[0m Starting fullstack development environment with hot-reload...');
console.log('  \x1b[32m✔\x1b[0m API Gateway:    \x1b[4mhttp://localhost:8000\x1b[0m (tsx watch)');
console.log('  \x1b[35m✔\x1b[0m Storefront Web: \x1b[4mhttp://localhost:3000\x1b[0m (next dev)');
console.log('\x1b[90mPress Ctrl+C at any time to immediately stop all services.\x1b[0m\n');

// Spawn Gateway directly without intermediate shell wrappers
const gatewayProcess = spawn(
  'npx',
  ['tsx', 'watch', '--clear-screen=false', 'src/server.ts'],
  {
    cwd: gatewayDir,
    stdio: 'inherit',
    env: { ...process.env, PORT: '8000' }
  }
);

// Spawn Next.js Web directly without intermediate shell wrappers
const webProcess = spawn(
  'npx',
  ['next', 'dev', '-p', '3000'],
  {
    cwd: webDir,
    stdio: 'inherit',
    env: { ...process.env, PORT: '3000' }
  }
);

let isShuttingDown = false;

function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n\x1b[1m\x1b[33m[KromaCommerce]\x1b[0m Received ${signal || 'termination'}. Stopping all servers...`);

  // Kill child processes
  if (gatewayProcess && !gatewayProcess.killed) {
    try {
      gatewayProcess.kill('SIGTERM');
      gatewayProcess.kill('SIGKILL');
    } catch {}
  }

  if (webProcess && !webProcess.killed) {
    try {
      webProcess.kill('SIGTERM');
      webProcess.kill('SIGKILL');
    } catch {}
  }

  // Force port release
  freePorts();

  console.log('\x1b[1m\x1b[32m[KromaCommerce]\x1b[0m All servers stopped cleanly and ports 3000 & 8000 released.');
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT (Ctrl+C)'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGHUP', () => shutdown('SIGHUP'));

gatewayProcess.on('exit', (code, sig) => {
  if (!isShuttingDown && (code !== 0 || sig)) {
    console.log(`\x1b[31m[Gateway]\x1b[0m Process exited with code ${code || sig}`);
    shutdown('Gateway Exit');
  }
});

webProcess.on('exit', (code, sig) => {
  if (!isShuttingDown && (code !== 0 || sig)) {
    console.log(`\x1b[31m[Web]\x1b[0m Process exited with code ${code || sig}`);
    shutdown('Web Exit');
  }
});
