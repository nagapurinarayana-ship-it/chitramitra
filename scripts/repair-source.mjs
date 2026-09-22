import fs from 'node:fs';

const target = 'scripts/generate-site.mjs';
if (!fs.existsSync(target)) throw new Error(`Missing build source: ${target}`);

const source = fs.readFileSync(target, 'utf8');
// The generated source has historically contained escaped line breaks (\\n)
// at statement boundaries. Those are literal characters in the checked-in file,
// not JavaScript line breaks, and can produce a SyntaxError before generation.
const repaired = source
  .replace(/\\\\\r?\n/g, '\n')
  .replace(/\\\\n/g, '\n');
if (repaired !== source) {
  fs.writeFileSync(target, repaired, 'utf8');
  console.log(`Build preflight repaired deterministic line-break syntax in ${target}.`);
}

const buildId = process.env.GITHUB_SHA || 'local';
fs.writeFileSync('health.txt', `chitramitra-build=${buildId}\n`, 'utf8');
console.log(`Production health marker written for ${buildId}.`);
