// Decoder for the PVD1 packed per-second format (see app/scripts/pack-bin.mjs).
// Pure JS, no React - shared by the app and its tests.

// Gunzips if the bytes are gzip (1f 8b); passes through bytes the server/CDN already
// decompressed. Uses the browser's DecompressionStream, or zlib under Node.
export async function gunzipIfNeeded(ab) {
  const u8 = new Uint8Array(ab, 0, Math.min(2, ab.byteLength));
  if (!(u8[0] === 0x1f && u8[1] === 0x8b)) return ab;
  if (typeof DecompressionStream !== 'undefined') {
    const stream = new Blob([ab]).stream().pipeThrough(new DecompressionStream('gzip'));
    return await new Response(stream).arrayBuffer();
  }
  const zlib = await import('zlib');
  const out = zlib.gunzipSync(Buffer.from(ab));
  return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);
}

// Unpacks PVD1 bytes into interleaved per-second values [ch0, ch1, ch0, ch1, ...].
// OutArray: Uint32Array (real data) or Int32Array (Scenario exports).
export function unpackPVD(ab, OutArray = Uint32Array) {
  const dv = new DataView(ab);
  const magic = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
  if (magic !== 'PVD1') throw new Error('not a PVD1 file');
  const startMs = Number(dv.getBigInt64(4, true));
  const stepMs = dv.getInt32(12, true), n = dv.getInt32(16, true), nCh = dv.getInt32(20, true), nExc = dv.getInt32(24, true);
  let off = 28;
  const base = [];
  for (let c = 0; c < nCh; c++, off += 4) base.push(dv.getInt32(off, true));
  const excByCh = Array.from({ length: nCh }, () => []);
  for (let k = 0; k < nExc; k++, off += 12) excByCh[dv.getInt32(off + 4, true)].push(dv.getInt32(off + 8, true));
  const deltas = new Int8Array(ab, off, nCh * (n - 1));
  const out = new OutArray(n * nCh);
  for (let c = 0; c < nCh; c++) {
    const ex = excByCh[c];
    let v = OutArray === Uint32Array ? base[c] >>> 0 : base[c], k = 0;
    out[c] = v;
    const row = c * (n - 1);
    for (let i = 1; i < n; i++) {
      const d = deltas[row + i - 1];
      v += d === -128 ? ex[k++] : d;
      out[i * nCh + c] = v;
    }
  }
  return { startMs, stepMs, n, nCh, data: out };
}
