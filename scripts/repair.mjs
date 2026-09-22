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

function repairDeterministicSource() {
  const target = 'scripts/generate-site.mjs';
  if (!fs.existsSync(target)) return { ok: false, reason: `Required source file missing: ${target}` };

  const source = fs.readFileSync(target, 'utf8');
  // The generated source previously contained a literal backslash immediately
  // before a newline, which JavaScript treats as an invalid token in this file.
  const repaired = source.replace(/\\\r?\n/g, '\n');
  if (repaired === source) return { ok: true, changed: false };

  fs.writeFileSync(target, repaired, 'utf8');
  console.log(`AUTO-REPAIR: removed ${source.length - repaired.length} deterministic line-continuation byte(s) from ${target}.`);
  return { ok: true, changed: true };
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

const sourceRepair = repairDeterministicSource();
if (!sourceRepair.ok) {
  console.error(`AUTO-REPAIR STOPPED: ${sourceRepair.reason}`);
  process.exit(2);
}

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  console.log(`AUTO-REPAIR PASS ${pass}/${MAX_PASSES}: deterministic regeneration + validation`);
  let allPassed = true;
  for (const [label, args] of commands) {
    console.log(`=== ${label.toUpperCase()} ===`);
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
