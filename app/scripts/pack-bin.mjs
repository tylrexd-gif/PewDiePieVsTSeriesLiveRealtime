// Packs a per-second [pdp, ts] binary into the compact PVD1 format (gzipped).
//
// Input: either a raw interleaved u32le pairs file (the real data - give its start
// time with startMs), or a Scenario "NPT1" export (header carries its own start).
//
// PVD1 layout (little-endian, then the whole file is gzipped):
//   0  magic "PVD1"
//   4  startMs   int64   time of record 0 (input clock, unchanged)
//   12 stepMs    int32
//   16 n         int32   records (seconds)
//   20 nCh       int32   channels (2: pdp, ts)
//   24 nExc      int32   exception count
//   28 base      int32 x nCh          values of record 0
//   .. exc       int32 x 3 x nExc     [record index, channel, delta] for |delta| > 127
//   .. deltas    int8 x nCh x (n-1)   per channel (planar): value[i] - value[i-1];
//                                     -128 = take the next exception for that channel
// Per-second changes almost always fit in a byte; only audit-sized jumps go to the
// exception table. Decoding is bit-exact.
//
// CLI:  node scripts/pack-bin.mjs <in.bin> <out.pvd.gz> [startMs]
import fs from 'fs';
import zlib from 'zlib';

export function packBinary(inPath, outPath, startMsForRaw) {
  const buf = fs.readFileSync(inPath);
  const isNPT1 = buf.length >= 24 && buf.toString('latin1', 0, 4) === 'NPT1';
  let startMs, stepMs, n, nCh, vals;
  if (isNPT1) {
    startMs = Number(buf.readBigInt64LE(4));
    stepMs = buf.readInt32LE(12); n = buf.readInt32LE(16); nCh = buf.readInt32LE(20);
    vals = new Int32Array(buf.buffer.slice(buf.byteOffset + 24, buf.byteOffset + 24 + n * nCh * 4));
  } else {
    if (startMsForRaw == null) throw new Error('raw input needs startMs');
    startMs = startMsForRaw; stepMs = 1000; nCh = 2;
    vals = new Uint32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
    n = vals.length / nCh;
  }
  const deltas = new Int8Array(nCh * (n - 1));
  const exc = [];
  for (let i = 1; i < n; i++) {
    for (let c = 0; c < nCh; c++) {
      const d = vals[i * nCh + c] - vals[(i - 1) * nCh + c];
      if (d >= -127 && d <= 127) deltas[c * (n - 1) + i - 1] = d;
      else { deltas[c * (n - 1) + i - 1] = -128; exc.push(i, c, d); }
    }
  }
  const head = Buffer.alloc(28 + nCh * 4 + exc.length * 4);
  head.write('PVD1', 0, 'latin1');
  head.writeBigInt64LE(BigInt(startMs), 4);
  head.writeInt32LE(stepMs, 12); head.writeInt32LE(n, 16); head.writeInt32LE(nCh, 20);
  head.writeInt32LE(exc.length / 3, 24);
  for (let c = 0; c < nCh; c++) head.writeInt32LE(vals[c] | 0, 28 + c * 4);
  for (let k = 0; k < exc.length; k++) head.writeInt32LE(exc[k], 28 + nCh * 4 + k * 4);
  const packed = zlib.gzipSync(Buffer.concat([head, Buffer.from(deltas.buffer)]), { level: 9 });
  fs.writeFileSync(outPath, packed);
  return { n, nCh, exceptions: exc.length / 3, inBytes: buf.length, outBytes: packed.length };
}

// Re-pack when the master .bin is newer than its packed copy (or the copy is missing).
export function packIfStale(inPath, outPath, startMsForRaw) {
  if (!fs.existsSync(inPath)) return null;
  if (fs.existsSync(outPath) && fs.statSync(outPath).mtimeMs >= fs.statSync(inPath).mtimeMs) return null;
  return packBinary(inPath, outPath, startMsForRaw);
}

if (process.argv[1] && process.argv[1].endsWith('pack-bin.mjs')) {
  const [, , inPath, outPath, startArg] = process.argv;
  if (!inPath || !outPath) { console.error('usage: node scripts/pack-bin.mjs <in.bin> <out.pvd.gz> [startMs]'); process.exit(1); }
  const r = packBinary(inPath, outPath, startArg != null ? Number(startArg) : undefined);
  console.log(`${inPath} -> ${outPath}: ${(r.inBytes / 1e6).toFixed(1)} MB -> ${(r.outBytes / 1e6).toFixed(1)} MB (${r.n} records, ${r.exceptions} exceptions)`);
}
