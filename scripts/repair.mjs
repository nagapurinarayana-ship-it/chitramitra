import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const MAX_PASSES = 2;
const commands = [
  ['build', ['run', 'build']],
  ['verify', ['run', 'verify']],
  ['qa', ['run', 'qa']],
];

function run(label, args) {
  const r = spawnSync('npm', args, { stdio: 'inherit', env: process.env });
  return r.status === 0;
}

function deterministicRepairableState() {
  const required = ['data.js', 'scripts/generate-site.mjs', 'scripts/verify.mjs', 'scripts/quality-gate.mjs'];
  const missing = required.filter(p => !fs.existsSync(p));
  if (missing.length) return { ok: false, reason: `Required source files missing: ${missing.join(', ')}` };
  return { ok: true };
}

const state = deterministicRepairableState();
if (!state.ok) {
  console.error(`AUTO-REPAIR STOPPED: ${state.reason}`);
  console.error('No speculative code was generated. A source-of-truth change is required.');
  process.exit(2);
}

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  console.log(`AUTO-REPAIR PASS ${pass}/${MAX_PASSES}: deterministic regeneration + validation`);
  let allPassed = true;
  for (const [label, args] of commands) {
    if (!run(label, args)) { allPassed = false; break; }
  }
  if (allPassed) {
    console.log('AUTO-REPAIR SUCCESS: source-defined site rebuilt and all deterministic gates passed.');
    process.exit(0);
  }
}

console.error('AUTO-REPAIR FAILED SAFELY: the failure is not covered by a deterministic repair recipe.');
console.error('The pipeline will not invent content, suppress a failing test, weaken a gate, or blindly edit source code.');
process.exit(1);
