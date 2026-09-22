import fs from 'node:fs';

const target = 'scripts/generate-site.mjs';
if (!fs.existsSync(target)) throw new Error(`Missing build source: ${target}`);

const source = fs.readFileSync(target, 'utf8');
const repaired = source.replace(/\\\r?\n/g, '\n');
if (repaired !== source) {
  fs.writeFileSync(target, repaired, 'utf8');
  console.log(`Build preflight repaired deterministic line-continuation syntax in ${target}.`);
}

const buildId = process.env.GITHUB_SHA || 'local';
fs.writeFileSync('health.txt', `chitramitra-build=${buildId}\n`, 'utf8');
console.log(`Production health marker written for ${buildId}.`);
