import fs from 'node:fs';

const target = 'scripts/generate-site.mjs';
if (!fs.existsSync(target)) throw new Error(`Missing build source: ${target}`);

const source = fs.readFileSync(target, 'utf8');
// The generated source can contain a literal backslash immediately before a
// newline at a JavaScript statement boundary. That is not a valid token here.
// Repair both the actual line-continuation form and the escaped "\\n" form.
const repaired = source
  .replace(/\\\r?\n/g, '\n')
  .replace(/\\n/g, '\n');
if (repaired !== source) {
  fs.writeFileSync(target, repaired, 'utf8');
  console.log(`Build preflight repaired deterministic line-break syntax in ${target}.`);
}

const buildId = process.env.GITHUB_SHA || 'local';
fs.writeFileSync('health.txt', `chitramitra-build=${buildId}\n`, 'utf8');
console.log(`Production health marker written for ${buildId}.`);
