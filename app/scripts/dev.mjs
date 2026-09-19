import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const children = new Set();
let shuttingDown = false;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function start(name, command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
  });
  children.add(child);
  child.on('exit', (code, signal) => {
    children.delete(child);
    if (shuttingDown) return;
    shutdown(code !== 0 && signal == null ? code ?? 1 : 0);
  });
  child.on('error', (err) => {
    console.error(`${name} failed to start:`, err);
    if (!shuttingDown) {
      shutdown(1);
    }
  });
  return child;
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  setTimeout(() => process.exit(code), 100);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

const smokeMs = Number(process.env.SCENARIO_DEV_SMOKE_MS || 0);
if (smokeMs > 0) setTimeout(() => shutdown(0), smokeMs);

const viteBin = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');

start('data server', process.execPath, ['server.js', '--data']);
start('vite', process.execPath, [viteBin, '--host', '127.0.0.1']);
