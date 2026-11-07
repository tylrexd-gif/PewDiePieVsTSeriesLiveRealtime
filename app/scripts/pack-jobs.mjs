// Master per-second .bin -> packed .pvd.gz jobs, shared by server.js and repack-all.mjs.
// [bin, packed, startMs for raw input (undefined = NPT1 header carries it)]
export const PACK_JOBS = [
  ['every_second_counts_pvt_u32le.bin', 'every_second_counts_pvt.pvd.gz', Date.UTC(2018, 9, 17, 4, 0, 0)],
  ['scenario-pdp-ts.bin', 'scenario-pdp-ts.pvd.gz', undefined],   // NPT1 export: start is in its header
  ['real-pdp-ts.bin', 'real-pdp-ts.pvd.gz', undefined],           // real-data extension (May 1 - Jun 30), NPT1
  ['PVTS_8_18_to_8_30_u32le.bin', 'PVTS_8_18_to_8_30.pvd.gz', undefined],   // 100M mode (Aug 18 - Aug 30), NPT1
];
