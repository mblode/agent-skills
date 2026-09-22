#!/usr/bin/env node
// Checks an Audit mode report (the CI JSON document in
// references/audit/output-adapters.md, plus the Verify mode session and
// verification blocks in references/verify/evidence-output.md) against its
// contract. Prints {"passed", "failures": [{code, detail}]} and exits 1 on any
// failure; a failing report renders with verdict INCOMPLETE.
//
//   node <skill>/scripts/audit/check-report.mjs report.json [--root <dir>]
//
// --root is where artifact paths in `evidence` resolve (default: cwd).
// Rule IDs are checked against this skill's rules/ and rules-typography/, so an
// invented rule ID fails here instead of reading as a citation.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const rootIdx = args.indexOf('--root');
const root = rootIdx >= 0 ? args[rootIdx + 1] : process.cwd();
if (!file) {
  console.error('usage: check-report.mjs report.json [--root <dir>]');
  process.exit(2);
}

const skillDir = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const ruleIds = new Set();
for (const d of ['rules', 'rules-typography']) {
  const dir = join(skillDir, d);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) if (f.endsWith('.md') && !f.startsWith('_')) ruleIds.add(f.slice(0, -3));
}

const failures = [];
const fail = (code, detail) => failures.push({ code, detail });
const TIERS = { 'release-blocker': 'releaseBlockers', 'fix-this-sprint': 'fixThisSprint', backlog: 'backlog' };
// Probes whose results depend on timing; a single reproducing run is not enough.
const TIMING_SENSITIVE = new Set(['layout-shift', 'web-vitals']);

let doc;
try {
  doc = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  fail('invalid-json', String(e.message));
}

if (doc) {
  const findings = Array.isArray(doc.findings) ? doc.findings : [];
  const scopeFiles = new Set(doc.audit?.scope?.files ?? []);
  if (!doc.audit) fail('missing-audit-block', 'top-level `audit` is required');

  // Counts reconcile, per tier and in total.
  const s = doc.summary ?? {};
  for (const key of ['releaseBlockers', 'fixThisSprint', 'backlog', 'total']) {
    const f = s.found?.[key], a = s.applied?.[key], r = s.remaining?.[key];
    if (f === undefined || a === undefined || r === undefined) { fail('counts-missing', `summary.*.${key}`); continue; }
    if (f !== a + r) fail('counts-do-not-reconcile', `${key}: found ${f} != applied ${a} + remaining ${r}`);
  }

  // The verdict is derived from remaining only.
  const rem = s.remaining ?? {};
  let expected = rem.releaseBlockers > 0 ? 'NOT_READY' : rem.fixThisSprint >= 4 ? 'READY_WITH_FOLLOW_UP' : 'READY';
  if (doc.audit?.selfCheck?.passed === false) expected = 'INCOMPLETE';
  if (doc.verdict !== expected && doc.verdict !== 'INCOMPLETE') fail('verdict-mismatch', `verdict ${doc.verdict}, remaining counts give ${expected}`);

  const active = findings.filter((x) => x.result === 'fail' || x.result === 'warn');
  let unknown = 0;
  findings.forEach((x, i) => {
    const at = `${x.rule ?? '?'} #${i}`;
    if (!x.rule) fail('rule-missing', at);
    else if (!ruleIds.has(x.rule) && !/^(axe|runtime):/.test(x.rule)) fail('unknown-rule-id', `${x.rule} is not a file in rules/ or rules-typography/`);
    if (!x.feature || !x.surface) fail('feature-or-surface-missing', at);
    if (x.result === 'unknown') {
      unknown++;
      if (!x.reason) fail('unknown-without-reason', at);
      if (x.assignedTier || x.applied !== undefined) fail('unknown-has-tier-or-applied', at);
    }
    if (x.result === 'fail' || x.result === 'warn') {
      for (const k of ['assignedTier', 'defaultTier', 'severity', 'fix']) if (!x[k]) fail('no-fix-provided', `${at}: ${k}`);
      if (typeof x.applied !== 'boolean') fail('applied-missing', at);
      if (!x.file) fail('no-evidence-cited', at);
      if (x.assignedTier !== x.defaultTier && !x.tierReason) fail('tier-without-reason', at);
      if (x.detect === 'rubric' && (x.score === undefined || !x.anchor)) fail('rubric-without-score', at);
      if (x.result === 'fail' && x.detect !== 'rubric' && x.observed === undefined) fail('observed-missing', at);
    }
    if (x.applied === true) {
      if (!x.appliedChange) fail('applied-not-described', at);
      else if (scopeFiles.size && ![...scopeFiles].some((f) => String(x.appliedChange).startsWith(f))) fail('out-of-scope-applied', `${at}: ${x.appliedChange}`);
      if (x.suppressed) fail('suppressed-applied', at);
    }
    if (x.outOfScope === true && (x.applied !== false || !x.outOfScopeReason || !x.proposedDiff)) fail('out-of-scope-incomplete', at);

    // Verify mode delta.
    const v = x.verification;
    if (v) {
      for (const k of ['probe', 'route', 'viewport', 'theme', 'result']) if (v[k] === undefined) fail('conditions-not-recorded', `${at}: verification.${k}`);
      if (doc.session && !(doc.session.probesRun ?? []).includes(v.probe)) fail('probe-not-run', `${at}: ${v.probe}`);
      if (v.result === 'unknown' && !v.reason) fail('unknown-without-reason', `${at}: verification`);
      if (v.result === 'reproduced' && v.observed === undefined) fail('observed-missing', `${at}: verification`);
      if (v.result === 'reproduced' && TIMING_SENSITIVE.has(v.probe) && !(v.reruns >= 2)) fail('single-run-fail', `${at}: ${v.probe} reruns ${v.reruns}`);
      for (const p of v.evidence ?? []) if (!existsSync(resolve(root, p))) fail('evidence-missing', p);
      if (x.applied === true && !v.clearedBy) fail('cleared-without-rerun', at);
      if (v.clearedBy) {
        for (const p of v.clearedBy.evidence ?? []) {
          if (!existsSync(resolve(root, p))) fail('evidence-missing', p);
          if ((v.evidence ?? []).includes(p)) fail('before-artifact-overwritten', p);
        }
      }
    }
  });

  if (findings.length && unknown / findings.length > 0.3) fail('too-many-unknown', `${unknown} of ${findings.length}`);
  const tiers = new Set(active.map((x) => x.assignedTier));
  if (active.length >= 5 && tiers.size === 1) fail('uniform-tier', `${active.length} findings all ${[...tiers][0]}`);
  for (const [k, v] of Object.entries(TIERS)) {
    const n = active.filter((x) => x.assignedTier === k).length;
    if (s.found?.[v] !== undefined && n !== s.found[v]) fail('counts-do-not-match-findings', `${k}: ${n} findings, summary.found.${v} ${s.found[v]}`);
  }
  for (const r of doc.consideredAndRejected ?? []) if (!r.candidate || !r.rule || !r.guard) fail('rejection-incomplete', JSON.stringify(r));

  if (doc.session && !Array.isArray(doc.session.probesSkipped)) fail('probes-skipped-missing', 'session.probesSkipped must be an array, even when empty');
}

process.stdout.write(JSON.stringify({ passed: failures.length === 0, failures }, null, 2) + '\n');
process.exit(failures.length ? 1 : 0);
