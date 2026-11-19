// Papers over a broken stretch of one channel in the real per-second data (e.g. a stalled
// counter followed by a catch-up jump) and writes the result as a source patch (see
// REAL_SOURCE_PATCHES in pack-jobs.mjs). The master every_second_counts_pvt_u32le.bin is
// only read; the other channel is copied through unchanged.
//
// The channel runs in a straight line from its value the second before t0 to its value at
// t1 (so the window's total growth is kept), plus per-second noise from SCENARIO's base
// layer: Student-t (df 10, clamped at 6 sd) with variance 2.5 + 0.45 x rate (subs/sec),
// shifted to sum to 0 so the count still lands on its value at t1. Seeded by the window,
// so a rerun writes the same patch. Values are rounded.
//
//   node scripts/paper.mjs ts "2018-11-28 16:55:26" "2018-11-28 17:07:16" [--dry-run]
// Times are US Eastern (EDT / EST by date). Writes
// app/data-patches/every_second_counts_pvt.patch-<date of t0>-<HHMM of t0>-<channel>.pvd.gz; add it to REAL_SOURCE_PATCHES.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { packBinary } from './pack-bin.mjs';
import { PATCH_DIR } from './pack-jobs.mjs';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'data');
const BIN = path.join(DATA, 'every_second_counts_pvt_u32le.bin');
const START_MS = Date.UTC(2018, 9, 17, 4, 0, 0);   // record 0 = 2018-10-17 00:00:00 EDT
const NOISE_V0 = 2.5, NOISE_V1 = 0.45, T_DF = 10, T_CAP = 6;   // SCENARIO's SKELLAM_V0 / V1 / T_DF / T_CAP

// US Eastern wall time -> UTC ms (EDT until Nov 4 2018 02:00, EST until Mar 10 2019 02:00, EDT after).
const easternToUtc = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/.exec(s.trim());
  if (!m) throw new Error('bad time (want "YYYY-MM-DD HH:MM:SS"): ' + s);
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  const est = wall >= Date.UTC(2018, 10, 4, 2) && wall < Date.UTC(2019, 2, 10, 2);
  return wall + (est ? 5 : 4) * 3600000;
};
const mulberry32 = (a) => () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
// Unit-variance Student-t draw, as SCENARIO's _studentT.
const studentT = (rng, df) => {
  const gauss = () => Math.sqrt(-2 * Math.log(rng() + 1e-10)) * Math.cos(2 * Math.PI * rng());
  let chi = 0;
  for (let k = 0; k < df; k++) { const z = gauss(); chi += z * z; }
  const t = gauss() / Math.sqrt(chi / df) * Math.sqrt((df - 2) / df);
  return Math.max(-T_CAP, Math.min(T_CAP, t));
};

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const dryRun = process.argv.includes('--dry-run');
const ch = { pdp: 0, ts: 1 }[(args[0] || '').toLowerCase()];
if (ch == null || args.length !== 3) { console.error('usage: node scripts/paper.mjs <pdp|ts> <t0> <t1> [--dry-run]  (US Eastern)'); process.exit(1); }
const a = (easternToUtc(args[1]) - START_MS) / 1000, b = (easternToUtc(args[2]) - START_MS) / 1000;

const buf = fs.readFileSync(BIN);
const raw = new Uint32Array(buf.buffer, buf.byteOffset, buf.length >> 2);
if (!(b > a) || a < 1 || b >= raw.length / 2) throw new Error('bad window');
const v = (i, c) => raw[i * 2 + c];

const z = a - 1, n = b - z;
const rate = (v(b, ch) - v(z, ch)) / n;   // subs/sec
const sd = Math.sqrt(NOISE_V0 + NOISE_V1 * Math.abs(rate));
const rng = mulberry32((a * 0x9E3779B1 ^ b ^ (ch + 1) * 0x85EBCA6B) >>> 0);
const noise = Array.from({ length: n }, () => sd * studentT(rng, T_DF));
const mean = noise.reduce((s, x) => s + x, 0) / n;

const out = new Uint32Array(n * 2);
let x = v(z, ch);
for (let k = 0; k < n; k++) {
  const i = z + 1 + k;
  x += rate + noise[k] - mean;
  out[k * 2 + ch] = k === n - 1 ? v(b, ch) : Math.round(x);
  out[k * 2 + (1 - ch)] = v(i, 1 - ch);
}

const fmt = (i) => { const t = START_MS + i * 1000, est = t >= Date.UTC(2018, 10, 4, 6) && t < Date.UTC(2019, 2, 10, 7); return new Date(t - (est ? 5 : 4) * 3600000).toISOString().replace('T', ' ').slice(0, 19) + (est ? ' EST' : ' EDT'); };
const name = ['PDP', 'TS'][ch];
const perMin = (src) => { const o = []; for (let k = 0; k + 60 <= n; k += 60) o.push(src(k + 59) - src(k - 1)); return o.join(' '); };
console.log(`${name} ${fmt(a)} -> ${fmt(b)} (${n} s): ${(rate * 60).toFixed(1)}/min, noise sd ${sd.toFixed(2)}/s`);
console.log(`  per minute before: ${perMin(k => v(z + 1 + k, ch))}`);
console.log(`  per minute after:  ${perMin(k => (k < 0 ? v(z, ch) : out[k * 2 + ch]))}`);
if (dryRun) process.exit(0);

const tmp = path.join(DATA, '.paper.tmp.bin');
fs.writeFileSync(tmp, Buffer.from(out.buffer));
const file = `every_second_counts_pvt.patch-${args[1].trim().slice(0, 10)}-${args[1].trim().slice(11, 16).replace(':', '')}-${args[0].toLowerCase()}.pvd.gz`;
try { packBinary(tmp, path.join(PATCH_DIR, file), START_MS + (z + 1) * 1000); } finally { fs.unlinkSync(tmp); }
console.log(`wrote data-patches/${file}; add it to REAL_SOURCE_PATCHES in scripts/pack-jobs.mjs, then node scripts/repack-all.mjs`);
