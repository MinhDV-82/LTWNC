#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const vitestBin = path.resolve(__dirname, '../node_modules/vitest/vitest.mjs');
const args = ['run'];
if (process.argv.includes('--coverage')) {
  args.push('--coverage');
}
const result = spawnSync(process.execPath, [vitestBin, ...args], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..'),
});
process.exit(result.status ?? 0);

