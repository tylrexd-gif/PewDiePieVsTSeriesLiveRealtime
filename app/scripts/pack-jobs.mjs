// Master per-second .bin -> packed .pvd.gz jobs, shared by server.js and repack-all.mjs.
// [bin, packed, startMs for raw input (undefined = NPT1 header carries it), source patch paths]
// Source patches: packed PVD1 files in app/data-patches (not served), on the master's own
// clock, each second they cover replacing the master's when packing (in list order, a later
// one wins). The master stays untouched; the packed copy (what gets committed and served)
// carries the patches.
import path from 'path';
import { fileURLToPath } from 'url';
export const PATCH_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data-patches');
const REAL_SOURCE_PATCHES = [
  'every_second_counts_pvt.patch-2018-10-29-0041.pvd.gz',   // Oct 29 2018 00:41:00 - 02:01:00 EDT, both channels: rate fix (front-loaded growth spread evenly; scripts/equalize.mjs)
  'every_second_counts_pvt.patch-2018-10-29-0435-pdp.pvd.gz',   // Oct 29 2018 04:35:42 - 04:36:15 EDT, PDP: papered over (scripts/paper.mjs)
  'every_second_counts_pvt.patch-2018-11-20-1245-ts.pvd.gz',   // Nov 20 2018 12:45:48 - 12:46:03 EST, TS: audit spread at ~+122/s papered over, whole +1912 audit put in 12:45:48
  'every_second_counts_pvt.patch-2018-11-20-1248-pdp.pvd.gz',   // Nov 20 2018 12:48:01 - 12:48:40 EST, PDP: raw counts restored (smoothing had spread the -359 audit at 12:48:09 over 40 s)
  'every_second_counts_pvt.patch-2018-11-28-1655-ts.pvd.gz',   // Nov 28 2018 16:55:26 - 17:07:16 EST, TS: stalled counter + catch-up jump papered over (scripts/paper.mjs)
  'every_second_counts_pvt.patch-2018-11-28-2326-ts.pvd.gz',   // Nov 28 2018 23:26:15 - 23:33:15 EST, TS: papered over (scripts/paper.mjs)
  'every_second_counts_pvt.patch-2018-11-29-0028.pvd.gz',   // Nov 29 2018 00:28:58 - 01:01:24 EST, split 00:32:28, both channels: rate fix (scripts/equalize.mjs)
  'every_second_counts_pvt.patch-2018-12-29-0445-ts.pvd.gz',   // Dec 29 2018 04:45:54 - 04:46:37 EST, TS: papered over (scripts/paper.mjs)
  'every_second_counts_pvt.patch-2019-03-12-2249-ts.pvd.gz',   // Mar 12 2019 22:49:33 - 23:07:37 EDT, TS: constant-rate fill + drop papered over (scripts/paper.mjs)
  'every_second_counts_pvt.patch-2019-03-18-0048-ts.pvd.gz',   // Mar 18 2019 00:48:18 - 00:52:02 EDT, TS: papered over (scripts/paper.mjs)
  'every_second_counts_pvt.patch-2019-03-18-0054-ts.pvd.gz',   // Mar 18 2019 00:54:27 - 00:55:04 EDT, TS: papered over (scripts/paper.mjs)
];
export const PACK_JOBS = [
  ['every_second_counts_pvt_u32le.bin', 'every_second_counts_pvt.pvd.gz', Date.UTC(2018, 9, 17, 4, 0, 0), REAL_SOURCE_PATCHES.map(p => path.join(PATCH_DIR, p))],
  ['scenario-pdp-ts.bin', 'scenario-pdp-ts.pvd.gz', undefined],   // NPT1 export: start is in its header
  ['real-pdp-ts.bin', 'real-pdp-ts.pvd.gz', undefined],           // real-data extension (May 1 - Jun 30), NPT1
  ['PVTS_8_18_to_8_30_u32le.bin', 'PVTS_8_18_to_8_30.pvd.gz', undefined],   // 100M mode (Aug 18 - Aug 30), NPT1
];
