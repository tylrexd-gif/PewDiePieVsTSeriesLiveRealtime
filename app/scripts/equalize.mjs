// Equalizes the combined (PDP + TS) growth rate across consecutive intervals of the real
// per-second data and writes the result as a source patch (see REAL_SOURCE_PATCHES in
// pack-jobs.mjs). Fixes collection artefacts where growth is front-loaded into one stretch
// and missing from the next. The master every_second_counts_pvt_u32le.bin is only read.
//
// Boundaries t0 < t1 < ... < tk split the window into k intervals; t0 is the first second
// changed, tk the last (where both counts rejoin the original data). Each interval gets one
// factor shared by both channels, scaling every second's growth so the interval's combined
// rate equals the whole window's. Each channel's leftover (a shared factor can't land both
// counts on their originals) is tapered linearly over the last interval. Values are rounded.
// Oct 29 2018: 00:41:00 01:01:21 02:01:00 -> factors 0.4286, 1.8340.
//
//   node scripts/equalize.mjs "2018-10-29 00:41:00" "2018-10-29 01:01:21" "2018-10-29 02:01:00" [--dry-run]
// Times are US Eastern (EDT / EST by date). Writes
// app/data-patches/every_second_counts_pvt.patch-<date of t0>-<HHMM of t0>.pvd.gz; add it to REAL_SOURCE_PATCHES.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { packBinary } from './pack-bin.mjs';
import { PATCH_DIR } from './pack-jobs.mjs';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'data');
const BIN = path.join(DATA, 'every_second_counts_pvt_u32le.bin');
const START_MS = Date.UTC(2018, 9, 17, 4, 0, 0);   // record 0 = 2018-10-17 00:00:00 EDT

// US Eastern wall time -> UTC ms (EDT until Nov 4 2018 02:00, EST until Mar 10 2019 02:00, EDT after).
const easternToUtc = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/.exec(s.trim());
  if (!m) throw new Error('bad time (want "YYYY-MM-DD HH:MM:SS"): ' + s);
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  const est = wall >= Date.UTC(2018, 10, 4, 2) && wall < Date.UTC(2019, 2, 10, 2);
  return wall + (est ? 5 : 4) * 3600000;
};

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const dryRun = process.argv.includes('--dry-run');
if (args.length < 3) { console.error('usage: node scripts/equalize.mjs <t0> <t1> ... <tk> [--dry-run]  (at least 3 boundaries, US Eastern)'); process.exit(1); }
const T = args.map(s => (easternToUtc(s) - START_MS) / 1000);
for (let k = 1; k < T.length; k++) if (!(T[k] > T[k - 1])) throw new Error('boundaries must increase');

const buf = fs.readFileSync(BIN);
const raw = new Uint32Array(buf.buffer, buf.byteOffset, buf.length >> 2);
if (T[T.length - 1] >= raw.length / 2 || T[0] < 1) throw new Error('window outside the data');
const v = (i, c) => raw[i * 2 + c];
const tot = (i, j) => v(j, 0) - v(i, 0) + v(j, 1) - v(i, 1);

// Interval k covers seconds (z_k, z_{k+1}], anchored on the last untouched second z_0 = t0 - 1;
// the inner boundaries z_k = t_k - 1 are each interval's last second.
const Z = [T[0] - 1, ...T.slice(1, -1).map(t => t - 1), T[T.length - 1]];
const zEnd = Z[Z.length - 1];
const rate = tot(Z[0], zEnd) / (zEnd - Z[0]);
const factors = [];
for (let k = 0; k + 1 < Z.length; k++) factors.push(rate * (Z[k + 1] - Z[k]) / tot(Z[k], Z[k + 1]));

const n = zEnd - Z[0];
const out = new Uint32Array(n * 2);
const zl = Z[Z.length - 2];
for (let c = 0; c < 2; c++) {
  let base = v(Z[0], c);
  for (let k = 0; k + 1 < Z.length; k++) {
    const a = Z[k], b = Z[k + 1], f = factors[k], last = k + 2 === Z.length;
    const rem = last ? v(b, c) - (base + f * (v(b, c) - v(a, c))) : 0;
    for (let i = a + 1; i <= b; i++) {
      const x = base + f * (v(i, c) - v(a, c)) + (last ? rem * (i - a) / (b - a) : 0);
      out[(i - Z[0] - 1) * 2 + c] = Math.round(x);
    }
    base += f * (v(b, c) - v(a, c));
  }
}

const fmt = (i) => { const t = START_MS + i * 1000, est = t >= Date.UTC(2018, 10, 4, 6) && t < Date.UTC(2019, 2, 10, 7); return new Date(t - (est ? 5 : 4) * 3600000).toISOString().replace('T', ' ').slice(0, 19) + (est ? ' EST' : ' EDT'); };
const perMin = (i, j, src) => ((src(j, 0) - src(i, 0) + src(j, 1) - src(i, 1)) / ((j - i) / 60)).toFixed(0);
const o = (i, c) => (i <= Z[0] ? v(i, c) : out[(i - Z[0] - 1) * 2 + c]);
console.log(`window ${fmt(Z[0] + 1)} -> ${fmt(zEnd)} (${n} s), combined ${(rate * 60).toFixed(0)}/min`);
for (let k = 0; k + 1 < Z.length; k++) console.log(`  ${fmt(Z[k] + 1)} -> ${fmt(Z[k + 1])}: factor ${factors[k].toFixed(4)}, ${perMin(Z[k], Z[k + 1], v)}/min -> ${perMin(Z[k], Z[k + 1], o)}/min`);
for (let c = 0; c < 2; c++) if (out[(n - 1) * 2 + c] !== v(zEnd, c)) console.log(`  warning: ${c ? 'TS' : 'PDP'} misses its end value by ${out[(n - 1) * 2 + c] - v(zEnd, c)}`);
if (dryRun) process.exit(0);

const tmp = path.join(DATA, '.equalize.tmp.bin');
fs.writeFileSync(tmp, Buffer.from(out.buffer));
const name = `every_second_counts_pvt.patch-${args[0].trim().slice(0, 10)}-${args[0].trim().slice(11, 16).replace(':', '')}.pvd.gz`;
try { packBinary(tmp, path.join(PATCH_DIR, name), START_MS + (Z[0] + 1) * 1000); } finally { fs.unlinkSync(tmp); }
console.log(`wrote data-patches/${name}; add it to REAL_SOURCE_PATCHES in scripts/pack-jobs.mjs, then node scripts/repack-all.mjs`);
