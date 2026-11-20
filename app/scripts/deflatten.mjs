// De-flattens the smooth real data in place: finds stretches where a channel's per-second
// change suddenly goes constant (every second within 1 of the others, e.g. 2 2 3 2 2 2 3)
// and gives them real-looking noise. A run of MIN_LEN seconds or more counts as a fill when
// the minute on both sides varies with sd >= NEIGHBOUR_SD, or when it is STRAIGHT_LEN seconds
// or more and locally straight: every STRAIGHT_LEN-second slice stays within STRAIGHT_DEV of
// the line through its own ends (an interpolated fill, even one chained from segments at
// different slopes; real noise drifts off a line). A straight piece of SHORT_LEN seconds or
// more touching a fill joins it.
// Writes into dist/data/every_second_counts_pvt_u32le.bin (the smooth master); the first run
// saves the original as .pre-deflat-bak and every run reads from that backup, so a rerun
// replaces the previous de-flattening. The source patches still apply on top when packing.
//
// Each fill keeps its course (the original values, so a change of slope inside it stays) and
// its two end values, plus SCENARIO's base noise: Student-t (df 10, clamped at 6 sd) with
// variance 2.5 + 0.45 x rate (subs/sec), shifted to sum to 0. Seeded per fill. Runs that only
// alternate 0 / 1 (a real counter can do that at low rates) or average under 0.2 subs/sec
// are left alone.
//
//   node scripts/deflatten.mjs [--dry-run]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'data');
const BIN = path.join(DATA, 'every_second_counts_pvt_u32le.bin');
const BAK = BIN + '.pre-deflat-bak';
const START_MS = Date.UTC(2018, 9, 17, 4, 0, 0);
const MIN_LEN = 15;        // seconds
const SHORT_LEN = 8;       // seconds: a straight piece this long joins a fill it touches
const NEIGHBOUR_S = 60;    // seconds read on each side
const NEIGHBOUR_SD = 2;    // both sides must vary at least this much (subs/sec)
const MIN_RATE = 0.2;      // subs/sec
const STRAIGHT_LEN = 20;   // seconds: slice length for local straightness
const STRAIGHT_DEV = 1;    // subs from the line through a slice's ends
const STRAIGHT_EDGE = 3;   // seconds skipped at each end of a run before slicing
const NOISE_V0 = 2.5, NOISE_V1 = 0.45, T_DF = 10, T_CAP = 6;   // SCENARIO's SKELLAM_V0 / V1 / T_DF / T_CAP

const mulberry32 = (a) => () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const studentT = (rng, df) => {
  const gauss = () => Math.sqrt(-2 * Math.log(rng() + 1e-10)) * Math.cos(2 * Math.PI * rng());
  let chi = 0;
  for (let k = 0; k < df; k++) { const z = gauss(); chi += z * z; }
  const t = gauss() / Math.sqrt(chi / df) * Math.sqrt((df - 2) / df);
  return Math.max(-T_CAP, Math.min(T_CAP, t));
};

const dryRun = process.argv.includes('--dry-run');
const buf = fs.readFileSync(fs.existsSync(BAK) ? BAK : BIN);
const raw = new Uint32Array(buf.buffer, buf.byteOffset, buf.length >> 2);
const N = raw.length / 2;

