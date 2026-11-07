// Repacks every master per-second .bin in dist/data into its compressed .pvd.gz.
//
//   node scripts/repack-all.mjs          only masters newer than their packed copy
//   node scripts/repack-all.mjs --force  repack everything
//   node scripts/repack-all.mjs real     only jobs whose .bin name contains "real"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { packBinary, packIfStale } from './pack-bin.mjs';
import { PACK_JOBS } from './pack-jobs.mjs';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'data');
const force = process.argv.includes('--force');
const filters = process.argv.slice(2).filter(a => !a.startsWith('--'));
const mb = b => (b / 1e6).toFixed(1) + ' MB';

let failed = 0;
for (const [bin, packed, startMs] of PACK_JOBS) {
  if (filters.length && !filters.some(f => bin.includes(f))) continue;
  const inPath = path.join(DATA, bin), outPath = path.join(DATA, packed);
  if (!fs.existsSync(inPath)) { console.log(`skip    ${bin} (missing)`); continue; }
  try {
    const r = force ? packBinary(inPath, outPath, startMs) : packIfStale(inPath, outPath, startMs);
    if (r) console.log(`packed  ${bin} -> ${packed}: ${mb(r.inBytes)} -> ${mb(r.outBytes)} (${r.n} s, ${r.exceptions} exceptions)`);
    else console.log(`current ${packed}`);
  } catch (e) { failed++; console.error(`FAILED  ${bin}: ${e.message}`); }
}
process.exit(failed ? 1 : 0);