// Runs of per-second changes all within 1 of each other (d(i) = value[i+1] - value[i]).
const runs = [];
for (const c of [0, 1]) {
  const d = (i) => raw[(i + 1) * 2 + c] - raw[i * 2 + c];
  let s = 0, lo = d(0), hi = d(0);
  for (let i = 1; i < N - 1; i++) {
    const x = d(i), nlo = Math.min(lo, x), nhi = Math.max(hi, x);
    if (nhi - nlo <= 1) { lo = nlo; hi = nhi; continue; }
    if (i - s >= SHORT_LEN) runs.push({ c, s, e: i - 1, lo, hi });
    // Restart at the longest tail still within 1, so a run that drifts by a step isn't lost.
    let j = i; lo = hi = x;
    while (j - 1 > s && Math.max(hi, d(j - 1)) - Math.min(lo, d(j - 1)) <= 1) { j--; lo = Math.min(lo, d(j)); hi = Math.max(hi, d(j)); }
    s = j;
  }
}
const sdOf = (c, a, b) => {
  let s = 0, s2 = 0, n = 0;
  for (let i = Math.max(0, a); i < Math.min(N - 1, b); i++) { const d = raw[(i + 1) * 2 + c] - raw[i * 2 + c]; s += d; s2 += d * d; n++; }
  return n > 5 ? Math.sqrt(Math.max(0, s2 / n - (s / n) ** 2)) : NaN;
};
// Largest distance (subs) of the count over values a..b from the straight line through them.
const lineDev = (c, a, b) => {
  const v = (i) => raw[i * 2 + c], k = (v(b) - v(a)) / (b - a);
  let m = 0;
  for (let i = a; i <= b; i++) m = Math.max(m, Math.abs(v(i) - v(a) - k * (i - a)));
  return m;
};
// Locally straight: every STRAIGHT_LEN-second slice (the whole run if shorter) within STRAIGHT_DEV.
// The slices skip STRAIGHT_EDGE seconds at each end, where a chained fill hands over between slopes.
const straight = (r) => {
  let a = r.s, b = r.e + 1;
  if (b - a <= STRAIGHT_LEN) return lineDev(r.c, a, b) < STRAIGHT_DEV;
  a += STRAIGHT_EDGE; b -= STRAIGHT_EDGE;
  if (b - a <= STRAIGHT_LEN) return lineDev(r.c, a, b) < STRAIGHT_DEV;
  for (let i = a; i + STRAIGHT_LEN <= b; i++) if (lineDev(r.c, i, i + STRAIGHT_LEN) >= STRAIGHT_DEV) return false;
  return true;
};
const usable = (r) => {
  const rate = (raw[(r.e + 1) * 2 + r.c] - raw[r.s * 2 + r.c]) / (r.e - r.s + 1);
  return rate >= MIN_RATE && !(r.lo === 0 && r.hi === 1);
};
// Runs are judged on the data before any fill.
runs.sort((a, b) => a.c - b.c || a.s - b.s);
const isFill = runs.map(r => {
  const len = r.e - r.s + 1;
  if (len < MIN_LEN || !usable(r)) return false;
  const nb = Math.min(sdOf(r.c, r.s - NEIGHBOUR_S, r.s), sdOf(r.c, r.e + 1, r.e + 1 + NEIGHBOUR_S));
  return nb >= NEIGHBOUR_SD || (len >= STRAIGHT_LEN && straight(r));
});
// Short straight pieces join a fill they touch (repeated, so a chain of pieces joins too).
const touches = (p, q) => p.c === q.c && p.s <= q.e + 1 && q.s <= p.e + 1;
for (let grew = true; grew;) {
  grew = false;
  runs.forEach((r, k) => {
    if (isFill[k] || !usable(r) || !straight(r)) return;
    if ((k > 0 && isFill[k - 1] && touches(r, runs[k - 1])) || (k + 1 < runs.length && isFill[k + 1] && touches(r, runs[k + 1]))) { isFill[k] = true; grew = true; }
  });
}
// Overlapping or touching fills (the restart can share seconds) merge into one stretch.
const picked = [];
runs.forEach((r, k) => {
  if (!isFill[k]) return;
  const last = picked[picked.length - 1];
  if (last && touches(last, r)) last.e = Math.max(last.e, r.e);
  else picked.push({ ...r });
});

// Fill: values r.s and r.e + 1 stay; seconds r.s + 1 .. r.e get the original course plus a
// zero-sum noise walk.
let seconds = 0;
const out = new Uint32Array(raw);
for (const r of picked) {
  const v0 = raw[r.s * 2 + r.c], v1 = raw[(r.e + 1) * 2 + r.c], n = r.e + 1 - r.s;
  const sd = Math.sqrt(NOISE_V0 + NOISE_V1 * Math.abs((v1 - v0) / n));
  const rng = mulberry32((r.s * 0x9E3779B1 ^ r.e ^ (r.c + 1) * 0x85EBCA6B) >>> 0);
  const noise = Array.from({ length: n }, () => sd * studentT(rng, T_DF));
  const mean = noise.reduce((s, x) => s + x, 0) / n;
  let walk = 0;
  for (let k = 0; k < n - 1; k++) { walk += noise[k] - mean; out[(r.s + 1 + k) * 2 + r.c] = Math.round(raw[(r.s + 1 + k) * 2 + r.c] + walk); }
  seconds += n - 1;
}

const pct = (100 * seconds / (2 * N)).toFixed(3);
console.log(`${picked.length} runs (PDP ${picked.filter(r => !r.c).length}, TS ${picked.filter(r => r.c).length}), ${seconds} channel-seconds = ${pct}% of the data`);
if (dryRun) process.exit(0);

if (!fs.existsSync(BAK)) fs.copyFileSync(BIN, BAK);
fs.writeFileSync(BIN, Buffer.from(out.buffer));
console.log(`wrote ${path.basename(BIN)} from ${path.basename(BAK)}; repack with node scripts/repack-all.mjs`);
