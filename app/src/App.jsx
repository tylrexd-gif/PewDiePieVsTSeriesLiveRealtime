import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer, useLayoutEffect } from "react";
import ReactDOM from 'react-dom/client';

/*
 * Layout ownership map:
 * - Top-level views are socialblade, flare, dashboard, and inflections.
 * - SocialBlade owns the fixed 1280x720 v1/v2 JSX blocks, sbChannelCard,
 *   renderCounter, sbWatermark, and its SB-style table/chart chrome.
 * - Flare owns FlareView, renderScoreCard, renderFlareCount,
 *   FlareCasinoCounter, FlareNewsTicker, and FlareBackground.
 * - Dashboard owns renderNormalDashboard, renderAltDashboard,
 *   renderDualDashboard, dashRenderCounter, dashRenderGap, DashRateDisplay,
 *   DashChartCard, DashMilestone, and the milestone card.
 * - Dashboard channel cards are inline inside renderNormalDashboard,
 *   and renderAltDashboard; do not reuse
 *   sbChannelCard there.
 * See app/LAYOUTS.md before moving or reusing counter/card/milestone code.
 */
const { H } = window.__DATA;
const GAP_CROSSINGS = Array.isArray(window.__DATA.GAP_CROSSINGS) ? window.__DATA.GAP_CROSSINGS : [];
const SBD_REAL  = Array.isArray(window.__DATA.SBD_REAL)  ? window.__DATA.SBD_REAL  : [];
const FTVD_REAL = Array.isArray(window.__DATA.FTVD_REAL) ? window.__DATA.FTVD_REAL : [];
// Real Data audit events: [{ms, channel, type, magnitude}], sorted chronologically.
const REAL_AUDITS = Array.isArray(window.__DATA.REAL_AUDITS) ? window.__DATA.REAL_AUDITS : [];
// Only major events (type === 'audit') are used for chart markers, gain stripping, and the
// Audit Time table. Minor events are detected but excluded from all UI.
const REAL_AUDITS_MAJOR = REAL_AUDITS.filter(a => a.type === 'audit');

import pdpIcon from './assets/pdpIcon.jpg';
import tsIcon from './assets/tsIcon.jpg';
import pdpBanner from './assets/pdpBanner.jpg';
import pdpBannerMilestone from './assets/Banner_PDPMilestoneCollection.jpg';
import tsBanner_3103 from './assets/tsBanner_3103.jpg';
import tsBanner_0104 from './assets/tsBanner_0104.jpg';
import tsBanner_0304 from './assets/tsBanner_0304.jpg';
import tsBanner_0604 from './assets/tsBanner_0604.jpg';
import tsBanner_0704 from './assets/tsBanner_0704.jpg';
import tsBanner_0904 from './assets/tsBanner_0904.jpg';
import tsBanner_1204 from './assets/tsBanner_1204.jpg';
import tsBanner_1504 from './assets/tsBanner_1504.jpg';
import tsBanner_1904 from './assets/tsBanner_1904.jpg';
import tsBanner_2204 from './assets/tsBanner_2204.jpg';
import tsBanner_2304 from './assets/tsBanner_2304.jpg';
import tsBanner_2404 from './assets/tsBanner_2404.jpg';
import tsBanner_2504 from './assets/tsBanner_2504.jpg';
import tsBanner_2604 from './assets/tsBanner_2604.jpg';
import tsBanner_2904 from './assets/tsBanner_2904.jpg';
import tsBanner_0205 from './assets/tsBanner_0205.jpg';
import tsBanner_0305 from './assets/tsBanner_0305.jpg';
import tsBanner_0905 from './assets/tsBanner_0905.jpg';
import tsBanner_1005 from './assets/tsBanner_1005.jpg';
import tsBanner_1305 from './assets/tsBanner_1305.jpg';
import tsBanner_1505 from './assets/tsBanner_1505.jpg';
import tsBanner_1605 from './assets/tsBanner_1605.jpg';
import tsBanner_1805 from './assets/tsBanner_1805.jpg';
import tsBanner_2005 from './assets/tsBanner_2005.jpg';
import tsBanner_2205 from './assets/tsBanner_2205.jpg';
import tsBanner_2505 from './assets/tsBanner_2505.jpg';
import tsBanner_0106 from './assets/tsBanner_0106.jpg';
import tsBanner_0306 from './assets/tsBanner_0306.jpg';
import tsBanner_0606 from './assets/tsBanner_0606.jpg';
import tsBanner_0906 from './assets/tsBanner_0906.jpg';
import tsBanner_1710 from './assets/tsBanner_1710.jpg';
import tsBanner_2110 from './assets/tsBanner_2110.jpg';
import tsBanner_2710 from './assets/tsBanner_2710.jpg';
import tsBanner_0111 from './assets/tsBanner_0111.jpg';
import tsBanner_0411 from './assets/tsBanner_0411.jpg';
import tsBanner_0611 from './assets/tsBanner_0611.jpg';
import tsBanner_1311 from './assets/tsBanner_1311.jpg';
import tsBanner_1411 from './assets/tsBanner_1411.jpg';
import tsBanner_1711 from './assets/tsBanner_1711.jpg';
import tsBanner_2411 from './assets/tsBanner_2411.jpg';
import tsBanner_2511 from './assets/tsBanner_2511.jpg';
import tsBanner_2711 from './assets/tsBanner_2711.jpg';
import tsBanner_2811 from './assets/tsBanner_2811.jpg';
import tsBanner_0112 from './assets/tsBanner_0112.jpg';
import tsBanner_0412 from './assets/tsBanner_0412.jpg';
import tsBanner_0512 from './assets/tsBanner_0512.jpg';
import tsBanner_0712 from './assets/tsBanner_0712.jpg';
import tsBanner_0812 from './assets/tsBanner_0812.jpg';
import tsBanner_1112 from './assets/tsBanner_1112.jpg';
import tsBanner_1412 from './assets/tsBanner_1412.jpg';
import tsBanner_1512 from './assets/tsBanner_1512.jpg';
import tsBanner_1812 from './assets/tsBanner_1812.jpg';
import tsBanner_1912 from './assets/tsBanner_1912.jpg';
import tsBanner_2012 from './assets/tsBanner_2012.jpg';
import tsBanner_2112 from './assets/tsBanner_2112.jpg';
import tsBanner_2212 from './assets/tsBanner_2212.jpg';
import tsBanner_2712 from './assets/tsBanner_2712.jpg';
import tsBanner_2812 from './assets/tsBanner_2812.jpg';
import tsBanner_3012 from './assets/tsBanner_3012.jpg';
import tsBanner_0501 from './assets/tsBanner_0501.jpg';
import tsBanner_0901 from './assets/tsBanner_0901.jpg';
import tsBanner_1001 from './assets/tsBanner_1001.jpg';
import tsBanner_1101 from './assets/tsBanner_1101.jpg';
import tsBanner_1301 from './assets/tsBanner_1301.jpg';
import tsBanner_1801 from './assets/tsBanner_1801.jpg';
import tsBanner_1901 from './assets/tsBanner_1901.jpg';
import tsBanner_2301 from './assets/tsBanner_2301.jpg';
import tsBanner_2401 from './assets/tsBanner_2401.jpg';
import tsBanner_2601 from './assets/tsBanner_2601.jpg';
import tsBanner_3001 from './assets/tsBanner_3001.jpg';
import tsBanner_0102 from './assets/tsBanner_0102.jpg';
import tsBanner_0502 from './assets/tsBanner_0502.jpg';
import tsBanner_0802 from './assets/tsBanner_0802.jpg';
import tsBanner_1302 from './assets/tsBanner_1302.jpg';
import tsBanner_1402 from './assets/tsBanner_1402.jpg';
import tsBanner_1602 from './assets/tsBanner_1602.jpg';
import tsBanner_1902 from './assets/tsBanner_1902.jpg';
import tsBanner_2202 from './assets/tsBanner_2202.jpg';
import tsBanner_2302 from './assets/tsBanner_2302.jpg';
import tsBanner_0103 from './assets/tsBanner_0103.jpg';
import tsBanner_0703 from './assets/tsBanner_0703.jpg';
import tsBanner_0803 from './assets/tsBanner_0803.jpg';
import tsBanner_1403 from './assets/tsBanner_1403.jpg';
import tsBanner_1603 from './assets/tsBanner_1603.jpg';
import tsBanner_1903 from './assets/tsBanner_1903.jpg';
import tsBanner_2103 from './assets/tsBanner_2103.jpg';
import tsBanner_2603 from './assets/tsBanner_2603.jpg';
import tsBanner_3003 from './assets/tsBanner_3003.jpg';
import flareTvIcon from './assets/flareTvIcon.jpg';
import sbIcon from './assets/sbIcon.jpg';
import sbLogo from './assets/sbLogo.png';
import sbLogoV2 from './assets/SBLOGO_V2.png';
import twitterIcon from './assets/twitterIcon.png';
import pollCheckmarkIcon from './assets/pollCheckmarkIcon.png';
import discordIcon from './assets/discordIcon.png';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot, Label, Customized } from "recharts";

// - HOURLY DATA: H -
// Each row is [t, pt, tt] - three fields, no derivatives stored.
//   t  : timestamp in milliseconds since UNIX epoch (UTC). Each row
//        represents the cumulative state observed at this exact instant;
//        consecutive rows are spaced 1 hour apart.
//   pt : PDP cumulative subscriber count at time t, with audit
//        corrections applied (the displayed scenario value).
//   tt : TS  cumulative subscriber count at time t, with audit
//        corrections applied.
//
// Every other quantity the dashboard cares about - organic counts,
// hourly/daily growth deltas, the PDP-vs-TS gap - is a pure function of
// (pt, tt, audit history) and is computed once at module load by the
// derived-fields post-pass below the audit infrastructure. See that
// block for the exact formulas. This keeps the source of truth small
// and prevents staleness when pt or tt are edited.

// - AUDIT INFRASTRUCTURE: RAW HOURS + GENERATOR -
//
// Audits are defined in two layers. The raw layer specifies only the
// hour bucket and value of each audit - no within-hour position. The
// generator places each audit at a deterministic timestamp inside its
// hour using a fixed-seed PRNG, so the same set of timestamps is
// produced on every load. Re-running with a different seed reshuffles
// only positions within each hour; values and hour assignments are
// fixed inputs.
//
// Hour buckets are identified by their END timestamp. By the convention
// used elsewhere in this file, "hour slot 15:00" denotes the 60-minute
// window (14:00, 15:00] - the slot ending at 15:00.
//
// Pairing at placement time:
//   • PDP+TS audits in the same hour: bivariate gaussian, mildly
//     correlated so the two draws tend to occupy the same neighborhood
//     of the hour without sitting on top of each other (sigma = 4 min,
//     rho = 0.5; std of signed t1-t2 is about 4.0 min).
//   • Lone audits: univariate gaussian, same sigma.
// Generated gaussian draws are clamped to [hour_start+1min, hour_end-1s].

const _AUDIT_RNG_SEED = 0x5a17c0de;
const _AUDIT_SIGMA_MIN = 4;
const _AUDIT_RHO = 0.5;

const _auditMulberry = (s0) => {
  let s = s0 >>> 0;
  return () => {
    let t = (s = (s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// One Box-Muller call yields two independent N(0,1) draws.
const _gaussPair = (rng) => {
  let u = rng(); while (u === 0) u = rng();
  const v = rng();
  const r = Math.sqrt(-2 * Math.log(u));
  return [r * Math.cos(2 * Math.PI * v), r * Math.sin(2 * Math.PI * v)];
};

const _fmtAuditDisplayTime = (ts) => {
  const d = new Date(ts + _getEasternOffset(ts) * 3600000);
  const yr = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dy = String(d.getUTCDate()).padStart(2, '0');
  const h24 = d.getUTCHours();
  const mi = String(d.getUTCMinutes()).padStart(2, '0');
  const ampm = h24 >= 12 ? 'pm' : 'am';
  const h12 = ((h24 + 11) % 12) + 1;
  return `${yr}-${mo}-${dy} ${h12}:${mi} ${ampm}`;
};

// Per-channel slices of REAL_AUDITS_MAJOR with prefix sums for O(log n) cumulative magnitude lookup.
// REAL_AUDITS is chronologically sorted (detect-audits.js guarantees this).
const _rdAuditPdp = REAL_AUDITS_MAJOR.filter(a => a.channel === 'pdp');
const _rdAuditTs  = REAL_AUDITS_MAJOR.filter(a => a.channel === 'ts');
const _rdMkPfx = (arr) => arr.reduce((acc, a) => { acc.push((acc.length ? acc[acc.length - 1] : 0) + a.magnitude); return acc; }, []);
const _rdAuditPdpPfx = _rdMkPfx(_rdAuditPdp);
const _rdAuditTsPfx  = _rdMkPfx(_rdAuditTs);
// Returns cumulative audit magnitude for channel ch at all events with ms <= t.
const getRdCumAudit = (t, ch) => {
  const arr = ch === 'pdp' ? _rdAuditPdp : _rdAuditTs;
  const pfx = ch === 'pdp' ? _rdAuditPdpPfx : _rdAuditTsPfx;
  if (!arr.length) return 0;
  let lo = 0, hi = arr.length - 1, res = -1;
  while (lo <= hi) { const mid = (lo + hi) >> 1; if (arr[mid].ms <= t) { res = mid; lo = mid + 1; } else hi = mid - 1; }
  return res < 0 ? 0 : pfx[res];
};

// rawArr: [[hourEndTs, channel, delta], ...]
// Returns: [[null, channel, delta, ts, displayTime], ...] sorted by ts.
// idx (slot 0) is unused downstream - kept for schema compatibility.
const _generateAuditPositions = (rawArr, seed) => {
  const HOUR = 60 * 60 * 1000;
  const SIGMA_MS = _AUDIT_SIGMA_MIN * 60 * 1000;
  const RHO = _AUDIT_RHO;
  // Sigma for cross-hour boundary placement: audits land ~2 min from the boundary on average
  const SIGMA_BOUNDARY_MS = 2 * 60 * 1000;
  const byHour = new Map();
  for (const [ts, ch, d, fixed] of rawArr) {
    if (!byHour.has(ts)) byHour.set(ts, []);
    byHour.get(ts).push({ ch, d, fixed: fixed != null ? fixed : null });
  }
  const sortedHours = [...byHour.keys()].sort((a, b) => a - b);
  const rng = _auditMulberry(seed);
  const out = [];

  // Pre-pass: find consecutive-hour cross-channel pairs (e.g. pdp at hour 14, ts at hour 15).
  // Both audits are placed near the shared boundary instead of each hour's midpoint.
  // Only fires when neither channel appears in the other's hour (no same-hour bivariate conflict).
  const crossHandled = new Set();
  const CROSS_CHANNEL_PAIRS = [['pdp','ts'],['ts','pdp']];

  // Pre-pass 0: manual fixed timestamps (audit_times.csv overrides). When an
  // audit carries an exact ms, emit it verbatim and mark its (hour:ch) slot so
  // the gaussian/boundary placement below skips it. Consumes no rng, so the
  // generated placement of the remaining audits stays deterministic.
  for (const tEnd of byHour.keys()) {
    for (const item of byHour.get(tEnd)) {
      if (item.fixed == null) continue;
      out.push([null, item.ch, item.d, item.fixed, _fmtAuditDisplayTime(item.fixed)]);
      crossHandled.add(`${tEnd}:${item.ch}`);
    }
  }

  for (let i = 0; i + 1 < sortedHours.length; i++) {
    const tA = sortedHours[i], tB = sortedHours[i + 1];
    if (tB - tA !== HOUR) continue;
    const itemsA = byHour.get(tA), itemsB = byHour.get(tB);
    const hasA = (ch) => itemsA.some(x => x.ch === ch);
    const hasB = (ch) => itemsB.some(x => x.ch === ch);

    for (const [chA, chB] of CROSS_CHANNEL_PAIRS) {
      if (!hasA(chA) || !hasB(chB)) continue;
      if (hasA(chB) || hasB(chA)) continue; // already paired within same hour
      const keyA = `${tA}:${chA}`, keyB = `${tB}:${chB}`;
      if (crossHandled.has(keyA) || crossHandled.has(keyB)) continue;

      // Boundary = tA (end of hour A = start of hour B)
      // A-side: place just before tA; B-side: place just after tA
      const [z1, z2] = _gaussPair(rng);
      const tPlaceA = Math.max(tA - HOUR + 60000, Math.min(tA - 1000,
                        Math.round(tA - Math.abs(z1) * SIGMA_BOUNDARY_MS)));
      const tPlaceB = Math.max(tA + 60000, Math.min(tB - 1000,
                        Math.round(tA + Math.abs(z2) * SIGMA_BOUNDARY_MS)));
      const itemA = itemsA.find(x => x.ch === chA);
      const itemB = itemsB.find(x => x.ch === chB);
      out.push([null, itemA.ch, itemA.d, tPlaceA, _fmtAuditDisplayTime(tPlaceA)]);
      out.push([null, itemB.ch, itemB.d, tPlaceB, _fmtAuditDisplayTime(tPlaceB)]);
      crossHandled.add(keyA);
      crossHandled.add(keyB);
      break;
    }
  }

  for (const tEnd of sortedHours) {
    const tStart = tEnd - HOUR;
    const center = tStart + 30 * 60 * 1000;
    const lo = tStart + 60 * 1000;       // 1-minute margin from slot start (≥ 14:01)
    const hi = tEnd - 1000;              // 1-second margin from slot end
    const clamp = (t) => Math.max(lo, Math.min(hi, Math.round(t)));
    const items = byHour.get(tEnd);
    const used = new Array(items.length).fill(false);
    items.forEach((x, i) => { if (crossHandled.has(`${tEnd}:${x.ch}`)) used[i] = true; });

    const idxOf = (chName) => items.findIndex((x, i) => !used[i] && x.ch === chName);
    const placeBivariate = (i1, i2) => {
      const [z1, z2] = _gaussPair(rng);
      const t1 = clamp(center + SIGMA_MS * z1);
      const t2 = clamp(center + SIGMA_MS * (RHO * z1 + Math.sqrt(1 - RHO * RHO) * z2));
      out.push([null, items[i1].ch, items[i1].d, t1, _fmtAuditDisplayTime(t1)]);
      out.push([null, items[i2].ch, items[i2].d, t2, _fmtAuditDisplayTime(t2)]);
      used[i1] = used[i2] = true;
    };
    const placeUnivariate = (i) => {
      const [z] = _gaussPair(rng);
      const t = clamp(center + SIGMA_MS * z);
      out.push([null, items[i].ch, items[i].d, t, _fmtAuditDisplayTime(t)]);
      used[i] = true;
    };

    const pdpI = idxOf('pdp'),  tsI   = idxOf('ts');
    if (pdpI >= 0 && tsI   >= 0) placeBivariate(pdpI, tsI);
    for (let i = 0; i < items.length; i++) if (!used[i]) placeUnivariate(i);
  }

  out.sort((a, b) => a[3] - b[3]);
  return out;
};


// =
// BASE64 IMAGE ASSETS - DO NOT VIEW OR EXPAND THIS REGION
// The next ~10 lines contain roughly 130 KB of base64 payload across
// 37 constants: pdpIcon, tsIcon, pdpBanner, 30 x tsBanner_DDMM, flareTvIcon,
// sbIcon, sbLogo, twitterIcon.
// To edit one: target it by name with str_replace.
// To navigate past: jump to the closing sentinel further below.
// =


// =
// END BASE64 IMAGE ASSETS
// =


// T-Series channel banner schedule. The real T-Series channel rotated its
// cover banner every few days during the race, so reproducing the stream
// faithfully means selecting the banner that was live at `clockTime`.
//
// Each entry's `startAt` is the UTC moment that banner becomes active.
// The array must stay sorted ascending by startAt. Most switchovers land
// at 00:00 UTC of the date on the filename, but some are hour-precision:
//
//   • Mar 31 banner stays live until Apr 1 08:00 UTC (not midnight).
//
// Adding a new banner: import the constant in the base64 block above,
// then insert a new entry here in chronological position.
const PDP_BANNERS = [
  { startAt: Date.UTC(2019, 2, 31, 0, 0), data: pdpBanner },           // start -> Jun 1
  { startAt: Date.UTC(2019, 5,  1, 0, 0), data: pdpBannerMilestone },  // Jun 1+
];

const TS_BANNERS = [
  { startAt: Date.UTC(2018,  9, 17, 0, 0), data: tsBanner_1710 },  // Oct 17 2018
  { startAt: Date.UTC(2018,  9, 21, 0, 0), data: tsBanner_2110 },  // Oct 21 2018
  { startAt: Date.UTC(2018,  9, 27, 0, 0), data: tsBanner_2710 },  // Oct 27 2018
  { startAt: Date.UTC(2018, 10,  1, 0, 0), data: tsBanner_0111 },  // Nov 1 2018
  { startAt: Date.UTC(2018, 10,  4, 0, 0), data: tsBanner_0411 },  // Nov 4 2018
  { startAt: Date.UTC(2018, 10,  6, 0, 0), data: tsBanner_0611 },  // Nov 6 2018
  { startAt: Date.UTC(2018, 10, 13, 0, 0), data: tsBanner_1311 },  // Nov 13 2018
  { startAt: Date.UTC(2018, 10, 14, 0, 0), data: tsBanner_1411 },  // Nov 14 2018
  { startAt: Date.UTC(2018, 10, 17, 0, 0), data: tsBanner_1711 },  // Nov 17 2018
  { startAt: Date.UTC(2018, 10, 24, 0, 0), data: tsBanner_2411 },  // Nov 24 2018
  { startAt: Date.UTC(2018, 10, 25, 0, 0), data: tsBanner_2511 },  // Nov 25 2018
  { startAt: Date.UTC(2018, 10, 27, 0, 0), data: tsBanner_2711 },  // Nov 27 2018
  { startAt: Date.UTC(2018, 10, 28, 0, 0), data: tsBanner_2811 },  // Nov 28 2018
  { startAt: Date.UTC(2018, 11,  1, 0, 0), data: tsBanner_0112 },  // Dec 1 2018
  { startAt: Date.UTC(2018, 11,  4, 0, 0), data: tsBanner_0412 },  // Dec 4 2018
  { startAt: Date.UTC(2018, 11,  5, 0, 0), data: tsBanner_0512 },  // Dec 5 2018
  { startAt: Date.UTC(2018, 11,  7, 0, 0), data: tsBanner_0712 },  // Dec 7 2018
  { startAt: Date.UTC(2018, 11,  8, 0, 0), data: tsBanner_0812 },  // Dec 8 2018
  { startAt: Date.UTC(2018, 11, 11, 0, 0), data: tsBanner_1112 },  // Dec 11 2018
  { startAt: Date.UTC(2018, 11, 14, 0, 0), data: tsBanner_1412 },  // Dec 14 2018
  { startAt: Date.UTC(2018, 11, 15, 0, 0), data: tsBanner_1512 },  // Dec 15 2018
  { startAt: Date.UTC(2018, 11, 18, 0, 0), data: tsBanner_1812 },  // Dec 18 2018
  { startAt: Date.UTC(2018, 11, 19, 0, 0), data: tsBanner_1912 },  // Dec 19 2018
  { startAt: Date.UTC(2018, 11, 20, 0, 0), data: tsBanner_2012 },  // Dec 20 2018
  { startAt: Date.UTC(2018, 11, 21, 0, 0), data: tsBanner_2112 },  // Dec 21 2018
  { startAt: Date.UTC(2018, 11, 22, 0, 0), data: tsBanner_2212 },  // Dec 22 2018
  { startAt: Date.UTC(2018, 11, 27, 0, 0), data: tsBanner_2712 },  // Dec 27 2018
  { startAt: Date.UTC(2018, 11, 28, 0, 0), data: tsBanner_2812 },  // Dec 28 2018
  { startAt: Date.UTC(2018, 11, 30, 0, 0), data: tsBanner_3012 },  // Dec 30 2018
  { startAt: Date.UTC(2019,  0,  5, 0, 0), data: tsBanner_0501 },  // Jan 5 2019
  { startAt: Date.UTC(2019,  0,  9, 0, 0), data: tsBanner_0901 },  // Jan 9 2019
  { startAt: Date.UTC(2019,  0, 10, 0, 0), data: tsBanner_1001 },  // Jan 10 2019
  { startAt: Date.UTC(2019,  0, 11, 0, 0), data: tsBanner_1101 },  // Jan 11 2019
  { startAt: Date.UTC(2019,  0, 13, 0, 0), data: tsBanner_1301 },  // Jan 13 2019
  { startAt: Date.UTC(2019,  0, 18, 0, 0), data: tsBanner_1801 },  // Jan 18 2019
  { startAt: Date.UTC(2019,  0, 19, 0, 0), data: tsBanner_1901 },  // Jan 19 2019
  { startAt: Date.UTC(2019,  0, 23, 0, 0), data: tsBanner_2301 },  // Jan 23 2019
  { startAt: Date.UTC(2019,  0, 24, 0, 0), data: tsBanner_2401 },  // Jan 24 2019
  { startAt: Date.UTC(2019,  0, 26, 0, 0), data: tsBanner_2601 },  // Jan 26 2019
  { startAt: Date.UTC(2019,  0, 30, 0, 0), data: tsBanner_3001 },  // Jan 30 2019
  { startAt: Date.UTC(2019,  1,  1, 0, 0), data: tsBanner_0102 },  // Feb 1 2019
  { startAt: Date.UTC(2019,  1,  5, 0, 0), data: tsBanner_0502 },  // Feb 5 2019
  { startAt: Date.UTC(2019,  1,  8, 0, 0), data: tsBanner_0802 },  // Feb 8 2019
  { startAt: Date.UTC(2019,  1, 13, 0, 0), data: tsBanner_1302 },  // Feb 13 2019
  { startAt: Date.UTC(2019,  1, 14, 0, 0), data: tsBanner_1402 },  // Feb 14 2019
  { startAt: Date.UTC(2019,  1, 16, 0, 0), data: tsBanner_1602 },  // Feb 16 2019
  { startAt: Date.UTC(2019,  1, 19, 0, 0), data: tsBanner_1902 },  // Feb 19 2019
  { startAt: Date.UTC(2019,  1, 22, 0, 0), data: tsBanner_2202 },  // Feb 22 2019
  { startAt: Date.UTC(2019,  1, 23, 0, 0), data: tsBanner_2302 },  // Feb 23 2019
  { startAt: Date.UTC(2019,  2,  1, 0, 0), data: tsBanner_0103 },  // Mar 1 2019
  { startAt: Date.UTC(2019,  2,  7, 0, 0), data: tsBanner_0703 },  // Mar 7 2019
  { startAt: Date.UTC(2019,  2,  8, 0, 0), data: tsBanner_0803 },  // Mar 8 2019
  { startAt: Date.UTC(2019,  2, 14, 0, 0), data: tsBanner_1403 },  // Mar 14 2019
  { startAt: Date.UTC(2019,  2, 16, 0, 0), data: tsBanner_1603 },  // Mar 16 2019
  { startAt: Date.UTC(2019,  2, 19, 0, 0), data: tsBanner_1903 },  // Mar 19 2019
  { startAt: Date.UTC(2019,  2, 21, 0, 0), data: tsBanner_2103 },  // Mar 21 2019
  { startAt: Date.UTC(2019,  2, 26, 0, 0), data: tsBanner_2603 },  // Mar 26 2019
  { startAt: Date.UTC(2019,  2, 30, 0, 0), data: tsBanner_3003 },  // Mar 30 2019
  { startAt: Date.UTC(2019,  2, 31, 0, 0), data: tsBanner_3103 },  // Mar 31 -> Apr 1 08:00
  { startAt: Date.UTC(2019, 3,  1, 8, 0), data: tsBanner_0104 },  // Apr 1  08:00 ->
  { startAt: Date.UTC(2019, 3,  3, 0, 0), data: tsBanner_0304 },  // Apr 3
  { startAt: Date.UTC(2019, 3,  6, 0, 0), data: tsBanner_0604 },  // Apr 6
  { startAt: Date.UTC(2019, 3,  7, 0, 0), data: tsBanner_0704 },  // Apr 7
  { startAt: Date.UTC(2019, 3,  9, 0, 0), data: tsBanner_0904 },  // Apr 9
  { startAt: Date.UTC(2019, 3, 12, 0, 0), data: tsBanner_1204 },  // Apr 12
  { startAt: Date.UTC(2019, 3, 15, 0, 0), data: tsBanner_1504 },  // Apr 15
  { startAt: Date.UTC(2019, 3, 19, 0, 0), data: tsBanner_1904 },  // Apr 19
  { startAt: Date.UTC(2019, 3, 22, 0, 0), data: tsBanner_2204 },  // Apr 22
  { startAt: Date.UTC(2019, 3, 23, 0, 0), data: tsBanner_2304 },  // Apr 23
  { startAt: Date.UTC(2019, 3, 24, 0, 0), data: tsBanner_2404 },  // Apr 24
  { startAt: Date.UTC(2019, 3, 25, 0, 0), data: tsBanner_2504 },  // Apr 25
  { startAt: Date.UTC(2019, 3, 26, 0, 0), data: tsBanner_2604 },  // Apr 26
  { startAt: Date.UTC(2019, 3, 29, 0, 0), data: tsBanner_2904 },  // Apr 29
  { startAt: Date.UTC(2019, 4,  2, 0, 0), data: tsBanner_0205 },  // May 2
  { startAt: Date.UTC(2019, 4,  3, 0, 0), data: tsBanner_0305 },  // May 3
  { startAt: Date.UTC(2019, 4,  9, 0, 0), data: tsBanner_0905 },  // May 9
  { startAt: Date.UTC(2019, 4, 10, 0, 0), data: tsBanner_1005 },  // May 10
  { startAt: Date.UTC(2019, 4, 13, 0, 0), data: tsBanner_1305 },  // May 13
  { startAt: Date.UTC(2019, 4, 15, 0, 0), data: tsBanner_1505 },  // May 15
  { startAt: Date.UTC(2019, 4, 16, 0, 0), data: tsBanner_1605 },  // May 16
  { startAt: Date.UTC(2019, 4, 18, 0, 0), data: tsBanner_1805 },  // May 18
  { startAt: Date.UTC(2019, 4, 20, 0, 0), data: tsBanner_2005 },  // May 20
  { startAt: Date.UTC(2019, 4, 22, 0, 0), data: tsBanner_2205 },  // May 22
  { startAt: Date.UTC(2019, 4, 25, 0, 0), data: tsBanner_2505 },  // May 25
  { startAt: Date.UTC(2019, 5,  1, 0, 0), data: tsBanner_0106 },  // Jun 1
  { startAt: Date.UTC(2019, 5,  3, 0, 0), data: tsBanner_0306 },  // Jun 3
  { startAt: Date.UTC(2019, 5,  6, 0, 0), data: tsBanner_0606 },  // Jun 6
  { startAt: Date.UTC(2019, 5,  9, 0, 0), data: tsBanner_0906 },  // Jun 9
];

const TS_BANNERS_RARE = TS_BANNERS.filter(b => new Set([
  Date.UTC(2019, 2, 31, 0, 0), Date.UTC(2019, 3,  1, 8, 0),
  Date.UTC(2019, 3,  7, 0, 0), Date.UTC(2019, 3, 15, 0, 0),
  Date.UTC(2019, 3, 19, 0, 0), Date.UTC(2019, 3, 24, 0, 0),
  Date.UTC(2019, 3, 29, 0, 0), Date.UTC(2019, 4,  3, 0, 0),
  Date.UTC(2019, 4, 10, 0, 0), Date.UTC(2019, 4, 15, 0, 0),
  Date.UTC(2019, 4, 20, 0, 0), Date.UTC(2019, 4, 25, 0, 0),
  Date.UTC(2019, 5,  1, 0, 0), Date.UTC(2019, 5,  6, 0, 0),
]).has(b.startAt));

// Resolve the T-Series banner active at a given clockTime. Linear scan
// over a short sorted array - at 16 entries this is microseconds per
// call and needs no caching. Before the first banner's startAt we fall
// back to the earliest entry (the stream always has *some* banner).
const resolveTsBanner = (clockTime, banners = TS_BANNERS) => {
  const t = clockTime || 0;
  let chosen = banners[0].data;
  for (const b of banners) {
    if (b.startAt <= t) chosen = b.data;
    else break;
  }
  return chosen;
};


// - DATA UNPACKING -
// H rows store only [t, pt, tt]. Every derived field on a RAW entry
// (ph, th, pd, td, g, opt, ott) is filled in by the derived-fields
// post-pass further down the file, after the audit infrastructure is
// available. See that block for the exact formulas and a description
// of each field.
const unpack = (a) => ({ t:a[0], pt:a[1], tt:a[2] });
const RAW = H.map(unpack);
const HIST_START = 505;  // Mar 22 2AM
const PLAY_START = 743;  // Apr 1 0AM - inflection trigger-search start (semantic), NOT the seek limit
const SEEK_START = 0;    // playhead/slider can scrub back to the true start of the data

const _SS_KEY = 'scenario_state';
let _ssCache = null;
const _loadSS = () => {
  if (_ssCache !== null) return _ssCache;
  try { _ssCache = JSON.parse(localStorage.getItem(_SS_KEY) || '{}'); } catch { _ssCache = {}; }
  return _ssCache;
};
const _saveSS = (d) => {
  _ssCache = Object.assign(_ssCache || {}, d);
  try { localStorage.setItem(_SS_KEY, JSON.stringify(_ssCache)); } catch {}
};

// Auto-reset of the historical sub-gap chart: when the playhead crosses
// April 29 6 PM (timestamp values in this file display as UTC but are
// actually EDT - the constant matches that convention), the SocialBlade
// chart reseeds its start to that boundary so it begins recording from
// then on. HIST_AUTO_RESET_IDX is the matching hourly RAW index, found
// once at module load so the per-render effect just compares.
const HIST_AUTO_RESET_TS = Date.UTC(2019, 3, 29, 18, 0);
const HIST_AUTO_RESET_IDX = (() => {
  for (let i = 0; i < RAW.length; i++) {
    if (RAW[i].t >= HIST_AUTO_RESET_TS) return i;
  }
  return RAW.length - 1;
})();
// SB V2 layout activates at May 20 00:00 UTC; historical charts reset to this boundary.
const SB_V2_TS = Date.UTC(2019, 4, 20, 0, 0);
const SB_V2_MID_TS = Date.UTC(2019, 4, 28, 0, 0);   // May 28 00:00 UTC - prediction switches to TS Pass PDP
const SB_V2_SWITCH_TS = Date.UTC(2019, 5, 8, 2, 0); // June 8 02:00 UTC - order flips to Music/TS/PDP
const HIST_V2_RESET_IDX = (() => {
  for (let i = 0; i < RAW.length; i++) {
    if (RAW[i].t >= SB_V2_TS) return i;
  }
  return RAW.length - 1;
})();

// First hour at which T-Series has BOTH passed 100M subs AND moved into the
// lead (TS > PDP). "T-Series takes the lead" layout switches key off this
// computed hour instead of a hardcoded date, so editing the Scenario CSV moves
// them automatically. Infinity = TS never leads past 100M in the loaded data.
const TS_LEAD_TS = (() => {
  for (let i = 0; i < RAW.length; i++) {
    if (RAW[i].tt >= 100000000 && RAW[i].tt > RAW[i].pt) return RAW[i].t;
  }
  return Infinity;
})();

// First hour at which BOTH channels are past 100M AND PewDiePie's trailing
// 5-day growth is below T-Series' (PDP DECELERATING relative to TS - this is
// NOT the overtake, it is the earlier slowdown). Drives the SB V2 "TS Pass PDP"
// PREDICTION phase (showMidMode), shown before TS actually leads. 5-day lookback
// is time-based (handles any gaps in the hourly grid). Infinity = never.
const TS_SLOWDOWN_TS = (() => {
  const DAY5 = 5 * 86400000;
  for (let i = 0; i < RAW.length; i++) {
    if (RAW[i].pt < 100000000 || RAW[i].tt < 100000000) continue;
    const t0 = RAW[i].t - DAY5;
    let j = i;
    while (j > 0 && RAW[j].t > t0) j--;
    const pdp5d = RAW[i].pt - RAW[j].pt;
    const ts5d  = RAW[i].tt - RAW[j].tt;
    if (pdp5d < ts5d) return RAW[i].t;
  }
  return Infinity;
})();

// First hour each 100M milestone is reached, computed from the data (drives the
// Flare subtitle). Infinity if never reached.
const PDP_100M_TS = (() => {
  for (let i = 0; i < RAW.length; i++) if (RAW[i].pt >= 100000000) return RAW[i].t;
  return Infinity;
})();
const TS_100M_TS = (() => {
  for (let i = 0; i < RAW.length; i++) if (RAW[i].tt >= 100000000) return RAW[i].t;
  return Infinity;
})();
const BOTH_100M_TS = (() => {
  for (let i = 0; i < RAW.length; i++) if (RAW[i].pt >= 100000000 && RAW[i].tt >= 100000000) return RAW[i].t;
  return Infinity;
})();

// - RAW AUDITS: PDP / TS -
// Extracted from PDP Audit / TS Audit columns of PVT_Scenario.xlsx.
// Each entry: [hourEndTs, channel, delta]. Within-hour timestamps are
// generated at module load by _generateAuditPositions (defined above);
// see that block for the generator design and pairing rules.
const RAW_AUDITS_PVT = window.__DATA.audits;

const AUDITS = _generateAuditPositions(RAW_AUDITS_PVT, _AUDIT_RNG_SEED ^ 0xa5a5);


const HOUR_MS = 3600000;
const DAY_MS = 24 * HOUR_MS;

// - REAL DATA MODE -
// Binary file: app/dist/data/every_second_counts_pvt_u32le.bin
// Format: interleaved u32le pairs [pdp, ts, pdp, ts, ...], one pair per second.
// Start: 2018-10-17 00:00:00 EDT (= UTC+4h); end: 2019-05-01 00:00:00 EDT.
// Total pairs: 16,934,401 (indices 0..16,934,400 = 196 days inclusive).
const REAL_DATA_START_MS = Date.UTC(2018, 9, 17, 4, 0, 0); // 2018-10-17 00:00:00 EDT (UTC-4)
const REAL_DATA_PAIR_COUNT = 16934401; // total seconds in the binary (indices 0..16934400)
const REAL_DATA_END_MS = REAL_DATA_START_MS + (REAL_DATA_PAIR_COUNT - 1) * 1000; // 2019-05-01 00:00 EDT

// Patch editor helpers (module-level, no React deps)
// Accepts: raw ms number, "idx:NNNNN" binary index, "YYYY-MM-DD HH:MM:SS [UTC]", or ISO string.
function _parsePatchTime(s) {
  s = (s || '').trim().replace(/\s*UTC$/i, '');
  if (!s) return null;
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  if (/^idx:\d+/i.test(s)) return REAL_DATA_START_MS + parseInt(s.slice(4), 10) * 1000;
  const d = new Date(/^\d{4}-\d{2}-\d{2} /.test(s) ? s.replace(' ', 'T') + 'Z' : s);
  return isNaN(d) ? null : d.getTime();
}
function _mkPatchId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function _fmtPatchMs(ms) {
  return ms ? new Date(ms).toISOString().replace('T', ' ').replace('.000Z', ' UTC') : '?';
}

// PDP has been continuously ahead of TS since before the dataset.
// At dataset start he had been ahead for 1887d 23h 49m 0s, so the implied
// lead-start timestamp is this many ms before REAL_DATA_START_MS.
const PDP_LEAD_SINCE = REAL_DATA_START_MS - (1887 * 86400 + 23 * 3600 + 49 * 60) * 1000;
const REAL_DATA_HOURS = 4704; // 196 days * 24 hours - playhead range in hour units

let _realDataBuf = null;      // Uint32Array once loaded
let _realDataLoading = false;

function _loadRealData(onDone, file = 'every_second_counts_pvt_u32le.bin') {
  if (_realDataLoading) return;
  _realDataLoading = true;
  fetch('/data/' + file)
    .then(r => r.arrayBuffer())
    .then(ab => { _realDataBuf = new Uint32Array(ab); _realDataLoading = false; if (onDone) onDone(); })
    .catch(() => { _realDataLoading = false; if (onDone) onDone(); });
}

function _reloadRealData(file, onDone) {
  _realDataBuf = null;
  _realDataLoading = false;
  _loadRealData(onDone, file);
}

// Returns {pdp, ts} at time t from binary, or null if buffer not loaded / out of range.
function realDataAt(t) {
  if (!_realDataBuf) return null;
  if (t < REAL_DATA_START_MS || t > REAL_DATA_END_MS) return null;
  const idx = Math.max(0, Math.min(REAL_DATA_PAIR_COUNT - 1, Math.floor((t - REAL_DATA_START_MS) / 1000)));
  return { pdp: _realDataBuf[idx * 2], ts: _realDataBuf[idx * 2 + 1] };
}

// Secondary buffer: always the raw (unsmoothed) binary, loaded on demand for delta chart.
let _rawAltBuf = null;
let _rawAltLoading = false;
function _loadRawAlt(onDone) {
  if (_rawAltLoading) return;
  if (_rawAltBuf) { onDone?.(); return; }
  _rawAltLoading = true;
  fetch('/data/every_second_counts_pvt_u32le.raw.bin')
    .then(r => r.arrayBuffer())
    .then(ab => { _rawAltBuf = new Uint32Array(ab); _rawAltLoading = false; onDone?.(); })
    .catch(() => { _rawAltLoading = false; onDone?.(); });
}
function rawAltAt(t) {
  if (!_rawAltBuf) return null;
  if (t < REAL_DATA_START_MS || t > REAL_DATA_END_MS) return null;
  const idx = Math.max(0, Math.min(REAL_DATA_PAIR_COUNT - 1, Math.floor((t - REAL_DATA_START_MS) / 1000)));
  return { pdp: _rawAltBuf[idx * 2], ts: _rawAltBuf[idx * 2 + 1] };
}


// Plain linear interpolation of RAW pt/tt (no noise, no cubic).
const rawLinearAt = (t) => {
  const maxI = RAW.length - 1;
  if (maxI < 0) return null;
  if (t <= RAW[0].t) return [RAW[0].pt, RAW[0].tt];
  if (t >= RAW[maxI].t) return [RAW[maxI].pt, RAW[maxI].tt];
  let lo = 0, hi = maxI;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (RAW[mid].t <= t) lo = mid; else hi = mid;
  }
  const a = RAW[lo], b = RAW[hi];
  const f = (t - a.t) / (b.t - a.t);
  return [a.pt + (b.pt - a.pt) * f, a.tt + (b.tt - a.tt) * f];
};

// Daily-sample interpolation between consecutive [ts, value] points in
// `arr`. Raw timestamps are labeled at UTC midnight of each day, but the
// actual subscriber count was sampled at 23:00 UTC of that day. We
// subtract 23h from the query timestamp before lookup so "what was X
// at real-time T" resolves to the point labeled "day that is T - 23h".
// Returns a monotonic-Hermite rounded integer inside the range, the last
// value past the end, and null before the start or on an empty array.
// Optional third argument: a function `(ts) => value | null` for a
// custom noise sampler; on null the cubic baseline runs as fallback.
const dailyInterp = (arr, ts, noiseOpt = null) => {
  if (typeof noiseOpt === 'function') {
    const v = noiseOpt(ts);
    if (v != null) return Math.round(v);
  }

  ts -= 23 * HOUR_MS;
  const n = arr.length;
  if (n === 0) return null;
  if (ts < arr[0][0]) return null;
  if (ts >= arr[n - 1][0]) return arr[n - 1][1];

  // Binary search for the bracket [lo, lo+1] containing ts.
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (arr[mid][0] <= ts) lo = mid; else hi = mid;
  }
  const a = arr[lo], b = arr[lo + 1];

  // monotonic Hermite needs four anchors. At the array edges the missing
  // outer point degenerates to its inner neighbour, which makes the
  // cubic flatten to linear there - same end-condition the per-channel
  // organic pipeline uses (see getChannelOrganicAtCubic).
  const p0 = arr[lo - 1] ? arr[lo - 1][1] : a[1];
  const p1 = a[1];
  const p2 = b[1];
  const p3 = arr[lo + 2] ? arr[lo + 2][1] : b[1];

  const f = (ts - a[0]) / (b[0] - a[0]);
  return Math.round(monoHermite(p0, p1, p2, p3, f));
};

// - FORMATTING -
const clean = (n) => (n == null ? null : Object.is(n, -0) ? 0 : n);
const fmt = (n, mode = "auto") => {
  const v = clean(n);
  if (v == null) return "\u2014";
  switch (mode) {
    case "subs": return (v / 1e6).toFixed(2) + "M";
    case "full": { const r = Math.round(v); return (r >= 0 ? "+" : "") + r.toLocaleString(); }
    case "signed": { const r = Math.round(v); return (r >= 0 ? "+" : "") + fmtAuto(r); }
    default: return fmtAuto(v);
  }
};
const fmtAuto = (v) => {
  const a = Math.abs(v);
  if (a >= 1e6) return (Math.trunc(v / 10000) / 100).toFixed(2) + "M";
  if (a >= 1e3) return (Math.trunc(v / 10) / 100).toFixed(2) + "K";
  return Math.round(v).toLocaleString();
};
const fmtDate = (ts) => new Date(ts).toLocaleDateString("en-US",{timeZone:"UTC",month:"short",day:"numeric"});
const fmtDateTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US",{timeZone:"America/New_York",month:"short",day:"numeric"})+" "+
    d.toLocaleTimeString("en-US",{timeZone:"America/New_York",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false})+" ET";
};

const fmtDateTimeLocalET = (ts) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone:"America/New_York", year:"numeric", month:"2-digit", day:"2-digit",
    hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false
  }).formatToParts(new Date(ts));
  const g = t => parts.find(p=>p.type===t).value;
  return `${g("year")}-${g("month")}-${g("day")}T${g("hour")}:${g("minute")}:${g("second")}`;
};
const parseDateTimeLocalET = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(s||"");
  if (!m) return null;
  const base = Date.UTC(+m[1], +m[2]-1, +m[3], +m[4], +m[5], m[6]?+m[6]:0);
  for (const off of [-4, -5]) {
    const utc = base - off * 3600000;
    const p = new Intl.DateTimeFormat("en-US", {timeZone:"America/New_York", hour:"numeric", minute:"numeric", hour12:false}).formatToParts(new Date(utc));
    if (+p.find(x=>x.type==="hour").value === +m[4] && +p.find(x=>x.type==="minute").value === +m[5]) return utc;
  }
  return base + 5*3600000;
};
const fmtSBTime = (ts, offsetHours) => {
  const d = new Date(ts + offsetHours * 3600000);
  const h = d.getUTCHours(), min = d.getUTCMinutes(),
        m = String(min).padStart(2,"0"), s = String(d.getUTCSeconds()).padStart(2,"0");
  const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getUTCDay()];
  if (h === 12 && min === 0) return `${day} 12:00:${s} Noon`;
  if (h === 0  && min === 0) return `${day} 12:00:${s} Midnight`;
  const ap = h >= 12 ? "pm" : "am", h12 = h % 12 || 12;
  return `${day} ${h12}:${m}:${s} ${ap}`;
};
const _nthSunday = (year, month0, n) => {
  const dow = new Date(Date.UTC(year, month0, 1)).getUTCDay();
  return 1 + ((7 - dow) % 7) + (n - 1) * 7;
};
const _lastSunday = (year, month0) => {
  const last = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  return last - new Date(Date.UTC(year, month0, last)).getUTCDay();
};
const _getEasternOffset = (ts) => {
  const y = new Date(ts).getUTCFullYear();
  const dstOn  = Date.UTC(y, 2,  _nthSunday(y, 2,  2), 7, 0, 0);
  const dstOff = Date.UTC(y, 10, _nthSunday(y, 10, 1), 6, 0, 0);
  return (ts >= dstOn && ts < dstOff) ? -4 : -5;
};
const _getUKOffset = (ts) => {
  const y = new Date(ts).getUTCFullYear();
  const bstOn  = Date.UTC(y, 2, _lastSunday(y, 2), 1, 0, 0);
  const bstOff = Date.UTC(y, 9, _lastSunday(y, 9), 1, 0, 0);
  return (ts >= bstOn && ts < bstOff) ? 1 : 0;
};

// - CHART HELPERS (ported from old dashboard) -
// All tick generators and formatters work in Eastern Time (ET), same as the Raleigh display.
// Strategy: shift ts into ET-local space (ts + etOff*ms), use UTC arithmetic there, then
// unshift back. etOff is recomputed each iteration so DST transitions mid-range are handled.
const getMidnights = (tMin, tMax) => {
  let etOff = _getEasternOffset(tMin) * 3600000;
  const d = new Date(tMin + etOff);
  d.setUTCHours(0, 0, 0, 0);
  if (d.getTime() < tMin + etOff) d.setUTCDate(d.getUTCDate() + 1);
  const ticks = [];
  while (true) {
    const tEt = d.getTime();
    const realT = tEt - _getEasternOffset(tEt - etOff) * 3600000;
    if (realT > tMax) break;
    ticks.push(realT);
    etOff = _getEasternOffset(realT) * 3600000;
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return ticks;
};

const get6HourTicks = (tMin, tMax) => {
  let etOff = _getEasternOffset(tMin) * 3600000;
  const d = new Date(tMin + etOff);
  d.setUTCHours(Math.ceil(d.getUTCHours() / 6) * 6, 0, 0, 0);
  if (d.getTime() < tMin + etOff) d.setUTCHours(d.getUTCHours() + 6);
  const ticks = [];
  while (true) {
    const tEt = d.getTime();
    const realT = tEt - _getEasternOffset(tEt - etOff) * 3600000;
    if (realT > tMax) break;
    ticks.push(realT);
    etOff = _getEasternOffset(realT) * 3600000;
    d.setUTCHours(d.getUTCHours() + 6);
  }
  return ticks;
};

const get15MinTicks = (tMin, tMax) => {
  const d = new Date(tMin);
  const m = d.getUTCMinutes();
  d.setUTCMinutes(Math.ceil(m / 15) * 15, 0, 0);
  if (d.getTime() <= tMin) d.setUTCMinutes(d.getUTCMinutes() + 15);
  const ticks = [];
  while (d.getTime() <= tMax) { ticks.push(d.getTime()); d.setUTCMinutes(d.getUTCMinutes() + 15); }
  return ticks;
};

// Adaptive date ticks: picks interval to show ~4-8 ticks regardless of data span
const getAdaptiveDateTicks = (tMin, tMax) => {
  const spanMs = tMax - tMin;
  const spanHours = spanMs / HOUR_MS;
  const spanDays = spanMs / DAY_MS;
  const ticks = [];
  let etOff = _getEasternOffset(tMin) * 3600000;
  const d = new Date(tMin + etOff);

  if (spanHours <= 3) {
    // Every 30 min - minute marks are timezone-invariant; offset stays constant over 3h
    d.setUTCMinutes(Math.ceil(d.getUTCMinutes() / 30) * 30, 0, 0);
    while (d.getTime() - etOff <= tMax) { ticks.push(d.getTime() - etOff); d.setUTCMinutes(d.getUTCMinutes() + 30); }
  } else if (spanHours <= 12) {
    // Every 2 hours in ET
    d.setUTCMinutes(0, 0, 0);
    d.setUTCHours(Math.ceil(d.getUTCHours() / 2) * 2);
    while (true) {
      const tEt = d.getTime();
      const realT = tEt - _getEasternOffset(tEt - etOff) * 3600000;
      if (realT > tMax) break;
      ticks.push(realT);
      etOff = _getEasternOffset(realT) * 3600000;
      d.setUTCHours(d.getUTCHours() + 2);
    }
  } else if (spanHours <= 48) {
    // Every 6 hours in ET
    d.setUTCMinutes(0, 0, 0);
    d.setUTCHours(Math.ceil(d.getUTCHours() / 6) * 6);
    while (true) {
      const tEt = d.getTime();
      const realT = tEt - _getEasternOffset(tEt - etOff) * 3600000;
      if (realT > tMax) break;
      ticks.push(realT);
      etOff = _getEasternOffset(realT) * 3600000;
      d.setUTCHours(d.getUTCHours() + 6);
    }
  } else {
    // ET day boundaries
    const interval = spanDays <= 9 ? 1 : spanDays <= 18 ? 2 : spanDays <= 36 ? 4 : spanDays <= 63 ? 7 : 14;
    d.setUTCHours(0, 0, 0, 0);
    if (d.getTime() < tMin + etOff) d.setUTCDate(d.getUTCDate() + 1);
    // Snap to a fixed anchor grid so the even/odd day pattern never shifts
    // as the view window moves. Anchor: 2018-10-17 in ET-day space (day 0).
    if (interval > 1) {
      const REF = Date.UTC(2018, 9, 17);
      const rem = ((Math.round((d.getTime() - REF) / DAY_MS) % interval) + interval) % interval;
      if (rem !== 0) d.setUTCDate(d.getUTCDate() + (interval - rem));
    }
    while (true) {
      const tEt = d.getTime();
      const realT = tEt - _getEasternOffset(tEt - etOff) * 3600000;
      if (realT > tMax) break;
      ticks.push(realT);
      etOff = _getEasternOffset(realT) * 3600000;
      d.setUTCDate(d.getUTCDate() + interval);
    }
  }
  return ticks;
};

// Y-axis domain that snaps to round boundaries with headroom.
// E.g. data range -90k to +200k -> domain [-150k, +250k]


// Cubic Hermite interpolation, monotonicity-preserving (Fritsch-Carlson).
// Same signature as the prior Catmull-Rom implementation that this kernel
// replaced: p0/p1/p2/p3 are samples at unit-spaced knots (−1, 0, 1, 2),
// t ∈ [0,1] returns the interpolated value on the interval [p1, p2].
// Unlike standard Catmull-Rom, this CANNOT overshoot the bracketing values
// when the four-point pattern is monotonic - the interpolant stays within
// the natural bounds of the segment, which matters for any sequence
// representing a strictly-non-decreasing quantity (cumulative subscriber
// counts).
//
// Algorithm:
//   1. Compute the three secant slopes (dL, dM, dR) between successive
//      knots.
//   2. Estimate tangents m1, m2 at the bracketing knots as the mean of
//      adjacent secants (centred-difference). If a knot is a local
//      extremum (sign change between adjacent secants), force its
//      tangent to zero - Fritsch-Carlson initial monotonicity step.
//   3. Apply the Fritsch-Carlson sufficiency check: if α²+β² > 9 with
//      α=m1/dM, β=m2/dM, scale both tangents by τ = 3/√(α²+β²). This
//      bounds the cubic so it stays monotone on [p1, p2].
//   4. Evaluate the standard cubic Hermite basis.
const _monoTangents = (p0, p1, p2, p3) => {
  const dL = p1 - p0;
  const dM = p2 - p1;
  const dR = p3 - p2;
  if (dM === 0) return [0, 0, 0];
  let m1 = 0.5 * (dL + dM);
  let m2 = 0.5 * (dM + dR);
  if (dL * dM <= 0) m1 = 0;
  if (dM * dR <= 0) m2 = 0;
  const a = m1 / dM, b = m2 / dM;
  const ssq = a*a + b*b;
  if (ssq > 9) {
    const tau = 3 / Math.sqrt(ssq);
    m1 = tau * a * dM;
    m2 = tau * b * dM;
  }
  return [m1, m2, dM];
};

// Local (independent) Steffen tangent at a knot given its left- and right-delta.
// Purely local - no cross-segment coupling - so the tangent at knot k is
// identical whether it serves as m2 of segment [k-1,k] or m1 of segment [k,k+1].
// This guarantees C1 continuity at every knot boundary.
// Bounds: |m| <= 2*min(|dL|,|dR|,|p|/2) where p=(dL+dR)/2 - prevents overshoot.
// Build a Float64Array of per-knot tangents using Akima spline formula.
// Uses 4-slope neighbourhood; smoother derivative graph than Steffen near sharp jumps.
const _buildTangents = (arr, key, fcLimit = false) => {
  const n = arr.length;
  const m = new Float64Array(n);
  if (n < 2) return m;
  const ns = n - 1;
  // ext[2..ns+1] = s[0..ns-1]; two phantom slopes on each end via linear extrapolation
  const ext = new Float64Array(ns + 4);
  for (let i = 0; i < ns; i++) {
    const vi = arr[i][key], vr = arr[i + 1][key];
    ext[i + 2] = (vi != null && vr != null) ? vr - vi : 0;
  }
  ext[1] = 2*ext[2] - (ns > 1 ? ext[3] : ext[2]);
  ext[0] = 2*ext[1] - ext[2];
  ext[ns + 2] = 2*ext[ns + 1] - (ns > 1 ? ext[ns] : ext[ns + 1]);
  ext[ns + 3] = 2*ext[ns + 2] - ext[ns + 1];
  for (let k = 0; k < n; k++) {
    if (arr[k][key] == null) continue;
    const sm2 = ext[k], sm1 = ext[k + 1], s0 = ext[k + 2], sp1 = ext[k + 3];
    const w1 = Math.abs(sp1 - s0), w2 = Math.abs(sm1 - sm2);
    m[k] = (w1 + w2 < 1e-10) ? 0.5 * (sm1 + s0) : (w1 * sm1 + w2 * s0) / (w1 + w2);
  }
  // Per-knot Fritsch-Carlson limiting (cumulative series only). Akima can hand a
  // near-flat segment tangents the size of its STEEP neighbour's slope (when the
  // two slopes before a knot are equal, their variation w2=0 and the knot tangent
  // becomes entirely the incoming slope). The per-segment clamp in
  // _monotoneHermiteFromTangents then rescaled that tangent inside the flat
  // segment only, while the steep segment kept the raw value - a C1 break at the
  // shared anchor (visible seam) plus a surge-stall-surge shape inside the flat
  // hour. Limiting HERE, against BOTH adjacent secants, gives every segment the
  // SAME tangent at a shared knot: tangent 0 at local extrema / sign changes,
  // magnitude <= 3x the smaller adjacent secant otherwise. Normal knots (tangent
  // already within both secants) are untouched.
  if (fcLimit) {
    for (let k = 0; k < n; k++) {
      const sL = k > 0  ? ext[k + 1] : null;   // secant of [k-1, k]
      const sR = k < ns ? ext[k + 2] : null;   // secant of [k, k+1]
      if (sL != null && sR != null) {
        if (sL * sR <= 0) { m[k] = 0; continue; }
        if (m[k] * sL < 0) { m[k] = 0; continue; }
        // Cap at 2x (not the classic 3x): worst case both segment ends at 2x
        // gives a^2+b^2 = 8 < 9, so the per-segment circle clamp in
        // _monotoneHermiteFromTangents NEVER fires and C1 holds exactly.
        const cap = 2 * Math.min(Math.abs(sL), Math.abs(sR));
        if (Math.abs(m[k]) > cap) m[k] = (m[k] < 0 ? -1 : 1) * cap;
      } else {
        const s = sL != null ? sL : sR;
        if (s == null || s === 0 || m[k] * s < 0) { m[k] = 0; continue; }
        const cap = 2 * Math.abs(s);
        if (Math.abs(m[k]) > cap) m[k] = (m[k] < 0 ? -1 : 1) * cap;
      }
    }
  }
  return m;
};

// Cubic Hermite evaluator given endpoints and precomputed tangents.
const _hermite = (y0, y1, m0, m1, f) => {
  const f2 = f * f, f3 = f2 * f;
  return (2*f3 - 3*f2 + 1)*y0 + (f3 - 2*f2 + f)*m0 + (-2*f3 + 3*f2)*y1 + (f3 - f2)*m1;
};

// Akima supplies smooth per-knot tangents, but a steep-flat-steep pattern can
// give segment tangents many times larger than the segment chord. Project the
// pair into the Fritsch-Carlson monotone region only when needed: normalized
// tangents must be non-negative and alpha^2 + beta^2 <= 9. Segments already
// inside that region evaluate exactly as raw Akima.
const _monotoneHermiteFromTangents = (y0, y1, m0, m1, f) => {
  const d = y1 - y0;
  if (d === 0) return y0;
  let t0 = m0, t1 = m1;
  if (t0 * d < 0) t0 = 0;
  if (t1 * d < 0) t1 = 0;
  const a = t0 / d, b = t1 / d;
  const ssq = a*a + b*b;
  if (ssq > 9) {
    const tau = 3 / Math.sqrt(ssq);
    t0 *= tau;
    t1 *= tau;
  }
  return _hermite(y0, y1, t0, t1, f);
};

const lerp = (a, b, f) => a + (b - a) * f;
const monoHermite = (p0, p1, p2, p3, t) => {
  const [m1, m2, dM] = _monoTangents(p0, p1, p2, p3);
  if (dM === 0) return p1;
  const t2 = t*t, t3 = t2*t;
  const h00 =  2*t3 - 3*t2 + 1;
  const h10 =      t3 - 2*t2 + t;
  const h01 = -2*t3 + 3*t2;
  const h11 =      t3 -    t2;
  return h00*p1 + h10*m1 + h01*p2 + h11*m2;
};
const monoHermiteDeriv = (p0, p1, p2, p3, t) => {
  const [m1, m2, dM] = _monoTangents(p0, p1, p2, p3);
  if (dM === 0) return 0;
  const t2 = t*t;
  const h00d =  6*t2 - 6*t;
  const h10d =  3*t2 - 4*t + 1;
  const h01d = -6*t2 + 6*t;
  const h11d =  3*t2 - 2*t;
  return h00d*p1 + h10d*m1 + h01d*p2 + h11d*m2;
};

//  AUDIT INFRASTRUCTURE
// Precompute cumulative audit sums for O(log n) lookup at any timestamp.
// The getCumAudit dispatcher reads from CUM_AUDIT_BY_CH.
const AUDIT_SORTED_P = [];
const AUDIT_SORTED_T = [];
(() => {
  let cumP = 0, cumT = 0;
  const all = AUDITS.map(a => ({idx:a[0], ch:a[1], delta:a[2], ts:a[3]})).sort((a,b) => a.ts - b.ts);
  for (const a of all) {
    if (a.ch === "pdp") { cumP += a.delta; AUDIT_SORTED_P.push({ts:a.ts, cum:cumP, delta:a.delta}); }
    else { cumT += a.delta; AUDIT_SORTED_T.push({ts:a.ts, cum:cumT, delta:a.delta}); }
  }
})();

const CUM_AUDIT_BY_CH = {
  pdp:  AUDIT_SORTED_P,
  ts:   AUDIT_SORTED_T,
};

const getCumAudit = (t, ch) => {
  const arr = CUM_AUDIT_BY_CH[ch];
  if (!arr || !arr.length || t < arr[0].ts) return 0;
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) { const mid = (lo+hi+1)>>1; if (arr[mid].ts <= t) lo = mid; else hi = mid-1; }
  return arr[lo].ts <= t ? arr[lo].cum : 0;
};

// Real-data daily SB/FTV: each labeled date's snapshot is at 23:00 ET.
// 23:00 EDT (UTC-4) = labeled midnight UTC + 27h.
// 23:00 EST (UTC-5) = labeled midnight UTC + 28h.
// Exact DST switch times (UTC):
//   Fall back  2018: Nov 4  02:00 AM EDT = 2018-11-04 06:00 UTC
//   Spring fwd 2019: Mar 10 02:00 AM EST = 2019-03-10 07:00 UTC
// Classification: compare the tentative 23:00 EDT snapshot time against the
// exact switch times. If it falls in [fall-back, spring-forward) -> EST.
const _DST_FALL_BACK_2018  = Date.UTC(2018, 10, 4, 6, 0, 0);
const _DST_SPRING_FWD_2019 = Date.UTC(2019,  2, 10, 7, 0, 0);
const _wrapDailyRealForNoise = (arr) => arr.map(a => {
  const tentative = a[0] + 27 * HOUR_MS; // tentative 23:00 EDT in UTC
  const isEST = tentative >= _DST_FALL_BACK_2018 && tentative < _DST_SPRING_FWD_2019;
  return { t: a[0] + (isEST ? 28 : 27) * HOUR_MS, v: a[1] };
});
const SBD_REAL_RAW  = _wrapDailyRealForNoise(SBD_REAL);
const FTVD_REAL_RAW = _wrapDailyRealForNoise(FTVD_REAL);

// - DERIVED-FIELDS POST-PASS -
// Every non-stored field on every channel's RAW row is computed here,
// once, at module load. Each definition is a pure function of (stored
// fields, audit history), so editing the source data and reloading
// produces a consistent view with no stale derived state to update by
// hand.
//
// PDP/TS dual channel (RAW). Stored: t, pt, tt. Derived:
//   ph[i]  = pt[i] - pt[i-1]              PDP hourly delta.
//   th[i]  = tt[i] - tt[i-1]              TS  hourly delta.
//   pd[i]  = pt[i] - pt[i-24]             PDP 24-hour delta (daily).
//   td[i]  = tt[i] - tt[i-24]             TS  24-hour delta.
//   g[i]   = pt[i] - tt[i]                PDP-vs-TS gap.
//   opt[i] = pt[i] - cumAudit(t[i],'pdp') Organic PDP (audits removed).
//   ott[i] = tt[i] - cumAudit(t[i],'ts')  Organic TS.
// Warm-up: ph/th/pd/td/g are null for i < 24, matching the source-data
// convention. Downstream (interpolate) handles null gracefully.
//
// SBD_REAL_RAW / FTVD_REAL_RAW daily-resolution channels. Stored:
// t, v (rows are 1 day apart). Derived:
//   vd[i]  = v[i] - v[i-1]               1-day delta (consecutive row).
//   vw[i]  = v[i] - v[i-7]               7-day delta.
//   opt[i] = v[i]                        No audits exist for these.
// Warm-up: vd null for i < 1, vw null for i < 7.

// PDP/TS dual channel.
for (let i = 0; i < RAW.length; i++) {
  const r = RAW[i];
  r.opt = r.pt - getCumAudit(r.t, 'pdp');
  r.ott = r.tt - getCumAudit(r.t, 'ts');
  if (i >= 24) {
    r.ph = r.pt - RAW[i-1].pt;
    r.th = r.tt - RAW[i-1].tt;
    r.pd = r.pt - RAW[i-24].pt;
    r.td = r.tt - RAW[i-24].tt;
    r.g  = r.pt - r.tt;
  } else {
    r.ph = null; r.th = null; r.pd = null; r.td = null; r.g = null;
  }
}

// Daily channels (rows 1 day apart).
const _deriveDailyChannel = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const r = arr[i];
    r.opt = r.v;                                   // audit-free.
    r.vd  = i >= 1 ? r.v - arr[i-1].v : null;      // 1-day delta.
    r.vw  = i >= 7 ? r.v - arr[i-7].v : null;      // 7-day delta.
  }
};
_deriveDailyChannel(SBD_REAL_RAW);
_deriveDailyChannel(FTVD_REAL_RAW);

// Precomputed per-knot tangent arrays - one entry per RAW row per key.
// Built once here; consumed by interpolate(), getOrganicAt(), etc.
// Using _buildTangents (Akima formula) for C1 continuity with smoother derivatives:
// the tangent at any knot is identical regardless of which segment uses it.
const RAW_T = Object.fromEntries(
  // opt/ott (cumulative) get per-knot FC limiting; the rate/delta series keep raw Akima.
  ['opt','ott','ph','th','pd','td'].map(k => [k, _buildTangents(RAW, k, k === 'opt' || k === 'ott')])
);

// Per-channel tangent arrays for the 'opt' field used in getChannelOrganicAt.
const CHANNEL_OPT_T = {
  pdp:      RAW_T.opt,
  ts:       RAW_T.ott,
  sb_real:  _buildTangents(SBD_REAL_RAW,  'opt', true),
  ftv_real: _buildTangents(FTVD_REAL_RAW, 'opt', true),
};

// Dispatcher: channel key -> its RAW array + the property holding
// organic counts. The daily channels (sb_real, ftv_real) participate in the
// same noise pipeline as the hourly ones (pdp, ts); the only differences are
// array length and bracket duration (24h vs 1h), both handled via b.t - a.t.
const CHANNEL_SOURCE = {
  pdp:      { raw: RAW,            field: "opt" },
  ts:       { raw: RAW,            field: "ott" },
  sb_real:  { raw: SBD_REAL_RAW,  field: "opt" },
  ftv_real: { raw: FTVD_REAL_RAW, field: "opt" },
};


// Interpolated organic value for any channel at timestamp t. Monotonic Hermite
// between adjacent hourly samples, clamp at endpoints, 0 if missing.
const getChannelOrganicAt = (t, ch) => {
  const src = CHANNEL_SOURCE[ch];
  if (!src || !src.raw || !src.raw.length) return 0;
  const arr = src.raw, fld = src.field;
  const tangents = CHANNEL_OPT_T[ch];
  const maxI = arr.length - 1;
  if (t <= arr[0].t) return arr[0][fld];
  if (t >= arr[maxI].t) return arr[maxI][fld];
  let lo = 0, hi = maxI;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (arr[mid].t <= t) lo = mid; else hi = mid;
  }
  const frac = (t - arr[lo].t) / (arr[hi].t - arr[lo].t);
  return _monotoneHermiteFromTangents(arr[lo][fld], arr[hi][fld], tangents[lo], tangents[hi], frac);
};

// Cubic monotonic Hermite interpolation of a channel's hourly organic samples.
// Mirrors the cubic baseline used by pdp/ts via _baselineCumAt.
// End anchors fall back to linear (no neighbour for the cubic
// term). Returns null when the channel has no data, otherwise the
// interpolated organic value at t (audits are NOT added - caller adds them).
const getChannelOrganicAtCubic = (t, ch) => {
  const src = CHANNEL_SOURCE[ch];
  if (!src || !src.raw || !src.raw.length) return null;
  const arr = src.raw, fld = src.field;
  const tangents = CHANNEL_OPT_T[ch];
  const maxI = arr.length - 1;
  if (t <= arr[0].t)    return arr[0][fld];
  if (t >= arr[maxI].t) return arr[maxI][fld];
  let lo = 0, hi = maxI;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (arr[mid].t <= t) lo = mid; else hi = mid;
  }
  const frac = (t - arr[lo].t) / (arr[hi].t - arr[lo].t);
  return _monotoneHermiteFromTangents(arr[lo][fld], arr[hi][fld], tangents[lo], tangents[hi], frac);
};

const getOrganicAt = (ts) => {
  const maxI = RAW.length - 1;
  for (let i = 1; i <= maxI; i++) {
    if (RAW[i].t >= ts) {
      const lo = i - 1;
      const f = (ts - RAW[lo].t) / (RAW[i].t - RAW[lo].t);
      return {
        opt: _monotoneHermiteFromTangents(RAW[lo].opt, RAW[i].opt, RAW_T.opt[lo], RAW_T.opt[i], f),
        ott: _monotoneHermiteFromTangents(RAW[lo].ott, RAW[i].ott, RAW_T.ott[lo], RAW_T.ott[i], f),
      };
    }
  }
  if (RAW.length > 0) return { opt: RAW[maxI].opt, ott: RAW[maxI].ott };
  return { opt: 0, ott: 0 };
};

const ALL_AUDIT_TS = AUDITS.map(a => a[3]).sort((a,b) => a - b);
const AUDIT_BY_TS = {};
for (const a of AUDITS) {
  if (!AUDIT_BY_TS[a[3]]) AUDIT_BY_TS[a[3]] = [];
  AUDIT_BY_TS[a[3]].push({ch:a[1], delta:a[2]});
}

const injectAuditBreakpoints = (data) => {
  if (!data.length) return data;
  const tMin = data[0].t, tMax = data[data.length-1].t;
  const relevantAudits = ALL_AUDIT_TS.filter(ts => ts > tMin && ts < tMax);
  if (!relevantAudits.length) return data;

  const maxI = RAW.length - 1;
  const result = [...data];
  for (const ats of relevantAudits) {
    // Use interpolate() (monotonic Hermite) for organic values so breakpoints
    // sit on the same curve as the surrounding densify points.
    const posBefore = tsToPos(ats - 2000);
    const posAfter  = tsToPos(ats + 2000);
    const idxB = Math.min(Math.floor(posBefore), maxI - 1);
    const fB   = posBefore - idxB;
    const idxA = Math.min(Math.floor(posAfter), maxI - 1);
    const fA   = posAfter - idxA;
    const orgBefore = (fB > 0.001 && idxB < maxI) ? interpolate(idxB, fB) : RAW[idxB];
    const orgAfter  = (fA > 0.001 && idxA < maxI) ? interpolate(idxA, fA) : RAW[idxA];

    const cumPBefore = getCumAudit(ats - 1, "pdp");
    const cumTBefore = getCumAudit(ats - 1, "ts");
    const cumPAfter  = getCumAudit(ats, "pdp");
    const cumTAfter  = getCumAudit(ats, "ts");

    const ptBefore = Math.round((orgBefore.opt ?? 0) + cumPBefore);
    const ttBefore = Math.round((orgBefore.ott ?? 0) + cumTBefore);
    const ptAfter  = Math.round((orgAfter.opt ?? 0) + cumPAfter);
    const ttAfter  = Math.round((orgAfter.ott ?? 0) + cumTAfter);

    result.push({ t: ats - 2000, pt: ptBefore, tt: ttBefore, g: ptBefore - ttBefore });
    result.push({ t: ats + 2000, pt: ptAfter,  tt: ttAfter,  g: ptAfter  - ttAfter  });
  }
  result.sort((a,b) => a.t - b.t);
  return result;
};

// Real Data mode counterpart: inserts +-2s markers at each REAL_AUDITS timestamp
// within the data window. Values come from the binary so no Alt audit maths needed.
const injectRdAuditBreakpoints = (data) => {
  if (!data.length || !REAL_AUDITS_MAJOR.length) return data;
  const tMin = data[0].t, tMax = data[data.length - 1].t;
  const relevant = REAL_AUDITS_MAJOR.filter(a => a.ms > tMin && a.ms < tMax);
  if (!relevant.length) return data;
  const result = [...data];
  for (const a of relevant) {
    for (const dt of [-2000, 2000]) {
      const t = a.ms + dt;
      const rd = realDataAt(t);
      if (rd) result.push({ t, pt: rd.pdp, tt: rd.ts, g: rd.pdp - rd.ts });
    }
  }
  result.sort((a, b) => a.t - b.t);
  return result;
};

// Convert timestamp to fractional RAW index position
const tsToPos = (ts) => {
  if (!RAW.length) return (ts - REAL_DATA_START_MS) / HOUR_MS;
  if (ts <= RAW[0].t) return 0;
  const maxI = RAW.length - 1;
  if (ts >= RAW[maxI].t) return maxI;
  let lo = 0, hi = maxI;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (RAW[mid].t <= ts) lo = mid; else hi = mid;
  }
  return lo + (ts - RAW[lo].t) / (RAW[hi].t - RAW[lo].t);
};

// Generate counter-accurate chart data at per-minute resolution.
// Steps through index-space at 1/60 increments (= 1 data-minute),
// calling interpolate() at each step - same path as live counters.
const densify = (tStart, tEnd, stepFrac) => {
  const maxI = RAW.length - 1;
  const posStart = tsToPos(tStart);
  const posEnd = tsToPos(tEnd);
  const result = [];
  // Start one step before the visible range so there's a data point just
  // off-screen left. Recharts clips at the XAxis domain via allowDataOverflow,
  // so the line segment crossing the left boundary slides smoothly.
  // No extension on the right - curPoint is appended by callers, and a future
  // point would leak upcoming audit drops into the visible line.
  const loopStart = Math.max(0, posStart - stepFrac);
  for (let p = loopStart; p <= posEnd + 0.0001; p += stepFrac) {
    const clamped = Math.min(p, maxI);
    const idx = Math.min(Math.floor(clamped), maxI - 1);
    const f = clamped - idx;
    if (idx < 0) continue;
    const pt = (f > 0.001 && idx < maxI) ? interpolate(idx, f) : RAW[idx];
    if (pt && pt.pt != null) result.push(pt);
  }
  return result;
};

const interpolate = (idx, f) => {
  const maxI = RAW.length - 1;
  const ib = Math.min(idx + 1, maxI);
  const a = RAW[idx], b = RAW[ib];
  if (!a || !b) return a || b;
  const out = { t: Math.round(lerp(a.t, b.t, f)) };
  for (const k of ["opt","ott","ph","th","pd","td"]) {
    if (a[k] != null && b[k] != null)
      out[k] = (k === "opt" || k === "ott")
        ? Math.round(_monotoneHermiteFromTangents(a[k], b[k], RAW_T[k][idx], RAW_T[k][ib], f))
        : Math.round(_hermite(a[k], b[k], RAW_T[k][idx], RAW_T[k][ib], f));
    else out[k] = a[k];
  }
  out.pt = (out.opt ?? 0) + getCumAudit(out.t, "pdp");
  out.tt = (out.ott ?? 0) + getCumAudit(out.t, "ts");
  out.g = out.pt - out.tt;
  return out;
};

const getMomentaryRate = (pos, key) => {
  const maxI = RAW.length - 1;
  if (maxI < 0) return null;
  const idx = Math.floor(pos);
  const f = pos - idx;
  const dk = key === "pt" ? "ph" : "th";
  const i1 = Math.min(idx + 1, maxI);
  const i2 = Math.min(idx + 2, maxI);
  const d1 = RAW[i1][dk], d2 = RAW[i2][dk];
  if (d1 == null || d2 == null) return null;
  return Math.round(_hermite(d1, d2, RAW_T[dk][i1], RAW_T[dk][i2], f) / 60);
};

const getOrganicRate = (pos, key) => {
  // Derivative on organic series (smooth, no audits) - used for RT tick generation
  const orgKey = key === "pt" ? "opt" : key === "tt" ? "ott" : key;
  const maxI = RAW.length - 1;
  const idx = Math.max(0, Math.min(Math.floor(pos), maxI - 1));
  const f = pos - idx;
  const a = RAW[idx], b = RAW[idx+1];
  if (!a || !b || a[orgKey]==null || b[orgKey]==null) return null;
  const i0 = Math.max(0,idx-1), i3 = Math.min(maxI,idx+2);
  return Math.round(monoHermiteDeriv(RAW[i0][orgKey]??a[orgKey], a[orgKey], b[orgKey], RAW[i3][orgKey]??b[orgKey], f) / 60);
};

const getSplineHourly = (pos, key) => {
  if (pos < 1) return null;
  const maxI = RAW.length - 1;
  const tangents = RAW_T[key];
  if (!tangents) return null;
  const getVal = (p) => {
    const i = Math.max(0, Math.min(Math.floor(p), maxI - 1));
    const f = p - i;
    const a = RAW[i], b = RAW[i + 1];
    if (!a || !b || a[key] == null || b[key] == null) return null;
    return (key === "opt" || key === "ott")
      ? _monotoneHermiteFromTangents(a[key], b[key], tangents[i], tangents[i + 1], f)
      : _hermite(a[key], b[key], tangents[i], tangents[i + 1], f);
  };
  const now = getVal(pos), prev = getVal(pos - 1);
  return now != null && prev != null ? Math.round(now - prev) : null;
};


// Channel-agnostic subs/min lookback. Works for any channel registered
// in CHANNEL_SOURCE. Uses channelNoisyValueAt
// when periodSec is provided (RT modes), otherwise the smooth organic
// baseline via getChannelOrganicAt. In both branches getCumAudit is
// added so the rate reflects audited deltas. Returns null when either
// the current or lookback timestamp is outside the channel's data
// window.
const getChannelSubsPerMin = (t, ch, lookbackHours, periodSec, sampler) => {
  const src = CHANNEL_SOURCE[ch];
  if (!src || !src.raw || !src.raw.length) return null;
  const tMin = src.raw[0].t;
  const tMax = src.raw[src.raw.length - 1].t;
  const t1 = t;
  const t0 = t - lookbackHours * HOUR_MS;
  if (t0 < tMin || t1 > tMax) return null;
  let v1, v0;
  if (periodSec != null) {
    const chSampler = sampler || channelNoisyValueAt;
    v1 = chSampler(ch, periodSec, t1);
    v0 = chSampler(ch, periodSec, t0);
  } else {
    v1 = getChannelOrganicAt(t1, ch);
    v0 = getChannelOrganicAt(t0, ch);
  }
  if (v1 == null || v0 == null) return null;
  return ((v1 + getCumAudit(t1, ch)) - (v0 + getCumAudit(t0, ch))) / (lookbackHours * 60);
};

// - PLAYBACK -
const RT_MODES = ["rt"];
const isRTSpeedMode = (m) => RT_MODES.includes(m);
const ALL_MODES = [
  {key:"rt",label:"Realtime"},{key:"1m",label:"1 Min/s"},
];
// Continuous mult slider operates in log10-space. Range is symmetric
// around 1x: log10(0.001) = -3 on the left, log10(1000) = +3 on the
// right, with 1x sitting exactly at slider position 0 (the geometric
// center). Three decades on either side keeps the popular round
// values (0.25, 0.5, 1, 2, 4, 10, 100, 1000) reachable to within
// ~2% at step=0.01.
const MULT_LOG_MIN = -3; // log10(0.001)
const MULT_LOG_MAX = 3;  // log10(1000)
const MULT_MIN = 0.001;
const MULT_MAX = 1000;
// Single source of truth for the RT cadence: the gap between value updates (the
// tick interval) AND the odometer roll duration must be identical, or the roll
// can't keep up with the ticks. periodSec is the per-tick interval at 1x (in
// seconds); above 1x the loop fires ~1 sim-sec per tick (1000/em).
const rtRollDuration = (periodSec, em) => {
  const m = em > 0 ? em : 1;
  const baseMs = periodSec * 1000;
  return m <= 1 ? baseMs / m : Math.max(10, 1000 / m);
};

const initialPlayback = { playing:false, reverse:false, speedMode:"rt", mult:1, dyn:false, desync:0, seekToken:0, minuteSnap:false };

function playbackReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_PLAY": return { ...state, playing: !state.playing };
    case "PLAY": return { ...state, playing: true };
    case "STOP": return { ...state, playing: false };
    case "TOGGLE_REVERSE": return { ...state, reverse: !state.reverse };
    case "SET_MODE": return { ...state, speedMode: action.mode };
    case "SET_DESYNC": return { ...state, desync: Math.max(0, Math.min(1, action.value)) };
    case "TOGGLE_MINUTE_SNAP": return { ...state, minuteSnap: !state.minuteSnap };
    case "BUMP_SEEK": return { ...state, seekToken: state.seekToken + 1 };
    case "SET_MULT": return { ...state, mult: Math.max(MULT_MIN, Math.min(MULT_MAX, action.mult)) };
    case "TOGGLE_DYN": return { ...state, dyn: !state.dyn };
    default: return state;
  }
}

// Tiered gap -> seconds-per-second ladder. Caller supplies |gap| from
// the active channel pair (PDP vs T-Series); see dynGapRef below.
const getDynSpeed = (absGap) => {
  if (absGap == null || !isFinite(absGap)) return 30;
  if (absGap < 30)      return 30;
  if (absGap < 300)     return 120;
  if (absGap < 3000)    return 500;
  if (absGap < 10000)   return 1000;
  if (absGap < 30000)   return 1400;
  if (absGap < 50000)   return 1500;
  if (absGap < 100000)  return 1700;
  if (absGap < 300000)  return 2000;
  if (absGap < 1000000) return 2500;
  return 3000;
};



const _MIN_MS = 60_000;

// Smooth cubic baseline at time t - used as the reference the inflections perturb.
// Accepts either legacy organic-field keys ("opt"/"ott", which read from the
// shared pdp/ts RAW via interpolate()) or direct channel keys ("pdp"/"ts").
// Channel keys route through CHANNEL_SOURCE for single-series channels.
const _baselineCumAt = (t, keyOrChannel) => {
  if (keyOrChannel === 'opt' || keyOrChannel === 'ott'
      || keyOrChannel === 'pdp' || keyOrChannel === 'ts') {
    const field = keyOrChannel === 'opt' || keyOrChannel === 'pdp' ? 'opt' : 'ott';
    const maxI = RAW.length - 1;
    if (maxI < 0) return 0;
    if (t <= RAW[0].t) return RAW[0][field];
    if (t >= RAW[maxI].t) return RAW[maxI][field];
    const pos = tsToPos(t);
    const idx = Math.max(0, Math.min(Math.floor(pos), maxI - 1));
    const f = pos - idx;
    const interp = interpolate(idx, f);
    return interp[field];
  }
  const src = CHANNEL_SOURCE[keyOrChannel];
  if (!src || !src.raw) return 0;
  return getChannelOrganicAt(t, keyOrChannel);
};

// Baseline rate (subs/min) via central numerical difference at 1-minute resolution.
const _baselineRateAt = (t, keyOrChannel) => {
  const v1 = _baselineCumAt(t + _MIN_MS / 2, keyOrChannel);
  const v0 = _baselineCumAt(t - _MIN_MS / 2, keyOrChannel);
  return v1 - v0;
};



// - PER-HOUR NOISE BRIDGE (for 1hr charts in RT mode) -
// Multinomial bridge: per-sample deltas sum exactly to the hour's organic Δ,
// so hourly snapshots are preserved bit-for-bit. Each sample's marginal is
// approximately Poisson(rate), giving natural per-second/minute roughness.
// Seeded PRNG -> fully deterministic, stable across re-renders and seeks.
const mulberry32 = (seed) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};


// - VOTE SCHEDULE -
// Strawpoll-style "Who do you support?" vote counts. Anchored to the
// Apr 1 2019 totals from the real poll (PDP 1,579,534 / TS 321,731)
// and advanced day-by-day from there: each UTC day adds roughly
// 60-70% of FlareTV's daily sub gain as new votes, split between the
// two channels using a ratio derived from each channel's own daily
// sub growth. Two mulberry32 draws per day (one for the 60-70%
// envelope, one for ±2pp split jitter) provide deterministic noise
// keyed on the UTC day number - same day always yields the same
// counts, stable across re-renders and seek/reverse.
//
// Split curve, piecewise in s = tsGrowth / (pdpGrowth + tsGrowth):
//   s ≤ 0.5:  tsShare = 0.14.s + 0.12.s²     (quadratic - PDP lead
//                                              produces disproportionately
//                                              higher vote share)
//   s >  0.5: tsShare = 0.30.s − 0.05         (linear)
// Anchors by design:
//   PDP 2x faster  (s=0.333) -> 94/6
//   equal growth   (s=0.500) -> 90/10
//   TS  2x faster  (s=0.667) -> 85/15
// Continuous at s=0.5 (both pieces = 0.10); derivative has a kink there
// - the sharper lower-half curvature is the whole point of the design.
// Edge s=0 -> 100/0 (TS only loses); edge s=1 -> 75/25 (TS only gains,
// but PDP still keeps three-quarters - the "fans vote harder" effect).
const VOTE_ANCHOR_T   = Date.UTC(2019, 3, 1);  // Apr 1 00:00 UTC
const VOTE_ANCHOR_PDP = 1579534;
const VOTE_ANCHOR_TS  = 321731;
const VOTE_MS_PER_DAY = 86_400_000;

const computeDailyVoteIncrement = (dayStartMs, ftvDailyGain, pdpGrowth, tsGrowth) => {
  const dayKey = Math.floor(dayStartMs / VOTE_MS_PER_DAY);
  const rng = mulberry32((dayKey * 0x9E3779B1) >>> 0);
  const r1 = rng();  // 60-70% envelope roll
  const r2 = rng();  // ±2pp split jitter
  const totalVotes = Math.max(0, ftvDailyGain) * (0.60 + 0.10 * r1);
  const denom = (pdpGrowth + tsGrowth) || 1;
  const s = tsGrowth / denom;
  const rawTsShare = s <= 0.5 ? 0.14 * s + 0.12 * s * s : 0.30 * s - 0.05;
  const tsShare = Math.max(0, Math.min(1, rawTsShare + (r2 - 0.5) * 0.04));
  return {
    pdp: Math.round(totalVotes * (1 - tsShare)),
    ts:  Math.round(totalVotes * tsShare),
  };
};

const VOTE_SCHEDULE = [];

// Resolve the vote counts active at `clockTime`. Binary-searches
// VOTE_SCHEDULE for the latest day boundary at or before t. Returns
// the cumulative counts plus whole-percent splits. Before Apr 1 the
// anchor values are returned unchanged (pre-poll-launch fallback).
const resolveVoteCounts = (clockTime) => {
  const t = clockTime || 0;
  if (!VOTE_SCHEDULE.length || t < VOTE_SCHEDULE[0].t) {
    const total = VOTE_ANCHOR_PDP + VOTE_ANCHOR_TS;
    const pdpPct = Math.round((VOTE_ANCHOR_PDP / total) * 100);
    return { pdp: VOTE_ANCHOR_PDP, ts: VOTE_ANCHOR_TS, pdpPct, tsPct: 100 - pdpPct };
  }
  let lo = 0, hi = VOTE_SCHEDULE.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (VOTE_SCHEDULE[mid].t <= t) lo = mid;
    else hi = mid - 1;
  }
  const e = VOTE_SCHEDULE[lo];
  const total = e.pdp + e.ts;
  const pdpPct = total > 0 ? Math.round((e.pdp / total) * 100) : 50;
  return { pdp: e.pdp, ts: e.ts, pdpPct, tsPct: 100 - pdpPct };
};

// Conditional-binomial decomposition of a multinomial draw.
// O(N); uses normal approximation when n*p is large, exact loop otherwise.
const multinomialBridge = (total, weights, rng) => {
  const N = weights.length;
  const out = new Int32Array(N);
  if (total <= 0) return out;
  let remaining = total;
  let wRemaining = 0;
  for (let i = 0; i < N; i++) wRemaining += weights[i];
  if (wRemaining <= 0) { out[N-1] = total; return out; }
  for (let i = 0; i < N - 1; i++) {
    if (remaining === 0) break;
    const p = weights[i] / wRemaining;
    let k;
    const np = remaining * p;
    if (np > 20 && remaining * (1-p) > 20) {
      const std = Math.sqrt(np * (1-p));
      const g = Math.sqrt(-2*Math.log(rng()+1e-10))*Math.cos(2*Math.PI*rng());
      k = Math.max(0, Math.min(remaining, Math.round(np + std * g)));
    } else if (np < 1e-9) {
      k = 0;
    } else {
      // Exact: Poisson approximation when n is moderate
      const L = Math.exp(-np);
      let kk = 0, prod = 1;
      do { kk++; prod *= rng(); } while (prod > L && kk < remaining * 4);
      k = Math.min(remaining, kk - 1);
    }
    out[i] = k;
    remaining -= k;
    wRemaining -= weights[i];
  }
  out[N-1] = remaining;
  return out;
};

const _generateNoisyHourCore = ({ a, b, durMs, samples, v0, v1, delta,
                                   organicAt, organicWeightAt, rateAt, affecting, rng, diffuseN }) => {
  const periodSec = 1;
  const periodMs  = periodSec * 1000;
  const periodMin = periodSec / 60;

  // Floor for the activity rate the noise layers ride on: half the hour-average
  // organic rate. Each layer uses max(floor, |instant total rate|) so the noise
  // does not collapse when the instantaneous rate dips near 0, while still easing
  // off in naturally slow stretches and scaling up through boosts.
  const rateFloorPerSec = Math.abs(delta) / Math.max(1, samples) / 2;
  const rateFloorPerMin = rateFloorPerSec * 60;

  // - Layer 1: Organic shape rescaling -
  // Cubic-interpolated SIGNED per-sample increments, scaled to sum exactly to
  // baselineTargetSigned via cumulative integer rounding.
  const organicInc = new Float64Array(samples);
  let organicFlowTotal = 0;
  let pathMin = v0, pathMax = v0;
  {
    let prev = v0;
    const organicShapeAt = organicWeightAt || organicAt;
    for (let i = 0; i < samples; i++) {
      const f = (i + 1) / samples;
      const v = organicShapeAt(f);
      const inc = v - prev;
      organicInc[i] = inc;
      organicFlowTotal += inc;
      if (v < pathMin) pathMin = v;
      if (v > pathMax) pathMax = v;
      prev = v;
    }
  }
  const pathAmplitude = pathMax - pathMin;


  // - Layer 4: Diffuse gap-and-growth-modulated waves (positive only) -
  // Computed before organic scaling so organic compensates, preserving the anchor.
  const NUM_WINDOWS = 6;
  const controlPts = [{ pos: 0, amp: 0 }];
  for (let w = 0; w < NUM_WINDOWS; w++) {
    const wStart = w / NUM_WINDOWS;
    const wEnd   = (w + 1) / NUM_WINDOWS;
    const wMid   = (wStart + wEnd) / 2;
    const n = diffuseN(wMid);
    const localRate = Math.max(rateFloorPerMin, Math.abs(rateAt(a.t + wMid * durMs)));  // subs/min, floored at half the hour average
    const std    = n * Math.sqrt(localRate / 60 * periodSec) * 0.2;
    const numPts = Math.max(1, Math.round(1 + 4 * n));
    for (let p = 0; p < numPts; p++) {
      const f = wStart + (p + 0.5) / numPts * (wEnd - wStart);
      const g = Math.sqrt(-2 * Math.log(rng() + 1e-10)) * Math.cos(2 * Math.PI * rng());
      controlPts.push({ pos: f * samples, amp: Math.abs(g * std) });
    }
  }
  controlPts.push({ pos: samples, amp: 0 });
  controlPts.sort((p, q) => p.pos - q.pos);
  const noisyExtra = new Float64Array(samples);
  let cpIdx = 0;
  for (let i = 0; i < samples; i++) {
    while (cpIdx < controlPts.length - 2 && controlPts[cpIdx + 1].pos <= i) cpIdx++;
    const c0 = controlPts[cpIdx], c1 = controlPts[cpIdx + 1];
    const span = c1.pos - c0.pos;
    const t4 = span > 0 ? (i - c0.pos) / span : 0;
    const blend = 0.5 * (1 - Math.cos(t4 * Math.PI));
    noisyExtra[i] = c0.amp * (1 - blend) + c1.amp * blend;
  }
  let noisyExtraTotal = 0;
  for (let i = 0; i < samples; i++) noisyExtraTotal += noisyExtra[i];

  const baselineTargetSigned = delta - Math.round(noisyExtraTotal);
  const baselineTarget = Math.abs(baselineTargetSigned);

  // - Organic draws (cumulative-rounded scaling) -
  const organicDraws = new Int32Array(samples);
  if (Math.abs(organicFlowTotal) > 1e-9) {
    const scale = baselineTargetSigned / organicFlowTotal;
    const organicRatePerMin = baselineTarget / (samples * periodMin);
    // Below one expected arrival per minute, cumulative rounding creates a
    // visible deterministic staircase. Use the same weighted multinomial
    // bridge as the zero-flow path so arrivals are Poisson-like while still
    // following the organic envelope and summing exactly to the hour target.
    if (baselineTarget > 0 && organicRatePerMin < 1) {
      const weights = new Float64Array(samples);
      let weightTotal = 0;
      if (organicWeightAt) {
        const weightInc = new Float64Array(samples);
        let weightPrev = v0;
        let weightFlowTotal = 0;
        for (let i = 0; i < samples; i++) {
          const f = (i + 1) / samples;
          const v = organicWeightAt(f);
          const inc = v - weightPrev;
          weightInc[i] = inc;
          weightFlowTotal += inc;
          weightPrev = v;
        }
        const weightScale = Math.abs(weightFlowTotal) > 1e-9
          ? baselineTargetSigned / weightFlowTotal
          : scale;
        for (let i = 0; i < samples; i++) {
          const w = Math.max(0, Math.abs(weightInc[i] * weightScale));
          weights[i] = w;
          weightTotal += w;
        }
      } else {
        for (let i = 0; i < samples; i++) {
          const w = Math.max(0, Math.abs(organicInc[i] * scale));
          weights[i] = w;
          weightTotal += w;
        }
      }
      if (weightTotal > 1e-12) {
        const bridge = multinomialBridge(baselineTarget, weights, rng);
        const s = baselineTargetSigned < 0 ? -1 : 1;
        for (let i = 0; i < samples; i++) organicDraws[i] = bridge[i] * s;
      } else {
        const uniform = new Float64Array(samples).fill(1);
        const bridge = multinomialBridge(baselineTarget, uniform, rng);
        const s = baselineTargetSigned < 0 ? -1 : 1;
        for (let i = 0; i < samples; i++) organicDraws[i] = bridge[i] * s;
      }
    } else {
      let cumReal = 0, cumInt = 0;
      for (let i = 0; i < samples; i++) {
        cumReal += organicInc[i] * scale;
        const newCumInt = Math.round(cumReal);
        organicDraws[i] = newCumInt - cumInt;
        cumInt = newCumInt;
      }
    }
  } else if (baselineTargetSigned !== 0) {
    const uniform = new Float64Array(samples).fill(1);
    const bridge = multinomialBridge(Math.abs(baselineTargetSigned), uniform, rng);
    const s = baselineTargetSigned < 0 ? -1 : 1;
    for (let i = 0; i < samples; i++) organicDraws[i] = bridge[i] * s;
  }

  // - Layer 2: Skellam activity noise -
  // Per-second normal approximation to Skellam(lp, lm), with net rate R = the
  // total instantaneous rate (organic baseline + inflection) in subs/sec, so the
  // variance tracks live activity: boosts raise it, suppressions lower it.
  // For positive activity, lp = kR and lm = lp - R, so E[Skellam] = R and
  // Var = lp + lm = (2k - 1)R. The bridge keeps only the zero-mean
  // fluctuation and applies zero-sum correction below. When R -> 0, both
  // Poisson intensities vanish, so the variance vanishes with activity.
  const SKELLAM_K = 2.0;
  const skellamDraws = new Float64Array(samples);
  let skellamSum = 0;
  for (let i = 0; i < samples; i++) {
    const tSample = a.t + i * periodMs;
    const R = Math.max(rateFloorPerSec, Math.abs(rateAt(tSample) / 60));
    const lp = SKELLAM_K * R;
    const lm = Math.max(0, lp - R);
    const std = Math.sqrt(lp + lm);
    const g = Math.sqrt(-2 * Math.log(rng() + 1e-10)) * Math.cos(2 * Math.PI * rng());
    skellamDraws[i] = std * g;
    skellamSum += skellamDraws[i];
  }
  const skellamMean = skellamSum / samples;
  for (let i = 0; i < samples; i++) skellamDraws[i] -= skellamMean;

  const draws = new Int32Array(samples);
  for (let i = 0; i < samples; i++) {
    draws[i] = organicDraws[i];
  }

  // - Accumulate -
  const cum = new Float64Array(samples);
  let acc = v0;
  for (let i = 0; i < samples; i++) {
    acc += draws[i] + noisyExtra[i] + skellamDraws[i];
    cum[i] = acc;
  }

  return { t0: a.t, periodMs, cum };
};


// === CHANNEL-PARAMETRIC NOISE PIPELINE ===
// Reads from each channel's own RAW via CHANNEL_SOURCE, independent noise cache.
// No cross-channel coupling: diffuse-noise gap factor dropped,
// seed offsets ensure each channel has independent noise realizations.

const _CHAN_NOISE_CACHE = new Map();
const _CHAN_NOISE_CACHE_MAX = 2000;
const _chanNoiseCacheGet = (k) => _CHAN_NOISE_CACHE.get(k);
const _chanNoiseCacheSet = (k, v) => {
  if (_CHAN_NOISE_CACHE.size >= _CHAN_NOISE_CACHE_MAX) {
    const firstKey = _CHAN_NOISE_CACHE.keys().next().value;
    _CHAN_NOISE_CACHE.delete(firstKey);
  }
  _CHAN_NOISE_CACHE.set(k, v);
};

// Per-channel seed offsets so each channel has independent noise realizations
// even with identical parameters and timestamps. EVERY non-pdp/ts channel that
// runs through generateChannelNoisyHour MUST have an entry here: a missing
// offset falls back to 0, which makes that channel share the base seed with any
// other offset-less channel - so their per-second noise becomes correlated
// (identical rng draw sequence, only rescaled by each channel's delta). The
// distinct offsets decorrelate sb_real / ftv_real.
const _CHAN_SEED_OFFSET = {
  sb_real:  0x53420002,
  ftv_real: 0x46545602,
};

// - CHANNEL NOISE WRAPPER -
// Builds the cfg for standalone channels. diffuseN returns a constant 0.6,
// which produces a 0.12 amplitude after the 0.2 scaling factor.
const generateChannelNoisyHour = (ch, hourIdx, periodSec, inflOverride) => {
  periodSec = 1;
  const src = CHANNEL_SOURCE[ch];
  if (!src || !src.raw) return null;
  const RAW_C = src.raw;
  const maxI = RAW_C.length - 1;
  if (hourIdx < 0 || hourIdx >= maxI) return null;
  const a = RAW_C[hourIdx], b = RAW_C[hourIdx + 1];
  if (a.opt == null || b.opt == null) return null;
  const durMs = b.t - a.t;
  const samples = Math.max(1, Math.floor(durMs / 1000));
  const v0 = a.opt, v1 = b.opt;
  const delta = Math.round(v1 - v0);
  const seedBase = (hourIdx * 0x1F1F1F1F) ^ (periodSec * 0x9E3779B1);
  const seed = (seedBase ^ (_CHAN_SEED_OFFSET[ch] || 0)) >>> 0;
  const affecting = inflOverride !== undefined ? inflOverride : [];
  return _generateNoisyHourCore({
    a, b, durMs, samples, v0, v1, delta,
    organicAt: (f) => getChannelOrganicAt(a.t + f * durMs, ch),
    organicWeightAt: (f) => getChannelOrganicAt(a.t + f * durMs, ch),
    rateAt:    (t) => _baselineRateAt(t, ch),
    affecting, rng: mulberry32(seed),
    diffuseN:  () => 0.6,
  });
};

const getChannelNoisyHour = (ch, hourIdx, periodSec) => {
  periodSec = 1;  // noise pipeline is periodSec-invariant
  const key = `${ch}_${hourIdx}_${periodSec}`;
  let v = _chanNoiseCacheGet(key);
  if (v) return v;
  v = generateChannelNoisyHour(ch, hourIdx, periodSec);
  if (v) _chanNoiseCacheSet(key, v);
  return v;
};

// Pointwise sample of a channel's noisy bridge, with per-channel audit
// cumulative folded in.
const channelNoisyValueAt = (ch, periodSec, t) => {
  periodSec = 1;  // noise pipeline is periodSec-invariant
  const src = CHANNEL_SOURCE[ch];
  if (!src || !src.raw || !src.raw.length) return null;
  const RAW_C = src.raw;
  const maxI = RAW_C.length - 1;
  if (t <= RAW_C[0].t) return RAW_C[0].v + getCumAudit(t, ch);
  if (t >= RAW_C[maxI].t) return RAW_C[maxI].v + getCumAudit(t, ch);
  // Linear scan for hour index since these channels' RAW timestamps are
  // hourly and uniform; tsToPos is calibrated to the main RAW.
  let hourIdx = -1;
  for (let i = 0; i < maxI; i++) {
    if (t >= RAW_C[i].t && t < RAW_C[i + 1].t) { hourIdx = i; break; }
  }
  if (hourIdx < 0) return null;
  const hr = getChannelNoisyHour(ch, hourIdx, periodSec);
  if (!hr) return null;
  const offsetMs = t - hr.t0;
  const i = Math.min(hr.cum.length - 1, Math.max(0, Math.floor(offsetMs / hr.periodMs) - 1));
  return hr.cum[i] + getCumAudit(t, ch);
};

const channelNoisyValueAtInterp = (ch, periodSec, t) => {
  periodSec = 1;
  const src = CHANNEL_SOURCE[ch];
  if (!src || !src.raw || !src.raw.length) return null;
  const RAW_C = src.raw;
  const maxI = RAW_C.length - 1;
  if (t <= RAW_C[0].t) return RAW_C[0].v + getCumAudit(t, ch);
  if (t >= RAW_C[maxI].t) return RAW_C[maxI].v + getCumAudit(t, ch);
  let hourIdx = -1;
  for (let i = 0; i < maxI; i++) {
    if (t >= RAW_C[i].t && t < RAW_C[i + 1].t) { hourIdx = i; break; }
  }
  if (hourIdx < 0) return null;
  const hr = getChannelNoisyHour(ch, hourIdx, periodSec);
  if (!hr) return null;
  const rawPos = (t - hr.t0) / hr.periodMs - 1;
  const iLo = Math.max(0, Math.floor(rawPos));
  const iHi = Math.min(hr.cum.length - 1, iLo + 1);
  const frac = Math.max(0, rawPos - iLo);
  return hr.cum[iLo] + (hr.cum[iHi] - hr.cum[iLo]) * frac + getCumAudit(t, ch);
};

// Build chart points across [tMin, tMax] for a channel.
// outKey names the field on each emitted point (e.g. "v" or the channel name).
const buildChannelNoisyWindow = (ch, outKey, periodSec, tMin, tMax) => {
  const src = CHANNEL_SOURCE[ch];
  if (!src || !src.raw) return [];
  const RAW_C = src.raw;
  const maxI = RAW_C.length - 1;
  // Find hour bounds via linear search (uniform hourly grid).
  let hStart = 0, hEnd = maxI - 1;
  for (let i = 0; i < maxI; i++) {
    if (RAW_C[i].t <= tMin && tMin < RAW_C[i + 1].t) { hStart = i; break; }
  }
  for (let i = maxI - 1; i >= 0; i--) {
    if (RAW_C[i].t <= tMax) { hEnd = Math.min(maxI - 1, i); break; }
  }
  const out = [];
  for (let h = hStart; h <= hEnd; h++) {
    const hr = getChannelNoisyHour(ch, h, periodSec);
    if (!hr) continue;
    // One point per periodSec, aligned to the hour's last sample for cross-hour continuity.
    const step = Math.max(1, Math.round(periodSec));
    for (let i = (hr.cum.length - 1) % step; i < hr.cum.length; i += step) {
      const t = hr.t0 + (i + 1) * hr.periodMs;
      if (t < tMin || t >= tMax) continue;
      const v = hr.cum[i] + getCumAudit(t, ch);
      out.push({ t, [outKey]: v });
    }
  }
  const vEnd = channelNoisyValueAt(ch, periodSec, tMax);
  if (vEnd != null) out.push({ t: tMax, [outKey]: vEnd });
  return out;
};

// Aligned sampler at multiples of stepMs in [tMin, tMax].
const sampleChannelNoisyAligned = (ch, periodSec, tMin, tMax, stepMs) => {
  const src = CHANNEL_SOURCE[ch];
  if (!src || !src.raw) return [];
  const RAW_C = src.raw;
  const maxI = RAW_C.length - 1;
  let hStart = 0, hEnd = maxI - 1;
  for (let i = 0; i < maxI; i++) {
    if (RAW_C[i].t <= tMin && tMin < RAW_C[i + 1].t) { hStart = i; break; }
  }
  for (let i = maxI - 1; i >= 0; i--) {
    if (RAW_C[i].t <= tMax) { hEnd = Math.min(maxI - 1, i); break; }
  }
  const out = [];
  let t = Math.ceil(tMin / stepMs) * stepMs;
  for (let h = hStart; h <= hEnd && t <= tMax; h++) {
    const hr = getChannelNoisyHour(ch, h, periodSec);
    if (!hr) continue;
    if (t < hr.t0) t = Math.ceil(hr.t0 / stepMs) * stepMs; // advance past pre-data gap
    const hrEnd = hr.t0 + hr.cum.length * hr.periodMs;
    while (t <= tMax && t < hrEnd && t >= hr.t0) {
      const i = Math.min(hr.cum.length - 1, Math.max(0, Math.floor((t - hr.t0) / hr.periodMs)));
      out.push({ t, v: hr.cum[i] + getCumAudit(t, ch) });
      t += stepMs;
    }
  }
  return out;
};



const FULL_EXPORT_HEADER_BYTES = 24;
const FULL_EXPORT_STEP_MS = 1000;
const FULL_EXPORT_RECORD_BYTES = 8;
const FULL_EXPORT_CHUNK_HOURS = 4;

const fullExportRecordCount = (raw) => {
  const startTs = raw[0].t;
  const endTs = raw[raw.length - 1].t;
  return Math.round((endTs - startTs) / FULL_EXPORT_STEP_MS) + 1;
};

const fullExportYield = () => new Promise(resolve => {
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => resolve());
  else setTimeout(resolve, 0);
});

const writeFullExportHeader = (view, magic, startTs, n, chCount) => {
  for (let i = 0; i < 4; i++) view.setUint8(i, magic.charCodeAt(i));
  view.setBigInt64(4, BigInt(startTs), true);
  view.setInt32(12, FULL_EXPORT_STEP_MS, true);
  view.setInt32(16, n, true);
  view.setInt32(20, chCount, true);
};

const writeFullExportDownload = (filename, buffer) => {
  const url = URL.createObjectURL(new Blob([buffer], { type: "application/octet-stream" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
};

// Generic N-channel exporter. `channels` = array of { start(t), hour(h), audit(t) }.
// Record width = channels.length * 4 bytes (int32 LE each), chCount in header.
const buildFullExportBuffer = async ({ magic, raw, channels, onProgress, rangeStart, rangeEnd }) => {
  // Clamp the requested [rangeStart, rangeEnd] interval to this file's data
  // range. Defaults to the full range when not given.
  const dataStart = raw[0].t;
  const dataEnd = raw[raw.length - 1].t;
  const startTs = Math.max(dataStart, rangeStart != null ? rangeStart : dataStart);
  const endTs = Math.min(dataEnd, rangeEnd != null ? rangeEnd : dataEnd);
  if (endTs <= startTs) throw new Error(`Full export ${magic}: empty interval`);
  const nCh = channels.length;
  const recordBytes = nCh * 4;
  const n = Math.round((endTs - startTs) / FULL_EXPORT_STEP_MS) + 1;
  const buffer = new ArrayBuffer(FULL_EXPORT_HEADER_BYTES + n * recordBytes);
  const view = new DataView(buffer);
  let byteOffset = FULL_EXPORT_HEADER_BYTES;
  let written = 0;

  writeFullExportHeader(view, magic, startTs, n, nCh);

  const writeRecord = (vals) => {
    for (let k = 0; k < nCh; k++) view.setInt32(byteOffset + k * 4, Math.round(vals[k]), true);
    byteOffset += recordBytes;
    written++;
  };

  writeRecord(channels.map(c => c.start(startTs)));
  if (onProgress) onProgress(written, n);

  for (let h = 0; h < raw.length - 1; h++) {
    if (raw[h + 1].t <= startTs) continue;   // hour entirely before the interval
    if (raw[h].t >= endTs) break;            // reached the interval end
    const hrs = channels.map(c => c.hour(h));
    if (hrs.some(hr => !hr)) throw new Error(`Missing full export hour ${magic}#${h}`);
    let len = Infinity;
    for (const hr of hrs) len = Math.min(len, hr.cum.length);
    for (let i = 0; i < len; i++) {
      const t = hrs[0].t0 + (i + 1) * hrs[0].periodMs;
      if (t <= startTs || t > endTs) continue;
      writeRecord(channels.map((c, k) => hrs[k].cum[i] + c.audit(t)));
    }
    if ((h + 1) % FULL_EXPORT_CHUNK_HOURS === 0) {
      if (onProgress) onProgress(written, n);
      await fullExportYield();
    }
  }

  if (written !== n) throw new Error(`Full export ${magic} wrote ${written} records, expected ${n}`);
  if (onProgress) onProgress(written, n);
  return buffer;
};



// - ANIMATION COMPONENTS -
const OdometerColumn = ({ digit, frac }) => {
  const next = (digit + 1) % 10;
  const slotH = 1.15; // em - taller than viewport adds visual gap between digits during roll
  return (
    <span style={{ display:"inline-block", height:"1em", overflow:"hidden", width:"1ch", textAlign:"center", lineHeight:1, verticalAlign:"top", marginRight:"0.0105em" }}>
      <span style={{ display:"block", transform:`translateY(${-frac*slotH}em)`, willChange:"transform" }}>
        <span style={{ display:"block", height:`${slotH}em`, lineHeight:1 }}>{digit}</span>
        <span style={{ display:"block", height:`${slotH}em`, lineHeight:1 }}>{next}</span>
      </span>
    </span>
  );
};

// CSS default 'ease' = cubic-bezier(0.25, 0.1, 0.25, 1.0).
// Newton-Raphson inverts the X parametric to find the curve parameter u, then evaluates Y.
function cssEase(t) {
  const x1 = 0.25, y1 = 0.1, x2 = 0.25, y2 = 1.0;
  let u = t;
  for (let i = 0; i < 8; i++) {
    const xu = 3*(1-u)*(1-u)*u*x1 + 3*(1-u)*u*u*x2 + u*u*u - t;
    const dx = 3*((1-u)*(1-u)*x1 + 2*u*(1-u)*(x2-x1) + u*u*(1-x2));
    if (Math.abs(dx) < 1e-6) break;
    u = Math.max(0, Math.min(1, u - xu/dx));
  }
  return 3*(1-u)*(1-u)*u*y1 + 3*(1-u)*u*u*y2 + u*u*u;
}

// 2-slot rAF ribbon - identical architecture to FlareOdoColumn/FlareCasinoCounter.
// rAF computes frac (0->1) each frame; DOM refs mutate slot text + translateY.
// No setState during animation = no React reconciliation. willChange:transform keeps
// the ribbon on a GPU compositor layer so translateY changes bypass layout+paint.
const OdometerDigit = ({ fromDigit, totalSteps, duration, animKey }) => {
  const innerRef = useRef(null);
  const slot0Ref = useRef(null);
  const slot1Ref = useRef(null);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (slot0Ref.current) slot0Ref.current.textContent = String(fromDigit);
    if (slot1Ref.current) slot1Ref.current.textContent = String((fromDigit + 1) % 10);
    el.style.transform = 'translateY(0)';
    if (totalSteps === 0) return;

    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = cssEase(t);
      const rolled = totalSteps * e;
      const step = Math.floor(rolled);
      const frac = rolled - step;
      const digit = ((fromDigit + step) % 10 + 10) % 10;
      if (slot0Ref.current) slot0Ref.current.textContent = String(digit);
      if (slot1Ref.current) slot1Ref.current.textContent = String((digit + 1) % 10);
      el.style.transform = `translateY(${-frac * 1.15}em)`;
      if (t < 1) { raf = requestAnimationFrame(tick); return; }
      const final = ((fromDigit + totalSteps) % 10 + 10) % 10;
      if (slot0Ref.current) slot0Ref.current.textContent = String(final);
      if (slot1Ref.current) slot1Ref.current.textContent = String((final + 1) % 10);
      el.style.transform = 'translateY(0)';
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animKey]);

  return (
    <span style={{ display:"inline-block", height:"1em", overflow:"hidden", width:"1ch", textAlign:"center", lineHeight:1, verticalAlign:"top", marginRight:"0.0105em" }}>
      <span ref={innerRef} style={{ display:"block", WebkitBackfaceVisibility:"hidden", backfaceVisibility:"hidden", willChange:"transform" }}>
        <span ref={slot0Ref} style={{ display:"block", height:"1.15em", lineHeight:1 }}>{fromDigit}</span>
        <span ref={slot1Ref} style={{ display:"block", height:"1.15em", lineHeight:1 }}>{(fromDigit + 1) % 10}</span>
      </span>
    </span>
  );
};

// LAYOUT: Shared counter - see LAYOUTS.md
const CasinoCounter = ({ value, signed, duration = 3400, seekToken = 0 }) => {
  const num = value == null ? null : Math.round(value);
  const prevRef = useRef(num || 0);
  const lastSeekRef = useRef(seekToken);
  const animKeyRef = useRef(0);
  const [display, setDisplay] = useState({ from: num || 0, to: num || 0, key: 0 });

  useEffect(() => {
    if (num == null) return;
    const seekHappened = lastSeekRef.current !== seekToken;
    lastSeekRef.current = seekToken;
    if (seekHappened) {
      prevRef.current = num;
      setDisplay({ from: num, to: num, key: ++animKeyRef.current });
      return;
    }
    const from = Math.round(prevRef.current), to = num;
    prevRef.current = to;
    if (from === to) return;
    setDisplay({ from, to, key: ++animKeyRef.current });
  }, [num, seekToken]);

  if (num == null) return <span>{"-"}</span>;

  const { from, to, key } = display;
  const prefix = signed ? (to >= 0 ? "+" : "-") : "";
  const absFrom = Math.abs(from), absTo = Math.abs(to);
  const formatted = Math.round(absTo).toLocaleString();
  const digitsOnly = formatted.replace(/,/g, "");
  const numDigits = digitsOnly.length;
  let dIdx = 0;

  return (
    <span style={{ display:"inline", fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap", lineHeight:1, letterSpacing:0 }}>
      {prefix && <span style={{ display:"inline-block", height:"1em", lineHeight:1, verticalAlign:"top" }}>{prefix}</span>}
      {formatted.split("").map((ch, i) => {
        if (ch === ",") return <span key={"c"+i} style={{ display:"inline-block", verticalAlign:"top", lineHeight:1, marginRight:"0.0105em" }}>,</span>;
        const power = numDigits - 1 - dIdx; dIdx++;
        const div = Math.pow(10, power);
        const fromDigit = Math.floor(absFrom / div) % 10;
        const totalSteps = Math.floor(absTo / div) - Math.floor(absFrom / div);
        return (
          <OdometerDigit key={"p"+power} fromDigit={fromDigit} totalSteps={totalSteps} duration={duration} animKey={key} />
        );
      })}
    </span>
  );
};

// - FLARE BACKGROUND (LOW-POLY TRIANGULATED) -
// Stock-graphic "shattered glass" / faceted background used by the Flare
// theme. Pattern: jittered square grid -> each cell split into two triangles
// along a random diagonal -> each vertex gets a seeded random value; triangle
// shade = mean of its three vertex values. Vertex-averaging produces smooth
// clumping (adjacent triangles share vertices, so their shades correlate)
// without needing 2D noise.
//
// Palette is neutral gray with a faint cool tint, range 210-252 per channel,
// matching the reference screenshot. The base <rect> fill guarantees no gaps
// if any triangle's fill fails to render.
//
// preserveAspectRatio="xMidYMid slice" keeps the pattern's aspect ratio and
// uniformly scales/crops it to cover tall (charts-on) layouts.
// LAYOUT: Flare - see LAYOUTS.md

// Build the low-poly triangle geometry for a seed. Shared by the rendered
// component and the PNG exporter so an exported image matches the screen exactly.
function _flareGeometry(seed) {
  let s = seed >>> 0;
  const rng = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const W = 1200, H = 800;
  const COLS = 16, ROWS = 11;
  const cellW = W / COLS, cellH = H / ROWS;
  const NV = (COLS + 1) * (ROWS + 1);
  const vx = new Float64Array(NV);
  const vy = new Float64Array(NV);
  const vv = new Float64Array(NV);
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      const idx = r * (COLS + 1) + c;
      const isEdge = c === 0 || c === COLS || r === 0 || r === ROWS;
      const jx = isEdge ? 0 : (rng() - 0.5) * cellW * 0.7;
      const jy = isEdge ? 0 : (rng() - 0.5) * cellH * 0.7;
      vx[idx] = c * cellW + jx;
      vy[idx] = r * cellH + jy;
      vv[idx] = rng();
    }
  }
  const triangles = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tl = r * (COLS + 1) + c;
      const tr = tl + 1;
      const bl = (r + 1) * (COLS + 1) + c;
      const br = bl + 1;
      if (rng() < 0.5) { triangles.push([tl, tr, bl], [tr, br, bl]); }
      else             { triangles.push([tl, tr, br], [tl, br, bl]); }
    }
  }
  return { triangles, vx, vy, vv, W, H };
}

// Flare palette. Dark mode: low-gray range (22..70 per channel) with the same
// cool tint direction; light mode: 210..252. Shared by render and exporter.
function _flarePalette(dark) {
  return {
    baseFill: dark ? "#1a1d23" : "#eef0f2",
    gBase: dark ? 22 : 210,
    gSpan: dark ? 48 : 42,
  };
}

// Serialize the Flare background to a standalone SVG string (no external refs,
// so it rasterizes without tainting a canvas).
function _flareSvgMarkup(seed, dark) {
  const { triangles, vx, vy, vv, W, H } = _flareGeometry(seed);
  const { baseFill, gBase, gSpan } = _flarePalette(dark);
  let polys = "";
  for (let i = 0; i < triangles.length; i++) {
    const [a, b, c] = triangles[i];
    const v = (vv[a] + vv[b] + vv[c]) / 3;
    const g = Math.round(gBase + v * gSpan);
    const r1 = g, g1 = Math.min(255, g + 1), b1 = Math.min(255, g + 3);
    polys += `<polygon points="${vx[a].toFixed(2)},${vy[a].toFixed(2)} ${vx[b].toFixed(2)},${vy[b].toFixed(2)} ${vx[c].toFixed(2)},${vy[c].toFixed(2)}" fill="rgb(${r1},${g1},${b1})"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect x="0" y="0" width="${W}" height="${H}" fill="${baseFill}"/>${polys}</svg>`;
}


const FlareBackground = React.memo(({ seed = 0x1337CAFE, dark = false }) => {
  const { triangles, vx, vy, vv, W, H } = useMemo(() => _flareGeometry(seed), [seed]);

  const { baseFill, gBase, gSpan } = _flarePalette(dark);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <rect x={0} y={0} width={W} height={H} fill={baseFill} />
      {triangles.map((tri, i) => {
        const [a, b, c] = tri;
        const v = (vv[a] + vv[b] + vv[c]) / 3;
        const g = Math.round(gBase + v * gSpan);
        const r1 = g, g1 = Math.min(255, g + 1), b1 = Math.min(255, g + 3);
        return (
          <polygon key={i}
            points={`${vx[a].toFixed(2)},${vy[a].toFixed(2)} ${vx[b].toFixed(2)},${vy[b].toFixed(2)} ${vx[c].toFixed(2)},${vy[c].toFixed(2)}`}
            fill={`rgb(${r1},${g1},${b1})`} />
        );
      })}
    </svg>
  );
});

// - FLARE ODOMETER (CSS-transition-driven) -
// A different animation architecture from CasinoCounter's rAF+setState loop.
// Mirrors the approach used by HubSpot's Odometer.js: each digit column
// contains a ribbon of digits spanning the full roll [fromDigit -> toDigit],
// and the browser interpolates `transform: translateY` between two values
// via a CSS transition. The compositor handles the interpolation on the GPU.
//
// This avoids the two pathologies of the rAF approach:
//   • Asymptotic tail: a power-N ease-out computed per frame never reaches
//     exactly 1, so the last ~0.01 of progress crawls for hundreds of ms.
//     A CSS transition is duration-bounded - the browser commits to the
//     final style at the exact duration mark, no matter the curve shape.
//   • Sub-pixel snap on completion: the compositor-rounded transform at
//     animation end sits on the same pixel grid as the static (frac=0) rest
//     state, so there is no one-pixel jump when the animation releases.
//
// Rendering metrics (1ch width, 1.15em slot height, tabular-nums, 0.0105em
// right margin) are byte-identical to OdometerColumn so the counter lines
// up exactly with the plain-string fallback used outside RT modes.
//
// Interruption semantics: if a new value arrives while an animation is still
// in progress, the visible column re-keys and remounts at its new fromDigit
// (the previous target) heading to the new toDigit. For a steady ~1s update
// cadence this is a no-op because the animation finishes before the next
// value; for rapid (FRT) updates the ribbon restarts more often, but motion
// at that tempo is blurred visually anyway.
const FLARE_DURATION_MS = 500;
const FLARE_SLOT_H = 1.15;

// Fixed 2-slot digit column driven by a frac value [0,1).
// Identical approach to OdometerColumn but supports compact (block) layout.
// O(1) DOM nodes per digit regardless of how large the value jump is.
const FlareOdoColumn = ({ digit, frac, compact = false }) => {
  const next = (digit + 1) % 10;
  return (
    <span style={compact
      ? { display:"block", height:"1em", overflow:"hidden", lineHeight:1 }
      : { display:"inline-block", height:"1em", overflow:"hidden", width:"1ch", textAlign:"center", lineHeight:1, verticalAlign:"top", marginRight:"0.0105em" }
    }>
      <span style={{ display:"block", transform:`translateY(${-frac * FLARE_SLOT_H}em)`, willChange:"transform" }}>
        <span style={{ display:"block", height:`${FLARE_SLOT_H}em`, lineHeight:1 }}>{digit}</span>
        <span style={{ display:"block", height:`${FLARE_SLOT_H}em`, lineHeight:1 }}>{next}</span>
      </span>
    </span>
  );
};

// LAYOUT: Flare counter - see LAYOUTS.md
const FlareCasinoCounter = ({ value, signed, seekToken = 0, mult = 1, compact = false, scale = 1 }) => {
  const num = value == null ? null : Math.round(value);
  const dispRef = useRef(num || 0);
  const rafRef = useRef(null);
  const lastSeekRef = useRef(seekToken);
  const [state, setState] = useState({ val: num || 0, from: num || 0, to: num || 0 });
  const effectiveMult = mult > 0 ? mult : 1;
  const rollMs = FLARE_DURATION_MS / effectiveMult;

  useEffect(() => {
    if (num == null) return;
    const seekHappened = lastSeekRef.current !== seekToken;
    lastSeekRef.current = seekToken;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (seekHappened) {
      dispRef.current = num;
      setState({ val: num, from: num, to: num });
      return;
    }
    const from = Math.round(dispRef.current), to = num;
    if (from === to) return;
    dispRef.current = to;
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / rollMs);
      const e = 1 - Math.pow(1 - t, 3);
      const v = from + (to - from) * e;
      dispRef.current = v;
      if (t < 1) { setState({ val: v, from, to }); rafRef.current = requestAnimationFrame(tick); }
      else { dispRef.current = to; setState({ val: to, from: to, to }); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [num, seekToken, rollMs]);

  if (num == null) return <span>{"-"}</span>;

  const { from: animFrom, to: animTo, val: animVal } = state;
  const absFrom = Math.abs(animFrom);
  const absTo   = Math.abs(animTo);
  const totalDelta = Math.round(absTo - absFrom);
  const progress = totalDelta !== 0 ? Math.max(0, Math.min(1, (Math.abs(animVal) - absFrom) / totalDelta)) : 0;

  const prefix = signed ? (num >= 0 ? "+" : "-") : "";
  const formatted = Math.round(Math.abs(animTo)).toLocaleString();
  const digitsOnly = formatted.replace(/,/g, "");
  const numDigits = digitsOnly.length;

  const colFrac = (div) => {
    const fromDigit = Math.floor(absFrom / div) % 10;
    const steps = Math.floor(absTo / div) - Math.floor(absFrom / div);
    if (steps === 0) return { digit: fromDigit, frac: 0 };
    const rolled = fromDigit + steps * progress;
    return { digit: ((Math.floor(rolled) % 10) + 10) % 10, frac: rolled - Math.floor(rolled) };
  };

  if (compact) {
    const cols = [];
    if (prefix) cols.push("auto");
    formatted.split("").forEach(() => cols.push("auto"));
    let dIdx = 0;
    return (
      <span style={{
        display: "inline-grid",
        gridTemplateColumns: cols.join(" "),
        alignItems: "start",
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
        letterSpacing: 0,
        verticalAlign: "baseline",
        textAlign: "left",
      }}>
        {prefix && <span style={{ height:"1em", overflow:"hidden", lineHeight:1 }}>{prefix}</span>}
        {formatted.split("").map((ch, i) => {
          if (ch === ",") return <span key={"c"+i} style={{ height:"1em", overflow:"hidden", lineHeight:1 }}>,</span>;
          const power = numDigits - 1 - dIdx; dIdx++;
          const { digit, frac } = colFrac(Math.pow(10, power));
          return <FlareOdoColumn key={"p"+power} digit={digit} frac={frac} compact />;
        })}
      </span>
    );
  }

  let dIdx = 0;
  return (
    <span style={{ display:"inline", fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap", lineHeight:1, letterSpacing:0 }}>
      {prefix && <span style={{ display:"inline-block", height:"1em", lineHeight:1, verticalAlign:"top" }}>{prefix}</span>}
      {formatted.split("").map((ch, i) => {
        if (ch === ",") return <span key={"c"+i} style={{ display:"inline-block", verticalAlign:"top", lineHeight:1, marginRight:"0.0105em" }}>,</span>;
        const power = numDigits - 1 - dIdx; dIdx++;
        const { digit, frac } = colFrac(Math.pow(10, power));
        return <FlareOdoColumn key={"p"+power} digit={digit} frac={frac} />;
      })}
    </span>
  );
};


// - FLARE NEWS TICKER -
// Horizontal scrolling marquee that sits in the 32px strip directly
// above the black bottom rule of the Flare view. The text source is
// day-dependent: `getFlareTickerMessage` receives the current stream
// clock (ms) and returns the string for that date. Rotation happens
// at scroll-pass boundaries - the DOM text is swapped only when the
// old message has fully scrolled off the left edge, so viewers never
// see a message change mid-scroll; instead, the *next* marquee pass
// simply carries the new content.
//
// Implementation notes:
//   • Scrolling uses a single CSS keyframe (translateX 0 -> -100%)
//     applied to an inline-block span whose `padding-left: 100%`
//     places its content flush against the right edge of the viewport
//     at the start of each pass. Duration is fixed, so the effective
//     pixel speed drifts slightly with message length; for messages
//     of comparable length this is imperceptible.
//   • `onAnimationIteration` fires at every 0%->100%->0% wraparound,
//     at which point we bump `passVersion`. The `useMemo` that reads
//     the current message depends on both `clockTime` and `passVersion`,
//     so the message is only recomputed at the iteration boundary
//     (React's DOM update lands between passes, matching the CSS
//     animation's restart).
//   • Keyframes are injected once into <head> on first mount; subsequent
//     mounts reuse the same named rule by id.
// Events that only appear once their date has passed. `startAt` is the
// timestamp (UTC ms) at which the text starts showing up in the ticker.
// "AFTER Apr 1" is interpreted as "from the start of Apr 2 onward" so
// the Apr 1 crossover is announced retrospectively once that day is
// behind us.
const getFlareTickerMessage = () =>
  'This stream is powered by FlareTV and Youtube Realtime by Akshat Mittal' +
  ' - Like other streams, rules do exist here. Send !rules in chat to read them!' +
  ' - BECOME A MEMBER TO GET ALL YOUR MESSAGES HIGHLIGHTED IN CHAT! CLICK THE JOIN BUTTON NEXT TO THE SUBSCRIBE BUTTON TO JOIN!';

// LAYOUT: Flare - see LAYOUTS.md
const FlareNewsTicker = React.memo(({ clockTime, textColor, robotoFont, mult = 1, playing = true }) => {
  // Natural (unscaled) width of a single message copy. Measured once
  // after mount and again whenever the message string changes.
  const [textW, setTextW] = useState(0);
  const innerRef = useRef(null);

  const message = getFlareTickerMessage();

  useLayoutEffect(() => {
    if (!innerRef.current) return;
    const w = innerRef.current.offsetWidth;
    if (w > 0 && w !== textW) setTextW(w);
  }, [message, textW]);

  // Inject the keyframes rule once per document. The translate
  // percentage resolves against the element's un-transformed layout
  // width (2.nTW with two back-to-back copies), while the scaleX
  // happens in the same transform. Visual shift per iteration =
  // |translatePercent| . 2.nTW. For the loop to tile exactly one
  // stretched copy, that shift must equal STRETCH_X.nTW, so the
  // percentage is STRETCH_X / 2. At STRETCH_X = 1.12 that's 56%. At
  // the loop snap, copy #2 (identical to copy #1) sits in the viewport
  // position copy #1 occupied at t = 0 - seamless.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "flare-ticker-keyframes";
    const css =
      "@keyframes flareTickerScroll { 0% { transform: translateX(0) scaleX(1.12); } 100% { transform: translateX(-56%) scaleX(1.12); } }";
    const existing = document.getElementById(id);
    if (existing) {
      if (existing.textContent !== css) existing.textContent = css;
      return;
    }
    const s = document.createElement("style");
    s.id = id;
    s.textContent = css;
    document.head.appendChild(s);
  }, []);

  // 12% horizontal glyph stretch - height unchanged.
  const STRETCH_X = 1.12;
  // Scroll speed in visual px/s (halved from the prior 105 px/s baseline).
  const SPEED_PX_S = 52;

  // One animation cycle traverses exactly one stretched message in
  // visual space, i.e. nTW . STRETCH_X pixels. Divide by speed -> s.
  // Effective duration shrinks with the playback multiplier so the
  // ticker speeds up/slows down in lock-step with the 0.25x/0.5x/1x/2x/... button.
  const baseDuration = textW > 0 ? (textW * STRETCH_X) / SPEED_PX_S : 150;
  const effectiveMult = mult > 0 ? mult : 1;
  const duration = baseDuration / effectiveMult;

  return (
    <div style={{
      position: "absolute",
      left: 0, right: 0,
      top: 554,           // centered in the 36-px gap (cards end y=552, rule at y=588)
      height: 32,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      zIndex: 2,
      pointerEvents: "none",
      // Hide until we've measured, so the static unstretched text
      // never flashes before the animation starts.
      visibility: textW > 0 ? "visible" : "hidden",
    }}>
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          willChange: "transform",
          transformOrigin: "left center",
          // Animation is declared with LONGHAND properties rather than the
          // `animation` shorthand. Reason: writing the shorthand to
          // element.style resets every animation-* longhand - including
          // animation-play-state - back to its default (`running`). React's
          // style reconciler then sees animationPlayState unchanged between
          // renders and skips the DOM write, so the DOM silently falls back
          // to `running` and the ticker resumes scrolling while paused.
          // This surfaces on seeks that cross a day boundary: dayKey flips,
          // the message recomputes, useLayoutEffect remeasures textW,
          // `duration` updates, and the shorthand gets rewritten. Longhands
          // diff independently, so duration changes leave play state intact.
          animationName: "flareTickerScroll",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          // CSS pauses the animation at its current frame and resumes from
          // the same position, so stopping playback freezes the ticker
          // mid-scroll rather than snapping back to start.
          animationPlayState: playing ? "running" : "paused",
          fontFamily: "'Roboto Black'," + robotoFont,
          fontWeight: 900,      // Roboto Black
          fontSize: "13pt",
          color: textColor,
          lineHeight: 1,
        }}
      >
        <span ref={innerRef} style={{ display: "inline-block" }}>
          {message + "\u00A0-\u00A0"}
        </span>
        <span style={{ display: "inline-block" }} aria-hidden="true">
          {message + "\u00A0-\u00A0"}
        </span>
      </div>
    </div>
  );
});


// - FLARE VIEW -
// Standalone top-level view modeled after the FlareTV stream layout:
//   ┌-┐
//   │      PEWDIEPIE VS T-SERIES               │  title bar (white)
//   │         WHO WILL PREVAIL?                │
//   ├-┬-┤
//   │                     │                    │
//   │   PDP scorecard     │   TS scorecard     │  two white cards
//   │   (banner/profile/  │   (same)           │
//   │    votes/name/      │                    │
//   │    counter)         │                    │
//   │                     │                    │
//   ├-┴-┤
//   │  YYYY-MM-DD: ticker message ...            │  ticker (black)
//   ├-┬-┬-┤
//   │ Discord  │   Gap counter   │  FlareTV    │  footer (3 cols)
//   │ block    │   (already      │  subscribe  │
//   │          │    styled)      │  block      │
//   └-┴-┴-┘
// Canvas is 1280x720 like the live view and scales via the outer transform.
// Palette follows `dark` prop (defaults light). All counters use
// FlareCasinoCounter so the odometer animation matches the Flare aesthetic.
// LAYOUT: Flare entry point - see LAYOUTS.md
const FlareView = React.memo(({
  displayPt, displayTt, currentGap,
  pdpLeading, clockTime, seekToken,
  displayFTV,
  isRTMode = false,
  rtPeriodSec = 2,
  dark = false,
  extraInfo = false,
  subsPerMinTable = null,
  leadMs = null,
  mult = 1,
  playing = true,
  scale = 1,
  rareBannerUpd = false,
}) => {
  // Local copy of the dashboard's fmtLeadDuration - same shape, same
  // rounding, so the Flare "Time ahead:" readout reads identically to the
  // dashboard's CHANNEL AHEAD duration at the same instant.
  const fmtLeadDuration = (ms) => {
    if (ms == null || ms < 0) return "\u2014";
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000) % 60;
    const h = Math.floor(ms / 3600000) % 24;
    const d = Math.floor(ms / 86400000);
    if (d > 0) return `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
    if (h > 0) return `${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
    return `${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  };
  // Palette. Light mode matches the reference (white cards over a pale
  // #ECF2F8 mid-band, triangulated pattern on top/bottom bands). Dark mode
  // inverts only the band/card surfaces.
  const middleBg  = dark ? "#22252c" : "#ECF2F8";
  const cardBg    = dark ? "#2a2d35" : "#ffffff";
  const textColor = dark ? "#d8dce3" : "#4A5963";
  // Ticker text is intentionally a darker, more neutral grey than the channel
  // textColor - decouples the news crawl from the channel labels so it reads
  // as secondary chrome rather than sharing emphasis with the sub counts.
  const tickerColor = dark ? "#d0d0d0" : "#2a2d31";
  const titleColor = dark ? "#e8ecf0" : "#1a1d23";
  const dimColor  = dark ? "#8b9098" : "#6c757d";
  const barColor  = "#000000";
  const bannerBg  = dark ? "#0a0b0e" : "#000000";
  const cboColor  = dark ? "#ffffff" : "#000000";
  const borderColor = dark ? "#3a3e48" : "#D8E1E6";

  // FlareTV subscribe count. Reads displayFTV from the parent (real-data
  // channel pipeline). Falls back to a static placeholder if null.
  const flareTvCount = displayFTV != null ? displayFTV : 1_800_382;

  // Gated odometer: FlareCasinoCounter only in RT modes; otherwise render the
  // same per-character DOM it emits (same wrapper styles, same 1ch digit
  // columns with the same 0.0105em right margin, same inline-block commas)
  // minus the rolling animation. This keeps total width and digit alignment
  // byte-identical between RT and non-RT modes, so there's no horizontal
  // shift when the mode changes or playback pauses.
  // LAYOUT: Flare counter helper - see LAYOUTS.md
  const renderFlareCount = (value) => {
    if (!isRTMode) {
      if (value == null) return "\u2014";
      const formatted = Math.round(value).toLocaleString();
      return (
        <span style={{ display:"inline", fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap", lineHeight:1, letterSpacing:0 }}>
          {formatted.split("").map((ch, i) => {
            if (ch === ",") return <span key={"c"+i} style={{ display:"inline-block", verticalAlign:"top", lineHeight:1, marginRight:"0.0105em" }}>,</span>;
            return <span key={"d"+i} style={{ display:"inline-block", height:"1em", width:"1ch", textAlign:"center", lineHeight:1, verticalAlign:"top", marginRight:"0.0105em" }}>{ch}</span>;
          })}
        </span>
      );
    }
    return <FlareCasinoCounter value={value} seekToken={seekToken} mult={mult}/>;
  };

  // Font stacks. Compose Black Oblique is a display font installed locally
  // in the reference setup; web fallbacks approximate the bold-italic heavy
  // sans-serif look.
  const cboFont    = "'Compose Black Obl','Compose Black Oblique','Twemoji Country Flags','Arial Black','Franklin Gothic Heavy','Impact',sans-serif";
  // Non-italic counterpart: same weight family but without the Oblique variant.
  // Used wherever the design calls for upright Compose Black (e.g. the Twitter
  // update-banner's second line). The 'Compose Black Obl' family is an
  // intrinsically-oblique font file, so `fontStyle: normal` cannot un-italicise
  // it - a separate family-name lookup is required.
  const cbFont     = "'Compose Black','Twemoji Country Flags','Arial Black','Franklin Gothic Heavy','Impact',sans-serif";
  const robotoFont = "'Roboto','Twemoji Country Flags','Helvetica Neue',Arial,sans-serif";

  // - One channel card. Card box is 611x394 at positions per spec:
  //    PDP: top-left (15,158);  TS: top-left (654,158). 3px rounded.
  // Internal positions (all relative to the card's top-left):
  //   Banner:        y 0-100, full card width, black
  //   Profile pic:   horizontally centered (124x124 circle, 40px down from top)
  //   Crown/cup:     20x20, center-y = 200, 32px from card's INNER edge
  //                  (right edge for PDP / left edge for TS)
  //   Channel name:  26pt, top y=200, centered
  //   Sub count:     80pt, top y=285, centered (light-weight Roboto)
  //   "Subscribers": 11.5px, top y=360, centered
  // LAYOUT: Flare card - see LAYOUTS.md
  const renderScoreCard = ({ icon, name, counter, leading, isRight, banner, votes, votePct, votePctRaw, rates, extraInfo: cardExtra }) => (
    <div style={{
      position: "absolute",
      top: 158,
      left: isRight ? 654 : 15,
      width: 611, height: 394,
      background: cardBg,
      borderRadius: 3,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      overflow: "hidden",
      zIndex: 2,
    }}>
      {/* Banner image - object-fit cover so the YouTube-wide art crops to
          fill the 611x100 area while keeping center focus. */}
      <img src={banner} alt="" style={{
        position: "absolute", top: 0, left: 0, width: 611, height: 100,
        objectFit: "cover",
        zIndex: 0,
      }}/>

      {/* Profile pic - 124x124 circle, horizontally centered in the 611px card
          (left = (611-124)/2 = 243.5 -> expressed as calc(50% - 62px) so the
          pic's own center lands on the card's center). 40px down overlaps banner. */}
      <img src={icon} alt={name} style={{
        position: "absolute",
        top: 40, left: "calc(50% - 62px)",
        width: 124, height: 124,
        borderRadius: "50%",
        objectFit: "cover",
        boxShadow: dark ? "0 4px 14px rgba(0,0,0,0.45)" : "0 4px 14px rgba(0,0,0,0.18)",
        zIndex: 2,
      }}/>

      {/* Leader icon - inline SVG trophy (Font Awesome 5 "fa-trophy" solid
          path data, CC BY 4.0). Inlined rather than loaded via @import of
          all.min.css because the webfont file (.woff2) can silently fail to
          fetch while the stylesheet's content rule still applies, producing
          the "F091" unglyphed fallback. SVG has none of that fragility:
          a single path, color via currentColor. 20x20 box, icon preserves
          its natural 576:512 aspect so height renders as ~18px. */}
      {leading && (
        <div style={{
          position: "absolute",
          top: 190,
          [isRight ? "left" : "right"]: 32,
          width: 20, height: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#FFC107",
          zIndex: 1,
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" width="20" height="18" aria-hidden="true">
            <path d="M552 64H448V24c0-13.3-10.7-24-24-24H152c-13.3 0-24 10.7-24 24v40H24C10.7 64 0 74.7 0 88v56c0 35.7 22.5 68.2 56.2 80.8 33.9 12.6 68.9 20.3 104.7 24.1 33.9 48.3 74.4 74.7 107.1 80.6V384H192c-30.9 0-56 20.1-56 44v16c0 8.8 7.2 16 16 16h272c8.8 0 16-7.2 16-16v-16c0-23.9-25.1-44-56-44h-80v-69.2c32.7-6.3 73.2-32.3 107.1-80.6 35.8-3.8 70.8-11.5 104.7-24.1C553.5 212.2 576 179.7 576 144V88c0-13.3-10.7-24-24-24zM99.3 192.8C74.9 183.7 64 169.1 64 144v-16h64.2c1 32.6 5.8 61.2 12.8 86.2-15.1-4.2-29.4-9.1-41.7-13.7-.1 0 0 0 0 0zM512 144c0 25.1-10.9 39.7-35.3 48.9-12.4 4.6-26.6 9.5-41.7 13.6 7-25 11.8-53.6 12.8-86.2H512v16z"/>
          </svg>
        </div>
      )}

      {/* Channel name */}
      <div style={{
        position: "absolute",
        top: 183, left: 0, right: 0,
        textAlign: "center",
        fontFamily: robotoFont,
        fontSize: "26pt", fontWeight: 400,
        color: textColor,
        lineHeight: 1,
        zIndex: 1,
      }}>
        {name}
      </div>

      {/* Subscriber count (rolling odometer). Flex-center needed because
          FlareCasinoCounter renders a flex row of digit columns - text-align
          alone won't center it. */}
      <div style={{
        position: "absolute",
        top: 232, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        fontFamily: robotoFont,
        fontSize: "80pt", fontWeight: 300,
        fontVariantNumeric: "tabular-nums",
        color: textColor,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        zIndex: 1,
      }}>
        {renderFlareCount(counter)}
      </div>

      {/* "Subscribers" label */}
      <div style={{
        position: "absolute",
        top: 354, left: 0, right: 0,
        textAlign: "center",
        fontFamily: robotoFont,
        fontSize: "11.5px", fontWeight: 400,
        color: dimColor,
        lineHeight: 1,
        zIndex: 1,
      }}>
        Subscribers
      </div>

      {/* Vote bar - 98x1 black/white line with the vote count centered
          above and the percentage right-aligned below. Horizontal x is
          per-channel: PewDiePie card has the bar near its left edge
          (57); T-Series card has the bar near its right edge (457).
          Both text layers use scaleX(1.1) for the +10% horizontal
          stretch the spec calls for - center-anchored for the vote
          count (so it grows symmetrically about the bar's midpoint),
          right-anchored for the percentage (so its right edge stays
          12px inside the bar's right edge regardless of digit count).
          Hidden from May 18 00:00 UTC - see _isPostVoting. */}
      {!_isPostVoting && (
      <div style={{
        position: "absolute",
        top: 128, left: isRight ? 457 : 57,
        width: 98,
        textAlign: "center",
        fontFamily: robotoFont,
        fontSize: "8pt", fontWeight: 400,
        color: cboColor,
        lineHeight: 1,
        transform: "scaleX(1.06)",
        transformOrigin: "center center",
        zIndex: 2,
      }}>
        {(votes ?? 0).toLocaleString("en-US")} Votes
      </div>
      )}
      {!_isPostVoting && (
      <div style={{
        position: "absolute",
        top: 158, left: isRight ? 457 : 57,
        width: 98, height: 1,
        background: cboColor,
        zIndex: 2,
      }}/>
      )}
      {!_isPostVoting && (
      <div style={{
        position: "absolute",
        top: 169, left: isRight ? 457 : 57,
        width: 86, // 98 minus 12px of right padding, baked into the width
        textAlign: "right",
        fontFamily: robotoFont,
        fontSize: "12pt", fontWeight: 700,
        color: cboColor,
        lineHeight: 1,
        transform: "scaleX(1.06)",
        transformOrigin: "right center",
        zIndex: 2,
      }}>
        {cardExtra && typeof votePctRaw === "number" ? votePctRaw.toFixed(2) : (votePct ?? 0)}%
      </div>
      )}

      {/* Extra Info: 1 Minute / 1 Hour / 1 Day sub-gain readout placed on
          the card's INNER (center-facing) edge above the crown - right
          side for PDP, left side for TS. Rendered as "Label: +value"
          lines, Roboto 8pt on cboColor (black in light / white in dark),
          values bold. */}
      {cardExtra && rates && (
        <div style={{
          position: "absolute",
          top: 114,
          [isRight ? "left" : "right"]: isRight ? 20 : 0,
          width: 140,
          fontFamily: robotoFont,
          fontSize: "16px",
          fontWeight: 400,
          color: cboColor,
          lineHeight: 1,
          textAlign: "left",
          zIndex: 2,
        }}>
          {[["1 Minute", rates.min], ["1 Hour", rates.hour], ["1 Day", rates.day]].map(([label, v], idx) => (
            <div key={label} style={{
              fontVariantNumeric: "tabular-nums",
              marginTop: idx === 0 ? 0 : 4,
            }}>
              {label}: <span style={{ fontWeight: 700 }}>
                {v == null
                  ? "\u2014"
                  : isRTMode
                    ? <FlareCasinoCounter value={v} signed compact seekToken={seekToken} mult={mult} scale={scale}/>
                    : fmt(v, "full")}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Extra Info: "Time ahead: Nd Nh Nm Ns" readout for the channel
          currently in the lead. Positioned near the bottom-inner corner
          of the card - right side for PDP, left side for TS (mirrored),
          since for each card the "inner" edge is the one facing the
          center of the canvas. Shown only on the leading card; the
          trailing card keeps its slot empty. Duration string is produced
          by a local fmtLeadDuration clone of the dashboard's formatter
          (already applied to second-granular ms by the App). */}
      {cardExtra && leading && leadMs != null && (
        <div style={{
          position: "absolute",
          bottom: 18,
          [isRight ? "left" : "right"]: 20,
          fontFamily: robotoFont,
          fontSize: "8pt",
          fontWeight: 400,
          color: cboColor,
          lineHeight: 1,
          textAlign: "left",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
          zIndex: 2,
        }}>
          Time ahead: <span style={{ fontWeight: 700 }}>{fmtLeadDuration(leadMs)}</span>
        </div>
      )}

      {/* Border overlay - rendered LAST so it sits above the banner, profile
          pic, and text. Uses inset:0 + border-box so the 1px stroke traces
          the card's exact 611x394 outer edge without affecting layout. */}
      <div style={{
        position: "absolute",
        inset: 0,
        border: "1px solid " + borderColor,
        borderRadius: 3,
        boxSizing: "border-box",
        pointerEvents: "none",
        zIndex: 5,
      }}/>
    </div>
  );

  // Subtitle copy is date-dependent. Thresholds use UTC to match the rest
  // of the stream's timekeeping:
  //   • before May 14 2019  - "WHO WILL PREVAIL?"
  //   • May 14 through end of May 18 (exclusive of May 19 00:00 UTC)
  //                          - "RACE TO 100 MILLION"
  //   • May 19 00:00 UTC onward - "CONGRATULATIONS TO PEWDIEPIE AND T-SERIES ON 100M!"
  //   • May 20 00:00 UTC onward - "P/T DIFFERENCE:" (Music-era layout
  //                                takes over: title gains "VS MUSIC",
  //                                bottom sub-gap box becomes a Music
  //                                channel card, and a small floating
  //                                P/T gap pill appears at the top of
  //                                the cards row).
  const _subtitleT = clockTime || 0;
  const _isMusicEra = _subtitleT >= Date.UTC(2019, 4, 22, 0, 0);
  // Vote infrastructure is retired at May 20 00:00 UTC - same threshold
  // used by the news-ticker strawpoll fragment. Three things turn off
  // together: the per-card "X Votes / Y%" mini-bar, and the rotating
  // bottom-left Poll banner ("LINK IN DESCRIPTION / VOTE WHO YOU SUPPORT").
  // The bottom-left rotation collapses from 3 slots (Twitter/Poll/Discord)
  // to 2 (Twitter/Discord) so there's no "dead" frame in the cycle.
  const _isPostVoting = _subtitleT >= Date.UTC(2019, 4, 20, 0, 0);
  const titleText = _isMusicEra ? "PEWDIEPIE VS T-SERIES VS MUSIC" : "PEWDIEPIE VS T-SERIES";
  const subtitleText =
    _isMusicEra ? "P/T DIFFERENCE:" :
    _subtitleT < Date.UTC(2019, 4, 14) ? "WHO WILL PREVAIL?" :
    _subtitleT < PDP_100M_TS ? "RACE TO 100 MILLION" :
    _subtitleT < BOTH_100M_TS ? "CONGRATULATIONS TO PEWDIEPIE ON 100M!" :
    "CONGRATULATIONS TO PEWDIEPIE AND T-SERIES ON 100M!";

  // Bottom-left call-to-action panel rotates through Twitter and Poll
  // (Discord reserved for a future slot). Each variant swaps in with an
  // opacity crossfade at a 15 s hold, 800 ms fade - the hold is long
  // enough to read and the fade short enough that the next banner lands
  // well before the next rotation. The cycle speeds up/slows down with
  // the playback multiplier and is suspended entirely while playback
  // is paused: the interval is only installed when `playing` is true,
  // and the cleanup on the playing->paused transition clears it. On
  // resume, the 15 s timer restarts from zero rather than continuing
  // from mid-hold - acceptable here since the rotation is ambient
  // chrome, not time-synced content.
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerCount = _isPostVoting ? 2 : 3; // Twitter, [Poll,] Discord
  useEffect(() => {
    if (!playing) return;
    const effMult = mult > 0 ? mult : 1;
    const id = setInterval(() => {
      setBannerIdx(i => (i + 1) % bannerCount);
    }, 15000 / effMult);
    return () => clearInterval(id);
  }, [mult, playing]);

  return (
    <div style={{
      width: 1280, height: 720,
      position: "relative", overflow: "hidden",
      fontFamily: robotoFont,
      color: textColor,
      margin: "0 auto",
    }}>
      {/* Triangulated pattern fills the whole canvas; the mid-band rectangle
          sits on top of it for y=146-588, leaving top/bottom strips showing
          the pattern. */}
      <FlareBackground dark={dark}/>

      {/* Mid-band (#ECF2F8) between the two horizontal rules */}
      <div style={{
        position: "absolute",
        top: 146, left: 0, right: 0, bottom: 132,
        background: middleBg,
        zIndex: 1,
      }}/>

      {/* Top rule: 3px at y=143 */}
      <div style={{
        position: "absolute",
        top: 143, left: 0, right: 0, height: 3,
        background: barColor, zIndex: 3,
      }}/>
      {/* Bottom rule: 2px at y=588 */}
      <div style={{
        position: "absolute",
        top: 588, left: 0, right: 0, height: 2,
        background: barColor, zIndex: 3,
      }}/>

      {/* Title - 46.5pt Compose Black Oblique, top of text at y=34.
          After May 20 (Music era, _isMusicEra) the title alone scales to
          90%, anchored at its own center (default transform-origin
          50%/50%). The subtitle is unaffected. */}
      <div style={{
        position: "absolute",
        top: 34, left: 0, right: 0,
        textAlign: "center",
        fontFamily: cboFont,
        fontWeight: 900,
        fontSize: "46.5pt",
        color: cboColor,
        lineHeight: 1,
        zIndex: 2,
        transform: _isMusicEra ? "scale(0.9)" : "none",
      }}>
        {titleText}
      </div>

      {/* Subtitle - 16.5pt CBO, top of text at y=98 */}
      <div style={{
        position: "absolute",
        top: 98, left: 0, right: 0,
        textAlign: "center",
        fontFamily: cboFont,
        fontWeight: 900,
        fontSize: "16.5pt",
        color: cboColor,
        lineHeight: 1,
        zIndex: 2,
      }}>
        {subtitleText}
      </div>

      {/* Channel cards */}
      {(() => {
        const v = resolveVoteCounts(clockTime);
        // Unrounded vote percentages for the Extra Info 2-decimal display.
        // resolveVoteCounts returns Math.round()ed pcts, which is fine for the
        // default view but destroys the sub-integer precision Extra Info needs.
        const totalV    = v.pdp + v.ts;
        const pdpPctRaw = totalV > 0 ? (v.pdp / totalV) * 100 : 50;
        const tsPctRaw  = totalV > 0 ? (v.ts  / totalV) * 100 : 50;
        // 1m/1h/1d sub-gain values sourced identically to the Dashboard
        // scoreboard (lines ~7468-7511): subsPerMinTable[0] is already
        // subs/min, [2] is subs/min over a 1-hour window (x60 -> subs/hr),
        // [4] is subs/min over a 1-day window (x1440 -> subs/day).
        const ratesFor = (side) => subsPerMinTable ? {
          min:  subsPerMinTable[side]?.[0] != null ? Math.round(subsPerMinTable[side][0])        : null,
          hour: subsPerMinTable[side]?.[2] != null ? Math.round(subsPerMinTable[side][2] * 60)   : null,
          day:  subsPerMinTable[side]?.[4] != null ? Math.round(subsPerMinTable[side][4] * 1440) : null,
        } : null;
        return (
          <>
            {renderScoreCard({
              icon: pdpIcon, name: "PewDiePie", counter: displayPt,
              leading: pdpLeading, isRight: false, banner: resolveTsBanner(clockTime, PDP_BANNERS),
              votes: v.pdp, votePct: v.pdpPct, votePctRaw: pdpPctRaw,
              rates: ratesFor("pdp"), extraInfo,
            })}
            {renderScoreCard({
              icon: tsIcon, name: "T-Series", counter: displayTt,
              leading: !pdpLeading, isRight: true, banner: resolveTsBanner(clockTime, rareBannerUpd ? TS_BANNERS_RARE : TS_BANNERS),
              votes: v.ts, votePct: v.tsPct, votePctRaw: tsPctRaw,
              rates: ratesFor("ts"), extraInfo,
            })}
          </>
        );
      })()}

      {/* P/T difference pill (May 20+) - 154x42 floating box centered
          horizontally at left = (1280−154)/2 = 563. Top:130 places it
          just below the subtitle (which ends at ~y=120) with its
          bottom edge dipping ~14px past the cards' top edge (y=158),
          matching the reference layout. zIndex:4 keeps it above the
          card chrome (zIndex:2). Roboto 20pt/500, FlareCasinoCounter
          via renderFlareCount so the digit-roll animation shares the
          rest of the Flare display's pipeline. */}
      {_isMusicEra && (
      <div style={{
        position: "absolute",
        top: 146, left: (1280 - 154) / 2,
        width: 154, height: 42,
        background: cardBg,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.20)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: robotoFont,
        fontSize: "20pt", fontWeight: 500,
        color: titleColor,
        lineHeight: 1,
        zIndex: 4,
      }}>
        {renderFlareCount(Math.abs(currentGap || 0))}
      </div>
      )}

      {/* News ticker - 32px strip directly above the y=588 black rule.
          Occupies the empty gap below the channel cards (which end at
          y=552) and renders a day-dependent scrolling marquee whose
          content is re-read at every scroll-pass boundary. */}
      <FlareNewsTicker
        clockTime={clockTime}
        textColor={tickerColor}
        robotoFont={robotoFont}
        mult={mult}
        playing={playing}
      />

      {/* Sub-gap box - 427x118 at (427,597), 4px rounded. Horizontally
          centered on the 1280-wide canvas ((1280−427)/2 = 426.5 ≈ 427).
          Pre-Music-era: dark "X subscribers apart" panel for PDP/TS.
          From May 20 onwards this slot is taken over by the Music card
          rendered just below. */}
      {!_isMusicEra && (
      <div style={{
        position: "absolute",
        top: 597, left: 427,
        width: 427, height: 118,
        background: "#3E3C3F",
        borderRadius: 4,
        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        color: "#ffffff",
        gap: 2,
        zIndex: 2,
      }}>
        <div style={{
          fontFamily: robotoFont,
          fontSize: "14pt", fontWeight: 400,
          lineHeight: 1.1,
        }}>
          PewDiePie and T-Series are
        </div>
        <div style={{
          fontFamily: robotoFont,
          fontSize: "44pt", fontWeight: 300,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          letterSpacing: "-0.01em",
          display: "flex", justifyContent: "center",
        }}>
          {renderFlareCount(Math.abs(currentGap || 0))}
        </div>
        <div style={{
          fontFamily: robotoFont,
          fontSize: "14pt", fontWeight: 400,
          lineHeight: 1.1,
        }}>
          subscribers apart
        </div>
      </div>
      )}


      {/* FlareTV block - pic at (930,604), 82x82. Outer is a column:
            Row 1: icon + [FlareTV label / subscriber count]
            Row 2: SUBSCRIBE - SEE THIS COUNT GO UP  (spans below the row) */}
      <div style={{
        position: "absolute",
        top: 604, left: 930,
        zIndex: 2,
        display: "flex", flexDirection: "column",
        gap: 6,
      }}>
        {/* Row 1 - icon beside FlareTV label + subscriber count */}
        <div style={{
          display: "flex", gap: 14,
          height: 82,
          alignItems: "stretch",
        }}>
          {/* FlareTV icon, 82x82, per spec */}
          <img src={flareTvIcon} alt="FlareTV" style={{
            width: 82, height: 82,
            objectFit: "cover",
            flexShrink: 0,
          }}/>

          {/* Text column - only two items now, centered vertically against the icon */}
          <div style={{
            display: "flex", flexDirection: "column",
            justifyContent: "center",
            gap: 6,
          }}>
            <div style={{
              fontFamily: robotoFont,
              fontWeight: 300, fontSize: "17pt",
              color: cboColor, lineHeight: 1,
            }}>
              FlareTV
            </div>
            <div style={{
              fontFamily: robotoFont,
              fontWeight: 700, fontSize: "27pt",
              fontVariantNumeric: "tabular-nums",
              color: cboColor, lineHeight: 1,
              display: "flex",
            }}>
              {renderFlareCount(flareTvCount)}
            </div>
          </div>
        </div>

        {/* Row 2 - SUBSCRIBE caption, below the icon+text row */}
        <div style={{
          fontFamily: cboFont,
          fontWeight: 900,
          fontSize: "13pt", letterSpacing: "0.01em",
          color: cboColor, lineHeight: 1,
        }}>
          SUBSCRIBE - SEE THIS COUNT GO UP
        </div>
      </div>

      {/* Bottom-left rotating call-to-action banner. Two variants share the
          same visual footprint: a 75x75 icon at (29, 618) and a 288x76 black
          text box at (112, 618). The active variant fades in while the other
          fades out, swapping every 15 s. Both wrappers are absolute/inset:0
          so the inner pieces remain anchored to the 1280x720 FlareView
          canvas at their original coordinates. */}

      {/* Twitter variant */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: bannerIdx === 0 ? 1 : 0,
        transition: `opacity ${800 / mult}ms ease-in-out`,
        pointerEvents: "none",
        zIndex: 2,
      }}>
        <div
          style={{
            position: "absolute",
            top: 618, left: 29,
            width: 75, height: 75,
            background: "#1DA1F2",
            pointerEvents: "none",
          }}
        />
        <img
          src={twitterIcon}
          alt=""
          style={{
            position: "absolute",
            top: 625.5, left: 36.5,
            width: 60, height: 60,
            display: "block",
            pointerEvents: "none",
          }}
        />
        <div style={{
          position: "absolute",
          top: 618, left: 112,
          width: 288, height: 76,
          background: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          paddingLeft: 12,
          paddingRight: 12,
          color: "#fff",
          lineHeight: 1.15,
          gap: 6,
        }}>
          <div style={{
            // Montserrat Black Italic is assumed to be a locally-installed display
            // font (mirroring the Compose Black Obl pattern used elsewhere in
            // this view). Fallbacks cascade through bold-italic display stacks.
            fontFamily: "'Montserrat Black Italic','Montserrat Black','Arial Black','Franklin Gothic Heavy','Impact',sans-serif",
            fontSize: "12pt",
            fontStyle: "italic",
          }}>
            @OFFICIALFLARETV
          </div>
          <div style={{
            fontFamily: "'Montserrat Black','Arial Black','Franklin Gothic Heavy','Impact',sans-serif",
            fontSize: "11pt",
          }}>
            CHANNEL &amp; STREAM UPDATES
          </div>
        </div>
      </div>

      {/* Poll variant - white rounded-square icon with a bold black
          checkmark (inline SVG so no additional asset is needed), plus
          the "LINK IN DESCRIPTION / VOTE WHO YOU SUPPORT" text box in
          the same position/style as the Twitter text box.
          Removed entirely from May 18 00:00 UTC onwards (voting era ends). */}
      {!_isPostVoting && (
      <div style={{
        position: "absolute", inset: 0,
        opacity: bannerIdx === 1 ? 1 : 0,
        transition: `opacity ${800 / mult}ms ease-in-out`,
        pointerEvents: "none",
        zIndex: 2,
      }}>
        <svg
          width="75" height="75" viewBox="0 0 75 75"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 618, left: 29,
            display: "block",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <rect width="75" height="75" fill="#000000"/>
          <rect
            x="15" y="15" width="45" height="45"
            fill="#000000"
            stroke="#ffffff" strokeWidth="5"
          />
          <image
            href={pollCheckmarkIcon}
            x="20" y="20" width="35" height="35"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
        <div style={{
          position: "absolute",
          top: 618, left: 112,
          width: 288, height: 76,
          background: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          paddingLeft: 12,
          paddingRight: 12,
          color: "#fff",
          lineHeight: 1.15,
          gap: 6,
        }}>
          <div style={{
            fontFamily: "'Montserrat Black Italic','Montserrat Black','Arial Black','Franklin Gothic Heavy','Impact',sans-serif",
            fontSize: "12pt",
            fontStyle: "italic",
          }}>
            LINK IN DESCRIPTION
          </div>
          <div style={{
            fontFamily: "'Montserrat Black','Arial Black','Franklin Gothic Heavy','Impact',sans-serif",
            fontSize: "11pt",
          }}>
            VOTE WHO YOU SUPPORT
          </div>
        </div>
      </div>
      )}

      {/* Discord variant - full-bleed 75x75 Discord icon with matching text box.
          Lives at idx 2 in the pre-voting (Twitter/Poll/Discord) rotation, idx 1
          in the post-voting (Twitter/Discord) rotation - Poll vacates slot 1. */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: bannerIdx === (_isPostVoting ? 1 : 2) ? 1 : 0,
        transition: `opacity ${800 / mult}ms ease-in-out`,
        pointerEvents: "none",
        zIndex: 2,
      }}>
        <img
          src={discordIcon}
          alt=""
          style={{
            position: "absolute",
            top: 618, left: 29,
            width: 75, height: 75,
            display: "block",
            pointerEvents: "none",
          }}
        />
        <div style={{
          position: "absolute",
          top: 618, left: 112,
          width: 288, height: 76,
          background: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          paddingLeft: 12,
          paddingRight: 12,
          color: "#fff",
          lineHeight: 1.15,
          gap: 6,
        }}>
          <div style={{
            fontFamily: "'Montserrat Black Italic','Montserrat Black','Arial Black','Franklin Gothic Heavy','Impact',sans-serif",
            fontSize: "12pt",
            fontStyle: "italic",
          }}>
            LINK IN DESCRIPTION
          </div>
          <div style={{
            fontFamily: "'Montserrat Black','Arial Black','Franklin Gothic Heavy','Impact',sans-serif",
            fontSize: "11pt",
          }}>
            PDP VS T DISCORD SERVER
          </div>
        </div>
      </div>
    </div>
  );
});


// - SB LAYOUT COLORS -
const salmon = "#E08080";
const red = "#E62117";
const gapBlue = "#7EA8D4";
const lightGray = "#D0D0D0";
const medGray = "#BFBFBF";

// LAYOUT: SocialBlade - see LAYOUTS.md
const sbWatermark = (x, y, w, h, dark=true) => (
  <svg viewBox="0 0 24 18.581" style={{ position:"absolute", left:x, top:y, width:w, height:h, fill:dark?"#100503":"#d64e33", opacity:dark?1:0.1, pointerEvents:"none" }} preserveAspectRatio="none">
    <path d="M2.323 16.688H0v1.893h2.323v-1.893ZM5.935 13.591H3.613v4.99h2.322v-4.99ZM9.548 14.796H7.226v3.785h2.322v-3.785ZM13.161 13.935H10.84v4.646h2.322v-4.646ZM16.774 12.043h-2.322v6.538h2.322v-6.538ZM20.387 10.065h-2.323v8.516h2.323v-8.516ZM24 5.42h-2.323v13.16H24V5.42Z"/>
  </svg>
);
const ytIcon = <svg viewBox="0 0 576 512" style={{ width:22, height:19, verticalAlign:"middle", fill:"#aaa", display:"inline-block", position:"relative", top:-10 }}><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>;
const ytIconSmall = <svg viewBox="0 0 576 512" style={{ width:8, height:7, verticalAlign:"middle", fill:"#aaa", display:"inline-block", position:"relative", top:-4 }}><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>;

const cellStyle = (w, h, align="left", dark=true) => ({
  width:w, height:h, maxHeight:h, textAlign:align, padding:"0 3px", boxSizing:"border-box",
  lineHeight:`${h}px`, borderTop:"1px solid "+(dark?"#888":"#888"), borderLeft:"1px solid "+(dark?"#888":"#888"),
  borderBottom:"1px solid "+(dark?"#222":"#555"), borderRight:"1px solid "+(dark?"#222":"#555"),
  boxShadow:dark?"inset 1px 1px 0 #000, inset -1px -1px 0 #000, inset 2px 2px 0 #777, inset -2px -2px 0 #333":"inset 1px 1px 0 #fff, inset -1px -1px 0 #fff, inset 2px 2px 0 #bbb, inset -2px -2px 0 #888",
  background:dark?"#000":"#fff", overflow:"hidden", whiteSpace:"nowrap",
});
const auditCellStyle = (align="left", dark=true) => ({
  padding:"1px 2px", boxSizing:"border-box", borderTop:"1px solid "+(dark?"#888":"#888"), borderLeft:"1px solid "+(dark?"#888":"#888"),
  borderBottom:"1px solid "+(dark?"#222":"#555"), borderRight:"1px solid "+(dark?"#222":"#555"),
  boxShadow:dark?"inset 1px 1px 0 #000, inset -1px -1px 0 #000, inset 2px 2px 0 #777, inset -2px -2px 0 #333":"inset 1px 1px 0 #fff, inset -1px -1px 0 #fff, inset 2px 2px 0 #bbb, inset -2px -2px 0 #888",
  background:dark?"#000":"#fff", textAlign:align, whiteSpace:"nowrap",
});

// Smoothly interpolate a [lo, hi] domain toward a moving target over `duration` ms.
// When `enabled` is false, returns the target unchanged (no animation, no lag).
// Re-targets cleanly mid-flight: each new target restarts from the current
// interpolated value, no snap.
function useSmoothBounds(target, duration = 500, enabled = true) {
  const valid = Array.isArray(target) && target.length === 2 &&
                Number.isFinite(target[0]) && Number.isFinite(target[1]);
  const [smoothed, setSmoothed] = useState(valid ? [target[0], target[1]] : target);
  const fromRef = useRef(valid ? [target[0], target[1]] : null);
  const toRef = useRef(valid ? [target[0], target[1]] : null);
  const startRef = useRef(0);
  const rafRef = useRef(null);
  const curRef = useRef(valid ? [target[0], target[1]] : null);
  const tLo = valid ? target[0] : null;
  const tHi = valid ? target[1] : null;
  useEffect(() => {
    if (!valid) return;
    if (!enabled) {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      curRef.current = [tLo, tHi];
      // Keep React state in sync with the target while disabled. Without
      // this, when `enabled` later flips back to true (e.g. after a pause
      // or seek), the first render reads stale `smoothed` from before the
      // disable. Y-axis then displays the stale domain until either curRef
      // diverges from the target (retriggering animation) or data exceeds
      // the stale bounds. Functional updater + epsilon check lets React
      // bail out when the value already matches - no spurious re-render.
      setSmoothed(prev => (prev && Math.abs(prev[0] - tLo) < 1e-9 && Math.abs(prev[1] - tHi) < 1e-9) ? prev : [tLo, tHi]);
      return;
    }
    if (curRef.current && Math.abs(curRef.current[0] - tLo) < 1e-9 && Math.abs(curRef.current[1] - tHi) < 1e-9) {
      // No animation needed (target matches current), but `smoothed` may
      // still be stale from a prior disabled period. Sync it.
      setSmoothed(prev => (prev && Math.abs(prev[0] - tLo) < 1e-9 && Math.abs(prev[1] - tHi) < 1e-9) ? prev : [tLo, tHi]);
      return;
    }
    fromRef.current = curRef.current ? [curRef.current[0], curRef.current[1]] : [tLo, tHi];
    toRef.current = [tLo, tHi];
    startRef.current = (typeof performance !== "undefined" ? performance.now() : Date.now());
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const v0 = fromRef.current[0] + (toRef.current[0] - fromRef.current[0]) * e;
      const v1 = fromRef.current[1] + (toRef.current[1] - fromRef.current[1]) * e;
      curRef.current = [v0, v1];
      setSmoothed([v0, v1]);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };
  }, [tLo, tHi, duration, enabled, valid]);
  return (enabled && valid) ? smoothed : target;
}

// - DASHBOARD THEME & HELPERS -
const DC = {
  PDP:"#3b82f6", TS:"#ef4444", GAP_POS:"#22c55e", GAP_NEG:"#f97316",
  BG:"#181b24", CARD:"#0f1117", BORDER:"#2a2d38", TEXT:"#c8cdd6", DIM:"#9ca3af",
};

const niceTicks = (domain, small) => {
  const [lo,hi] = domain;
  if (!isFinite(lo)||!isFinite(hi)) return [0];
  const range = hi - lo;
  if (range <= 0) return [0];
  let step;
  if (small) step = range<20?5:range<50?10:range<100?20:range<200?50:range<500?100:range<1000?200:range<2000?500:range<5000?1000:range<10000?2000:range<20000?5000:range<50000?10000:range<100000?20000:50000;
  else step = range<200000?50000:range<500000?100000:range<1000000?200000:range<2000000?500000:range<5000000?1000000:1000000;
  const ticks = [];
  const start = Math.ceil(lo/step)*step;
  for (let v=start;v<=hi;v+=step) ticks.push(v);
  if (lo<=0&&hi>=0&&!ticks.includes(0)){ticks.push(0);ticks.sort((a,b)=>a-b);}
  if (ticks.length===0) ticks.push(0);
  return ticks;
};

// Snap a tight [lo, hi] domain outward to multiples of a 1/2/2.5/5 x 10^n step
// (~5 intervals). Unlike recharts' 'auto' domain this returns concrete numbers,
// so it can be run through useSmoothBounds for an eased step transition.
const roundDomain = (dom) => {
  if (!Array.isArray(dom)) return dom;
  let [lo, hi] = dom;
  if (!isFinite(lo) || !isFinite(hi)) return dom;
  if (lo === hi) { lo -= 1; hi += 1; }
  const rawStep = (hi - lo) / 5;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  return [Math.floor(lo / step) * step, Math.ceil(hi / step) * step];
};

// Round Y-axis for the historical gap charts: scan the data's gap (plus the live
// tip), pick a 1/2/5 x 10^n step for ~5 ticks, snap the domain to multiples of it.
// Returns {domain, ticks} for recharts (pass BOTH so recharts uses the round
// step instead of its own 0.05-granular one). Falls back to auto on no data.
const roundGapAxis = (data, curG) => {
  let lo = Infinity, hi = -Infinity;
  for (const d of data) { if (d.g != null) { if (d.g < lo) lo = d.g; if (d.g > hi) hi = d.g; } }
  if (curG != null) { if (curG < lo) lo = curG; if (curG > hi) hi = curG; }
  if (!isFinite(lo)) return { domain: ['auto', 'auto'], ticks: undefined };
  if (lo === hi) { lo -= 1; hi += 1; }
  const rawStep = (hi - lo) / 5;   // ~5-6 ticks
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const dlo = Math.floor(lo / step) * step;
  const dhi = Math.ceil(hi / step) * step;
  const ticks = [];
  for (let v = dlo; v <= dhi + step * 0.5; v += step) ticks.push(Math.round(v));
  return { domain: [dlo, dhi], ticks };
};

// LAYOUT: Dashboard card helper - see LAYOUTS.md
const DashRateDisplay = React.memo(({label,value,color,dc}) => {
  const d = dc || DC;
  return (
  <div style={{textAlign:"left",width:90,flexShrink:0}}>
    <div style={{fontSize:12,color:d.DIM}}>{label}</div>
    <div style={{fontSize:14,fontWeight:700,fontVariantNumeric:"tabular-nums",color}}>
      {value!=null?(value>=0?"+":"")+Math.round(value).toLocaleString():"\u2014"}
    </div>
  </div>
  );
});

// Returns ReferenceDot elements for the last visible point on each line.
// Monotone cubic (Fritsch-Carlson) interpolation matching recharts type="monotone".
// Finds the 4 surrounding points and applies hermite cubic with monotone slope constraints.
const _monoInterp = (data, tCur, key) => {
  let i1 = -1;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i].t <= tCur && data[i+1].t >= tCur) { i1 = i; break; }
  }
  if (i1 < 0) return data[data.length-1]?.[key] ?? null;
  const p0 = data[Math.max(0, i1-1)], p1 = data[i1], p2 = data[i1+1], p3 = data[Math.min(data.length-1, i1+2)];
  const y0=p0[key], y1=p1[key], y2=p2[key], y3=p3[key];
  if (y0==null||y1==null||y2==null||y3==null) return y1;
  const h = p2.t - p1.t;
  if (h === 0) return y1;
  const d1 = (y2-y0)/(p2.t-p0.t), d2 = (y3-y1)/(p3.t-p1.t);
  const delta = (y2-y1)/h;
  // Fritsch-Carlson monotone constraints
  const m1 = delta===0||Math.sign(d1)!==Math.sign(delta) ? 0 : (Math.abs(d1)>3*Math.abs(delta)?3*delta:d1);
  const m2 = delta===0||Math.sign(d2)!==Math.sign(delta) ? 0 : (Math.abs(d2)>3*Math.abs(delta)?3*delta:d2);
  const f = (tCur - p1.t) / h;
  const f2=f*f, f3=f2*f;
  return (2*f3-3*f2+1)*y1 + (f3-2*f2+f)*h*m1 + (-2*f3+3*f2)*y2 + (f3-f2)*h*m2;
};

const endDots = (data, tCur, specs) => {
  if (!data || !data.length) return null;
  // x anchor: clamp tCur to data range
  const xVal = Math.min(tCur, data[data.length-1].t);
  const pts = specs.map(({key, color, fmtMode, exact}) => {
    const val = _monoInterp(data, xVal, key);
    if (val == null) return null;
    // Dot sits on the line (val); the label can be overridden with the exact
    // current metric value (matching the live counters) when supplied.
    const labelVal = (exact != null && isFinite(exact)) ? exact : val;
    return {key, xVal, val, displayVal: Math.round(labelVal), color, fmtMode};
  }).filter(Boolean);
  if (!pts.length) return null;
  return (
    <Customized key="enddots" component={({xAxisMap, yAxisMap}) => {
      const xScale = Object.values(xAxisMap)[0]?.scale;
      const yScale = Object.values(yAxisMap)[0]?.scale;
      if (!xScale || !yScale) return null;
      return (
        <g style={{pointerEvents:'none'}}>
          {[...pts].sort((a,b) => a.val - b.val).map(({key, xVal, val, displayVal, color, fmtMode}) => {
            const cx = xScale(xVal), cy = yScale(val);
            if (cx==null||cy==null||isNaN(cx)||isNaN(cy)) return null;
            return (
              <g key={key}>
                <circle cx={cx} cy={cy} r={4} fill={color} stroke="#ffffff" strokeWidth={1.5}/>
                <text x={cx+10} y={cy+4} fill={color} fontSize={11} fontFamily="Inter,system-ui,sans-serif" fontWeight={600}>{fmt(displayVal,fmtMode)}</text>
              </g>
            );
          })}
        </g>
      );
    }}/>
  );
};

// LAYOUT: Dashboard card - see LAYOUTS.md
const miniTogBtn = (active) => ({
  background: active ? "#1a2535" : "transparent",
  color: active ? "#7bc8f0" : "#444",
  border: "1px solid " + (active ? "#2a5878" : "#282828"),
  borderRadius: 3,
  padding: "1px 5px",
  fontSize: 9,
  cursor: "pointer",
  fontFamily: "inherit",
  lineHeight: "1.5",
});
const DashChartCard = React.memo(({title,children,dc,controls}) => {
  const d = dc || DC;
  return (
  <div style={{background:d.CARD,border:"1px solid "+d.BORDER,borderRadius:10,padding:"14px 10px 6px 10px",flex:1,minWidth:0,minHeight:0,overflow:"hidden",display:"flex",flexDirection:"column"}}>
    <div style={{padding:"0 6px",marginBottom:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{color:d.TEXT,fontWeight:700,fontSize:14,letterSpacing:"0.02em"}}>{title}</span>
      {controls && <div style={{display:"flex",alignItems:"center",gap:3}}>{controls}</div>}
    </div>
    <div style={{flex:1,minHeight:0}}>{children}</div>
  </div>
  );
});

// LAYOUT: Dashboard chart helper - see LAYOUTS.md
const DashTooltip = ({active,payload,label,fmtMode,dc,flare,flareDark}) => {
  if (!active||!payload?.length) return null;
  const d = dc || DC;
  const useLightBg = flare && !flareDark;
  const bg = useLightBg ? "#ffffff" : "#1e2130";
  const shadow = useLightBg ? "0 2px 8px rgba(0,0,0,0.08)" : "none";
  const dt = new Date(label + _getEasternOffset(label) * 3600000);
  const datePart = dt.toLocaleDateString("en-US",{timeZone:"UTC",month:"short",day:"numeric"});
  const timePart = dt.toLocaleTimeString("en-US",{timeZone:"UTC",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
  return (
    <div style={{background:bg,border:"1px solid "+d.BORDER,borderRadius:6,padding:"8px 12px",fontSize:12,boxShadow:shadow}}>
      <div style={{color:d.DIM,marginBottom:4}}>{datePart+" "+timePart}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color,fontWeight:600}}>{p.name}: {fmt(p.value,fmtMode)}</div>
      ))}
    </div>
  );
};

// LAYOUT: Dashboard PDP/TS milestone - see LAYOUTS.md
const DashMilestone = ({pdpSubs,tsSubs,pdpDaily,tsDaily,curTime:ct,dc,flare,flareDark,duration=0,seekToken=0,altLayout=false}) => {
  const pdpDisp = pdpSubs ?? null;
  const tsDisp  = tsSubs  ?? null;
  const d = dc || DC;
  // Colors: only "light Flare" uses the washed-out pastel palette. Dark Flare
  // shares the original dark-on-dark treatment with non-Flare mode since both
  // sit on dark backgrounds.
  const useLightColors = flare && !flareDark;
  const barBg = useLightColors ? "#eef2f6" : "#1e2130";
  const pdpGradStart = useLightColors ? "#cfe1ff" : "#1e3a5f";
  const tsGradStart = useLightColors ? "#ffd5d5" : "#5f1e1e";
  const barLabelColor = useLightColors ? "#212529" : "#fff";
  const barLabelShadow = useLightColors ? "none" : "0 1px 3px rgba(0,0,0,0.6)";

  // Flare-only compact sizing. Dark mode keeps the original calibration; Flare
  // shrinks every metric (outer padding, header, bar height, in-bar label size,
  // side padding, ETA row) by roughly 20-30 % so the milestone block occupies
  // less vertical real estate in the lighter layout.
  const pad       = flare ? "4px 0 5px"   : "6px 0 8px";
  const headerFs  = flare ? 8             : 9;
  const headerMb  = flare ? 3             : 5;
  const barH      = flare ? 12            : 16;
  const barFs     = flare ? 9             : 10;
  const barSide   = flare ? 6             : 8;
  const etaPad    = flare ? "3px 6px 0"   : "4px 8px 0";
  const etaFs     = flare ? 8             : 8;

  const nextMs=(v)=>Math.ceil(v/1e6)*1e6;
  const prevMs=(v)=>Math.floor(v/1e6)*1e6;
  const etaDate=(subs,daily)=>{
    if(subs==null||daily==null||daily<=0)return null;
    const rem=nextMs(subs)-subs;
    if(rem<=0)return null;
    return new Date(ct+(rem/daily)*86400000);
  };
  const fmtEta=(dt)=>{
    if(!dt)return"\u2014";
    const ts=dt.getTime();
    const etOff=_getEasternOffset(ts);
    const d=new Date(ts+etOff*3600000);
    const mon=d.toLocaleDateString("en-US",{timeZone:"UTC",month:"short",day:"numeric"});
    const hr=d.getUTCHours();
    return mon+" "+(hr%12||12)+(hr<12?"am":"pm")+" "+(etOff===-4?"EDT":"EST");
  };
  const renderBar=(label,val,color,gradStart,roundTop)=>{
    const next=val!=null?nextMs(val):null;
    const prev=val!=null?prevMs(val):null;
    const pct=val!=null&&next!==prev?((val-prev)/(next-prev))*100:0;
    const radius=roundTop?`${barH/2}px ${barH/2}px 0 0`:`0 0 ${barH/2}px ${barH/2}px`;
    return (
      <div style={{background:barBg,borderRadius:radius,height:barH,overflow:"hidden",width:"100%",position:"relative"}}>
        <div style={{width:"100%",height:"100%",borderRadius:radius,background:`linear-gradient(90deg,${gradStart},${color})`,boxShadow:`0 0 8px ${color}4d`,transformOrigin:"left",transform:`scaleX(${pct/100})`,transition:duration?`transform ${duration}ms linear`:undefined}}/>
        <div style={{position:"absolute",top:0,left:barSide,height:"100%",display:"flex",alignItems:"center",fontSize:barFs,fontWeight:700,color:barLabelColor,textShadow:barLabelShadow}}>
          {label} -> {next!=null?(next/1e6).toFixed(0)+"M":"\u2014"}
        </div>
        <div style={{position:"absolute",top:0,right:barSide,height:"100%",display:"flex",alignItems:"center",fontSize:barFs,fontWeight:600,color:barLabelColor,textShadow:barLabelShadow,fontVariantNumeric:"tabular-nums"}}>
          {(Math.floor(pct * 10) / 10).toFixed(1)}%
        </div>
      </div>
    );
  };
  const pdpEta=etaDate(pdpSubs,pdpDaily), tsEta=etaDate(tsSubs,tsDaily);
  const pdpNext=pdpSubs!=null?nextMs(pdpSubs):null, tsNext=tsSubs!=null?nextMs(tsSubs):null;

  if (altLayout) {
    const altBarH = 10;
    const rows = [
      {name:"PewDiePie", val:pdpDisp, color:d.PDP, gradStart:pdpGradStart, eta:pdpEta, next:pdpNext},
      {name:"T-Series",  val:tsDisp,  color:d.TS,  gradStart:tsGradStart,  eta:tsEta,  next:tsNext},
    ];
    return (
      <div style={{padding:"2px 0",flexShrink:0}}>
        <div style={{fontSize:9,color:d.TEXT,textAlign:"center",marginBottom:5}}>Progress to Next Milestone</div>
        {rows.map(({name,val,color,gradStart,eta,next},i)=>{
          const prev=val!=null?prevMs(val):null;
          const pct=val!=null&&next!==prev?((val-prev)/(next-prev))*100:0;
          return (
            <div key={name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:i===0?5:0}}>
              <div style={{minWidth:120,fontSize:11,fontWeight:700,color:d.TEXT,whiteSpace:"nowrap",flexShrink:0}}>
                <span style={{color}}>{name}</span>{" to "}{next!=null?(next/1e6).toFixed(0)+"M":"-"}
              </div>
              <div style={{flex:1,height:altBarH,background:barBg,borderRadius:altBarH/2,overflow:"hidden",position:"relative",minWidth:0,outline:"1px solid rgba(255,255,255,0.4)"}}>
                <div style={{width:"100%",height:"100%",borderRadius:altBarH/2,background:`linear-gradient(90deg,${gradStart},${color})`,boxShadow:`0 0 8px ${color}4d`,transformOrigin:"left",transform:`scaleX(${pct/100})`,transition:duration?`transform ${duration}ms linear`:undefined}}/>
                <div style={{position:"absolute",top:0,right:6,height:"100%",display:"flex",alignItems:"center",fontSize:9,fontWeight:600,color:barLabelColor,textShadow:barLabelShadow,fontVariantNumeric:"tabular-nums"}}>
                  {(Math.floor(pct*10)/10).toFixed(1)}%
                </div>
              </div>
              <div style={{minWidth:100,fontSize:10,color:d.TEXT,textAlign:"left",flexShrink:0,whiteSpace:"nowrap",fontVariantNumeric:"tabular-nums"}}>
                {fmtEta(eta)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{padding:pad,flexShrink:0}}>
      <div style={{fontSize:headerFs,color:d.TEXT,textAlign:"center",marginBottom:headerMb}}>Progress to Next Milestone</div>
      {renderBar("PDP",pdpDisp,d.PDP,pdpGradStart,true)}
      {renderBar("T-S",tsDisp,d.TS,tsGradStart,false)}
      <div style={{display:"flex",justifyContent:"space-between",padding:etaPad,fontSize:etaFs,fontVariantNumeric:"tabular-nums"}}>
        <span style={{color:d.PDP}}>PewDiePie to {pdpNext!=null?(pdpNext/1e6).toFixed(0)+"M":"\u2014"} by: <span style={{color:d.TEXT,fontWeight:600}}>{fmtEta(pdpEta)}</span></span>
        <span style={{color:d.TS}}>T-Series to {tsNext!=null?(tsNext/1e6).toFixed(0)+"M":"\u2014"} by: <span style={{color:d.TEXT,fontWeight:600}}>{fmtEta(tsEta)}</span></span>
      </div>
    </div>
  );
};


const TIMEZONES = [
  {flag:"\ud83c\uddfa\ud83c\uddf8",getOffset:_getEasternOffset,label:"EST"},
  {flag:"\ud83c\uddec\ud83c\udde7",getOffset:_getUKOffset,label:"GMT"},
  {flag:"\ud83c\uddee\ud83c\uddf3",getOffset:()=>5.5,label:"IST"},
];
const fmtTZ = (ts,offsetHours) => {
  const d = new Date(ts+offsetHours*3600000);
  return d.toLocaleTimeString("en-US",{timeZone:"UTC",hour:"2-digit",minute:"2-digit",hour12:false})
    +" "+d.toLocaleDateString("en-US",{timeZone:"UTC",weekday:"short",month:"short",day:"numeric"});
};

// Rolling gain chart configs: [lookbackHours, chartSpanHours, label, stepMs]
// stepMs: negative = tick multiplier (resolved as |n| * rtPeriodSec * 2000);
//         positive = fixed ms; null = RAW hourly
const GAIN_CHARTS = [
  [1/60, 10/60, "1min Gain / 10min", -1],
  [10/60, 1,    "10min Gain / 1hr",  -5],
  [1,    24,    "1hr Gain / 24hr",   300000],
  [12,   7*24,  "12hr Gain", 1800000],
  [24,   14*24, "24hr Gain", null],
  [48,   30*24, "48hr Gain", null],
  [1/60, 1,     "1min Gain / 1hr",   -1],   // index 6: alt layout
  [1/3600, 1/60, "1s Gain / 1min",   -0.5], // index 7: per-second mode (1s gain, 1min span, ~1s step)
  [5/60, 1,     "5min Gain / 1hr",   -5],   // index 8: 5min lookback (toggle from ci=1)
];


// - FOOBAR2000-STYLE SPECTRUM ANALYZER -
// 20 logarithmic frequency bars animated by a synthetic EDM
// excitation model. No real FFT - perceptually plausible stand-in
// driven by a rAF loop. The loop is only installed while `playing`
// is true, so pausing freezes the bars at their last state; on
// resume the internal song time continues from where it left off.
// `mult` scales both the beat rate and the envelope rates, so the
// animation speeds up/slows down with playback. Height is an
// integer pixel value in [1..SPEC_MAX_H]; the gradient is painted
// at a fixed SPEC_MAX_H background-size and anchored at the top so
// every bar shows white at its top and reveals more of the
// #1088FF endpoint only when it grows toward full height.
const SPEC_N_BARS = 20;
const SPEC_MAX_H = 19;
const SPEC_BPM = 128;

// 1D value noise + fBm. Used to shape slow section dynamics (loud
// vs quiet periods, bassy vs not), a persistent sub-bass rumble,
// and smooth per-bar jitter. Hash is deterministic - seeded only
// by coordinate - so noise is reproducible but not perceptibly
// periodic over the relevant timescale.
const _specHash = (n) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const _specSmooth = (x) => x * x * (3 - 2 * x);
const _specValueNoise = (t) => {
  const i = Math.floor(t);
  const f = t - i;
  const a = _specHash(i);
  const b = _specHash(i + 1);
  return a + (b - a) * _specSmooth(f);
};
// fBm: 3 octaves. Output is in [0..1] after normalization.
const _specFbm = (t) => {
  const v = _specValueNoise(t) * 0.5
          + _specValueNoise(t * 2) * 0.25
          + _specValueNoise(t * 4) * 0.125;
  return v / 0.875;
};

// LAYOUT: SocialBlade chrome - see LAYOUTS.md
const SpectrumAnalyzer = React.memo(({ playing = true, mult = 1, live = false, analyserRef = null, freqDataRef = null }) => {
  const [heights, setHeights] = useState(() => new Array(SPEC_N_BARS).fill(0));
  const stateRef = useRef({
    t: 0,                                // internal song time (s)
    last: 0,                             // prior rAF timestamp (ms)
    beatPhase: 0,                        // accumulated beats since mount;
                                         // integrated from a time-varying
                                         // BPM so tempo can drift without
                                         // discontinuities at beat boundaries
    h: new Array(SPEC_N_BARS).fill(0),   // smoothed bar heights 0..1
  });
  const rafRef = useRef(null);

  useEffect(() => {
    if (!playing) return;
    const tick = (now) => {
      const s = stateRef.current;
      if (!s.last) s.last = now;
      // Clamp dt to avoid huge jumps after tab-switches / GC pauses.
      const dt = Math.min(0.1, (now - s.last) / 1000);
      s.last = now;
      const speed = mult > 0 ? mult : 1;
      s.t += dt * speed;

      const t = s.t;

      // - Time-varying BPM & beat-phase integration -
      // BPM drifts on a very slow fBm (~60 s period) through a range
      // covering common EDM tempos. A single accumulator `beatPhase`
      // integrates the instantaneous BPM each frame, so tempo can
      // change continuously without breaking beat-grid continuity -
      // the instant before and after a BPM shift, the visualizer is
      // still at the same position within its current beat.
      const bpm = 105 + 45 * _specFbm(t * 0.016 + 1783.5);   // 105..150
      const T  = 60 / bpm;                                   // beat period (s)
      const T8 = T / 2;                                      // 8th-note period
      s.beatPhase += dt * speed * bpm / 60;
      const beatFrac = s.beatPhase - Math.floor(s.beatPhase);          // [0,1)
      const halfFrac = s.beatPhase * 2 - Math.floor(s.beatPhase * 2);  // [0,1)
      const barBeats = s.beatPhase - Math.floor(s.beatPhase / 4) * 4;  // [0,4)

      // - Breakdown gate -
      // A very slow noise thresholded near its peak -> rare, clearly
      // delimited "intermission" sections where drums and bass drop
      // out, leaving only lead + pad + spectral noise. `breakdown`
      // is 0 in normal play, ramps to 1 during a breakdown. The
      // threshold and multiplier are tuned so breakdowns occupy
      // roughly 10-15% of total playtime, in runs of ~3-8 s.
      const breakdownRaw = _specFbm(t * 0.022 + 1279.3) - 0.72;
      const breakdown = breakdownRaw > 0 ? Math.min(1, breakdownRaw * 8) : 0;
      const drumGain = 1 - breakdown;

      // - Section-level noise modulators (slow, fBm-driven) -
      // These shape the "which part of the song are we in" feel:
      // overall energy, how bass-heavy the mix is right now, how
      // loud the mids/highs sit, and how heavy each kick hits.
      // Time scales of 0.05-0.11 Hz give ~10-20 s sections.
      const energy   = 0.55 + 0.55 * _specFbm(t * 0.08);          // 0.55..1.10
      const bassMix  = 0.55 + 0.80 * _specFbm(t * 0.06 + 101.3);  // 0.55..1.35
      const midMix   = 0.60 + 0.60 * _specFbm(t * 0.11 + 237.7);  // 0.60..1.20
      const highMix  = 0.60 + 0.65 * _specFbm(t * 0.13 + 419.1);  // 0.60..1.25
      const kickHeft = 0.65 + 0.55 * _specFbm(t * 0.09 + 553.9);  // 0.65..1.20

      // - Per-instrument envelopes (0..1-ish, can briefly exceed) -
      // All drum/bass components are gated by `drumGain` so a
      // breakdown fully mutes them. Lead and pad are left untouched
      // - in a real EDM breakdown those layers carry the section.
      // Kick: 4-on-the-floor, sharp exponential decay each beat.
      const kickSince = beatFrac * T;
      const kick = Math.exp(-kickSince * 14) * kickHeft * drumGain;
      // Hi-hat: every 8th note; velocity varies per hit via a hash
      // keyed to the 8th-note index. Hats fade partly (not fully)
      // during breakdowns - many tracks keep a sparse hat pattern.
      const hatIdx = Math.floor(s.beatPhase * 2);
      const hatSince = halfFrac * T8;
      const hatVel = 0.55 + 0.45 * _specHash(hatIdx * 1.7);
      const hihat = Math.exp(-hatSince * 28) * 0.75 * hatVel * (1 - breakdown * 0.6);
      // Snare: peaks on beats 2 and 4 within the 4-beat bar.
      const bp = barBeats * T;
      const snare = Math.max(
        Math.exp(-Math.abs(bp - T    ) * 18),
        Math.exp(-Math.abs(bp - 3 * T) * 18),
      ) * 0.85 * drumGain;
      // Bass: sustained, lightly modulated; ducks slightly on kicks.
      const bass = (0.55 + 0.25 * Math.sin((kickSince / T) * Math.PI * 2))
                 * (1 - kick * 0.25)
                 * drumGain;
      // Lead: mid-tempo melodic wobble. Unaffected by breakdowns.
      const lead = 0.45 + 0.18 * Math.sin(t * 2.3) + 0.14 * Math.sin(t * 3.7 + 0.6);
      // Pad: slow atmospheric background. Unaffected by breakdowns.
      const pad  = 0.30 + 0.12 * Math.sin(t * 0.35) + 0.08 * Math.sin(t * 0.71 + 1.1);

      // - Sub-bass rumble + irregular womps (lowest bars) -
      const rumble = (0.35 + 0.60 * _specFbm(t * 1.7 + 731.2)) * drumGain;
      const wompRaw = _specFbm(t * 0.45 + 889.0) - 0.55;
      const womp = (wompRaw > 0 ? wompRaw * 2.2 : 0) * drumGain;

      // - Per-bar gaussian weights over bar index 0..19 -
      // Widths are intentionally tight so each instrument concentrates
      // on a few bars rather than smearing across a wide neighborhood.
      const gauss = (i, c, w) => Math.exp(-((i - c) * (i - c)) / (2 * w * w));
      const duck = 1 - kick * 0.35;   // sidechain-style mid/high duck

      // - Per-bar independent noise fields (decorrelates neighbors) -
      // `barAct`: slow-varying multiplier, uncorrelated across bars
      // (31.7 units apart in noise space ≫ correlation length), so at
      // any instant some bars are emphasized and others suppressed
      // even when the underlying instrument excitation is identical.
      // `barSting`: thresholded fast noise -> sparse, sharp per-bar
      // peaks that land on individual bars only, mimicking the way
      // real synth harmonics cause isolated bars to spike above
      // their neighbors.
      const barAct = new Array(SPEC_N_BARS);
      const barSting = new Array(SPEC_N_BARS);
      for (let i = 0; i < SPEC_N_BARS; i++) {
        barAct[i] = 0.35 + 1.35 * _specFbm(t * 0.35 + i * 31.7);
        const sRaw = _specFbm(t * 1.6 + i * 53.1) - 0.58;
        barSting[i] = sRaw > 0 ? sRaw * sRaw * 5.0 : 0;
      }

      const targets = new Array(SPEC_N_BARS);
      for (let i = 0; i < SPEC_N_BARS; i++) {
        let v = 0;
        v += kick   * gauss(i,  1.2, 1.2) * 1.20;
        v += rumble * gauss(i,  0.5, 1.3) * 0.60 * bassMix;
        v += womp   * gauss(i,  1.8, 1.2) * 0.85 * bassMix;
        v += bass   * gauss(i,  4.0, 1.7) * 0.90 * bassMix;
        v += snare  * gauss(i,  7.5, 1.8) * 0.85 * duck * midMix;
        v += lead   * gauss(i, 11.0, 2.4) * 0.70 * duck * midMix;
        v += hihat  * gauss(i, 16.5, 2.0) * 0.85 * duck * highMix;
        v += pad    * gauss(i, 11.0, 5.0) * 0.30 * midMix;

        // Per-bar activity multiplier - primary decorrelation source.
        v *= barAct[i];
        // Section-wide loud/quiet envelope.
        v *= energy;
        // Sparse per-bar stingers, additive so they can punch above
        // the gaussian-weighted baseline.
        v += barSting[i] * 0.45;
        // Strong smooth jitter via value noise, phase-offset per bar.
        v += (_specValueNoise(t * 9.0 + i * 17.3) - 0.5) * 0.35;

        // Gentle roll-off at the spectral extremes.
        const edge = Math.min(i, SPEC_N_BARS - 1 - i);
        if (edge < 2) v *= 0.75 + 0.25 * (edge / 2);
        targets[i] = v;
      }

      // No spatial smoothing: neighbor averaging was the main reason
      // adjacent bars tracked each other. Real foobar2000 spectra show
      // large bar-to-bar jumps, which a 1-2-1 kernel actively prevents.

      // - Real-audio override -
      // When a real track is playing, replace the procedural targets with
      // the actual FFT magnitude spectrum from the Web Audio AnalyserNode.
      // 20 bars are mapped log-spaced across the low/mid bins (top third of
      // the spectrum is mostly empty for music, so it is dropped). The
      // procedural block above still ran, but its targets are discarded here;
      // the temporal smoothing below then applies to the FFT targets too.
      if (live && analyserRef && analyserRef.current && freqDataRef && freqDataRef.current) {
        const an = analyserRef.current, data = freqDataRef.current, bins = data.length;
        an.getByteFrequencyData(data);
        // foobar2000: octave (log) distribution over 20..20000 Hz. Map those Hz
        // edges to FFT bins via the real sample rate, then log-space the 20 bars.
        const sr = (an.context && an.context.sampleRate) || 44100;
        const nyq = sr / 2;
        const hzToBin = (hz) => Math.max(1, Math.min(bins - 1, Math.round(hz / nyq * bins)));
        const minBin = hzToBin(20), maxBin = Math.max(minBin + 1, hzToBin(20000));
        for (let i = 0; i < SPEC_N_BARS; i++) {
          const b0 = Math.floor(minBin * Math.pow(maxBin / minBin, i / SPEC_N_BARS));
          let b1 = Math.floor(minBin * Math.pow(maxBin / minBin, (i + 1) / SPEC_N_BARS));
          if (b1 <= b0) b1 = b0 + 1;
          let sum = 0, c = 0;
          for (let b = b0; b < b1 && b < bins; b++) { sum += data[b]; c++; }
          // getByteFrequencyData already maps dB linearly across [minDecibels,
          // maxDecibels] -> [0,255]. With gamma 1.0 (foobar default) the bar
          // height IS that normalized value; no extra curve.
          targets[i] = c ? (sum / c) / 255 : 0;
        }
      }

      // - Temporal smoothing: fast attack, slow decay -
      const attack = 1 - Math.exp(-dt * speed * 45);
      const decay  = 1 - Math.exp(-dt * speed * 9);
      for (let i = 0; i < SPEC_N_BARS; i++) {
        const target = Math.max(0, Math.min(1, targets[i]));
        const cur = s.h[i];
        const k = target > cur ? attack : decay;
        s.h[i] = cur + (target - cur) * k;
      }

      setHeights(s.h.slice());
      rafRef.current = requestAnimationFrame(tick);
    };
    stateRef.current.last = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      stateRef.current.last = 0;
    };
  }, [playing, mult, live]);

  return (
    <div style={{
      position: "absolute",
      left: 360, top: 701,
      width: 89, height: SPEC_MAX_H,
      display: "flex", alignItems: "flex-end", gap: 1,
    }}>
      {heights.map((v, i) => {
        const h = Math.max(1, Math.round(v * SPEC_MAX_H));
        return (
          <div key={i} style={{
            flex: 1,
            height: h,
            // Gradient is sized to the full bar-strip height and anchored
            // at the top, so shorter bars reveal only the upper (whiter)
            // portion of the gradient; a full-height bar ends in #1088FF.
            background: "linear-gradient(to bottom, #ffffff, #1088FF)",
            backgroundSize: `100% ${SPEC_MAX_H}px`,
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
          }}/>
        );
      })}
    </div>
  );
});

// Module-level cache for gap crossings - keyed by "noise:periodSec".
// Survives view switches so re-entering dashboard is instant.
const _gapCrossingsCache = new Map();

// - MAIN COMPONENT -
export default function SocialBladeLive() {
  const appMode = 'real'; // alt-scenario mode removed
  const [realDataReady, setRealDataReady] = useState(false);
  const [rawMode, setRawMode] = useState(false);
  const [dashRawDelta, setDashRawDelta] = useState(false);
  const [dashGain5min, setDashGain5min] = useState(false);
  const [dashGainPerMin, setDashGainPerMin] = useState(false);
  const [rawAltReady, setRawAltReady] = useState(false);
  const maxIdx = RAW.length - 1;
  const rdMaxIdx = REAL_DATA_HOURS; // 4704 hours - real data playhead ceiling
  const effectiveMaxIdx = appMode === 'real' ? rdMaxIdx : maxIdx;
  const [pb, dispatch] = useReducer(playbackReducer, initialPlayback);
  const { playing, reverse, speedMode, mult, dyn, desync, seekToken, minuteSnap } = pb;
  const _ssRef = useRef(null);
  if (_ssRef.current === null) _ssRef.current = _loadSS();
  const _ss = _ssRef.current;
  // When the Dynamic toggle is on, it overrides whatever base mode is
  // selected in the dropdown - playback advances via getDynSpeed and
  // none of the RT-tick / 1m / 1h paths fire. isRTMode and isDyn read
  // through this override so downstream effect blocks, gating
  // conditions, and display logic all see the effective mode.
  const isDyn = dyn;
  const isRTMode = isRTSpeedMode(speedMode);

  // Position -> |gap| function for Dynamic mode. Reads the PDP-vs-TS gap.
  // Stashed in a ref so the rAF loop and the keyboard arrow handler can
  // read the current rule without re-init on view changes.
  const dynGapRef = useRef(() => null);

  // Local text state for the mult number input. We can't bind the input
  // directly to `mult` because parseFloat strips trailing dots - typing
  // "2" -> "2." -> "2.5" would re-render as "2" -> "2" -> "2.5", losing the
  // dot at the intermediate step and forcing the user to write the dot
  // BETWEEN existing digits rather than after them. Keep a string here,
  // dispatch to mult on every valid parse, and sync the string back from
  // mult only when the input isn't focused (so external changes - slider,
  // Now button - propagate without trampling in-progress typing).
  const multInputRef = useRef(null);
  const [multText, setMultText] = useState(() => String(parseFloat(mult.toFixed(2))));
  useEffect(() => {
    if (document.activeElement !== multInputRef.current) {
      setMultText(String(parseFloat(mult.toFixed(2))));
    }
  }, [mult]);

  // Compute "Now" position: map current real-world clock to 2019 timeline
  const initNowPos = useMemo(() => {
    const now = new Date(Date.now() - 4*60*60*1000);
    const target = Date.UTC(2019, now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    return tsToPos(Math.max(REAL_DATA_START_MS, Math.min(REAL_DATA_END_MS, target)));
  }, []);

  const [pos, setPos] = useState(() => _ss.pos != null ? _ss.pos : tsToPos(Date.UTC(2018, 9, 18, 4, 0)));
  const [menuOpen, setMenuOpen] = useState(() => _ss.menuOpen != null ? _ss.menuOpen : true);
  const [barHidden, setBarHidden] = useState(() => _ss.barHidden ?? false);
  // SocialBlade "realistic bounds": snap the 1hr-growth / 1hr-gap / 1day-gap chart
  // Y-domains to round nice-number ticks containing the range (like the hist gap
  // charts) instead of the tight min/max - so the axis only steps at round
  // thresholds rather than drifting every frame.
  const [view, setView] = useState(() => _ss.view ?? "socialblade");
  const [dashWin, setDashWin] = useState(() => _ss.dashWin ?? 7);
  const [dashChanFilter, setDashChanFilter] = useState('both'); // 'both'|'pdp'|'ts'
  const dashShowCharts = true;
  // Per-second mode (standard dashboard): swaps the 1min-gain chart for a 1s-gain
  // over the last minute, and the 1hr-gap chart for a 1min gap.
  const [dashPerSecond, setDashPerSecond] = useState(() => _ss.dashPerSecond ?? false);
  // Dashboard chart layout: 0 = Default, 1 = Default+, 2 = Alt (former Normal).
  // dashAltLayout gates the alt renderer (layouts 0 and 1); dashAltPlus enables
  // the extra ci0/ci1 columns (layout 1). Layout 2 uses renderNormalDashboard.
  // Migrates boolean _ss.dashAltLayout on first load.
  const [dashLayout, setDashLayout] = useState(() => _ss.dashLayout != null ? _ss.dashLayout : (_ss.dashAltLayout ? 1 : 0));
  const dashAltLayout = dashLayout < 2;
  const dashAltPlus = dashLayout === 1;
  const altDenseCharts = false; // alt dense charts removed
  // Dashboard "Filter Audits": for the short gain charts (1min/10min/1hr) strip
  // audit jumps out of the growth (organic-only delta) and mark each audit with
  // a faint dotted vertical line in the channel's colour.
  const [filterAudits, setFilterAudits] = useState(() => _ss.filterAudits ?? false);
  // In Real Data mode, audit stripping uses getRdCumAudit (from REAL_AUDITS).
  // In Alt Scenario mode it uses getCumAudit. Same toggle drives both.
  const effectiveFilterAudits = filterAudits;
  // Flare view is a standalone top-level mode (peer to SocialBlade and Dashboard).
  // Per-view toggles: light vs. dark palette, and an Extra Info overlay that
  // (a) renders vote percentages at 2-decimal precision and (b) shows the
  // Dashboard's 1-MIN / 1-HOUR / 1-DAY sub-gain stack above the crown on each
  // channel card. Extra Info is only meaningful when the Flare view is active.
  const [flareDark, setFlareDark] = useState(() => _ss.flareDark ?? false);
  const [sbDark, setSbDark] = useState(() => _ss.sbDark ?? true);
  const [sbOvertake, setSbOvertake] = useState(() => _ss.sbOvertake ?? false);
  // SB region background colors. Charts/center always black per design. Cards use SB site palette in light mode.
  const SB_CARD_BG   = sbDark ? "#000" : "#e6e9ec";  // SB site page bg (#e6e9ec) for sub-counter cards
  const SB_CHART_BG  = SB_CARD_BG;                      // 60-min chart plot area
  const SB_AXIS_BG   = sbDark ? "#000" : "#e8eef8";     // x-axis strip - slightly darker than plot area
  const SB_CENTER_BG = "#000";                         // central column (battle + gap charts) - always black
  const SB_BOTTOM_BG = sbDark ? "#000" : "#fff";      // bottom half: pure white in light mode
  const [flareExtraInfo, setFlareExtraInfo] = useState(() => _ss.flareExtraInfo ?? false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorPinned, setInspectorPinned] = useState(false);
  const [inspectorPinnedTime, setInspectorPinnedTime] = useState(null);
  const [inspectorCount, setInspectorCount] = useState(60);
  const [devMode, setDevMode] = useState(() => { try { return localStorage.getItem('pvt_devmode') === '1'; } catch { return false; } });
  const [patchEditorOpen, setPatchEditorOpen] = useState(false);
  const [patches, setPatches] = useState(() => {
    const d = window.__DATA.MANUAL_PATCHES;
    if (d && Array.isArray(d.audit_invalidations)) return { invalidated_ids: [], invalidated_audits: [], ...d };
    return { audit_invalidations: [], smooth_windows: [], invalidated_ids: [] };
  });
  const [patchTab, setPatchTab] = useState('freezes');
  const [patchForm, setPatchForm] = useState({ at:'', ac:'pdp', an:'', ss:'', se:'', sc:'both', sn:'' });
  const [patchSaveStatus, setPatchSaveStatus] = useState(null);
  const [smoothReport, setSmoothReport] = useState(null);
  const [smoothReportLoading, setSmoothReportLoading] = useState(false);
  const [patchFilter, setPatchFilter] = useState({ ch:'all', status:'all' });
  const [patchPage, setPatchPage] = useState(0);
  const [patchWindow, setPatchWindow] = useState(600000);
  const [runStatus, setRunStatus] = useState({ da: null, sb: null });
  const [editingSwId, setEditingSwId] = useState(null);
  const [editSwForm, setEditSwForm] = useState({ ss:'', se:'', sc:'both', sn:'' });
  const [rareBannerUpd, setRareBannerUpd] = useState(false);
  // Export Full Data removed.
  const [clockEditing, setClockEditing] = useState(false);   // top-bar time: click to type/seek
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [histStartIdx, setHistStartIdx] = useState(() => _ss.histStartIdx ?? HIST_START);
  const [rtInterval, setRtInterval] = useState(() => _ss.rtInterval ?? 2); // RT update interval in seconds (1, 2, or 3)
  const posRef = useRef(_ss.pos != null ? _ss.pos : initNowPos);
  const effectiveMultRef = useRef(mult);

  // Auto-start in Now mode on first load
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const ss = _ssRef.current;
    if (ss && ss.speedMode && ss.speedMode !== "1h") {
      dispatch({type:"SET_MODE", mode: ss.speedMode});
      if (ss.mult != null && ss.mult !== 1) dispatch({type:"SET_MULT", mult: ss.mult});
      if (ss.desync != null) dispatch({type:"SET_DESYNC", value: ss.desync});
      if (ss.minuteSnap) dispatch({type:"TOGGLE_MINUTE_SNAP"});
      if (ss.dyn) dispatch({type:"TOGGLE_DYN"});
      if (ss.reverse) dispatch({type:"TOGGLE_REVERSE"});
      if (ss.playing) dispatch({type:"PLAY"});
    } else {
      dispatch({type:"SET_MODE", mode:"rt"});
      dispatch({type:"SET_DESYNC", value:0.7});
      dispatch({type:"PLAY"});
    }
  }, []);

  useEffect(() => { window._dismissLoading?.(); }, []);

  // Persist settings to localStorage
  useEffect(() => {
    _saveSS({ speedMode, mult, dyn, desync, minuteSnap, playing, reverse, rtInterval });
  }, [speedMode, mult, dyn, desync, minuteSnap, playing, reverse, rtInterval]);
  useEffect(() => {
    _saveSS({ view, dashWin, dashShowCharts, dashPerSecond, dashLayout, filterAudits, flareDark, flareExtraInfo, sbDark, sbOvertake, barHidden, histStartIdx, menuOpen });
  }, [view, dashWin, dashShowCharts, dashPerSecond, dashLayout, filterAudits, flareDark, flareExtraInfo, sbDark, sbOvertake, barHidden, histStartIdx, menuOpen]);
  useEffect(() => {
    const id = setInterval(() => { _saveSS({ pos: posRef.current }); }, 3000);
    return () => clearInterval(id);
  }, []);
  const rafRef = useRef(null);

  // RT noise state
  const prevDevP = useRef(0), prevDevT = useRef(0), prevDevSB = useRef(0), prevDevFTV = useRef(0);
  const prevSpeedMode = useRef(speedMode);
  const gapThrottleRef = useRef({ time: 0, value: null }); // throttle gap updates when minSnap
  useEffect(() => {
    if (prevSpeedMode.current !== speedMode) {
      prevDevP.current=0; prevDevT.current=0; prevDevSB.current=0; prevDevFTV.current=0;
      prevSpeedMode.current = speedMode;
    }
  }, [speedMode]);

  // Auto-adjust desync + minute-snap on SocialBlade ↔ Flare switches.
  // Rationale: SocialBlade's counter cadence benefits from minute-snap
  // + a 0.70 desync (matches the reference stream's display rhythm),
  // but those settings feel wrong under the Flare layout, which wants
  // a direct counter read with no snap or desync offset. On every
  // transition between the two views we detect the "canonical
  // SocialBlade preset" vs "canonical Flare preset" and flip to the
  // other; we only act when RT mode is active and the *current*
  // values match the expected source preset, so a user who has
  // overridden either setting manually is left alone.
  const prevView = useRef(view);
  useEffect(() => {
    const prev = prevView.current;
    const curr = view;
    prevView.current = curr;
    if (prev === curr) return;
    if (!isRTMode) return;
    if (prev === "socialblade" && curr === "flare"
        && desync === 0.7 && minuteSnap) {
      dispatch({ type: "SET_DESYNC", value: 0 });
      dispatch({ type: "TOGGLE_MINUTE_SNAP" });
    } else if (prev === "flare" && curr === "socialblade"
        && desync === 0 && !minuteSnap) {
      dispatch({ type: "SET_DESYNC", value: 0.7 });
      dispatch({ type: "TOGGLE_MINUTE_SNAP" });
    }
  }, [view, isRTMode, desync, minuteSnap]);

  // Load smooth_report.json when patch editor opens (once per session)
  useEffect(() => {
    if (!patchEditorOpen || smoothReport !== null || smoothReportLoading) return;
    setSmoothReportLoading(true);
    fetch('/data/smooth_report.json')
      .then(r => r.ok ? r.json() : null)
      .then(d => { setSmoothReport(d); setSmoothReportLoading(false); })
      .catch(() => setSmoothReportLoading(false));
  }, [patchEditorOpen, smoothReport, smoothReportLoading]);


  // Load the real-data binary once on mount; trigger re-render when done.
  useEffect(() => {
    const file = rawMode
      ? 'every_second_counts_pvt_u32le.raw.bin'
      : 'every_second_counts_pvt_u32le.bin';
    setRealDataReady(false);
    _reloadRealData(file, () => setRealDataReady(!!_realDataBuf));
  }, [rawMode]);

  // Load raw alt buffer on demand for delta chart.
  useEffect(() => {
    if (!dashRawDelta) return;
    _loadRawAlt(() => setRawAltReady(!!_rawAltBuf));
  }, [dashRawDelta]);


  const [rtDisplay, setRtDisplay] = useState({ pt:null, tt:null, sb:null, ftv:null, gap:null });
  const clearRT = useCallback(() => {
    setRtDisplay({ pt:null, tt:null, sb:null, ftv:null, gap:null });
  }, []);
  // Gap text update throttle for RT modes (every 5 data-seconds)
  

  // - Derived values -
  const intIdx = Math.max(SEEK_START, Math.min(Math.floor(pos), effectiveMaxIdx));
  const frac = pos - Math.floor(pos);
  // In Real Data mode clamp to RAW bounds so chart/audit code never gets undefined.
  const safeRawIdx = Math.min(intIdx, maxIdx);
  const curPoint = appMode === 'real'
    ? RAW[safeRawIdx]
    : ((frac > 0.001 && intIdx < maxIdx) ? interpolate(intIdx, frac) : RAW[intIdx]);
  useEffect(() => { if (intIdx < histStartIdx) setHistStartIdx(HIST_START); }, [intIdx, histStartIdx]);
  const curTime = (() => {
    if (appMode === 'real') return REAL_DATA_START_MS + pos * HOUR_MS;
    if (!RAW[intIdx]) return RAW[0].t;
    if (intIdx >= maxIdx) return RAW[maxIdx].t;
    return RAW[intIdx].t + frac * (RAW[intIdx+1].t - RAW[intIdx].t);
  })();
  // Auto-reset trigger: when the playhead crosses HIST_AUTO_RESET_TS
  // (Apr 29 6 PM), advance histStartIdx forward to that boundary's index
  // so the SocialBlade historical sub-gap chart begins recording from
  // then on. The histStartIdx < boundary check makes the effect
  // idempotent (won't re-trigger on subsequent renders past the
  // boundary) and ensures a manual Reset Chart click made AFTER the
  // boundary is preserved (if the user resets to a later point, that
  // index is greater than HIST_AUTO_RESET_IDX, so we don't override).
  // If the user seeks back before the boundary, the fallback effect
  // above sends histStartIdx back to HIST_START; on the next forward
  // play through the boundary, this effect re-fires.
  useEffect(() => {
    if (curTime >= HIST_AUTO_RESET_TS && histStartIdx < HIST_AUTO_RESET_IDX) {
      setHistStartIdx(HIST_AUTO_RESET_IDX);
    }
  }, [curTime, histStartIdx]);
  useEffect(() => {
    if (curTime >= SB_V2_TS && histStartIdx < HIST_V2_RESET_IDX) {
      setHistStartIdx(HIST_V2_RESET_IDX);
    }
  }, [curTime, histStartIdx]);
  const curSB  = useMemo(() => Math.round(getChannelOrganicAt(curTime, 'sb_real')  ?? 0), [curTime]);
  const curFTV = useMemo(() => Math.round(getChannelOrganicAt(curTime, 'ftv_real') ?? 0), [curTime]);

  // 1-second clock for timezone display.
  const [, setClockBump] = useState(0);
  const tzWallRef = useRef({ wallMs: Date.now(), simMs: 0 });
  const tzPrevSimRef = useRef(0);
  if (curTime !== tzPrevSimRef.current) {
    tzPrevSimRef.current = curTime;
    tzWallRef.current = { wallMs: Date.now(), simMs: curTime };
  }
  useEffect(() => {
    if (!isRTMode) return;
    const id = setInterval(() => setClockBump(n => n + 1), 1000);
    return () => clearInterval(id);
  }, [isRTMode]);
  const tzDisplayMs = isRTMode
    ? tzWallRef.current.simMs + Math.min(Date.now() - tzWallRef.current.wallMs, 4000)
    : curTime;

  // - Chart data (ported from old dashboard) -
  const makeWindow = useCallback((windowHours, filterKey) => {
    const end = Math.min(intIdx + 2, maxIdx);
    const wStart = Math.max(0, intIdx - windowHours - 2);
    let slice = RAW.slice(wStart, end + 1);
    if (filterKey) slice = slice.filter(d => d[filterKey] != null);
    return slice;
  }, [intIdx, maxIdx]);

  const MINUTE = 1/60;  // 1 minute in index-space (1 index = 1 hour)

  // In Real Data mode floor at REAL_DATA_START_MS; otherwise floor at RAW[0].t.
  const _dataFloor = appMode === 'real' ? REAL_DATA_START_MS : RAW[0].t;
  const tMin48h = Math.max(_dataFloor, curTime - 2 * DAY_MS);

  // - Compact chart data (60-min totals, 1-hr gap) -
  // In RT modes with desync > 0, each channel's chart advances independently at
  // that channel's own update moment. ptT/ttT come from the staggered RT tick.
  // gapTime always trails by one full RT tick (rtDisplay.gapT = previous ptT)
  // so every gap chart shows a settled, post-desync value.
  // Outside RT modes, both fall back to curTime (synchronous).
  const pdpTime = (isRTMode && rtDisplay.ptT != null) ? rtDisplay.ptT : curTime;
  const tsTime  = (isRTMode && rtDisplay.ttT != null) ? rtDisplay.ttT : curTime;
  const gapTime = (isRTMode && rtDisplay.gapT != null) ? rtDisplay.gapT : curTime;
  const tMinPdp1h  = Math.max(_dataFloor, pdpTime - HOUR_MS);
  const tMinTs1h   = Math.max(_dataFloor, tsTime  - HOUR_MS);
  const tMinGap1h  = Math.max(_dataFloor, gapTime - HOUR_MS);
  const tMinGap1d  = Math.max(_dataFloor, gapTime - DAY_MS);
  const tMin1h = tMinGap1h;

  // RT and 1m modes show noise on top of the cubic curve, anchored exactly to
  // hourly snapshots via the multinomial bridge. Other modes use cubic densify.
  const useNoise = isRTMode || speedMode === "1m" || isDyn;
  const rtPeriodSec = rtInterval;

  const pdp1hData = useMemo(() => {
    const pts = [];
    for (let t = tMinPdp1h; t <= pdpTime; t += 1000) {
      const rd = realDataAt(t); if (rd) pts.push({ t, pt: rd.pdp });
    }
    return pts;
  }, [tMinPdp1h, pdpTime, realDataReady]);

  const ts1hData = useMemo(() => {
    const pts = [];
    for (let t = tMinTs1h; t <= tsTime; t += 1000) {
      const rd = realDataAt(t); if (rd) pts.push({ t, tt: rd.ts });
    }
    return pts;
  }, [tMinTs1h, tsTime, realDataReady]);

  const gap1hData = useMemo(() => {
    const pts = [];
    for (let t = tMinGap1h; t <= gapTime; t += 1000) {
      const rd = realDataAt(t); if (rd) pts.push({ t, g: rd.pdp - rd.ts });
    }
    return pts;
  }, [tMinGap1h, gapTime, realDataReady]);

  // Power-of-2 step in ms, floored at the mode's natural minimum
  // (rtPeriodSec*1000 in RT, 60000 in 1m). Stable across small span
  // changes - only "shifts" at log2 boundaries (e.g. when the span
  // doubles), at which point the bucket changes and the chart
  // re-quantizes once. Within a bucket every chart sample sits at the
  // same absolute timestamp render after render, so the line shape
  // doesn't morph; the right edge just advances.
  const _gap1dSpan = Math.max(0, gapTime - tMinGap1d);
  const _gap1dModeFloor = (speedMode === "1m") ? 60000 : (rtPeriodSec * 1000);
  const _gap1dRawStep = Math.max(_gap1dModeFloor, _gap1dSpan / 1500);
  const _gap1dStep = Math.pow(2, Math.ceil(Math.log2(Math.max(1, _gap1dRawStep))));
  const _gap1dPeriodSec = Math.max(rtPeriodSec, Math.round(_gap1dStep / 1000));
  const _gap1dQuantum = Math.max(_gap1dModeFloor, _gap1dStep / 8);
  const _gap1dKey = Math.floor(gapTime / _gap1dQuantum);

  const gap1dData = useMemo(() => {
    const tEnd = _gap1dKey * _gap1dQuantum;
    const pts = [];
    const tFirst = Math.ceil(tMinGap1d / _gap1dStep) * _gap1dStep;
    for (let t = tFirst; t <= tEnd; t += _gap1dStep) {
      const rd = realDataAt(t); if (rd) pts.push({ t, g: rd.pdp - rd.ts });
    }
    return pts;
  }, [tMinGap1d, _gap1dKey, _gap1dQuantum, _gap1dStep, realDataReady]);

  // In Real Data mode the hist chart shows a rolling 2-week window ending at
  // curTime. In Alt mode tStart is fixed at the user-chosen reset point.
  const _histTStart = appMode === 'real'
    ? Math.max(REAL_DATA_START_MS, gapTime - 14 * DAY_MS)
    : RAW[histStartIdx].t;
  const _histSpan = Math.max(0, gapTime - _histTStart);
  const _histModeFloor = (speedMode === "1m") ? 60000 : (rtPeriodSec * 1000);
  const _histRawStep = Math.max(_histModeFloor, _histSpan / 4000);
  const _histStep = Math.pow(2, Math.ceil(Math.log2(Math.max(1, _histRawStep))));
  const _histPeriodSec = Math.max(rtPeriodSec, Math.round(_histStep / 1000));
  const _histQuantum = Math.max(_histModeFloor, _histStep / 8);
  const _histKey = Math.floor(gapTime / _histQuantum);

  const histGapData = useMemo(() => {
    const tStart = _histTStart;
    const tEnd = _histKey * _histQuantum;
    const pts = [];
    const tFirst = Math.ceil(tStart / _histStep) * _histStep;
    for (let t = tFirst; t < tEnd; t += _histStep) {
      const rd = realDataAt(t); if (rd) pts.push({ t, g: rd.pdp - rd.ts });
    }
    const rdEnd = realDataAt(tEnd);
    if (rdEnd) pts.push({ t: tEnd, g: rdEnd.pdp - rdEnd.ts });
    return pts;
  }, [_histTStart, _histKey, _histQuantum, _histStep, realDataReady]);

  const getRange = (data, keys, tMin, tMax, extra) => {
    let lo = Infinity, hi = -Infinity;
    for (const d of data) {
      if (d.t < tMin || d.t > tMax) continue;
      for (const k of keys) { if (d[k] != null) { lo = Math.min(lo, d[k]); hi = Math.max(hi, d[k]); } }
    }
    if (extra) { for (const k of keys) { if (extra[k] != null) { lo = Math.min(lo, extra[k]); hi = Math.max(hi, extra[k]); } } }
    if (!isFinite(lo)) return [0, 1];
    const pad = (hi - lo) * 0.04 || 1;
    return [lo - pad, hi + pad];
  };

  const tMinHist = _histTStart;

  const gainCharts = (() => {
    const w = dashWin * 24;
    return GAIN_CHARTS.map((g, i) => {
      if (i === 3) return [g[0], w / 2, g[2], g[3]];
      if (i === 4) return [g[0], w,     g[2], g[3]];
      if (i === 5) return [g[0], w * 2, g[2], g[3]];
      return g;
    });
  })();

  // Current-point reference from binary buffer for Y-axis domain clamping.
  const _rdCurRef = (() => {
    const rd = realDataAt(gapTime);
    return rd ? { pt: rd.pdp, tt: rd.ts, g: rd.pdp - rd.ts } : null;
  })();
  const _domExtraCP = _rdCurRef ?? curPoint;

  const domGap1d  = useMemo(() => getRange(gap1dData,  ["g"], tMinGap1d, gapTime, _domExtraCP), [gap1dData,  tMinGap1d, gapTime, _domExtraCP]);
  const ticksHist = useMemo(() => getAdaptiveDateTicks(tMinHist, gapTime), [tMinHist, gapTime]);
  // Round Y-axis for the historical gap chart (V1 + V2 PDP/TS share this data).
  const histGapAxis = roundGapAxis(histGapData, _domExtraCP?.g);

  // Compact mode domains/ticks
  // Domain-extra reference: the current display value at each channel's display
  // time, so the y-axis stays pinned to what is actually on screen right now.
  // Reads from binary buffer; falls back to curPoint when binary has no entry.
  const _rdPdp = realDataAt(pdpTime), _rdTs = realDataAt(tsTime), _rdGap = realDataAt(gapTime);
  const _domExtraPdp = _rdPdp ? { t: pdpTime, pt: _rdPdp.pdp } : (curPoint ?? null);
  const _domExtraTs  = _rdTs  ? { t: tsTime,  tt: _rdTs.ts   } : (curPoint ?? null);
  const _domExtraGap = _rdGap ? { t: gapTime, g: _rdGap.pdp - _rdGap.ts } : (curPoint ?? null);
  const domPdp1h    = useMemo(() => getRange(pdp1hData,   ["pt"], 0, Infinity, _domExtraPdp),  [pdp1hData, _domExtraPdp]);
  const domTs1h     = useMemo(() => getRange(ts1hData,    ["tt"], 0, Infinity, _domExtraTs),   [ts1hData,  _domExtraTs]);
  const domGap1h = useMemo(() => getRange(gap1hData, ["g"], tMinGap1h, gapTime, _domExtraGap), [gap1hData, tMinGap1h, gapTime, _domExtraGap]);
  const ticksPdp1h = useMemo(() => get15MinTicks(tMinPdp1h, pdpTime), [tMinPdp1h, pdpTime]);
  const ticksTs1h  = useMemo(() => get15MinTicks(tMinTs1h, tsTime),  [tMinTs1h, tsTime]);
  const ticksGap1h = useMemo(() => get15MinTicks(tMinGap1h, gapTime), [tMinGap1h, gapTime]);

  // effectiveMult: mult scaled by dyn speed. Declared as `let` so it can be
  // refined below once dynGapRef.current is wired to live display values.
  // Here we seed it with the baked RAW gap (good enough for smoothDur/smoothEnabled).
  const rawGapForEm = isDyn ? Math.abs(RAW[Math.max(0, Math.min(Math.floor(pos), maxIdx))]?.g ?? 0) : 0;
  const _modeBaseSec = speedMode === "1m" ? 60 : 1;
  let effectiveMult = isDyn ? mult * getDynSpeed(rawGapForEm) / _modeBaseSec : mult;
  effectiveMultRef.current = effectiveMult;

  // Smoothed Y-domains: bounds glide to new values over ~500ms in RT modes only.
  // In non-RT modes (1m, 1h, 1d, etc.) smoothing is disabled - bounds snap.
  // The `enabled` flag also gates on `playing` so paused playback bypasses the
  // rAF easing loop and returns the target domain instantly. Without this,
  // the rAF loop would keep advancing for ~500ms after pause and the bounds
  // would visibly drift after the user has stopped playback.
  // At higher mult the playhead advances faster than the 500ms ease can
  // track, so the chart axes lag visibly behind the data. Divide the
  // animation duration by mult so the ease completes in proportionally
  // less wall-clock time. Clamped at mult=1 on the low end so slow
  // playback doesn't get a slower-than-default smoother (it's already
  // smooth enough when the data barely moves).
  // At very high speed multipliers, the data advances so fast that even the
  // mult-divided smoothing duration produces visible axis lag and wasted
  // compute (rAF loop animating bounds that change every frame). Past 100x,
  // bypass smoothing entirely - domain snaps directly to target.
  const smoothDur = 500 / Math.max(1, effectiveMult);
  const smoothEnabled = isRTMode && playing && effectiveMult <= 100;
  // 1hr total charts: when Real Bounds is on, the round domain is computed HERE
  // (roundDomain) and eased by useSmoothBounds - handing recharts 'auto' instead
  // would re-pick the bounds instantly, so threshold crossings snapped the whole
  // chart with no transition (the gap sparklines' eased look was missing).
  const _sDomPdp1h   = useSmoothBounds(roundDomain(domPdp1h),   smoothDur, smoothEnabled);
  const _sDomTs1h    = useSmoothBounds(roundDomain(domTs1h),    smoothDur, smoothEnabled);
  const _sDomGap1h   = useSmoothBounds(roundDomain(domGap1h),   smoothDur, smoothEnabled);
  const _sDomGap1d   = useSmoothBounds(roundDomain(domGap1d),   smoothDur, smoothEnabled);
  const sDomPdp1h   = _sDomPdp1h;
  const sDomTs1h    = _sDomTs1h;
  const sDomGap1h   = _sDomGap1h;
  const sDomGap1d   = _sDomGap1d;

  // Rates
  const pdpPerMin = useMemo(() => getMomentaryRate(pos, "pt"), [pos]);
  const tsPerMin = useMemo(() => getMomentaryRate(pos, "tt"), [pos]);

  // Subs/min table - SINGLE time reference for the whole table (subs/min, the
  // milestone predictions, AND the audit display) so they all flip together:
  //   - Min Snap on: refresh once per minute, at the (minute + desync*60s) mark.
  //     desync 0 -> :00, 0.7 -> :42.000, 0.69 -> :41.400.
  //   - RT, no snap: refresh at the desync MIDPOINT (rtDisplay.midT, the same
  //     slot the Sub Gap / SB counter use), not per-channel.
  //   - otherwise: curTime.
  const tableTime = minuteSnap
    ? (() => { const off = desync * 60000; return Math.floor((curTime - off) / 60000) * 60000 + off; })()
    : (isRTMode && rtDisplay.midT != null ? rtDisplay.midT : curTime);
  const tablePos = tsToPos(tableTime);
  const tableIntIdx = Math.max(SEEK_START, Math.min(Math.floor(tablePos), maxIdx));
  const tableFrac = tablePos - tableIntIdx;
  const tablePoint = (tableFrac > 0.001 && tableIntIdx < maxIdx) ? interpolate(tableIntIdx, tableFrac) : RAW[tableIntIdx];
  const _rdTableNow = realDataAt(tableTime);
  const tableDisplayPt = _rdTableNow ? _rdTableNow.pdp : (tablePoint?.pt != null ? Math.round(tablePoint.pt) : null);
  const tableDisplayTt = _rdTableNow ? _rdTableNow.ts  : (tablePoint?.tt != null ? Math.round(tablePoint.tt) : null);

  // Quantize curTime to 10s buckets - rates don't change meaningfully
  // between ticks, and in rAF modes curTime fires at 60fps otherwise.
  const _curTime10s = Math.floor(curTime / 10000);
  const _use1mInterp = speedMode === "1m" && !minuteSnap;
  const subsPerMinTable = useMemo(() => {
    const lookbacks = [1/60, 5/60, 1, 12, 24, 48, 72, 120, 168, 336, 720];
    // Binary lookup: returns null when lookback window starts before REAL_DATA_START_MS.
    const rdRate = (key, lb) => {
      const t1 = tableTime;
      const t0 = t1 - lb * HOUR_MS;
      const v1 = realDataAt(t1);
      const v0 = realDataAt(t0);
      if (!v1 || !v0) return null;
      return ((key === 'pdp' ? v1.pdp : v1.ts) - (key === 'pdp' ? v0.pdp : v0.ts)) / (lb * 60);
    };
    return {
      pdp:   lookbacks.map(lb => rdRate('pdp', lb)),
      ts:    lookbacks.map(lb => rdRate('ts',  lb)),
    };
  }, [tableTime, realDataReady]);

  // - Audit Display (precomputed) -
  // AUDITS[i] = [dataIndex, channel, change, timestamp, displayTimeStr]
  // Just find the most recent audit for each channel before current position.
  const fmtAuditChange = (v) => {
    if (v == null) return "";
    const abs = Math.abs(v);
    const s = abs >= 1000 ? (Math.trunc(abs / 100) / 10).toFixed(1)+"k" : abs.toString();
    return (v >= 0 ? "+" : "-") + s;
  };

  const auditDisplay = useMemo(() => {
    if (appMode === 'real') {
      let pdp = null, ts = null;
      for (let i = REAL_AUDITS_MAJOR.length - 1; i >= 0; i--) {
        const a = REAL_AUDITS_MAJOR[i];
        if (a.ms > tableTime) continue;
        if (a.channel === 'pdp' && !pdp) pdp = { time: _fmtAuditDisplayTime(a.ms), change: a.minute_total };
        if (a.channel === 'ts'  && !ts)  ts  = { time: _fmtAuditDisplayTime(a.ms), change: a.minute_total };
        if (pdp && ts) break;
      }
      return { pdp, ts };
    }
    let pdp = null, ts = null;
    for (let i = AUDITS.length - 1; i >= 0; i--) {
      const [, ch, change, auditTs, time] = AUDITS[i];
      if (auditTs > tableTime) continue;
      if (ch === "pdp" && !pdp) pdp = { time, change };
      if (ch === "ts" && !ts) ts = { time, change };
      if (pdp && ts) break;
    }
    return { pdp, ts };
  }, [tableTime, appMode]);

  const musicArrowSeekRef = useRef(true);
  const skipMusicSyncRef = useRef(false);
  const gapLabelRef = useRef(null);
  const [gapLabelScale, setGapLabelScale] = useState(1);

  // - Keyboard -
  useEffect(() => { console.log('%c[Keybinds] H = show/hide playback toolbar | Space = play/pause | Arrow keys = seek', 'color:#4a8fc0'); }, []);
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
        if (e.key === "Enter" || e.key === "Escape") { e.preventDefault(); e.target.blur(); }
        return;
      }
      if (e.code === "Space") { e.preventDefault(); if (!musicArrowSeekRef.current) skipMusicSyncRef.current = true; dispatch({type:"TOGGLE_PLAY"}); return; }
      if (e.shiftKey && e.key === "H") { setDevMode(v => { const n=!v; try{localStorage.setItem('pvt_devmode',n?'1':'0');}catch{} return n; }); return; }
      if (e.key === "h" || e.key === "H") { setBarHidden(v => !v); return; }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      let delta;
      if (isDyn) delta = dir * getDynSpeed(dynGapRef.current(posRef.current)) * 5 / 3600;
      else if (isRTSpeedMode(speedMode)) delta = dir * 5 / 3600;
      else if (speedMode === "1m") delta = dir * 5 / 60;
      else delta = 0;
      delta *= mult;
      const next = Math.max(SEEK_START, Math.min(effectiveMaxIdx, posRef.current + delta));
      posRef.current = next; setPos(next); clearRT(); dispatch({type:"BUMP_SEEK"});
      if (musicArrowSeekRef.current) musicSeekRef.current?.(dir);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [maxIdx, speedMode, isDyn, mult]);

  // - Main playback loop (rAF-paced; handles 1m, 1h, and Dynamic) -
  // RT modes (frt/rt/crt) are handled by their own setInterval /
  // dedicated rAF effects below. When isDyn is on, this effect takes
  // over even if the dropdown mode is RT - the dyn toggle is the
  // override.
  useEffect(() => {
    if (!playing) return;
    if (isRTSpeedMode(speedMode)) return;
    let last = performance.now();
    const step = (now) => {
      const dt = now - last; last = now;
      let inc;
      if (speedMode === "1m") inc = dt/60000;
      else inc = 0;
      inc *= effectiveMultRef.current;
      const next = posRef.current + (reverse ? -inc : inc);
      if (!reverse && next >= effectiveMaxIdx) { posRef.current=effectiveMaxIdx; setPos(effectiveMaxIdx); dispatch({type:"STOP"}); return; }
      if (reverse && next < SEEK_START) { posRef.current=SEEK_START; setPos(SEEK_START); dispatch({type:"STOP"}); return; }
      posRef.current = next; setPos(next);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, speedMode, isDyn, reverse, mult, effectiveMaxIdx]);

  // - RT mode interval -
  useEffect(() => {
    if (!isRTSpeedMode(speedMode) || !playing) return;
    const periodSec = rtInterval;
    const baseMs = rtInterval * 1000;
    // At 1x, advance one full RT period per tick (unchanged). At higher mult,
    // aim for 1 sim-sec per tick so the clock display ticks every second instead
    // of jumping in period-sec increments. actualMs shrinks accordingly to keep
    // the overall sim-rate equal to mult. The 10ms floor is the practical lower
    // bound - at mult=100 it lets the tick fire every 10ms with advanceSec=1
    // (one sim-sec per tick), and only past mult=100 does advanceSec grow.
    const getTickMs = () => rtRollDuration(rtInterval, effectiveMultRef.current);
    const getAdvanceSec = (tickMs) => {
      const em = effectiveMultRef.current;
      if (em <= 1) return baseMs / 1000;
      return tickMs * em / 1000;
    };
    const gauss = () => Math.sqrt(-2*Math.log(Math.random()+1e-10))*Math.cos(2*Math.PI*Math.random());

    // Seed display at effect setup from binary.
    {
      const rdSeed = realDataAt(curTime);
      if (rdSeed) {
        setRtDisplay({ pt: rdSeed.pdp, tt: rdSeed.ts, sb: null, ftv: null,
          gap: rdSeed.pdp - rdSeed.ts,
          ptT: curTime, ttT: curTime, sbT: curTime, ftvT: curTime, midT: curTime });
      }
    }

    const pendingTimeouts = [];
    let tickId;
    let lastTick = performance.now();
    const tick = () => {
      const actualMs = getTickMs();
      // Advance by REAL elapsed wall-clock time, not a fixed per-tick amount, so
      // dropped frames / setTimeout jank can't make RT drift slower than 1x - a
      // late tick advances proportionally more and stays on the realtime clock.
      const now = performance.now();
      let realMs = now - lastTick; lastTick = now;
      if (realMs < 0) realMs = 0;
      const advanceSec = realMs / 1000 * effectiveMultRef.current;
      const advance = (reverse?-1:1)*advanceSec/3600;
      const next = posRef.current + advance;
      if (!reverse && next>=effectiveMaxIdx) { posRef.current=effectiveMaxIdx; setPos(effectiveMaxIdx); dispatch({type:"STOP"}); return; }
      if (reverse && next<SEEK_START) { posRef.current=SEEK_START; setPos(SEEK_START); dispatch({type:"STOP"}); return; }
      posRef.current = next; setPos(next);

      const tNow = REAL_DATA_START_MS + next * HOUR_MS;
      const sbNow  = channelNoisyValueAt('sb_real',  1, tNow) ?? dailyInterp(SBD_REAL, tNow);
      const ftvNow = channelNoisyValueAt('ftv_real', 1, tNow) ?? dailyInterp(FTVD_REAL, tNow);

      // PT/TT values: binary lookup.
      const _rdTick = realDataAt(tNow);
      const ptVal = _rdTick ? _rdTick.pdp : 0;
      const ttVal = _rdTick ? _rdTick.ts  : 0;

      const sbVal = sbNow;
      const ftvVal = ftvNow;
      const gapVal = ptVal - ttVal;

      // Desync: PT updates immediately, TT lags by desync*actualMs (0..1 = 0..full period).
      // Gap fires at the midpoint (same slot as SB) using 1s-resolution noise.
      const delayTT = desync * actualMs;
      const delaySB = delayTT / 2;
      const delayFTV = delayTT / 2;
      if (delayTT <= 0) {
        setRtDisplay(prev => ({ pt:ptVal, tt:ttVal, sb:sbVal, ftv:ftvVal, gap:gapVal, ptT:tNow, ttT:tNow, sbT:tNow, ftvT:tNow, gapT: prev.ptT ?? tNow, midT:tNow }));
      } else {
        setRtDisplay(prev => ({ ...prev, pt:ptVal, ptT:tNow, gapT: prev.ptT ?? tNow }));
        // Midpoint slot (same as gap/SB counter): the whole subs/min + prediction
        // + audit table commits here, so its columns update together, not staggered.
        const t1 = setTimeout(() => setRtDisplay(prev => ({ ...prev, sb:sbVal, sbT:tNow, gap:gapVal, midT:tNow })), delaySB);
        const tF = setTimeout(() => setRtDisplay(prev => ({ ...prev, ftv:ftvVal, ftvT:tNow })), delayFTV);
        const t2 = setTimeout(() => setRtDisplay(prev => ({ ...prev, tt:ttVal, ttT:tNow })), delayTT);
        pendingTimeouts.push(t1, tF, t2);
      }

      tickId = setTimeout(tick, actualMs);
    };
    tickId = setTimeout(tick, getTickMs());
    return () => { clearTimeout(tickId); pendingTimeouts.forEach(clearTimeout); };
  }, [speedMode, playing, reverse, mult, effectiveMaxIdx, desync, isDyn, appMode, rtInterval]);

  // - Clock ticker: advances every wall-clock second by 1 data-second x mult -
  const [clockTime, setClockTime] = useState(curTime);
  useEffect(() => {
    // Non-RT: sync directly to curTime every render
    if (!isRTSpeedMode(speedMode) || !playing) { setClockTime(curTime); return; }
    // RT: tick every wall-clock second
    setClockTime(curTime);
    const iv = setInterval(() => {
      setClockTime(prev => prev + (reverse ? -1000 : 1000) * effectiveMultRef.current);
    }, 1000);
    return () => clearInterval(iv);
  }, [speedMode, playing, reverse, mult, curTime]);

  // - Display values -
  // RT modes get values from the rtDisplay state (set by the RT tick).
  // All non-RT paths read from the binary data buffer.
  const _rdNow = realDataAt(curTime);
  const displayPt = (isRTMode && rtDisplay.pt!=null) ? rtDisplay.pt
    : _rdNow ? _rdNow.pdp
    : (curPoint?.pt!=null ? Math.round(curPoint.pt) : null);
  const displayTt = (isRTMode && rtDisplay.tt!=null) ? rtDisplay.tt
    : _rdNow ? _rdNow.ts
    : (curPoint?.tt!=null ? Math.round(curPoint.tt) : null);
  // Raw (unrounded) for milestone bar - float updates every frame so the
  // progress pct animates continuously rather than stepping at integer boundaries.
  const mileDisplayPt = (isRTMode && rtDisplay.pt!=null) ? rtDisplay.pt
    : _rdNow ? _rdNow.pdp : curPoint?.pt ?? null;
  const mileDisplayTt = (isRTMode && rtDisplay.tt!=null) ? rtDisplay.tt
    : _rdNow ? _rdNow.ts  : curPoint?.tt ?? null;
  // displaySB / displayFTV dispatch:
  //   - RT modes (rt/frt/crt) read from rtDisplay, populated by the RT
  //     setInterval which now reads noisy values via dailyInterp(arr, t,
  //     periodSec). Fall back to curSB on the very first frame before
  //     rtDisplay is set.
  //   - 1m mode is NRT-style for animation (advances via the rAF tick)
  //     but useNoise is true for it, so the counter must show the same
  //     multinomial-bridge + Skellam noise the chart shows. Read directly
  //     from the noise pipeline at curTime via dailyInterp's periodSec
  //     dispatch - this skips the rAF-tick poissonDraw accumulator (which
  //     was a smooth-rate model anyway) and reuses the exact same noise
  //     functions PDP/TS use.
  //   - All other modes (normal speed, paused, etc.) use the smooth
  //     cubic baseline curSB / curFTV.
  // displaySB / displayFTV are defined just below, after _channelDisplayAt,
  // so their stale/seek fallback can reuse the same noisy-bridge sampler the
  // other channels use (otherwise seeking flashes the smooth cubic for one
  // frame before the next RT tick repopulates rtDisplay with the noisy value).

  const _channelDisplayAt = (ch) => {
    const src = CHANNEL_SOURCE[ch];
    if (!src || !src.raw || !src.raw.length) return null;
    const t = curTime;
    if (t < src.raw[0].t || t > src.raw[src.raw.length - 1].t) return null;
    if (useNoise) {
      const v = (speedMode === "1m" ? channelNoisyValueAtInterp : channelNoisyValueAt)(ch, rtPeriodSec, t);
      return v != null ? Math.round(v) : null;
    }
    const v = getChannelOrganicAt(t, ch);
    return v != null ? Math.round(v + getCumAudit(t, ch)) : null;
  };
  // SB / FTV: when the RT-tick value is missing (seek / first frame / pause
  // after seek), fall back to the noisy bridge via _channelDisplayAt.
  // curSB/curFTV remain the out-of-window fallback.
  const displaySB  = (isRTMode && rtDisplay.sb  != null) ? rtDisplay.sb
    : (_channelDisplayAt('sb_real')  ?? curSB);
  const displayFTV = (isRTMode && rtDisplay.ftv != null) ? rtDisplay.ftv
    : (_channelDisplayAt('ftv_real') ?? curFTV);

  // Dynamic-mode gap source - the SAME gap the user actually sees on
  // screen. Reading from the displayed values (which include the noisy
  // bridge / Skellam overlay when useNoise is on) means the speed
  // ladder switches tiers at the moment the visible gap crosses a
  // threshold, not when the underlying cubic baseline does.
  // The position argument is preserved for signature compatibility but
  // ignored - the displayed values already correspond to the current
  // playhead time.
  dynGapRef.current = (_p) => {
    if (displayPt == null || displayTt == null) return null;
    return Math.min(
      Math.abs(displayPt - displayTt),
      Math.abs(displayPt - 100_000_000),
      Math.abs(displayTt - 100_000_000)
    );
  };
  const modeBaseSec = speedMode === "1m" ? 60 : 1;
  effectiveMult = isDyn ? mult * getDynSpeed(dynGapRef.current(pos) ?? 0) / modeBaseSec : mult;
  effectiveMultRef.current = effectiveMult;
  const currentGap = (isRTMode && rtDisplay.gap != null)
    ? rtDisplay.gap
    : (displayPt != null && displayTt != null ? displayPt - displayTt : null);

  // effectiveSpeed: absolute sim-sec/real-sec shown next to the Dynamic button.
  // Multiplied by modeBaseSec so 1min/s and 1hr/s modes display the true combined rate.
  const effectiveSpeed = isDyn ? getDynSpeed(dynGapRef.current(pos)) * mult : null;
  const dur = rtRollDuration(rtInterval, effectiveMult);

  // LAYOUT: SocialBlade counter helper - see LAYOUTS.md
  const renderCounter = (value) => {
    if (isRTMode) return <CasinoCounter value={value} duration={dur} seekToken={seekToken}/>;
    if (value == null) return "\u2014";
    const formatted = Math.round(value).toLocaleString();
    return (
      <span style={{ display:"inline", fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap", lineHeight:1, letterSpacing:0 }}>
        {formatted.split("").map((ch, i) => {
          if (ch === ",") return <span key={"c"+i} style={{ display:"inline-block", verticalAlign:"top", lineHeight:1, marginRight:"0.0105em" }}>,</span>;
          return <span key={"d"+i} style={{ display:"inline-block", height:"1em", width:"1ch", textAlign:"center", lineHeight:1, verticalAlign:"top", marginRight:"0.0105em" }}>{ch}</span>;
        })}
      </span>
    );
  };

  // Unified SocialBlade channel card. Renders the sub-count + profile pic +
  // channel name + SB watermark + subtitle as a single self-contained unit.
  //
  // IMPORTANT: this is a plain helper function, NOT a React component. If
  // it were declared as `const SbChannelCard = (...) => (...)` and used as
  // <SbChannelCard .../>, React would treat each parent render as a fresh
  // component type (since the function reference is recreated every render
  // of the closure scope), unmount and remount the entire subtree, and the
  // <CasinoCounter> inside it would lose its animation state every tick,
  // turning the rolling odometer into static text. Calling it as a regular
  // function and returning JSX avoids that entirely.
  //
  // Layout: outer wrapper at (left, top) with size (width, height). Inside
  // sits ONE scaled subtree at (0, 0) carrying the watermark plus the icon,
  // name, counter, and subtitle. The `scale` prop scales the whole inner
  // subtree as a coherent unit, including the watermark. All offset props
  // (bgWatermark, iconPos, namePos, counterPos, subtitlePos) are in the
  // inner subtree's UN-scaled coordinate space, so the two main channels
  // can pass their original hand-tuned offsets verbatim.
  //
  // - bgWatermark: optional; SB background watermark, pass null to omit.
  // - subtitlePos: optional; pass null to omit the subtitle line entirely
  //   (used by the compact Social Blade channel card which has no subtitle).
  // LAYOUT: SocialBlade card ONLY - see LAYOUTS.md
  const sbChannelCard = ({
    left, top, width, height, scale = 1,
    bgWatermark,
    bgWatermarkBelow = false, // render the watermark at z-index 0 so it sits
                              //   below the page charts (only safe when the
                              //   card has no solidBackground).
    bgClipW = null,           // optional visual-px width of the watermark clip
                              //   box (default = full card). Smaller value keeps
                              //   the watermark from bleeding into neighbours on
                              //   the card's right edge.
    bgExtendLeft = 0,         // visual-px amount to extend the clip box leftward past
                              //   the card's left edge, exposing watermark content
                              //   with negative x offsets.
    iconSrc,
    iconPos,
    nameText, nameIcon,
    namePos,
    counterValue,
    counterPos,
    subtitlePos,
    contentScale = 1,         // scale applied to the name+pfp+counter group only
    solidBackground = false,  // solid fill of the wrapper. Sits behind the watermark.
    dark = sbDark,            // false = light mode (white bg, dark counter text)
    bottomCutoff = 0,         // canvas pixels to clip from the wrapper's bottom edge.
                              //   Affects the solid background, the SB watermark, and the
                              //   subtitle (anything inside the scaled subtree). Foreground
                              //   elements (icon, name, counter) are not affected unless
                              //   they happen to fall in the clipped region.
    zIndex,                   // optional CSS z-index applied to the outer wrapper. Used
                              //   to position cards relative to charts/text/tables that
                              //   render later in the JSX but should appear visually
                              //   below or above the card.
    key,
  }) => {
    // Visual dimensions = unscaled width/height multiplied by scale. The
    // outer wrapper is sized to these visual dimensions so a card with
    // width:561, scale:0.5 occupies a 280.5x122 box. The wrapper matches
    // the visible card dimensions so its hit box and background stay aligned.
    const visualWidth  = width  * scale;
    const visualHeight = height * scale;
    // bottomCutoff is in canvas (visual) px, applied to the visual height.
    const effectiveHeight = Math.max(0, visualHeight - bottomCutoff);
    // Layout structure (chosen so bottomCutoff cleanly clips the watermark
    // and subtitle without ever clipping the centered counter text, which
    // can overflow the wrapper horizontally on small cards like SB):
    //
    //   outer wrapper (visual size, no clipping)
    //     +-- solid black fill (visual width x effectiveHeight)    [optional]
    //     +-- bg-clip subtree (overflow:hidden, height:effectiveHeight)
    //     |     +-- scaled inner: watermark + subtitle
    //     +-- foreground subtree (unclipped, full visual height)
    //           +-- scaled inner: icon, name, counter
    //
    // Splitting bg from foreground means bottomCutoff and the solid fill
    // affect only background visuals; overflow of the foreground counter
    // (which uses width:100% with text-align center and may exceed the
    // wrapper width) stays visible regardless of cutoff settings.
    return (
    <div key={key} style={{ position:"absolute", left, top, width:visualWidth, height:effectiveHeight, ...(zIndex != null ? {zIndex} : {}) }}>
      {solidBackground && (
        <div style={{ position:"absolute", left:0, top:0, width:visualWidth, height:effectiveHeight, background:SB_CARD_BG }}/>
      )}
      <div style={{ position:"absolute", left:-bgExtendLeft, top:0, width:(bgClipW != null ? bgClipW + bgExtendLeft : visualWidth + bgExtendLeft), height:effectiveHeight, overflow:"hidden", ...(bgWatermarkBelow ? {zIndex:0} : {}) }}>
        <div style={{ position:"absolute", left:0, top:0, width, height, transform:`scale(${scale})`, transformOrigin:"top left" }}>
          {bgWatermark && sbWatermark(bgWatermark.x, bgWatermark.y, bgWatermark.w, bgWatermark.h, dark)}
          {subtitlePos && (
            <div style={{ position:"absolute", left:subtitlePos.x, top:subtitlePos.y, fontFamily:"Roboto, sans-serif", fontSize:16 }}><span style={{color:dark?"#643F34":"#d64e33"}}>YouTube Live Subscriber Count</span><span style={{color:dark?"#686867":"#787373"}}> - Powered by SocialBlade.com</span></div>
          )}
        </div>
      </div>
      <div style={{ position:"absolute", left:0, top:0, width, height, transform:`scale(${scale})`, transformOrigin:"top left", ...(bgWatermarkBelow ? {zIndex:2} : {}) }}>
        {/* Header (profile picture + channel name) is centered horizontally
            as a single group within the card width. iconPos.x / namePos.x
            define the preserved horizontal gap; iconPos.y / namePos.y define
            the preserved vertical offsets. */}
        <div style={{ position:"absolute", left:0, top:iconPos.y, width:"100%", transform:`scale(${contentScale})`, transformOrigin:"top center" }}>
          <div style={{ position:"absolute", left:counterPos.x, top:0, width:"100%", display:"flex", justifyContent:"center", alignItems:"flex-start", gap: Math.max(0, namePos.x - iconPos.x - 50) }}>
            <div style={{ width:50, height:50, flexShrink:0 }}>
              <img src={iconSrc} style={{ width:50, height:50, border:`1px solid ${dark?red:"#e62117"}`, display:"block", boxSizing:"border-box" }}/>
              <div style={{ width:50, height:16, background:dark?red:"#e62117", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>+</div>
            </div>
            <div style={{ marginTop: namePos.y - iconPos.y, fontFamily:"Roboto, sans-serif", fontWeight:700, fontSize:32, color:dark?salmon:"#e62117", whiteSpace:"nowrap" }}>{nameText} {dark?nameIcon:React.cloneElement(nameIcon,{style:{...nameIcon.props.style,fill:"#555"}})}</div>
          </div>
          <div style={{ position:"absolute", left:counterPos.x, top:counterPos.y - iconPos.y, width:"100%", fontFamily:"Roboto, sans-serif", fontWeight:700, fontSize:95, color:dark?"#D6D6D6":"#232323", letterSpacing:1, lineHeight:1, textAlign:"center" }}>{renderCounter(counterValue)}</div>
        </div>
      </div>
    </div>
    );
  };

  const showSBv2 = curTime >= SB_V2_TS;
  const showMidMode = curTime >= TS_SLOWDOWN_TS;
  const showTsOverMode = curTime >= TS_LEAD_TS;

  // Gap text label
  const gapLabel = (() => {
    const g = currentGap;
    if (g == null) return "Sub Gap: \u2014";
    if (g >= 0) return `Sub Gap: PewDiePie: +${Math.abs(g).toLocaleString()}`;
    return `Sub Gap: T-Series: +${Math.abs(g).toLocaleString()}`;
  })();

  useLayoutEffect(() => {
    const el = gapLabelRef.current;
    if (!el) return;
    const maxW = 455;
    const w = el.offsetWidth;
    const scale = w > maxW ? maxW / w : 1;
    setGapLabelScale(prev => Math.abs(prev - scale) < 0.001 ? prev : scale);
  }, [gapLabel.length]);

  // Milestone predictions
  const nextMs = (v) => v!=null ? Math.ceil(v/1e6)*1e6 : null;
  const etaDate = (subs, daily) => {
    if (subs==null || daily==null || daily<=0) return null;
    const remaining = nextMs(subs) - subs;
    if (remaining <= 0) return null;
    return new Date(tableTime + (remaining/daily)*86400000);
  };
  const eta100M = (subs, daily) => {
    if (subs==null || daily==null || daily<=0 || subs>=100000000) return null;
    return new Date(tableTime + ((100000000-subs)/daily)*86400000);
  };
  const fmtEta = (d) => {
    if (!d) return "\u2014";
    const ts = d.getTime();
    const etOff = _getEasternOffset(ts);
    const et = new Date(ts + etOff * 3600000);
    const mon = et.toLocaleDateString("en-US",{timeZone:"UTC",month:"short",day:"numeric"});
    const hr = et.getUTCHours();
    return mon+" "+(hr%12||12)+(hr<12?"am":"pm")+" "+(etOff===-4?"EDT":"EST");
  };
  // When Min Snap is on, milestone predictions use the INTEGER-rounded 1-day
  // avg subs/min (the value actually displayed in the table's 24h cell -
  // lookbacks index 4 = 24 hours), converted to subs/day for the ETA
  // functions. Otherwise they use the raw per-day field from the data.
  // In Real Data mode always use the binary-derived 24h rate (no tablePoint.pd).
  const predRatePdp = (appMode === 'real' || minuteSnap)
    ? (typeof subsPerMinTable.pdp[4] === 'number' ? Math.round(subsPerMinTable.pdp[4]) * 1440 : null)
    : tablePoint?.pd;
  const predRateTs = (appMode === 'real' || minuteSnap)
    ? (typeof subsPerMinTable.ts[4] === 'number'  ? Math.round(subsPerMinTable.ts[4])  * 1440 : null)
    : tablePoint?.td;
  const pdpNextMs = nextMs(tableDisplayPt);
  const tsNextMs = nextMs(tableDisplayTt);
  const pdpMsEta = etaDate(tableDisplayPt, predRatePdp);
  const tsMsEta = etaDate(tableDisplayTt, predRateTs);
  const pdp100Eta = eta100M(tableDisplayPt, predRatePdp);
  const ts100Eta = eta100M(tableDisplayTt, predRateTs);

  // In Real Data mode, null with a lookback that starts before binary coverage = TBD.
  const fmtSpm = (v, lbH) => {
    if (v == null) {
      if (appMode === 'real' && lbH != null && tableTime - lbH * HOUR_MS < REAL_DATA_START_MS)
        return 'TBD';
      return "\u2014";
    }
    return Math.round(v).toLocaleString();
  };

  // Scale
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  // Music player removed.
  const musicEnabled = false;
  const musicArrowSeek = false;
  musicArrowSeekRef.current = musicArrowSeek;
  const musicPlaylist = [];
  const musicIdx = 0;
  const musicPlaying = false;
  const musicLibrary = null;
  const audioRef = useRef(null);
  // Music player logic removed.
  const musicHandleEndRef = useRef(null);
  musicHandleEndRef.current = () => {};
  const fpsDisplayRef = useRef(null);
  const musicFileOf = (song) => { const s = String(song); const ci = s.indexOf('::'); return ci >= 0 ? s.slice(ci + 2) : s; };
  const musicPickRandom = () => {};
  const musicSeekRef = useRef(null);
  musicSeekRef.current = () => {};
  const hasVisitedFlareRef = useRef(false);
  const musicLiveTrack = false;
  const musicMeta = { artist: "", title: "" };
  const analyserRef = useRef(null);
  const freqDataRef = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      const barH = barHidden ? 0 : (document.querySelector('[data-controlbar]')?.offsetHeight || 0);
      const sw = window.innerWidth / 1280;
      const sh = (window.innerHeight - barH) / 720;
      setScale(Math.min(sw, sh));
    };
    handleResize();
    setTimeout(handleResize, 0);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen, barHidden]);

  // Chart tick formatters — all display in Eastern Time (same as Raleigh clock)
  const fmt1hTick = (ts) => {
    const d = new Date(ts + _getEasternOffset(ts) * 3600000);
    const h = d.getUTCHours(), m = d.getUTCMinutes();
    if (h === 0 && m === 0) return d.toLocaleDateString("en-US",{timeZone:"UTC",month:"short",day:"numeric"});
    return String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0");
  };
  const fmtHistTick = (ts) => {
    const d = new Date(ts + _getEasternOffset(ts) * 3600000);
    const spanHours = (curTime - tMinHist) / HOUR_MS;
    const dateFmt = d.getUTCDate()+". "+d.toLocaleDateString("en-US",{timeZone:"UTC",month:"short"});
    if (spanHours <= 12) return String(d.getUTCHours()).padStart(2,"0")+":"+String(d.getUTCMinutes()).padStart(2,"0");
    if (spanHours <= 48) {
      const h = d.getUTCHours();
      if (h === 0) return dateFmt;
      return String(h).padStart(2,"0")+":00";
    }
    return dateFmt;
  };

  // - Dashboard data -
  // Dashboard scoreboard scale when charts are off
  const dashScoreRef = useRef(null);
  const dashMileRef = useRef(null);
  const [dashScoreScale, setDashScoreScale] = useState(1);
  const [dashTargetH, setDashTargetH] = useState(0);
  const leftPanelRef = useRef(null);
  const [leftPanelScale, setLeftPanelScale] = useState(1);
  const eDC = DC;
  useEffect(() => {
    let frames = [];
    let raf;
    const tick = (now) => {
      frames.push(now);
      if (frames.length > 60) frames.shift();
      if (frames.length >= 2 && fpsDisplayRef.current) {
        const fps = (frames.length - 1) / ((frames[frames.length - 1] - frames[0]) / 1000);
        fpsDisplayRef.current.textContent = Math.round(fps) + ' fps';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const dashFont = "'Inter',system-ui,-apple-system,'Segoe UI',sans-serif";

  // flareHides/FLARE_HIDDEN removed with Flare decoupling; stub left so
  // `!flareHides(key) && X` sites keep rendering X until their guards are
  // cleaned up. Flare-specific hiding now belongs inside FlareView.
  const flareHides = () => false;
  useEffect(() => {
    if (view !== "dashboard") { setDashScoreScale(1); setDashTargetH(0); return; }
    const measure = () => {
      const el = dashScoreRef.current;
      if (!el) return;
      // Measure natural dimensions by temporarily forcing zoom=1 and width=max-content
      // inline - all within the same JS tick so the browser never paints the
      // intermediate scale=1 state.
      const prevZoom = el.style.zoom;
      const prevWidth = el.style.width;
      el.style.zoom = '1';
      el.style.width = 'max-content';
      const natW = el.offsetWidth;  // forces reflow, but no paint until JS yields
      const natH = el.offsetHeight;
      el.style.zoom = prevZoom;
      el.style.width = prevWidth;
      if (natW < 10 || natH < 10) return;
      const barH = barHidden ? 0 : (document.querySelector('[data-controlbar]')?.offsetHeight || 0);
      const availH = window.innerHeight - barH - 20;
      const availW = window.innerWidth - 64;
      const zByW = availW / natW;

      if (dashShowCharts) {
        setDashScoreScale(1);
        setDashTargetH(0);
      } else {
        const zByH = availH / natH;
        const z = Math.min(zByW, zByH);
        const targetH = availH / z;
        setDashScoreScale(z);
        setDashTargetH(targetH);
      }
    };
    requestAnimationFrame(measure);
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [view, dashShowCharts, menuOpen, barHidden]);

  useEffect(() => {
    if (view !== "dashboard" || !dashShowCharts) { setLeftPanelScale(1); return; }
    const measure = () => {
      const el = leftPanelRef.current;
      if (!el) return;
      const prevZoom = el.style.zoom;
      const prevWidth = el.style.width;
      const prevHeight = el.style.height;
      const prevFlex = el.style.flex;
      el.style.zoom = '1';
      el.style.width = 'max-content';
      el.style.height = 'max-content';
      el.style.flex = 'none';
      const natH = el.scrollHeight;
      const natW = el.scrollWidth;
      el.style.zoom = prevZoom;
      el.style.width = prevWidth;
      el.style.height = prevHeight;
      el.style.flex = prevFlex;
      if (natH < 10 || natW < 10) return;
      const bH = barHidden ? 0 : (document.querySelector('[data-controlbar]')?.offsetHeight || 0);
      const availH = (window.innerHeight - bH - 12) * (dashAltLayout ? 0.52 : 1);
      const availW = (el.parentElement?.offsetWidth || Math.round(window.innerWidth * (dashAltLayout ? 1 : 0.33))) - 4;
      const z = Math.min(availH / natH, availW / natW, 3);
      setLeftPanelScale(z);
    };
    requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [view, dashShowCharts, barHidden, menuOpen, dashAltLayout]);

  const pdpLeading = displayPt != null && displayTt != null && displayPt >= displayTt;

  const fmtLeadDuration = (ms) => {
    if (ms == null || ms < 0) return "\u2014";
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000) % 60;
    const h = Math.floor(ms / 3600000) % 24;
    const d = Math.floor(ms / 86400000);
    if (d > 0) return `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
    if (h > 0) return `${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
    return `${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  };

  // Flare leadership-crossings: built lazily in an effect (off the render
  // path, so the scan can never block a paint) and only when the Flare
  // view with Extra Info is actually being shown. Results are stored in
  // state; the per-frame binary search reads whatever's currently in
  // state. If the Flare view isn't the active view, or Extra Info is off,
  // we leave the crossings array empty and pay nothing. Effect re-runs
  // only when (flareNeeded, useNoise, rtPeriodSec) changes - never during
  // normal playback, only on view/toggle/speed-mode changes.
  //
  // Two-tier scan keeps the build cost down even when it does run. Most
  // hours have the two channels millions of subs apart; no per-sample
  // noise spike can flip the sign there, so we skip the per-sample walk
  // and just push the organic endpoint. Only hours where the organic
  // gap either changes sign across the boundary or sits within
  // NOISE_MARGIN of zero get the full noise scan.
  // Precomputed PDP↔TS gap-sign-flip timestamps. Built once per
  // (view, useNoise, rtPeriodSec) tuple in a useEffect, then queried via
  // O(log N) binary search from the render path. The precomputed timestamps
  // stay stable across seeks and distinguish "the gap just flipped" from
  // "we just rendered".
  //
  // Used by:
  //   - Flare view's "Time ahead:" readout
  //   - Dashboard's CHANNEL AHEAD duration
  //
  // If neither view needs it, we leave the array empty and pay nothing.
  // Effect re-runs only when (crossingsNeeded, useNoise, rtPeriodSec)
  // change - never during normal playback, only on view/toggle/speed.
  //
  // Two-tier scan keeps the build cost down even when it does run. Most
  // hours have the two channels millions of subs apart; no per-sample
  // noise spike can flip the sign there, so we skip the per-sample walk
  // and just push the organic endpoint. Only hours where the organic
  // gap either changes sign across the boundary or sits within
  // NOISE_MARGIN of zero get the full noise scan.
  const crossingsNeeded = (view === "flare" && flareExtraInfo) || view === "dashboard";
  const [gapCrossings, setGapCrossings] = useState([]);
  useEffect(() => {
    if (!crossingsNeeded) return; // keep last result - avoids clearing on flare view switch
    setGapCrossings(GAP_CROSSINGS);
  }, [crossingsNeeded]);

  const tsTotalSecsAhead = useMemo(() => {
    if (curTime == null || gapCrossings.length === 0) return 0;
    // gapCrossings alternates: [0]=PDP->TS, [1]=TS->PDP, [2]=PDP->TS, ...
    // TS is ahead during even-indexed intervals: [c[0],c[1]], [c[2],c[3]], ...
    let total = 0;
    for (let i = 0; i < gapCrossings.length; i += 2) {
      const start = gapCrossings[i];
      if (start >= curTime) break;
      const end = gapCrossings[i + 1];
      const effectiveEnd = (end != null && end < curTime) ? end : curTime;
      total += (effectiveEnd - start) / 1000;
      if (end == null || end >= curTime) break;
    }
    return total;
  }, [curTime, gapCrossings]);

  const tsTakeoverCount = useMemo(() => {
    if (curTime == null || gapCrossings.length === 0) return 0;
    let count = 0;
    for (let i = 0; i < gapCrossings.length; i += 2) {
      if (gapCrossings[i] <= curTime) count++;
      else break;
    }
    return count;
  }, [curTime, gapCrossings]);

  // Legit takeover count: only TS leads that lasted >= 10 seconds count.
  const tsTakeoverCountLegit = useMemo(() => {
    if (curTime == null || gapCrossings.length === 0) return 0;
    let count = 0;
    for (let i = 0; i < gapCrossings.length; i += 2) {
      const start = gapCrossings[i];
      if (start > curTime) break;
      const end = gapCrossings[i + 1] != null ? Math.min(gapCrossings[i + 1], curTime) : curTime;
      if (end - start >= 10000) count++;
    }
    return count;
  }, [curTime, gapCrossings]);

  // CHANNEL AHEAD duration: binary search the same precomputed crossings
  // array the Flare view uses. O(log N) per render, no scanning, no ref
  // state, and matches Flare exactly at any given clockTime.
  //
  // While gapCrossings is still building (first frame after view switch /
  // noise-mode flip), fall back to a coarse RAW-only scan so the readout
  // doesn't show "-" during the brief async gap.
  const dashLeadMs = (() => {
    if (currentGap == null) return null;
    if (gapCrossings.length > 0) {
      let lo = 0, hi = gapCrossings.length - 1, best = -1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (gapCrossings[mid] <= clockTime) { best = mid; lo = mid + 1; }
        else { hi = mid - 1; }
      }
      const crossT = best >= 0 ? gapCrossings[best] : PDP_LEAD_SINCE;
      return Math.floor((clockTime - crossT) / 1000) * 1000;
    }
    // Fallback: GAP_CROSSINGS not loaded yet (shouldn't happen in real mode
    // since it's synchronous, but handle gracefully).
    if (appMode === 'real') return null;
    if (!RAW.length) return null;
    const curSign = currentGap >= 0;
    let since = PDP_LEAD_SINCE;
    for (let i = Math.min(intIdx, maxIdx); i >= 1; i--) {
      const prevS = RAW[i-1].pt - RAW[i-1].tt >= 0;
      if (prevS !== curSign) {
        const g0 = RAW[i-1].pt - RAW[i-1].tt;
        const g1 = RAW[i].pt - RAW[i].tt;
        const frac = g0 / (g0 - g1);
        since = RAW[i-1].t + frac * (RAW[i].t - RAW[i-1].t);
        break;
      }
    }
    return Math.floor((clockTime - since) / 1000) * 1000;
  })();

  // Shared builders for gain-tier chart data. Algorithm lives once; callers
  // supply channel-specific samplers and key names.

  // Tick tier (ci 0,1): sub-minute step, re-samples every 10 sim-seconds.
  function _buildGainTick(ci, { tMinCh, tMaxCh, curTime, rtPeriodSec, useNoise, sampleA, sampleB, nrtBoth, keyA, keyB, stripAudits, sampleAOrg, sampleBOrg, nrtBothOrg }) {
    const [lb, span, , rawStep] = gainCharts[ci];
    const lbMs = Math.round(lb * HOUR_MS);
    // Audit filter applies to every gain chart: use the organic samplers so audit
    // jumps drop out of the growth delta (gap stays audit-inclusive below).
    const strip = stripAudits;
    const sA = strip && sampleAOrg ? sampleAOrg : sampleA;
    const sB = strip && sampleBOrg ? sampleBOrg : sampleB;
    const nb = strip && nrtBothOrg ? nrtBothOrg : nrtBoth;
    const stepMs = Math.abs(rawStep) * rtPeriodSec * 2000;
    const qTime = Math.floor(curTime / 10000) * 10000;
    const tEnd = tMaxCh != null ? Math.min(qTime, tMaxCh) : qTime;
    const tStart = Math.max(tMinCh, tEnd - span * HOUR_MS);
    const shift = Math.round(lbMs / stepMs);
    const extStart = tStart - stepMs * 2 - lbMs;
    const extEnd = tEnd + 10000 + stepMs * 2;
    if (useNoise) {
      const nowA = sA(extStart, extEnd, stepMs);
      const nowB = sB(extStart, extEnd, stepMs);
      // gap stays audit-inclusive even when the gain is audit-stripped.
      const gapA = strip ? sampleA(extStart, extEnd, stepMs) : nowA;
      const gapB = strip ? sampleB(extStart, extEnd, stepMs) : nowB;
      const data = [], n = Math.min(nowA.length, nowB.length, gapA.length, gapB.length);
      for (let i = shift; i < n; i++)
        data.push({ t: nowA[i].t, [keyA]: Math.round(nowA[i].v - nowA[i-shift].v), [keyB]: Math.round(nowB[i].v - nowB[i-shift].v), gap: Math.round(gapA[i].v - gapB[i].v) });
      return data;
    }
    const alignedStart = Math.ceil(extStart / stepMs) * stepMs;
    const pts = [];
    for (let t = alignedStart; t <= extEnd; t += stepMs) { const b = nb(t); const bg = strip ? nrtBoth(t) : b; pts.push({ t, vA: b?.vA ?? null, vB: b?.vB ?? null, gA: bg?.vA ?? null, gB: bg?.vB ?? null }); }
    const data = [];
    for (let i = shift; i < pts.length; i++) {
      const s = pts[i], sp = pts[i-shift];
      if (s.vA != null && sp.vA != null)
        data.push({ t: s.t, [keyA]: Math.round(s.vA - sp.vA), [keyB]: Math.round(s.vB - sp.vB), gap: Math.round(s.gA - s.gB) });
    }
    return data;
  }

  // Minute tier (ci 2,3): 5-30min step, pre-computed to end of current hour.
  function _buildGainMinute(ci, { hourEnd, tMinCh, rtPeriodSec, useNoise, sampleA, sampleB, nrtBoth, keyA, keyB, stripAudits, sampleAOrg, sampleBOrg, nrtBothOrg }) {
    const [lb, span, , stepMs] = gainCharts[ci];
    const lbMs = Math.round(lb * HOUR_MS);
    const strip = stripAudits;   // 1hr (ci 2) and 12hr (ci 3) tiers
    const sA = strip && sampleAOrg ? sampleAOrg : sampleA;
    const sB = strip && sampleBOrg ? sampleBOrg : sampleB;
    const nb = strip && nrtBothOrg ? nrtBothOrg : nrtBoth;
    const tEnd = hourEnd;
    const tStart = Math.max(tMinCh, tEnd - span * HOUR_MS - HOUR_MS);
    const shift = Math.round(lbMs / stepMs);
    const extStart = tStart - stepMs - lbMs;
    const extEnd = tEnd + stepMs;
    if (useNoise) {
      const nowA = sA(extStart, extEnd, stepMs);
      const nowB = sB(extStart, extEnd, stepMs);
      // gap stays audit-inclusive even when the gain is audit-stripped.
      const gapA = strip ? sampleA(extStart, extEnd, stepMs) : nowA;
      const gapB = strip ? sampleB(extStart, extEnd, stepMs) : nowB;
      const data = [], n = Math.min(nowA.length, nowB.length, gapA.length, gapB.length);
      for (let i = shift; i < n; i++)
        data.push({ t: nowA[i].t, [keyA]: Math.round(nowA[i].v - nowA[i-shift].v), [keyB]: Math.round(nowB[i].v - nowB[i-shift].v), gap: Math.round(gapA[i].v - gapB[i].v) });
      return data;
    }
    const alignedStart = Math.ceil(extStart / stepMs) * stepMs;
    const pts = [];
    for (let t = alignedStart; t <= extEnd; t += stepMs) { const b = nb(t); const bg = strip ? nrtBoth(t) : b; pts.push({ t, vA: b?.vA ?? null, vB: b?.vB ?? null, gA: bg?.vA ?? null, gB: bg?.vB ?? null }); }
    const data = [];
    for (let i = shift; i < pts.length; i++) {
      const s = pts[i], sp = pts[i-shift];
      if (s.vA != null && sp.vA != null)
        data.push({ t: s.t, [keyA]: Math.round(s.vA - sp.vA), [keyB]: Math.round(s.vB - sp.vB), gap: Math.round(s.gA - s.gB) });
    }
    return data;
  }

  // Hourly tier (ci 4,5): walk pre-built hourlyPoints, compute gains via pastAt.
  // Callers build hourlyPoints (including any right-edge pin) and supply pastAt.
  function _buildGainHourly(ci, { tMinCh, hourlyPoints, pastAt, keyA, keyB, stripAudits, auditChans }) {
    const [lb] = gainCharts[ci];
    const lbMs = Math.round(lb * HOUR_MS);
    const strip = stripAudits && auditChans;   // 24hr (ci 4) + 48hr (ci 5) tiers
    const data = [];
    for (const { t, vA, vB } of hourlyPoints) {
      if (t - lbMs < tMinCh) continue;
      const past = pastAt(t - lbMs);
      if (!past) continue;
      let gA = vA - past.vA, gB = vB - past.vB;
      if (strip) {
        // strip the GAIN only; gap stays audit-inclusive below.
        gA -= getCumAudit(t, auditChans[0]) - getCumAudit(t - lbMs, auditChans[0]);
        gB -= getCumAudit(t, auditChans[1]) - getCumAudit(t - lbMs, auditChans[1]);
      }
      data.push({ t, [keyA]: Math.round(gA), [keyB]: Math.round(gB), gap: Math.round(vA - vB) });
    }
    return data;
  }

  // - Dashboard chart data -
  // Include 1 extra RAW point beyond each edge so the monotonic Hermite curve extends
  // smoothly past the domain boundary.
  const interpAt = useCallback((t) => {
    const p = tsToPos(t);
    if (p < 0 || p > maxIdx) return null;
    const idx = Math.max(0, Math.min(Math.floor(p), maxIdx - 1));
    const f = p - idx;
    return (f > 0.001 && idx < maxIdx) ? interpolate(idx, f) : RAW[idx];
  }, [maxIdx]);

  const dashTotalData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts) return [];
    const endIdx = Math.min(intIdx + 1, maxIdx);
    const startIdx = Math.max(0, intIdx - dashWin * 24 - 2);
    const data = [];
    for (let i = startIdx; i <= endIdx; i++) {
      const e = RAW[i];
      data.push({ t: e.t, pt: e.pt, tt: e.tt, g: e.pt - e.tt });
    }
    return data;
  }, [view, dashShowCharts, intIdx, dashWin]);

  // Charts 0,1 (tick-level): update every 10 sim-seconds. Real mode uses rdDashGainData instead.
  const dashGainTick = useMemo(() => {
    if (appMode === 'real' || !RAW.length || view !== "dashboard" || !dashShowCharts) return [[], [], [], []];
    const cfg = {
      tMinCh: RAW[0].t, tMaxCh: null, curTime, rtPeriodSec, useNoise,
      sampleA: null, sampleB: null,
      nrtBoth: (t) => { const r = interpAt(t); return r ? { vA: r.pt, vB: r.tt } : null; },
      keyA: "gp", keyB: "gt",
      stripAudits: effectiveFilterAudits,
      sampleAOrg: null, sampleBOrg: null,
      nrtBothOrg: (t) => { const r = interpAt(t); return r ? { vA: r.opt, vB: r.ott } : null; },
    };
    return [0, 1, 6, 7, 8].map(ci => _buildGainTick(ci, cfg));
  }, [view, dashShowCharts, Math.floor(curTime / 10000), useNoise, rtPeriodSec, interpAt, effectiveFilterAudits]);

  // Charts 2,3 (5min/30min): pre-computed to end of current hour. Real mode uses rdDashGainData instead.
  const dashGainMinute = useMemo(() => {
    if (appMode === 'real' || !RAW.length || view !== "dashboard" || !dashShowCharts) return [[], []];
    const hourEnd = RAW[Math.min(intIdx + 1, maxIdx)]?.t ?? REAL_DATA_END_MS;
    const cfg = {
      tMinCh: RAW[0].t, hourEnd, rtPeriodSec, useNoise,
      sampleA: null, sampleB: null,
      nrtBoth: (t) => { const r = interpAt(t); return r ? { vA: r.pt, vB: r.tt } : null; },
      keyA: "gp", keyB: "gt",
      stripAudits: effectiveFilterAudits,
      sampleAOrg: null, sampleBOrg: null,
      nrtBothOrg: (t) => { const r = interpAt(t); return r ? { vA: r.opt, vB: r.ott } : null; },
    };
    return [2, 3].map(ci => _buildGainMinute(ci, cfg));
  }, [view, dashShowCharts, intIdx, useNoise, rtPeriodSec, interpAt, dashWin, effectiveFilterAudits]);

  // Charts 4,5 (hourly RAW): update only when intIdx changes.
  const dashGainHourly = useMemo(() => {
    if (!RAW.length || view !== "dashboard" || !dashShowCharts) return [[], []];
    const pastAt = (t) => { const r = interpAt(t); return r ? { vA: r.pt, vB: r.tt } : null; };
    return [4, 5].map(ci => {
      const [, span] = gainCharts[ci];
      const endIdx = Math.min(intIdx + 1, maxIdx); // +1: line extends past curTime, clipped by X domain
      const startIdx = Math.max(0, intIdx - Math.round(span) - 1);
      const hourlyPoints = [];
      for (let i = startIdx; i <= endIdx; i++) hourlyPoints.push({ t: RAW[i].t, vA: RAW[i].pt, vB: RAW[i].tt });
      return _buildGainHourly(ci, { tMinCh: RAW[0].t, hourlyPoints, pastAt, keyA: "gp", keyB: "gt", stripAudits: effectiveFilterAudits, auditChans: ['pdp','ts'] });
    });
  }, [view, dashShowCharts, intIdx, interpAt, dashWin, effectiveFilterAudits]);

  // Combine into single array indexed by chart number
  const dashGainData = useMemo(() => [
    dashGainTick[0], dashGainTick[1],
    dashGainMinute[0], dashGainMinute[1],
    dashGainHourly[0], dashGainHourly[1],
    dashGainTick[2],
    dashGainTick[3],   // index 7: per-second (1s gain / 1min)
    dashGainTick[4],   // index 8: 5min gain / 1hr
  ], [dashGainTick, dashGainMinute, dashGainHourly]);

  const _altBucketFor = (spanMs) => {
    const tMin = Math.max(appMode === 'real' ? REAL_DATA_START_MS : RAW[0].t, curTime - spanMs);
    const span = Math.max(0, curTime - tMin);
    // Floor at the noise sampling period (NOT 60s in 1m mode). The span/1500 target
    // already scales the bucket per window (1h ~2.4s, 24h ~58s, dashWin-day ~7min),
    // so a 1-minute floor would wrongly coarsen the short 1h charts to ~1 point/min.
    // Long windows are unaffected (their span/1500 already exceeds this floor).
    const modeFloor = rtPeriodSec * 1000;
    const rawStep = Math.max(modeFloor, span / 1500);
    const step = Math.pow(2, Math.ceil(Math.log2(Math.max(1, rawStep))));
    const periodSec = Math.max(rtPeriodSec, Math.round(step / 1000));
    const quantum = Math.max(modeFloor, step / 8);
    const key = Math.floor(curTime / quantum);
    return { tMin, span, modeFloor, rawStep, step, periodSec, quantum, key };
  };

  const _altGap1hBucket = _altBucketFor(HOUR_MS);
  const _altGap24hBucket = _altBucketFor(DAY_MS);
  const _altDashBucket = _altBucketFor(dashWin * DAY_MS);
  const _altGain1hBucket = _altBucketFor(gainCharts[6][1] * HOUR_MS);
  const _altGain24hBucket = _altBucketFor(gainCharts[2][1] * HOUR_MS);
  const _altGainDashBucket = _altBucketFor(gainCharts[4][1] * HOUR_MS);
  // Alt+ extra columns: ci0 (1min gain / 10min gap) and ci1 (10min gain / 1hr gap).
  const _altGap10mBucket  = _altBucketFor(gainCharts[0][1] * HOUR_MS);   // 10min window
  const _altGain10mBucket = _altBucketFor(gainCharts[0][1] * HOUR_MS);   // 10min window (ci0)
  const _altPerSecBucket  = _altBucketFor(gainCharts[7][1] * HOUR_MS);   // 1min window (ci7, per-second step)
  // ci1's window is 1hr - it reuses _altGain1hBucket (gain) and altGap1hData (gap).
  // ci3 (12h gain / 7d) and ci5 (48h gain / 30d) buckets for standard layout in Real Data mode.
  const _altGain12hBucket = _altBucketFor(gainCharts[3][1] * HOUR_MS);
  const _altGain48hBucket = _altBucketFor(gainCharts[5][1] * HOUR_MS);

  const _altPdpTsAt = (t) => {
    const rd = realDataAt(t);
    return rd ? { pt: rd.pdp, tt: rd.ts } : null;
  };

  const _altNormalizeGap = (pts) => pts.map(d => d.gap == null && d.g != null ? { ...d, gap: d.g } : d);

  const _altBuildGapData = (bucket) => {
    // End at the quantized bucket boundary so the data rebuilds only ~once per
    // quantum, not every frame. quantum scales with the window (1h~2s, 24h~8s,
    // dashWin~65s), so the right edge lags curTime by a sub-pixel amount while the
    // per-frame x-domain easing keeps the window gliding smoothly.
    const tEnd = bucket.key * bucket.quantum;
    const pts = [];
    const tFirst = Math.ceil(bucket.tMin / bucket.step) * bucket.step;
    for (let t = tFirst; t < tEnd; t += bucket.step) {
      const v = _altPdpTsAt(t);
      if (v) pts.push({ t, pt: v.pt, tt: v.tt, g: v.pt - v.tt, gap: v.pt - v.tt });
    }
    const vEnd = _altPdpTsAt(tEnd);
    if (vEnd) pts.push({ t: tEnd, pt: vEnd.pt, tt: vEnd.tt, g: vEnd.pt - vEnd.tt, gap: vEnd.pt - vEnd.tt });
    return _altNormalizeGap(injectRdAuditBreakpoints(pts));
  };

  const _altBuildTotalData = (bucket) => {
    const tEnd = bucket.key * bucket.quantum;
    const pts = [];
    const tFirst = Math.ceil(bucket.tMin / bucket.step) * bucket.step;
    for (let t = tFirst; t < tEnd; t += bucket.step) {
      const v = _altPdpTsAt(t);
      if (v) pts.push({ t, pt: v.pt, tt: v.tt, g: v.pt - v.tt });
    }
    const vEnd = _altPdpTsAt(tEnd);
    if (vEnd) pts.push({ t: tEnd, pt: vEnd.pt, tt: vEnd.tt, g: vEnd.pt - vEnd.tt });
    return injectRdAuditBreakpoints(pts);
  };

  const _altBuildGainData = (bucket, ci) => {
    const [lb] = gainCharts[ci];
    const lbMs = Math.round(lb * HOUR_MS);
    const tEnd = bucket.key * bucket.quantum;
    // Filter Audits: strip the audit jump out of the GAIN (gp/gt) only.
    // pt/tt/g/gap stay audit-inclusive. getRdCumAudit folds in audit delta.
    const strip = effectiveFilterAudits;
    const pointAt = (t) => {
      const now = _altPdpTsAt(t);
      const past = _altPdpTsAt(t - lbMs);
      if (!now || !past) return null;
      let gp = now.pt - past.pt, gt = now.tt - past.tt;
      if (strip) {
        gp -= getRdCumAudit(t, "pdp") - getRdCumAudit(t - lbMs, "pdp");
        gt -= getRdCumAudit(t, "ts")  - getRdCumAudit(t - lbMs, "ts");
      }
      return {
        t,
        gp: Math.round(gp),
        gt: Math.round(gt),
        pt: now.pt,
        tt: now.tt,
        g: now.pt - now.tt,
        gap: now.pt - now.tt,
      };
    };
    const pts = [];
    const tFirst = Math.ceil(bucket.tMin / bucket.step) * bucket.step;
    for (let t = tFirst; t < tEnd; t += bucket.step) {
      const p = pointAt(t);
      if (p) pts.push(p);
    }
    const endPoint = pointAt(tEnd);
    if (endPoint && (!pts.length || pts[pts.length - 1].t !== tEnd)) pts.push(endPoint);
    return injectRdAuditBreakpoints(pts)
      .map(d => d.gp != null && d.gt != null ? d : pointAt(d.t))
      .filter(Boolean);
  };

  const altGap1hData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltLayout || !altDenseCharts) return [];
    return _altBuildGapData(_altGap1hBucket, MINUTE);
  }, [view, dashShowCharts, dashAltLayout, altDenseCharts, _altGap1hBucket.key, _altGap1hBucket.quantum, _altGap1hBucket.step, _altGap1hBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, realDataReady]);

  const altGap24hData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltLayout || !altDenseCharts) return [];
    return _altBuildGapData(_altGap24hBucket, 5 * MINUTE);
  }, [view, dashShowCharts, dashAltLayout, altDenseCharts, _altGap24hBucket.key, _altGap24hBucket.quantum, _altGap24hBucket.step, _altGap24hBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, realDataReady]);

  const altTotalData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltLayout || !altDenseCharts) return [];
    return _altBuildTotalData(_altDashBucket, 15 * MINUTE);
  }, [view, dashShowCharts, dashAltLayout, altDenseCharts, dashWin, _altDashBucket.key, _altDashBucket.quantum, _altDashBucket.step, _altDashBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, realDataReady]);

  const altGain1hData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltLayout || !altDenseCharts) return [];
    return _altBuildGainData(_altGain1hBucket, 6, MINUTE);
  }, [view, dashShowCharts, dashAltLayout, altDenseCharts, _altGain1hBucket.key, _altGain1hBucket.quantum, _altGain1hBucket.step, _altGain1hBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, effectiveFilterAudits, realDataReady]);

  const altGain24hData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltLayout || !altDenseCharts) return [];
    return _altBuildGainData(_altGain24hBucket, 2, 5 * MINUTE);
  }, [view, dashShowCharts, dashAltLayout, altDenseCharts, _altGain24hBucket.key, _altGain24hBucket.quantum, _altGain24hBucket.step, _altGain24hBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, effectiveFilterAudits, realDataReady]);

  const altGainDashData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltLayout || !altDenseCharts) return [];
    return _altBuildGainData(_altGainDashBucket, 4, 15 * MINUTE);
  }, [view, dashShowCharts, dashAltLayout, altDenseCharts, dashWin, _altGainDashBucket.key, _altGainDashBucket.quantum, _altGainDashBucket.step, _altGainDashBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, effectiveFilterAudits, realDataReady]);

  // Alt+ only: ci0 (1min gain / 10min window) and ci1 (10min gain / 1hr window).
  const altGain10mData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltPlus || !altDenseCharts) return [];
    return _altBuildGainData(_altGain10mBucket, 0, MINUTE);
  }, [view, dashShowCharts, dashAltPlus, altDenseCharts, _altGain10mBucket.key, _altGain10mBucket.quantum, _altGain10mBucket.step, _altGain10mBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, effectiveFilterAudits, realDataReady]);

  const altGain1hLb10Data = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltPlus || !altDenseCharts) return [];
    return _altBuildGainData(_altGain1hBucket, 1, MINUTE);
  }, [view, dashShowCharts, dashAltPlus, altDenseCharts, _altGain1hBucket.key, _altGain1hBucket.quantum, _altGain1hBucket.step, _altGain1hBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, effectiveFilterAudits, realDataReady]);

  const altGap10mData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltPlus || !altDenseCharts) return [];
    return _altBuildGapData(_altGap10mBucket, MINUTE);
  }, [view, dashShowCharts, dashAltPlus, altDenseCharts, _altGap10mBucket.key, _altGap10mBucket.quantum, _altGap10mBucket.step, _altGap10mBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, realDataReady]);

  // Per-second (ci7): 1s gain + 1min gap over the last minute, for Alt and Alt+.
  const altGain1sData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltLayout || !altDenseCharts || !dashPerSecond) return [];
    return _altBuildGainData(_altPerSecBucket, 7, MINUTE);
  }, [view, dashShowCharts, dashAltLayout, altDenseCharts, dashPerSecond, _altPerSecBucket.key, _altPerSecBucket.quantum, _altPerSecBucket.step, _altPerSecBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, effectiveFilterAudits, realDataReady]);

  const altGap1mData = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts || !dashAltLayout || !altDenseCharts || !dashPerSecond) return [];
    return _altBuildGapData(_altPerSecBucket, MINUTE);
  }, [view, dashShowCharts, dashAltLayout, altDenseCharts, dashPerSecond, _altPerSecBucket.key, _altPerSecBucket.quantum, _altPerSecBucket.step, _altPerSecBucket.periodSec, useNoise, rtPeriodSec, speedMode, interpAt, realDataReady]);

  const altGainData = useMemo(() => {
    const data = [[], [], [], [], [], [], [], [], []];
    data[0] = altGain10mData;
    data[1] = altGain1hLb10Data;
    data[2] = altGain24hData;
    data[4] = altGainDashData;
    data[6] = altGain1hData;
    data[7] = altGain1sData;
    return data;
  }, [altGain1hData, altGain24hData, altGainDashData, altGain10mData, altGain1hLb10Data, altGain1sData]);

  const altGapData = useMemo(() => {
    const data = [[], [], [], [], [], [], [], []];
    data[0] = altGap10mData;
    data[1] = altGap1hData;   // ci1 window = 1hr
    data[2] = altGap24hData;
    data[6] = altGap1hData;
    data[7] = altGap1mData;
    return data;
  }, [altGap1hData, altGap24hData, altGap10mData, altGap1mData]);

  // Real Data mode dashboard gain charts: adaptive bucket-based builders (same
  // mechanism as Alt Scenario), reading from the binary via _altPdpTsAt.
  // The bucket system stabilises tEnd at a quantized past timestamp so the
  // x-domain window slides smoothly without rebuilding data every frame.
  const rdDashGainData = useMemo(() => {
    if (view !== 'dashboard' || !dashShowCharts) return [[], [], [], [], [], [], [], [], []];
    return [
      _altBuildGainData(_altGain10mBucket, 0, MINUTE),
      _altBuildGainData(_altGain1hBucket, 1, MINUTE),
      _altBuildGainData(_altGain24hBucket, 2, 5 * MINUTE),
      _altBuildGainData(_altGain12hBucket, 3, 15 * MINUTE),
      _altBuildGainData(_altGainDashBucket, 4, 15 * MINUTE),
      _altBuildGainData(_altGain48hBucket, 5, 30 * MINUTE),
      _altBuildGainData(_altGain1hBucket, 6, MINUTE),
      dashPerSecond ? _altBuildGainData(_altPerSecBucket, 7, MINUTE) : [],
      _altBuildGainData(_altGain1hBucket, 8, MINUTE),  // index 8: 5min gain (same 1hr span as ci=1)
    ];
  }, [view, dashShowCharts, dashPerSecond,
    _altGain10mBucket.key, _altGain1hBucket.key, _altGain24hBucket.key,
    _altGain12hBucket.key, _altGainDashBucket.key, _altGain48hBucket.key, _altPerSecBucket.key,
    _altGain10mBucket.quantum, _altGain1hBucket.quantum, _altGain24hBucket.quantum,
    _altGain12hBucket.quantum, _altGainDashBucket.quantum, _altGain48hBucket.quantum, _altPerSecBucket.quantum,
    _altGain10mBucket.step, _altGain1hBucket.step, _altGain24hBucket.step,
    _altGain12hBucket.step, _altGainDashBucket.step, _altGain48hBucket.step, _altPerSecBucket.step,
    effectiveFilterAudits, realDataReady]);

  const rdDashTotalData = useMemo(() => {
    if (view !== 'dashboard' || !dashShowCharts) return [];
    return _altBuildTotalData(_altDashBucket);
  }, [view, dashShowCharts, dashWin,
    _altDashBucket.key, _altDashBucket.quantum, _altDashBucket.step, realDataReady]);

  // Raw-minus-smooth delta chart data: 1h window, 10s step, both channels.
  // Only meaningful when smooth binary is loaded (rawMode=false) and raw alt buffer is ready.
  const rdRawDeltaData = useMemo(() => {
    if (!dashRawDelta || rawMode || !_realDataBuf || !_rawAltBuf) return [];
    const tEnd = curTime;
    const tStart = Math.max(tEnd - HOUR_MS, REAL_DATA_START_MS);
    const out = [];
    for (let t = tStart; t <= tEnd; t += 1000) {
      const idx = Math.max(0, Math.min(REAL_DATA_PAIR_COUNT - 1, Math.floor((t - REAL_DATA_START_MS) / 1000)));
      out.push({ t, pdp: _rawAltBuf[idx*2] - _realDataBuf[idx*2], ts: _rawAltBuf[idx*2+1] - _realDataBuf[idx*2+1] });
    }
    return out;
  }, [dashRawDelta, rawMode, realDataReady, rawAltReady, curTime]);


  const dashGetRange = (data, keys, tCur, tMin) => {
    let lo = Infinity, hi = -Infinity;
    for (const d of data) {
      if (tCur != null && d.t > tCur) continue;
      if (tMin != null && d.t < tMin) continue;
      for (const k of keys) { if (d[k]!=null){lo=Math.min(lo,d[k]);hi=Math.max(hi,d[k]);} }
    }
    // Include the interpolated values at BOTH window edges - they fall between
    // data points, so the drawn curve's true extremes inside the window include
    // the partial segments crossing the boundaries, not just whole points.
    if (data && data.length) {
      for (const k of keys) {
        if (tCur != null) {
          const v = _monoInterp(data, tCur, k);
          if (v != null && isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
        }
        if (tMin != null && tMin > -Infinity) {
          const v = _monoInterp(data, tMin, k);
          if (v != null && isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
        }
      }
    }
    if (!isFinite(lo)) return [0, 1];
    const pad = (hi - lo) * 0.04 || 1;
    return [lo - pad, hi + pad];
  };

  const dashChartTicks = useMemo(() => {
    if (view !== "dashboard" || !dashShowCharts) return [];
    return getMidnights(curTime - dashWin * DAY_MS, curTime);
  }, [view, dashShowCharts, curTime, dashWin]);

  // LAYOUT: Dashboard counter helper - see LAYOUTS.md
  const dashRenderGap = (value) => {
    if (isRTMode) return <CasinoCounter value={value} signed duration={dur} seekToken={seekToken}/>;
    if (value == null) return "\u2014";
    const prefix = value >= 0 ? "+" : "-";
    const formatted = Math.round(Math.abs(value)).toLocaleString();
    return (
      <span style={{ display:"inline", fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap", lineHeight:1, letterSpacing:0 }}>
        <span style={{ display:"inline-block", height:"1em", lineHeight:1, verticalAlign:"top" }}>{prefix}</span>
        {formatted.split("").map((ch, i) => {
          if (ch === ",") return <span key={"c"+i} style={{ display:"inline-block", verticalAlign:"top", lineHeight:1, marginRight:"0.0105em" }}>,</span>;
          return <span key={"d"+i} style={{ display:"inline-block", height:"1em", width:"1ch", textAlign:"center", lineHeight:1, verticalAlign:"top", marginRight:"0.0105em" }}>{ch}</span>;
        })}
      </span>
    );
  };
  // Flare variant: absolute value, no sign. Uses the snappier FlareCasinoCounter,
  // whose duration is a fixed constant - deliberately independent of the current
  // playback mode (Fast RT / Slow RT / mult), so the Flare counter always feels
  // the same regardless of simulation tempo.
  // LAYOUT: Dashboard/Flare-style gap helper - see LAYOUTS.md
  const dashRenderGapAbs = (value) => {
    const abs = value != null ? Math.abs(value) : null;
    if (isRTMode) return <FlareCasinoCounter value={abs} seekToken={seekToken}/>;
    return abs != null ? Math.round(abs).toLocaleString() : "\u2014";
  };

  // Dashboard-scoped counter renderer - always the standard CasinoCounter.
  // (FlareCasinoCounter stays reserved for FlareView.)
  // LAYOUT: Dashboard counter helper - see LAYOUTS.md
  const dashRenderCounter = (value) => {
    if (!isRTMode) {
      if (value == null) return "\u2014";
      const formatted = Math.round(value).toLocaleString();
      return (
        <span style={{ display:"inline", fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap", lineHeight:1, letterSpacing:0 }}>
          {formatted.split("").map((ch, i) => {
            if (ch === ",") return <span key={"c"+i} style={{ display:"inline-block", verticalAlign:"top", lineHeight:1, marginRight:"0.0105em" }}>,</span>;
            return <span key={"d"+i} style={{ display:"inline-block", height:"1em", width:"1ch", textAlign:"center", lineHeight:1, verticalAlign:"top", marginRight:"0.0105em" }}>{ch}</span>;
          })}
        </span>
      );
    }
    return <CasinoCounter value={value} duration={dur} seekToken={seekToken}/>;
  };

  const dashXFormat = (ts) => { const d = new Date(ts + _getEasternOffset(ts) * 3600000); return d.toLocaleDateString("en-US",{timeZone:"UTC",month:"short",day:"numeric"}); };

  // - Shared dashboard chart renderers -
  // cfg fields (gain/gap charts):
  //   gainData   - array[ci] of chart data
  //   dataStart  - earliest timestamp for the dataset
  //   lineA      - { key, color, name }  (PDP)
  //   lineB      - { key, color, name }  (T-S)
  //   gainLabels - string[6] indexed by ci
  //   skGain     - smooth-key prefix for gain x-domain
  //   skDGain    - smooth-key prefix for gain y-domain
  //   skGap      - smooth-key prefix for gap  x-domain
  //   skDGap     - smooth-key prefix for gap  y-domain
  //   gapName    - gap line name string
  //
  // cfg fields (total charts, in addition to the above):
  //   totalData   - dashTotalData
  //   totalLineA  - { key, color, name }
  //   totalLineB  - { key, color, name }
  //   totalGapKey - key for the gap series in totalData
  //   totalGapName- gap series name string
  //   totalTitle  - card title for total-subs chart
  //   gapTitle    - card title for gap chart
  //   skTot       - smooth key for total x-domain
  //   skDTot      - smooth key for total y-domain
  //   skXGapTot   - smooth key for gap   x-domain
  //   skDGapTot   - smooth key for gap   y-domain

  // LAYOUT: Dashboard chart card renderer - see LAYOUTS.md
  const renderDashGainChart = (ci, h, cfg) => {
    // 5min toggle: swap ci=1 (10min lookback) to ci=8 (5min lookback) when enabled
    // and data for ci=8 is available (non-empty) in this cfg.
    const has5mData = (cfg.gainData[8]?.length ?? 0) > 0;
    const effectiveCi = (ci === 1 && dashGain5min && has5mData) ? 8 : ci;
    const [lb, span] = gainCharts[effectiveCi];
    const lbMs = Math.round(lb * HOUR_MS);
    const lbMins = lb * 60;
    const gd_raw = cfg.gainData[effectiveCi] ?? [];
    // Per-min mode: divide gp/gt by the lookback length in minutes for subs/min display.
    const gd = (dashGainPerMin && lbMins > 1)
      ? gd_raw.map(d => ({...d, gp: d.gp != null ? d.gp / lbMins : null, gt: d.gt != null ? d.gt / lbMins : null}))
      : gd_raw;
    // Exact current gain over the lookback, computed at the live display period so
    // the end-dot labels match the actual current value, not the chart's sample.
    const _gNow = cfg.valAt ? cfg.valAt(curTime) : null;
    const _gPast = cfg.valAt ? cfg.valAt(curTime - lbMs) : null;
    // Filter Audits. auditChans (the {ch,color} pairs) is present on every gain
    // chart when the filter is on; the live end-dot delta is audit-stripped too so
    // the dot matches the audit-free line. The dotted MARKER lines, however, are
    // only drawn on the short charts (lb <= 1h) - longer windows would be cluttered.
    const auditChans = cfg.auditMarks || null;
    let _exGainA = (_gNow && _gPast) ? Math.round(_gNow.a - _gPast.a) : null;
    let _exGainB = (_gNow && _gPast) ? Math.round(_gNow.b - _gPast.b) : null;
    if (auditChans) {
      const aA = auditChans[0] && auditChans[0].ch, aB = auditChans[1] && auditChans[1].ch;
      const cumFn = appMode === 'real' ? getRdCumAudit : getCumAudit;
      if (_exGainA != null && aA) _exGainA -= Math.round(cumFn(curTime, aA) - cumFn(curTime - lbMs, aA));
      if (_exGainB != null && aB) _exGainB -= Math.round(cumFn(curTime, aB) - cumFn(curTime - lbMs, aB));
    }
    if (dashGainPerMin && lbMins > 1) {
      _exGainA = _exGainA != null ? _exGainA / lbMins : null;
      _exGainB = _exGainB != null ? _exGainB / lbMins : null;
    }
    const tMin = Math.max(curTime - span * HOUR_MS, cfg.dataStart);
    const auditLines = (auditChans && lb <= 1)
      ? (appMode === 'real'
          ? REAL_AUDITS_MAJOR.filter(a => a.ms >= tMin && a.ms <= curTime && auditChans.some(m => m.ch === a.channel))
          : AUDITS.filter(a => a[3] >= tMin && a[3] <= curTime && auditChans.some(m => m.ch === a[1])))
      : [];
    const xDom = [tMin, curTime];
    const _chanKeys = dashChanFilter==='pdp'?[cfg.lineA.key]:dashChanFilter==='ts'?[cfg.lineB.key]:[cfg.lineA.key,cfg.lineB.key];
    const dom = dashGetRange(gd, _chanKeys, curTime, tMin);
    const yTicks = niceTicks(dom, true);
    const edgeBufG = (curTime - tMin) * 0.1;
    const allMidnightsG = getMidnights(tMin, curTime);
    const midnightTicksG = allMidnightsG.filter(m => m - tMin > edgeBufG && curTime - m > edgeBufG);
    const _midStepG = Math.ceil(midnightTicksG.length / 6);
    const _shownMidnightsG = _midStepG > 1 ? midnightTicksG.filter((_,i) => i % _midStepG === 0) : midnightTicksG;
    const midnightSetG = new Set(_shownMidnightsG);
    const allAxisTicksG = [tMin, curTime, ..._shownMidnightsG];
    const xFmtBase = span < 1
      ? (ts => { const d=new Date(ts+_getEasternOffset(ts)*3600000); return String(d.getUTCHours()).padStart(2,"0")+":"+String(d.getUTCMinutes()).padStart(2,"0")+":"+String(d.getUTCSeconds()).padStart(2,"0"); })
      : span <= 24
      ? (ts => { const d=new Date(ts+_getEasternOffset(ts)*3600000); return String(d.getUTCHours()).padStart(2,"0")+":"+String(d.getUTCMinutes()).padStart(2,"0"); })
      : dashXFormat;
    const xFmt = ts => {
      if (midnightSetG.has(ts)) { const d=new Date(ts+_getEasternOffset(ts)*3600000); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]+' '+d.getUTCDate(); }
      return xFmtBase(ts);
    };
    const cardControls = (
      <React.Fragment>
        {ci === 1 && has5mData && (
          <React.Fragment>
            <button onClick={() => setDashGain5min(false)} style={miniTogBtn(!dashGain5min)}>10m</button>
            <button onClick={() => setDashGain5min(true)} style={miniTogBtn(dashGain5min)}>5m</button>
          </React.Fragment>
        )}
        {lbMins > 1 && <button onClick={() => setDashGainPerMin(v => !v)} style={miniTogBtn(dashGainPerMin)}>/min</button>}
      </React.Fragment>
    );
    return (
      <DashChartCard title={(dashGainPerMin && lbMins > 1) ? cfg.gainLabels[effectiveCi].replace("Gain", "avg") : cfg.gainLabels[effectiveCi]} dc={eDC} controls={cardControls}>
        <ResponsiveContainer width="100%" height={h}>
          <LineChart data={gd} margin={{top:4,right:70,bottom:0,left:0}}>
            <CartesianGrid stroke="#2e3348" strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="t" type="number" domain={xDom} allowDataOverflow ticks={allAxisTicksG} interval={0} tickFormatter={xFmt} tick={{fill:eDC.DIM,fontSize:10,fontFamily:"Inter,system-ui,sans-serif"}} axisLine={{stroke:eDC.BORDER}} tickLine={false}/>
            {allMidnightsG.map(m=><ReferenceLine key={m} x={m} stroke="#2a2d38" strokeWidth={1}/>)}
            {auditLines.map((a,i)=>{ const ch=appMode==='real'?a.channel:a[1]; const ts=appMode==='real'?a.ms:a[3]; const m=auditChans.find(mm=>mm.ch===ch); return <ReferenceLine key={"aud"+i} x={ts} stroke={m.color} strokeWidth={1} strokeDasharray="2 4" strokeOpacity={0.45} ifOverflow="hidden"/>; })}
            <YAxis tickFormatter={v=>fmt(v)} tick={{fill:eDC.DIM,fontSize:10,fontFamily:"Inter,system-ui,sans-serif"}} axisLine={false} tickLine={false} width={52} domain={dom} allowDataOverflow ticks={yTicks}/>
            {!isRTMode && <Tooltip content={<DashTooltip dc={eDC}/>}/>}
            <ReferenceLine y={0} stroke="#5a5f72" strokeWidth={1}/>
            {dashChanFilter!=='ts'  && <Line type="monotone" dataKey={cfg.lineA.key} stroke={cfg.lineA.color} strokeWidth={1.8} dot={false} name={cfg.lineA.name} isAnimationActive={false} style={{mixBlendMode:"screen"}}/>}
            {dashChanFilter!=='pdp' && <Line type="monotone" dataKey={cfg.lineB.key} stroke={cfg.lineB.color} strokeWidth={1.8} dot={false} name={cfg.lineB.name} isAnimationActive={false} style={{mixBlendMode:"screen"}}/>}
            {endDots(gd, curTime, [...(dashChanFilter!=='ts'?[{key:cfg.lineA.key,color:cfg.lineA.color,exact:_exGainA}]:[]),...(dashChanFilter!=='pdp'?[{key:cfg.lineB.key,color:cfg.lineB.color,exact:_exGainB}]:[])])}
          </LineChart>
        </ResponsiveContainer>
      </DashChartCard>
    );
  };

  // LAYOUT: Dashboard chart card renderer - see LAYOUTS.md
  const renderDashGapChart = (ci, gapLabel, h, cfg) => {
    const [lb, span] = gainCharts[ci];
    const lbMs = Math.round(lb * HOUR_MS);
    const gd = cfg.gainData[ci];
    const tMin = Math.max(curTime - span * HOUR_MS, cfg.dataStart);
    const xDom = [tMin, curTime];
    const dom = dashGetRange(gd, ["gap"], curTime, tMin);
    const yTicks = niceTicks(dom, true);
    const edgeBufGap = (curTime - tMin) * 0.1;
    const allMidnightsGap = getMidnights(tMin, curTime);
    const midnightTicksGap = allMidnightsGap.filter(m => m - tMin > edgeBufGap && curTime - m > edgeBufGap);
    const _midStepGap = Math.ceil(midnightTicksGap.length / 6);
    const _shownMidnightsGap = _midStepGap > 1 ? midnightTicksGap.filter((_,i) => i % _midStepGap === 0) : midnightTicksGap;
    const midnightSetGap = new Set(_shownMidnightsGap);
    const allAxisTicksGap = [tMin, curTime, ..._shownMidnightsGap];
    const xFmtBaseGap = span <= 1
      ? (ts => { const d=new Date(ts+_getEasternOffset(ts)*3600000); return String(d.getUTCHours()).padStart(2,"0")+":"+String(d.getUTCMinutes()).padStart(2,"0")+":"+String(d.getUTCSeconds()).padStart(2,"0"); })
      : span <= 24
      ? (ts => { const d=new Date(ts+_getEasternOffset(ts)*3600000); return String(d.getUTCHours()).padStart(2,"0")+":"+String(d.getUTCMinutes()).padStart(2,"0"); })
      : dashXFormat;
    const xFmt = ts => {
      if (midnightSetGap.has(ts)) { const d=new Date(ts+_getEasternOffset(ts)*3600000); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]+' '+d.getUTCDate(); }
      return xFmtBaseGap(ts);
    };
    return (
      <DashChartCard title={gapLabel} dc={eDC}>
        <ResponsiveContainer width="100%" height={h}>
          <LineChart data={gd} margin={{top:4,right:70,bottom:0,left:0}}>
            <CartesianGrid stroke="#2e3348" strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="t" type="number" domain={xDom} allowDataOverflow ticks={allAxisTicksGap} interval={0} tickFormatter={xFmt} tick={{fill:eDC.DIM,fontSize:10,fontFamily:"Inter,system-ui,sans-serif"}} axisLine={{stroke:eDC.BORDER}} tickLine={false}/>
            {allMidnightsGap.map(m=><ReferenceLine key={m} x={m} stroke="#2a2d38" strokeWidth={1}/>)}
            <YAxis tickFormatter={v=>fmt(v)} tick={{fill:eDC.DIM,fontSize:10,fontFamily:"Inter,system-ui,sans-serif"}} axisLine={false} tickLine={false} width={52} domain={dom} allowDataOverflow ticks={yTicks}/>
            {!isRTMode && <Tooltip content={<DashTooltip dc={eDC}/>}/>}
            <ReferenceLine y={0} stroke="#5a5f72" strokeWidth={1.5}/>
            <Line type="monotone" dataKey="gap" stroke={"#e2e5eb"} strokeWidth={2} dot={false} name={cfg.gapName} isAnimationActive={false}/>
            {endDots(gd, curTime, [{key:'gap',color:'#e2e5eb',exact:cfg.exactGap}])}
          </LineChart>
        </ResponsiveContainer>
      </DashChartCard>
    );
  };

  // LAYOUT: Raw-vs-smooth delta chart (dev mode, last slot of Normal dashboard bottom row)
  const renderDashRawDeltaChart = () => {
    const pdpColor = '#4f8ef7', tsColor = '#f74f74';
    if (rawMode) return (
      <DashChartCard title="Raw - Smooth" dc={eDC}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:eDC.DIM,fontSize:11}}>N/A in Raw mode</div>
      </DashChartCard>
    );
    if (!rawAltReady || !realDataReady) return (
      <DashChartCard title="Raw - Smooth" dc={eDC}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:eDC.DIM,fontSize:11}}>Loading...</div>
      </DashChartCard>
    );
    const data = rdRawDeltaData;
    const last = data.length ? data[data.length - 1] : null;
    const curPdp = last?.pdp ?? null;
    const curTs  = last?.ts  ?? null;
    const title = 'Raw - Smooth' +
      (curPdp != null ? '   PDP ' + (curPdp >= 0 ? '+' : '') + curPdp.toLocaleString() : '') +
      (curTs  != null ? '   TS '  + (curTs  >= 0 ? '+' : '') + curTs.toLocaleString()  : '');
    const tMin = data.length ? data[0].t : curTime - HOUR_MS;
    const allVals = data.flatMap(d => [d.pdp, d.ts]);
    const lo = allVals.length ? Math.min(...allVals) : -50;
    const hi = allVals.length ? Math.max(...allVals) : 50;
    const pad = Math.max((hi - lo) * 0.08, 5);
    const dom = [lo - pad, hi + pad];
    const yTicks = niceTicks(dom, true);
    const xFmt = ts => { const d = new Date(ts + _getEasternOffset(ts)*3600000); return String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0'); };
    return (
      <DashChartCard title={title} dc={eDC}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{top:4,right:70,bottom:0,left:0}}>
            <CartesianGrid stroke="#2e3348" strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="t" type="number" domain={[tMin, curTime]} allowDataOverflow tickFormatter={xFmt} tick={{fill:eDC.DIM,fontSize:10,fontFamily:"Inter,system-ui,sans-serif"}} axisLine={{stroke:eDC.BORDER}} tickLine={false}/>
            <YAxis tickFormatter={v=>fmt(v)} domain={dom} ticks={yTicks} allowDataOverflow tick={{fill:eDC.DIM,fontSize:10,fontFamily:"Inter,system-ui,sans-serif"}} axisLine={false} tickLine={false} width={52}/>
            <ReferenceLine y={0} stroke="#5a5f72" strokeWidth={1}/>
            <Line type="monotone" dataKey="pdp" stroke={pdpColor} strokeWidth={1.5} dot={false} isAnimationActive={false} style={{mixBlendMode:"screen"}}/>
            <Line type="monotone" dataKey="ts"  stroke={tsColor}  strokeWidth={1.5} dot={false} isAnimationActive={false} style={{mixBlendMode:"screen"}}/>
            {endDots(data, curTime, [{key:'pdp',color:pdpColor,exact:curPdp},{key:'ts',color:tsColor,exact:curTs}])}
          </LineChart>
        </ResponsiveContainer>
      </DashChartCard>
    );
  };

  // Unified side-by-side dashboard layout.
  // LAYOUT: Dashboard Normal entry point - see LAYOUTS.md
  const savePatchesToServer = (p) => {
    setPatchSaveStatus('saving');
    fetch('/api/manual-patches', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(p) })
      .then(r => { if (!r.ok) throw new Error(); setPatchSaveStatus('saved'); setTimeout(()=>setPatchSaveStatus(null),2000); })
      .catch(() => { setPatchSaveStatus('error'); setTimeout(()=>setPatchSaveStatus(null),3000); });
  };

  const renderNormalDashboard = ({
    barH, chanA, chanB, gap, leadingIsA, renderGap,
    diffLabel, aheadLabel, aheadName, leadDuration,
    subsLabel, showRates,
    chartCfg, pairedLabels, legendItems,
    milestoneEl, timezonesEl,
  }) => (
    <div style={{background:eDC.BG,color:eDC.TEXT,fontFamily:dashFont,width:"100%",height:`calc(100vh - ${barH}px)`,display:"flex",flexDirection:"row",overflow:"hidden"}}>
      {/* LEFT PANEL */}
      <div style={{width:"33%",minWidth:220,flexShrink:0,overflow:"hidden",borderRight:"1px solid "+eDC.BORDER,display:"flex",alignItems:"flex-start",justifyContent:"flex-start"}}>
        <div ref={leftPanelRef} style={{zoom:leftPanelScale,width:"100%",padding:"10px 14px 10px 24px",boxSizing:"border-box"}}>
          {/* Channel A */}
          <div style={{paddingBottom:8,marginBottom:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <img src={chanA.icon} alt={chanA.name} style={{width:62,height:62,borderRadius:"50%",border:"3px solid "+chanA.color,objectFit:"cover",flexShrink:0}}/>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{fontSize:28,fontWeight:700,color:chanA.color,lineHeight:1.1}}>{chanA.name}</div>
                <span style={{fontSize:24,visibility:leadingIsA?"visible":"hidden"}}>👑</span>
              </div>
            </div>
            <div className="sub-count" style={{fontSize:54,fontWeight:800,fontVariantNumeric:"tabular-nums",color:eDC.TEXT,letterSpacing:0,lineHeight:1,marginBottom:2,textAlign:"center"}}>
              {dashRenderCounter(chanA.display)}
            </div>
            <div style={{fontSize:14,color:eDC.DIM,marginBottom:4,textAlign:"center"}}>{subsLabel}</div>
            {showRates && <div style={{display:"flex",gap:0}}>
              <DashRateDisplay label={chanA.rateLabels[0]} value={chanA.rates[0]} color={chanA.color} dc={eDC}/>
              <DashRateDisplay label={chanA.rateLabels[1]} value={chanA.rates[1]} color={chanA.color} dc={eDC}/>
              <DashRateDisplay label={chanA.rateLabels[2]} value={chanA.rates[2]} color={chanA.color} dc={eDC}/>
            </div>}
          </div>
          {/* Gap block */}
          <div style={{display:"flex",alignItems:"center",padding:"8px 0",borderTop:"1px solid "+eDC.BORDER,borderBottom:"1px solid "+eDC.BORDER,margin:"8px 0",gap:12}}>
            <div style={{flex:3,minWidth:0,overflow:"hidden"}}>
              <div style={{fontSize:10,color:eDC.DIM,fontWeight:700,marginBottom:4,whiteSpace:"nowrap"}}>{diffLabel}</div>
              <div style={{fontSize:40,fontWeight:800,fontVariantNumeric:"tabular-nums",lineHeight:1,color:gap!=null?(gap>=0?eDC.GAP_POS:eDC.GAP_NEG):eDC.DIM}}>
                {renderGap(gap)}
              </div>
            </div>
            <div style={{flex:2,minWidth:0,textAlign:"right"}}>
              <div style={{fontSize:10,color:eDC.DIM,marginBottom:2}}>{aheadLabel}</div>
              <div style={{fontSize:16,fontWeight:700,color:leadingIsA?chanA.color:chanB.color,marginBottom:1}}>{aheadName}</div>
              <div style={{fontSize:12,color:eDC.DIM,fontVariantNumeric:"tabular-nums"}}>{leadDuration}</div>
            </div>
          </div>
          {/* Channel B */}
          <div style={{paddingBottom:8,marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <img src={chanB.icon} alt={chanB.name} style={{width:62,height:62,borderRadius:"50%",border:"3px solid "+chanB.color,objectFit:"cover",flexShrink:0}}/>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{fontSize:28,fontWeight:700,color:chanB.color,lineHeight:1.1}}>{chanB.name}</div>
                <span style={{fontSize:24,visibility:leadingIsA?"hidden":"visible"}}>👑</span>
              </div>
            </div>
            <div className="sub-count" style={{fontSize:54,fontWeight:800,fontVariantNumeric:"tabular-nums",color:eDC.TEXT,letterSpacing:0,lineHeight:1,marginBottom:2,textAlign:"center"}}>
              {dashRenderCounter(chanB.display)}
            </div>
            <div style={{fontSize:14,color:eDC.DIM,marginBottom:4,textAlign:"center"}}>{subsLabel}</div>
            {showRates && <div style={{display:"flex",gap:0}}>
              <DashRateDisplay label={chanB.rateLabels[0]} value={chanB.rates[0]} color={chanB.color} dc={eDC}/>
              <DashRateDisplay label={chanB.rateLabels[1]} value={chanB.rates[1]} color={chanB.color} dc={eDC}/>
              <DashRateDisplay label={chanB.rateLabels[2]} value={chanB.rates[2]} color={chanB.color} dc={eDC}/>
            </div>}
          </div>
          {milestoneEl}
          {timezonesEl}
        </div>
      </div>
      {/* RIGHT PANEL */}
      <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",padding:"6px 16px 4px 8px",gap:4,overflow:"hidden"}}>
        {(() => {
          // Per-second mode (only where the index-7 data exists, i.e. the PDP/TS
          // dashboard): row 0 gain becomes 1s/1min, row 1 gap becomes a 1min gap.
          const psOn = dashPerSecond && chartCfg.gainData[7] != null;
          const rows = [
            { gainCi: psOn ? 7 : 0, gapCi: psOn ? 7 : 0, gapLabel: psOn ? "1min Gap" : pairedLabels[0] },
            { gainCi: 1,            gapCi: 1,            gapLabel: pairedLabels[1] },
            { gainCi: 2,            gapCi: 2,            gapLabel: pairedLabels[2] },
          ];
          return rows.map((r, ri) => (
            <div key={ri} style={{flex:1,minHeight:0,height:0,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {renderDashGainChart(r.gainCi,"100%",chartCfg)}
              {renderDashGapChart(r.gapCi,r.gapLabel,"100%",chartCfg)}
            </div>
          ));
        })()}
        <div style={{flex:1,minHeight:0,height:0,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
          {[3,4].map(ci=><React.Fragment key={ci}>{renderDashGainChart(ci,"100%",chartCfg)}</React.Fragment>)}
          {dashRawDelta ? renderDashRawDeltaChart() : renderDashGainChart(5,"100%",chartCfg)}
        </div>
        {renderDashTotalCharts(chartCfg,"100%",{flex:1,minHeight:0,height:0,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6})}
        <div style={{padding:"4px 0",display:"flex",justifyContent:"center",gap:24,fontSize:11,flexShrink:0,borderTop:"1px solid "+eDC.BORDER,color:eDC.DIM}}>
          {legendItems.map(l=>(
            <span key={l.label}><span style={{display:"inline-block",width:12,height:3,background:l.color,borderRadius:2,marginRight:6,verticalAlign:"middle"}}/>{l.label}</span>
          ))}
        </div>
      </div>
    </div>
  );

  // LAYOUT: Dashboard Alt entry point - see LAYOUTS.md
  const renderAltDashboard = ({
    barH, chanA, chanB, gap, leadingIsA,
    diffLabel, aheadLabel, aheadName, leadDuration,
    subsLabel, showRates,
    chartCfg, pairedLabels, legendItems,
    milestoneEl, timezonesEl,
  }) => {
    const useDense = chartCfg.altData && altDenseCharts;
    const altChartCfg = useDense ? {
      ...chartCfg,
      gainData: chartCfg.altData.gainData,
      totalData: chartCfg.altData.totalData,
      skGain: "xgalt",
      skDGain: "dgalt",
      skTot: "xtotalt",
      skDTot: "dtotalt",
      skXGapTot: "xgaptotalt",
      skDGapTot: "dgaptotalt",
    } : chartCfg;
    const altGapChartCfg = useDense ? {
      ...altChartCfg,
      gainData: chartCfg.altData.gapData,
      skGap: "xgapalt",
      skDGap: "dgapalt",
    } : chartCfg;
    // Per-second mode swaps the finest gain+gap pair (ci0 in Alt+, ci6 in Alt) for
    // the 1s-gain / 1min-gap pair (ci7), where that data exists.
    const psAlt = dashPerSecond && altChartCfg.gainData[7] != null && altGapChartCfg.gainData[7] != null;
    return (
    <div style={{background:eDC.BG,color:eDC.TEXT,fontFamily:dashFont,width:"100%",height:`calc(100vh - ${barH}px)`,display:"flex",flexDirection:"column",overflow:"hidden",padding:"8px 12px 4px",boxSizing:"border-box",gap:6}}>

      {/* Rows 1+2 — zoom-scaled to fit top portion of viewport */}
      <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column"}}>
        <div ref={leftPanelRef} style={{zoom:leftPanelScale,flex:1,width:"100%",display:"flex",flexDirection:"column"}}>
          {/* Row 1: PDP | TS | Timezones */}
          <div style={{display:"flex",flexDirection:"row",alignItems:"stretch",gap:8,marginBottom:6,flex:1}}>
            {/* Channel A */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1,minWidth:0,justifyContent:"space-between",border:"1px solid "+chanA.color,borderRadius:10,background:chanA.color+"18",padding:"8px 10px",boxSizing:"border-box"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,width:"100%"}}>
                <img src={chanA.icon} alt={chanA.name} style={{width:80,height:80,borderRadius:"50%",border:"2px solid "+chanA.color,objectFit:"cover",flexShrink:0,boxShadow:"2px 3px 5px rgba(0,0,0,0.45)"}}/>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{fontSize:28,fontWeight:700,color:chanA.color,textShadow:"1px 1px 3px rgba(0,0,0,0.5)"}}>{chanA.name}</div>
                    <span style={{fontSize:20,lineHeight:1,position:"relative",top:-2,visibility:leadingIsA?"visible":"hidden",filter:"drop-shadow(1px 1px 2px rgba(0,0,0,0.5))"}}>👑</span>
                  </div>
                </div>
                {showRates && <div style={{marginLeft:"auto",marginRight:16,display:"flex",flexDirection:"column",gap:3}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{fontSize:12,fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",display:"flex"}}>
                      <span style={{color:eDC.DIM,width:45,flexShrink:0,textAlign:"left"}}>{chanA.rateLabels[i]}:</span>
                      <span style={{color:chanA.rates[i]!=null?(chanA.rates[i]>=0?"#4caf50":"#f44336"):eDC.DIM,fontWeight:700,display:"inline-block",width:65,textAlign:"left"}}>{chanA.rates[i]!=null?(chanA.rates[i]>=0?"+":"")+Math.round(chanA.rates[i]).toLocaleString():"--"}</span>
                    </div>
                  ))}
                </div>}
              </div>
              <div className="sub-count" style={{fontSize:56,fontWeight:800,fontVariantNumeric:"tabular-nums",color:eDC.TEXT,letterSpacing:0,lineHeight:1,textAlign:"center",textShadow:"1px 1px 3px rgba(0,0,0,0.5)",width:"100%",overflow:"hidden"}}>
                {dashRenderCounter(chanA.display)}
              </div>
              <div style={{fontSize:12,color:eDC.DIM,textAlign:"center"}}>{subsLabel}</div>
            </div>
            {/* Channel B */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1,minWidth:0,justifyContent:"space-between",border:"1px solid "+chanB.color,borderRadius:10,background:chanB.color+"18",padding:"8px 10px",boxSizing:"border-box"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,width:"100%"}}>
                <img src={chanB.icon} alt={chanB.name} style={{width:80,height:80,borderRadius:"50%",border:"2px solid "+chanB.color,objectFit:"cover",flexShrink:0,boxShadow:"2px 3px 5px rgba(0,0,0,0.45)"}}/>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{fontSize:28,fontWeight:700,color:chanB.color,textShadow:"1px 1px 3px rgba(0,0,0,0.5)"}}>{chanB.name}</div>
                    <span style={{fontSize:20,lineHeight:1,position:"relative",top:-2,visibility:leadingIsA?"hidden":"visible",filter:"drop-shadow(1px 1px 2px rgba(0,0,0,0.5))"}}>👑</span>
                  </div>
                </div>
                {showRates && <div style={{marginLeft:"auto",marginRight:16,display:"flex",flexDirection:"column",gap:3}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{fontSize:12,fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",display:"flex"}}>
                      <span style={{color:eDC.DIM,width:45,flexShrink:0,textAlign:"left"}}>{chanB.rateLabels[i]}:</span>
                      <span style={{color:chanB.rates[i]!=null?(chanB.rates[i]>=0?"#4caf50":"#f44336"):eDC.DIM,fontWeight:700,display:"inline-block",width:65,textAlign:"left"}}>{chanB.rates[i]!=null?(chanB.rates[i]>=0?"+":"")+Math.round(chanB.rates[i]).toLocaleString():"--"}</span>
                    </div>
                  ))}
                </div>}
              </div>
              <div className="sub-count" style={{fontSize:56,fontWeight:800,fontVariantNumeric:"tabular-nums",color:eDC.TEXT,letterSpacing:0,lineHeight:1,textAlign:"center",textShadow:"1px 1px 3px rgba(0,0,0,0.5)",width:"100%",overflow:"hidden"}}>
                {dashRenderCounter(chanB.display)}
              </div>
              <div style={{fontSize:12,color:eDC.DIM,textAlign:"center"}}>{subsLabel}</div>
            </div>
            {/* Timezones */}
            <div style={{background:eDC.CARD,border:"1px solid "+eDC.BORDER,borderRadius:10,padding:"8px 13px",flexShrink:0,width:200,display:"flex",flexDirection:"column",justifyContent:"flex-start",alignSelf:"stretch"}}>
              {timezonesEl}
              <div style={{borderTop:"1px solid "+eDC.BORDER,marginTop:8,paddingTop:8}}>
                <div style={{fontSize:9,color:eDC.DIM,marginBottom:2}}>Playback Speed</div>
                <div style={{fontSize:14,fontWeight:700,color:eDC.TEXT,fontVariantNumeric:"tabular-nums"}}>{effectiveSpeed!=null?Math.round(effectiveSpeed)+"s/s":mult.toFixed(mult<10?2:0)+"x"}</div>
              </div>
            </div>
          </div>
          {/* Row 2: Sub Gap (25%) | Milestone (50%) | Ahead (25%) */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr",gap:6}}>
            <div style={{background:eDC.CARD,border:"1px solid "+eDC.BORDER,borderRadius:10,padding:"6px 10px",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontSize:14,color:eDC.DIM,fontWeight:400,marginBottom:4}}>Sub Gap</div>
              <div style={{fontSize:36,fontWeight:800,fontVariantNumeric:"tabular-nums",lineHeight:1,color:gap!=null?(leadingIsA?"rgba(160,200,255,1)":"rgba(255,160,160,1)"):eDC.DIM,textAlign:"center"}}>
                {isRTMode?<CasinoCounter value={gap!=null?Math.abs(gap):null} duration={dur} seekToken={seekToken}/>:(gap!=null?Math.round(Math.abs(gap)).toLocaleString():"-")}
              </div>
            </div>
            <div style={{background:eDC.CARD,border:"1px solid "+eDC.BORDER,borderRadius:10,padding:"0 12px",boxSizing:"border-box",display:"flex",flexDirection:"column",justifyContent:"center"}}>
              {milestoneEl}
            </div>
            <div style={{background:eDC.CARD,border:"1px solid "+eDC.BORDER,borderRadius:10,padding:"8px 12px",boxSizing:"border-box",display:"grid",gridTemplateColumns:"2fr 3fr",gap:0}}>
              <div style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:2}}>
                <div style={{fontSize:9,color:eDC.DIM}}>{aheadLabel}</div>
                <div style={{fontSize:14,fontWeight:700,color:leadingIsA?chanA.color:chanB.color}}>{aheadName}</div>
                <div style={{fontSize:11,color:eDC.DIM,fontVariantNumeric:"tabular-nums"}}>{leadDuration}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:4,paddingLeft:14,marginLeft:14,borderLeft:"1px solid "+eDC.BORDER}}>
                <div>
                  <div style={{fontSize:8,color:eDC.DIM,fontWeight:600,marginBottom:1}}>Number of Takeovers</div>
                  <div style={{fontSize:12,fontWeight:700,fontVariantNumeric:"tabular-nums",color:eDC.TS}}>{tsTakeoverCountLegit} <span style={{fontSize:10,fontWeight:500,color:eDC.DIM}}>({tsTakeoverCount})</span></div>
                </div>
                <div>
                  <div style={{fontSize:8,color:eDC.DIM,fontWeight:600,marginBottom:1}}>Total Time T-Series Ahead</div>
                  {(()=>{
                    const s = Math.floor(tsTotalSecsAhead);
                    const d = Math.floor(s/86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60), sec = s%60;
                    const fmt = d>0?`${d}d ${h}h ${m}m ${sec}s`:h>0?`${h}h ${m}m ${sec}s`:`${m}m ${sec}s`;
                    return <div style={{fontSize:12,fontWeight:700,fontVariantNumeric:"tabular-nums",color:eDC.TS}}>{fmt}</div>;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart grid: 4 cols x 2 rows — 40% of viewport height */}
      {dashAltPlus ? (
      <div style={{flex:"0 0 47%",minHeight:0,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gridTemplateRows:"1fr 1fr",gap:6}}>
        <div style={{gridColumn:1,gridRow:1,minHeight:0,display:"flex"}}>{renderDashGapChart(psAlt?7:0,psAlt?"1min Gap":"10min Gap","100%",altGapChartCfg)}</div>
        <div style={{gridColumn:2,gridRow:1,minHeight:0,display:"flex"}}>{renderDashGapChart(1,"1hr Gap","100%",altGapChartCfg)}</div>
        <div style={{gridColumn:3,gridRow:1,minHeight:0,display:"flex"}}>{renderDashGapChart(2,"24hr Gap","100%",altGapChartCfg)}</div>
        <div style={{gridColumn:4,gridRow:1,minHeight:0,display:"flex"}}>{renderDashTotalCharts(altChartCfg,"100%",null,'gap')}</div>
        <div style={{gridColumn:1,gridRow:2,minHeight:0,display:"flex"}}>{renderDashGainChart(psAlt?7:0,"100%",altChartCfg)}</div>
        <div style={{gridColumn:2,gridRow:2,minHeight:0,display:"flex"}}>{renderDashGainChart(1,"100%",altChartCfg)}</div>
        <div style={{gridColumn:3,gridRow:2,minHeight:0,display:"flex"}}>{renderDashGainChart(2,"100%",altChartCfg)}</div>
        <div style={{gridColumn:4,gridRow:2,minHeight:0,display:"flex"}}>{renderDashGainChart(4,"100%",altChartCfg)}</div>
        <div style={{gridColumn:5,gridRow:"1 / 3",minHeight:0,display:"flex"}}>{renderDashTotalCharts(altChartCfg,"100%",null,'subs')}</div>
      </div>
      ) : (
      <div style={{flex:"0 0 47%",minHeight:0,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridTemplateRows:"1fr 1fr",gap:6}}>
        <div style={{gridColumn:1,gridRow:1,minHeight:0,display:"flex"}}>{renderDashGapChart(psAlt?7:6,psAlt?"1min Gap":"1hr Gap","100%",altGapChartCfg)}</div>
        <div style={{gridColumn:2,gridRow:1,minHeight:0,display:"flex"}}>{renderDashGapChart(2,"24hr Gap","100%",altGapChartCfg)}</div>
        <div style={{gridColumn:3,gridRow:1,minHeight:0,display:"flex"}}>{renderDashTotalCharts(altChartCfg,"100%",null,'gap')}</div>
        <div style={{gridColumn:1,gridRow:2,minHeight:0,display:"flex"}}>{renderDashGainChart(psAlt?7:6,"100%",altChartCfg)}</div>
        <div style={{gridColumn:2,gridRow:2,minHeight:0,display:"flex"}}>{renderDashGainChart(2,"100%",altChartCfg)}</div>
        <div style={{gridColumn:3,gridRow:2,minHeight:0,display:"flex"}}>{renderDashGainChart(4,"100%",altChartCfg)}</div>
        <div style={{gridColumn:4,gridRow:"1 / 3",minHeight:0,display:"flex"}}>{renderDashTotalCharts(altChartCfg,"100%",null,'subs')}</div>
      </div>
      )}

      {/* Legend */}
      <div style={{padding:"2px 0",display:"flex",justifyContent:"center",gap:24,fontSize:11,flexShrink:0,borderTop:"1px solid "+eDC.BORDER,color:eDC.DIM}}>
        {legendItems.map(l=>(
          <span key={l.label}><span style={{display:"inline-block",width:12,height:3,background:l.color,borderRadius:2,marginRight:6,verticalAlign:"middle"}}/>{l.label}</span>
        ))}
      </div>
    </div>
    );
  };

  // LAYOUT: Dashboard Normal/Alt dispatcher - see LAYOUTS.md
  const renderDualDashboard = (props) => props.altLayout ? renderAltDashboard(props) : renderNormalDashboard(props);


  // LAYOUT: Dashboard chart card renderer - see LAYOUTS.md
  const renderDashTotalCharts = (cfg, h=260, wrapStyle=null, which=null) => {
    const totTMin = Math.max(curTime - dashWin * DAY_MS, cfg.dataStart);
    const _totKeys = dashChanFilter==='pdp'?[cfg.totalLineA.key]:dashChanFilter==='ts'?[cfg.totalLineB.key]:[cfg.totalLineA.key,cfg.totalLineB.key];
    const totDom = dashGetRange(cfg.totalData, _totKeys, curTime, totTMin);
    const totTicks = niceTicks(totDom);
    const gapDom = dashGetRange(cfg.totalData, [cfg.totalGapKey], curTime, totTMin);
    const gapTicks = niceTicks(gapDom);
    const totXDom = [totTMin, curTime];
    const gapXDom = [totTMin, curTime];
    const subsCard = (
      <DashChartCard title={cfg.totalTitle} dc={eDC}>
        <ResponsiveContainer width="100%" height={h}>
          <LineChart data={cfg.totalData} margin={{top:4,right:70,bottom:0,left:0}}>
            <CartesianGrid stroke="#2e3348" strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="t" type="number" domain={totXDom} allowDataOverflow ticks={dashChartTicks} tickFormatter={dashXFormat} tick={{fill:eDC.DIM,fontSize:10,fontFamily:"Inter,system-ui,sans-serif"}} axisLine={{stroke:eDC.BORDER}} tickLine={false}/>
            {dashChartTicks.map(m=><ReferenceLine key={m} x={m} stroke="#2a2d38" strokeWidth={1}/>)}
            <YAxis tickFormatter={v=>fmt(v,"subs")} tick={{fill:eDC.DIM,fontSize:10,fontFamily:"Inter,system-ui,sans-serif"}} axisLine={false} tickLine={false} width={52} domain={totDom} allowDataOverflow ticks={totTicks}/>
            {!isRTMode && <Tooltip content={<DashTooltip fmtMode="subs" dc={eDC}/>}/>}
            {dashChanFilter!=='ts'  && <Line type="monotone" dataKey={cfg.totalLineA.key} stroke={cfg.totalLineA.color} strokeWidth={2} dot={false} name={cfg.totalLineA.name} isAnimationActive={false} style={{mixBlendMode:"screen"}}/>}
            {dashChanFilter!=='pdp' && <Line type="monotone" dataKey={cfg.totalLineB.key} stroke={cfg.totalLineB.color} strokeWidth={2} dot={false} name={cfg.totalLineB.name} isAnimationActive={false} style={{mixBlendMode:"screen"}}/>}
            {endDots(cfg.totalData, curTime, [...(dashChanFilter!=='ts'?[{key:cfg.totalLineA.key,color:cfg.totalLineA.color,fmtMode:'subs',exact:cfg.exactA}]:[]),...(dashChanFilter!=='pdp'?[{key:cfg.totalLineB.key,color:cfg.totalLineB.color,fmtMode:'subs',exact:cfg.exactB}]:[])])}
          </LineChart>
        </ResponsiveContainer>
      </DashChartCard>
    );
    const gapCard = (
      <DashChartCard title={cfg.gapTitle} dc={eDC}>
        <ResponsiveContainer width="100%" height={h}>
          <LineChart data={cfg.totalData} margin={{top:4,right:70,bottom:0,left:0}}>
            <CartesianGrid stroke="#2e3348" strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="t" type="number" domain={gapXDom} allowDataOverflow ticks={dashChartTicks} tickFormatter={dashXFormat} tick={{fill:eDC.DIM,fontSize:10,fontFamily:"Inter,system-ui,sans-serif"}} axisLine={{stroke:eDC.BORDER}} tickLine={false}/>
            {dashChartTicks.map(m=><ReferenceLine key={m} x={m} stroke="#2a2d38" strokeWidth={1}/>)}
            <YAxis tickFormatter={v=>fmt(v)} tick={{fill:eDC.DIM,fontSize:10,fontFamily:"Inter,system-ui,sans-serif"}} axisLine={false} tickLine={false} width={52} domain={gapDom} allowDataOverflow ticks={gapTicks}/>
            {!isRTMode && <Tooltip content={<DashTooltip dc={eDC}/>}/>}
            <ReferenceLine y={0} stroke="#5a5f72" strokeWidth={1.5}/>
            <Line type="monotone" dataKey={cfg.totalGapKey} stroke={"#e2e5eb"} strokeWidth={2} dot={false} name={cfg.totalGapName} isAnimationActive={false}/>
            {endDots(cfg.totalData, curTime, [{key:cfg.totalGapKey,color:'#e2e5eb',exact:cfg.exactGap}])}
          </LineChart>
        </ResponsiveContainer>
      </DashChartCard>
    );
    if (which === 'subs') return subsCard;
    if (which === 'gap')  return gapCard;
    return (
      <div style={wrapStyle || {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,paddingBottom:8}}>
        {subsCard}{gapCard}
      </div>
    );
  };

  const _sbShrinkF   = ((displayPt ?? 0) >= 99945613 || (displayTt ?? 0) >= 99945613) ? 0.92 : 1;
  const _pdpCardScale = 1.0   * _sbShrinkF;
  const _pdpCardLeft  = 272       - 544 * _pdpCardScale / 2;
  const _pdpCardTop   = 123       - 246 * _pdpCardScale / 2;
  const _tsCardScale  = 1.035 * _sbShrinkF;
  const _tsCardLeft   = 1009.3175 - 561 * _tsCardScale / 2;
  const _tsCardTop    = 126.27    - 244 * _tsCardScale / 2;

  return (
    <div style={{ background:"#000", minHeight:"100vh", overflow:"hidden", fontFamily:"'Inter',system-ui,-apple-system,'Segoe UI',sans-serif" }}>
      {/* Flare theme assets: load Roboto at the weights FlareView needs.
          No blanket !important rules - FlareView sets font-family and
          font-weight explicitly per element so mixed weights and non-Roboto
          display fonts (Compose Black Oblique, etc.) render correctly.
          Inter is loaded for the Dashboard chrome (charts, controls, labels);
          FlareView overrides explicitly so it stays Roboto/CBO. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      `}</style>
      {/* - Control Bar - */}
      {!barHidden && <div data-controlbar style={{ borderBottom:"1px solid #333", fontFamily:"'Inter',system-ui,-apple-system,'Segoe UI',sans-serif", fontSize:12, color:"#ccc" }}>
        {menuOpen && <div style={{ padding:"4px 14px 6px", display:"flex", alignItems:"stretch", gap:0, flexWrap:"nowrap" }}>

          {/* PLAY */}
          <div style={{display:"flex",flexDirection:"column",gap:3,paddingRight:10}}>
            <span style={{fontSize:13,color:"#888",letterSpacing:"0.05em"}}>PLAY</span>
            <div style={{display:"flex",alignItems:"center",gap:3}}>
              <button onClick={()=>dispatch({type:"TOGGLE_PLAY"})} style={{ background:playing?"#162036":"#162016", color:playing?"#6baee8":"#5dba6e", border:"none", borderRadius:5, padding:"3px 12px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", minWidth:40 }}>{playing?"⏸":"▶"}</button>
              <button onClick={()=>dispatch({type:"TOGGLE_REVERSE"})} title="Reverse playback" style={{ background:reverse?"#1e2535":"transparent", color:reverse?"#8aaccc":"#777", border:"1px solid "+(reverse?"#2d4060":"#1e1e1e"), borderRadius:4, padding:"3px 7px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>{"◀"}</button>
            </div>
          </div>

          <div style={{width:1,background:"#1e1e1e",alignSelf:"stretch",margin:"0 10px"}}/>

          {/* SPEED */}
          <div style={{display:"flex",flexDirection:"column",gap:3,paddingRight:10}}>
            <span style={{fontSize:13,color:"#888",letterSpacing:"0.05em"}}>SPEED</span>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <select value={speedMode} onChange={e=>{dispatch({type:"SET_MODE",mode:e.target.value});e.target.blur();}} style={{ background:"#0e1018", color:"#aaa", border:"1px solid #1e1e1e", borderRadius:4, padding:"2px 4px", fontSize:11, fontFamily:"inherit", cursor:"pointer", outline:"none" }}>
                {ALL_MODES.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
              {isRTMode && <div style={{display:"flex",flexDirection:"column",gap:1}}>
                <span style={{fontSize:9,color:"#666",letterSpacing:"0.03em"}}>Counter Update Interval</span>
                <div style={{display:"flex",alignItems:"center",gap:2}}>
                  <input type="range" min={1} max={3} step={1} value={rtInterval} onChange={e=>setRtInterval(Number(e.target.value))} onMouseUp={e=>e.target.blur()} style={{width:34,accentColor:"#4a6080",cursor:"pointer"}}/>
                  <span style={{fontSize:9,color:"#888",minWidth:12}}>{rtInterval}s</span>
                </div>
              </div>}
              {/* Mult slider in log10-space: -1..2 = 0.1x..100x; 0 = 1x centered */}
              <div style={{display:"flex",flexDirection:"column",gap:1}}>
                <span style={{fontSize:9,color:"#666",letterSpacing:"0.03em"}}>Playback Speed</span>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <input type="range" min={MULT_LOG_MIN} max={MULT_LOG_MAX} step={0.01} value={Math.log10(mult)} onChange={e=>dispatch({type:"SET_MULT",mult:Math.pow(10,parseFloat(e.target.value))})} onMouseUp={e=>e.target.blur()} style={{width:68,accentColor:"#4a6080",cursor:"pointer"}}/>
                  <input ref={multInputRef} type="text" inputMode="decimal" value={multText}
                    onChange={e=>{ const s=e.target.value; setMultText(s); const v=parseFloat(s); if(!isNaN(v)&&v>=MULT_MIN&&v<=MULT_MAX)dispatch({type:"SET_MULT",mult:v}); }}
                    onBlur={()=>setMultText(String(parseFloat(mult.toFixed(2))))}
                    onKeyDown={e=>{ if(e.key==="Enter")e.target.blur(); }}
                    style={{width:36,background:"#0e1018",color:mult!==1?"#bbb":"#888",border:"1px solid #1e1e1e",borderRadius:4,padding:"2px 4px",fontSize:11,fontFamily:"inherit",textAlign:"right",outline:"none",fontVariantNumeric:"tabular-nums"}}/>
                  <span style={{fontSize:10,color:mult!==1?"#888":"#777"}}>x</span>
                </div>
              </div>
              {/* Dynamic: getDynSpeed drives rAF-paced playhead at gap-dependent rate */}
              {speedMode==="1m" && <button onClick={()=>dispatch({type:"TOGGLE_DYN"})} title="Dynamic speed: gap-dependent rate" style={{ background:dyn?"#1a2535":"transparent", color:dyn?"#7cb9f7":"#777", border:"1px solid "+(dyn?"#2d4060":"#1e1e1e"), borderRadius:4, padding:"2px 6px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>Dynamic<span style={{display:"inline-block",minWidth:38,marginLeft:isDyn?4:0,color:"#4a6080",textAlign:"right"}}>{isDyn?(effectiveSpeed!=null?Math.round(effectiveSpeed):0)+'s/s':''}</span></button>}
            </div>
          </div>

          {/* PHASE (RT modes only) */}
          {isRTSpeedMode(speedMode) && <>
            <div style={{width:1,background:"#1e1e1e",alignSelf:"stretch",margin:"0 10px"}}/>
            <div style={{display:"flex",flexDirection:"column",gap:3,paddingRight:10}} title="Phase-shift PT/TT counter updates; SB lands at midpoint">
              <span style={{fontSize:10,color:"#888",letterSpacing:"0.04em"}}>Counters Desync Shift</span>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <input type="range" min={0} max={1} step={0.01} value={desync} onChange={e=>dispatch({type:"SET_DESYNC",value:parseFloat(e.target.value)})} onMouseUp={e=>e.target.blur()} style={{width:60,accentColor:"#4a6080",cursor:"pointer"}}/>
                <span style={{fontSize:10,color:"#888",fontVariantNumeric:"tabular-nums",minWidth:24,textAlign:"right"}}>{desync.toFixed(2)}</span>
              </div>
            </div>
          </>}

          <div style={{width:1,background:"#1e1e1e",alignSelf:"stretch",margin:"0 10px"}}/>

          {/* SEEK */}
          <div style={{display:"flex",flexDirection:"column",gap:3,flex:1,minWidth:120}}>
            <span style={{fontSize:13,color:"#888",letterSpacing:"0.05em"}}>SEEK</span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <input type="range" min={SEEK_START} max={effectiveMaxIdx} step="any" value={pos} onChange={e=>{const v=+e.target.value;setPos(v);posRef.current=v;dispatch({type:"STOP"});clearRT();dispatch({type:"BUMP_SEEK"});if(musicArrowSeek)musicPickRandom(false);}} onMouseUp={e=>e.target.blur()} onTouchEnd={e=>e.target.blur()} style={{flex:1,accentColor:"#4a6080",cursor:"pointer"}}/>
              {clockEditing
                ? <input type="datetime-local" step={1} autoFocus defaultValue={fmtDateTimeLocalET(curTime)} min={fmtDateTimeLocalET(REAL_DATA_START_MS)} max={fmtDateTimeLocalET(REAL_DATA_END_MS)}
                    onKeyDown={e=>{ if(e.key==="Enter")e.target.blur(); }}
                    onBlur={e=>{ const ts=parseDateTimeLocalET(e.target.value); if(ts!=null){const cl=Math.max(REAL_DATA_START_MS,Math.min(REAL_DATA_END_MS,ts));const p=tsToPos(cl);setPos(p);posRef.current=p;dispatch({type:"STOP"});clearRT();dispatch({type:"BUMP_SEEK"});} setClockEditing(false); }}
                    style={{fontSize:11,background:"#0e1018",color:"#bbb",border:"1px solid #2d4060",borderRadius:4,padding:"2px 4px",fontFamily:"inherit",outline:"none",colorScheme:"dark"}}/>
                : <span onClick={()=>setClockEditing(true)} title="Click to jump to date/time" style={{fontSize:11,color:"#999",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",cursor:"pointer",padding:"1px 5px",background:"#0e1018",borderRadius:3,border:"1px solid #1a1d28",width:132,display:"inline-block",textAlign:"center"}}>{fmtDateTime(curTime)}</span>}
              <span ref={fpsDisplayRef} style={{fontSize:9,color:"#666",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",width:40,textAlign:"right",display:"inline-block"}}>-- fps</span>
            </div>
          </div>

          <div style={{width:1,background:"#1e1e1e",alignSelf:"stretch",margin:"0 10px"}}/>

          {/* VIEW */}
          <div style={{display:"flex",flexDirection:"column",gap:3,paddingRight:10}}>
            <span style={{fontSize:13,color:"#888",letterSpacing:"0.05em"}}>VIEW</span>
            <div style={{display:"inline-flex",background:"#0a0c14",border:"1px solid #1e1e1e",borderRadius:5,overflow:"hidden"}}>
              {[{id:"socialblade",label:"SocialBlade"},{id:"flare",label:"Flare"},{id:"dashboard",label:"Dashboard"}].map((opt,i)=>{
                const active=view===opt.id;
                return <button key={opt.id} onClick={()=>setView(opt.id)} style={{ background:active?"#1e3050":"transparent", color:active?"#7cb9f7":"#777", border:"none", borderLeft:i===0?"none":"1px solid #1e1e1e", padding:"2px 9px", fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:active?600:400 }}>{opt.label}</button>;
              })}
            </div>
          </div>

          {/* OPTIONS (view-specific) */}
          {(view==="dashboard" || view==="flare" || view==="socialblade") && <>
            <div style={{width:1,background:"#1e1e1e",alignSelf:"stretch",margin:"0 10px"}}/>
            <div style={{display:"flex",flexDirection:"column",gap:3,paddingRight:10}}>
              <span style={{fontSize:13,color:"#888",letterSpacing:"0.05em"}}>{view==="dashboard"?"DASHBOARD":view==="flare"?"FLARE":"SOCIALBLADE"}</span>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                {view==="dashboard" && <button onClick={()=>setDashLayout(v=>(v+1)%3)} style={{ background:"#1a2535", color:"#9bbfdf", border:"1px solid #2d4060", borderRadius:4, padding:"2px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>{dashLayout===0?"Default":dashLayout===1?"Default+":"Alt"}</button>}
                {view==="dashboard" && <button onClick={()=>setFilterAudits(v=>!v)} title="Strip audits from charts; mark audit timestamps" style={{ background:filterAudits?"#1a2535":"transparent", color:filterAudits?"#9bbfdf":"#777", border:"1px solid "+(filterAudits?"#2d4060":"#1e1e1e"), borderRadius:4, padding:"2px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>Filter Audits</button>}
                {view==="dashboard" && <div style={{display:"inline-flex",background:"#0a0c14",border:"1px solid #1e1e1e",borderRadius:4,overflow:"hidden"}}>
                  {[['both','Both'],['pdp','PDP'],['ts','TS']].map(([v,lbl])=>(
                    <button key={v} onClick={()=>setDashChanFilter(v)} style={{background:dashChanFilter===v?"#1a2535":"transparent",color:dashChanFilter===v?"#9bbfdf":"#777",border:"none",borderLeft:v==='both'?"none":"1px solid #1e1e1e",padding:"2px 8px",fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:dashChanFilter===v?600:400}}>{lbl}</button>
                  ))}
                </div>}

                {view==="flare" && <button onClick={()=>setFlareDark(v=>!v)} style={{ background:flareDark?"#1a2535":"transparent", color:flareDark?"#9bbfdf":"#777", border:"1px solid "+(flareDark?"#2d4060":"#1e1e1e"), borderRadius:4, padding:"2px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>{flareDark?"Dark":"Light"}</button>}
                {view==="socialblade" && <button onClick={()=>setSbDark(v=>!v)} style={{ background:!sbDark?"#1a2535":"transparent", color:!sbDark?"#9bbfdf":"#777", border:"1px solid "+(!sbDark?"#2d4060":"#1e1e1e"), borderRadius:4, padding:"2px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>{sbDark?"Light":"Dark"}</button>}
                {view==="socialblade" && <button onClick={()=>setSbOvertake(v=>!v)} style={{ background:sbOvertake?"#1a2535":"transparent", color:sbOvertake?"#9bbfdf":"#777", border:"1px solid "+(sbOvertake?"#2d4060":"#1e1e1e"), borderRadius:4, padding:"2px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>Predict Overtake</button>}
                {view==="socialblade" && <button onClick={()=>dispatch({type:"TOGGLE_MINUTE_SNAP"})} title="Update tables once every minute - otherwise, updates every second" style={{ background:minuteSnap?"#1a2535":"transparent", color:minuteSnap?"#7cb9f7":"#777", border:"1px solid "+(minuteSnap?"#2d4060":"#1e1e1e"), borderRadius:4, padding:"2px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>Snap</button>}
              </div>
            </div>
          </>}

          <div style={{width:1,background:"#1e1e1e",alignSelf:"stretch",margin:"0 10px"}}/>

          {/* DEV (dev mode only, toggle with Shift+H) */}
          {devMode && <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <span style={{fontSize:13,color:"#888",letterSpacing:"0.05em"}}>DEV</span>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <button onClick={()=>{ setInspectorOpen(v=>!v); if(!inspectorPinned) setInspectorPinnedTime(curTime); }} style={{ background:inspectorOpen?"#1e3050":"transparent", color:inspectorOpen?"#7cb9f7":"#777", border:"1px solid "+(inspectorOpen?"#2d4060":"#1e1e1e"), borderRadius:4, padding:"2px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>Data</button>
              <button onClick={()=>setRawMode(v=>!v)} title={rawMode?"Switch to smoothed data":"Switch to raw unfiltered data"} style={{ background:rawMode?"#301818":"transparent", color:rawMode?"#f88":"#777", border:"1px solid "+(rawMode?"#603030":"#1e1e1e"), borderRadius:4, padding:"2px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>{rawMode?"Raw":"Smooth"}</button>
              <button onClick={()=>setPatchEditorOpen(v=>!v)} title="Edit manual data patches (audit marks and smooth windows)" style={{ background:patchEditorOpen?"#1e3020":"transparent", color:patchEditorOpen?"#7fdf9b":"#777", border:"1px solid "+(patchEditorOpen?"#2d6040":"#1e1e1e"), borderRadius:4, padding:"2px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>Patches{(patches.audit_invalidations.length+patches.smooth_windows.length)>0?" ("+(patches.audit_invalidations.length+patches.smooth_windows.length)+")":""}</button>
              {view==="dashboard" && <button onClick={()=>setDashRawDelta(v=>!v)} title="Replace last chart slot with Raw-minus-Smooth delta for both channels (last 1h)" style={{ background:dashRawDelta?"#1e1535":"transparent", color:dashRawDelta?"#b88cf7":"#777", border:"1px solid "+(dashRawDelta?"#4d2d9a":"#1e1e1e"), borderRadius:4, padding:"2px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>Delta</button>}
            </div>
          </div>}

          {devMode && <>
            <div style={{width:1,background:"#1e1e1e",alignSelf:"stretch",margin:"0 10px"}}/>
            {/* WINDOW */}
            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              <span style={{fontSize:13,color:"#888",letterSpacing:"0.05em"}}>WINDOW</span>
              <div style={{display:"inline-flex",background:"#0a0c14",border:"1px solid #1e1e1e",borderRadius:4,overflow:"hidden"}}>
                <button onClick={()=>{ setScale(1); window.resizeTo(1280,720+(window.outerHeight-window.innerHeight)); }} title="Resize to 1280x720 viewport" style={{ background:scale===1?"#1e2535":"transparent", color:scale===1?"#aaa":"#777", border:"none", borderRight:"1px solid #1e1e1e", padding:"2px 8px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>720p</button>
                <button onClick={()=>{ setScale(1.5); window.resizeTo(1920,1080+(window.outerHeight-window.innerHeight)); }} title="Render Flare at 1920x1080" style={{ background:scale===1.5?"#1e2535":"transparent", color:scale===1.5?"#aaa":"#777", border:"none", padding:"2px 8px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>1080p</button>
              </div>
            </div>
          </>}

        </div>}
        {false && <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",borderTop:"1px solid #1a1d28",flexWrap:"nowrap",overflow:"hidden"}}>
          <select value={musicLib} onChange={e=>{const l=e.target.value;setMusicLib(l);setMusicPlaylist(musicGetPl(l,musicShuffle));}} style={{background:"#1a1d28",color:"#ccc",border:"1px solid #2a2d38",borderRadius:4,padding:"2px 4px",fontSize:11,fontFamily:"inherit",cursor:"pointer",flexShrink:0}}>
            {[{id:'monstercat',label:'Monstercat'},{id:'congratulations',label:'Congratulations'},{id:'lasagna',label:'Lasagna'},{id:'adaptive',label:'Adaptive'},{id:'custom',label:'Custom'}].map(l=><option key={l.id} value={l.id}>{l.label}</option>)}
            {Object.keys(musicPlaylists).map(n=><option key={'pl:'+n} value={'pl:'+n}>{'PL: '+n}</option>)}
          </select>
          <button onClick={()=>musicDoPlay(musicPlaylist,(musicIdx-1+musicPlaylist.length)%musicPlaylist.length,musicLib)} style={{background:"transparent",color:"#666",border:"1px solid #333",borderRadius:4,padding:"2px 6px",fontSize:11,cursor:"pointer",flexShrink:0,fontFamily:"inherit"}}>Prev</button>
          <button onClick={()=>{if(!audioRef.current)return;if(musicPlaying){audioRef.current.pause();setMusicPlaying(false);}else if(audioRef.current.src){audioRef.current.play().then(()=>setMusicPlaying(true)).catch(()=>{});}else if(musicPlaylist.length){musicDoPlay(musicPlaylist,musicIdx,musicLib);}}} style={{background:"transparent",color:"#ccc",border:"1px solid #444",borderRadius:4,padding:"2px 8px",fontSize:11,cursor:"pointer",flexShrink:0,fontFamily:"inherit"}}>{musicPlaying?'Pause':'Play'}</button>
          <button onClick={()=>musicDoPlay(musicPlaylist,(musicIdx+1)%musicPlaylist.length,musicLib)} style={{background:"transparent",color:"#666",border:"1px solid #333",borderRadius:4,padding:"2px 6px",fontSize:11,cursor:"pointer",flexShrink:0,fontFamily:"inherit"}}>Next</button>
          <span style={{flex:1,fontSize:11,color:"#aaa",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0}}>{musicFileOf(musicPlaylist[musicIdx]||'\u2014').replace(/\.[^.]+$/,'')}</span>
          <span style={{fontSize:10,color:"#555",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",flexShrink:0}}>{fmtMusicTime(musicTime)}/{fmtMusicTime(musicDuration)}</span>
          <input type="range" min={0} max={musicDuration||1} step={0.5} value={musicTime} onChange={e=>{if(audioRef.current)audioRef.current.currentTime=+e.target.value;setMusicTime(+e.target.value);}} style={{flex:1,minWidth:120,accentColor:"#6b7280",cursor:"pointer"}}/>
          <button onClick={()=>{const sh=!musicShuffle;setMusicShuffle(sh);setMusicPlaylist(musicGetPl(musicLib,sh));}} style={{background:musicShuffle?"#2a2d38":"transparent",color:musicShuffle?"#ccc":"#666",border:"1px solid "+(musicShuffle?"#3b3f4f":"#333"),borderRadius:4,padding:"2px 5px",fontSize:11,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Shuf</button>
          <button onClick={()=>setMusicLoop(v=>!v)} title="Repeat current track" style={{background:musicLoop?"#2a2d38":"transparent",color:musicLoop?"#ccc":"#666",border:"1px solid "+(musicLoop?"#3b3f4f":"#333"),borderRadius:4,padding:"2px 5px",fontSize:11,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Loop</button>
          <button onClick={()=>setMusicAutoplay(v=>!v)} style={{background:musicAutoplay?"#2a2d38":"transparent",color:musicAutoplay?"#ccc":"#666",border:"1px solid "+(musicAutoplay?"#3b3f4f":"#333"),borderRadius:4,padding:"2px 5px",fontSize:11,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Auto</button>
          <button onClick={()=>setPlEditorOpen(v=>!v)} title="Playlist editor" style={{background:plEditorOpen?"#2a2d38":"transparent",color:plEditorOpen?"#ccc":"#666",border:"1px solid "+(plEditorOpen?"#3b3f4f":"#333"),borderRadius:4,padding:"2px 5px",fontSize:11,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>PL</button>
          <button onClick={()=>setMusicArrowSeek(v=>!v)} title="Arrow keys seek music" style={{background:musicArrowSeek?"#2a2d38":"transparent",color:musicArrowSeek?"#ccc":"#666",border:"1px solid "+(musicArrowSeek?"#3b3f4f":"#333"),borderRadius:4,padding:"2px 5px",fontSize:11,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>⟵⟶</button>
        </div>}
        {false && (() => {
          const plBtn = {background:"transparent",color:"#888",border:"1px solid #333",borderRadius:3,padding:"0px 5px",fontSize:10,cursor:"pointer",fontFamily:"inherit",flexShrink:0,lineHeight:"16px"};
          const entries = musicPlaylists[plSelected] || [];
          const browseSongs = (musicLibrary && musicLibrary[plBrowseLib]) || [];
          const plCreate = () => { const n = plNewName.trim(); if (!n || musicPlaylists[n]) return; setMusicPlaylists(p=>({ ...p, [n]: [] })); setPlSelected(n); setPlNewName(''); };
          const plDelete = () => {
            if (!plSelected) return;
            setMusicPlaylists(p=>{ const q={...p}; delete q[plSelected]; return q; });
            if (musicLib === 'pl:'+plSelected) { setMusicLib('monstercat'); setMusicPlaylist(musicGetPl('monstercat', musicShuffle)); }
            setPlSelected('');
          };
          const plAdd = (song) => { if (!plSelected) return; setMusicPlaylists(p=>({ ...p, [plSelected]: [...(p[plSelected]||[]), plBrowseLib+'::'+song] })); };
          const plRemove = (i) => setMusicPlaylists(p=>{ const a=[...(p[plSelected]||[])]; a.splice(i,1); return { ...p, [plSelected]: a }; });
          const plMove = (i,dir) => setMusicPlaylists(p=>{ const a=[...(p[plSelected]||[])]; const j=i+dir; if (j<0||j>=a.length) return p; [a[i],a[j]]=[a[j],a[i]]; return { ...p, [plSelected]: a }; });
          return (
          <div style={{borderTop:"1px solid #1a1d28",padding:"4px 8px",fontSize:11,color:"#aaa"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
              <span style={{color:"#666",fontSize:10}}>Playlist:</span>
              <select value={plSelected} onChange={e=>setPlSelected(e.target.value)} style={{background:"#1a1d28",color:"#ccc",border:"1px solid #2a2d38",borderRadius:4,padding:"1px 4px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>
                <option value="">-- select --</option>
                {Object.keys(musicPlaylists).map(n=><option key={n} value={n}>{n}</option>)}
              </select>
              <button onClick={plDelete} disabled={!plSelected} style={{...plBtn,color:plSelected?"#f87171":"#444"}}>Delete</button>
              <input value={plNewName} onChange={e=>setPlNewName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')plCreate();}} placeholder="new playlist name" style={{background:"#1a1d28",color:"#ccc",border:"1px solid #2a2d38",borderRadius:4,padding:"1px 5px",fontSize:11,fontFamily:"inherit",outline:"none",width:140}}/>
              <button onClick={plCreate} style={plBtn}>Create</button>
              {plSelected && <span style={{color:"#555",fontSize:10}}>{entries.length} tracks</span>}
            </div>
            <div style={{display:"flex",gap:10,maxHeight:170}}>
              <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column"}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                  <span style={{color:"#666",fontSize:10}}>Browse:</span>
                  <select value={plBrowseLib} onChange={e=>setPlBrowseLib(e.target.value)} style={{background:"#1a1d28",color:"#ccc",border:"1px solid #2a2d38",borderRadius:4,padding:"1px 4px",fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>
                    {Object.keys(MUSIC_FOLDERS).map(k=><option key={k} value={k}>{MUSIC_FOLDERS[k]}</option>)}
                  </select>
                </div>
                <div style={{overflowY:"auto",border:"1px solid #1a1d28",borderRadius:4}}>
                  {browseSongs.map(s=>(
                    <div key={s} style={{display:"flex",alignItems:"center",gap:4,padding:"1px 4px"}}>
                      <button onClick={()=>plAdd(s)} disabled={!plSelected} title={plSelected?"Add to "+plSelected:"Select a playlist first"} style={{...plBtn,color:plSelected?"#4ade80":"#444"}}>+</button>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0}}>{s.replace(/\.[^.]+$/,'')}</span>
                    </div>
                  ))}
                  {!browseSongs.length && <div style={{padding:"2px 6px",color:"#555"}}>no files</div>}
                </div>
              </div>
              <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column"}}>
                <div style={{color:"#666",fontSize:10,marginBottom:2}}>{plSelected?("Tracks in \""+plSelected+"\""):"select or create a playlist"}</div>
                <div style={{overflowY:"auto",border:"1px solid #1a1d28",borderRadius:4}}>
                  {entries.map((s,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:4,padding:"1px 4px"}}>
                      <button onClick={()=>plMove(i,-1)} style={plBtn}>^</button>
                      <button onClick={()=>plMove(i,1)} style={plBtn}>v</button>
                      <button onClick={()=>plRemove(i)} style={{...plBtn,color:"#f87171"}}>x</button>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0}}>{musicFileOf(s).replace(/\.[^.]+$/,'')}</span>
                      <span style={{color:"#555",fontSize:9,flexShrink:0,marginLeft:"auto"}}>{(s.indexOf('::')>=0?s.slice(0,s.indexOf('::')):musicLib)}</span>
                    </div>
                  ))}
                  {plSelected && !entries.length && <div style={{padding:"2px 6px",color:"#555"}}>empty - add tracks from the left</div>}
                </div>
              </div>
            </div>
          </div>
          );
        })()}
        <div style={{ display:"flex", justifyContent:"center" }}>
          <button onClick={()=>setMenuOpen(v=>!v)} style={{ background:"transparent", color:"#555", border:"none", cursor:"pointer", fontSize:10, fontFamily:"inherit", padding:"2px 20px", lineHeight:1 }}>{menuOpen?"\u25B2":"\u25BC"}</button>
        </div>
      </div>}

      {/* LAYOUT: SocialBlade entry point - see LAYOUTS.md */}
      {view === "socialblade" && <>
      {/* LAYOUT: SocialBlade v1 entry point - see LAYOUTS.md */}
      {!showSBv2 && <>
      {/* - SocialBlade Layout (1280x720 fixed) - */}
      <div ref={containerRef} style={{ width:1280, height:720, background:sbDark?"#000":"#e6e9ec", position:"relative", overflow:"hidden", fontFamily:"Roboto, Arial, sans-serif", color:sbDark?"#fff":"#000", margin:"0 auto", zoom:scale, border:"none" }}>


        {/* Channel cards. Each PDP/TS card is a single self-contained unit
            (watermark + icon + name + counter + subtitle) rendered by
            sbChannelCard() above. Offsets and sizes for the two main
            channels are passed verbatim from the hand-tuned
            absolute-positioned layout. The TS card uses scale=1.035,
            including the watermark. */}
        {sbChannelCard({
          key: "pdp",
          left: _pdpCardLeft, top: _pdpCardTop, width: 544, height: 246, scale: _pdpCardScale,
          solidBackground: true,
          bgWatermark: {x: 18, y: -119, w: 511, h: 357},
          iconSrc: pdpIcon,
          iconPos: {x: 144, y: 12},
          namePos: {x: 216, y: 27},
          nameText: "PewDiePie",
          nameIcon: ytIcon,
          counterPos: {x: -3, y: 103},
          counterValue: displayPt,
          subtitlePos: {x: 53, y: 215},
        })}
        {sbChannelCard({
          key: "ts",
          left: _tsCardLeft, top: _tsCardTop, width: 561, height: 244, scale: _tsCardScale,
          solidBackground: true,
          bgWatermark: {x: 18, y: -117, w: 527, h: 350},
          iconSrc: tsIcon,
          iconPos: {x: 161, y: 0},
          namePos: {x: 232, y: 13},
          nameText: "T-Series",
          nameIcon: React.cloneElement(ytIcon, {style:{...ytIcon.props.style, width:22.8, height:19.7, left:1}}),
          counterPos: {x: -13, y: 90},
          counterValue: displayTt,
          subtitlePos: {x: 51, y: 202},
        })}

        {/* = PDP Sub Chart = */}
        <div style={{ position:"absolute", left:0, top:252, width:541, height:231, overflow:"hidden", background:`linear-gradient(to bottom, ${SB_CHART_BG} calc(100% - 80px), ${SB_AXIS_BG} calc(100% - 80px))` }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pdp1hData} margin={{top:5,right:10,bottom:20,left:10}}>
              <XAxis dataKey="t" type="number" domain={[tMinPdp1h, pdpTime]} allowDataOverflow ticks={ticksPdp1h} tickFormatter={fmt1hTick} stroke={sbDark?"#666":"#aaa"} tick={{fontSize:12,fontFamily:"Lucida Sans Unicode",fill:sbDark?"#999":"#555"}} axisLine={{stroke:sbDark?"#555":"#aaa"}} tickLine={{stroke:sbDark?"#666":"#aaa",strokeWidth:1}}/>
              <YAxis hide domain={[sDomPdp1h[0]-(sDomPdp1h[1]-sDomPdp1h[0])*0.22, sDomPdp1h[1]]} allowDataOverflow/>
              <Line type="monotone" dataKey="pt" stroke={salmon} dot={false} strokeWidth={3} isAnimationActive={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* = TS Sub Chart = */}
        <div style={{ position:"absolute", left:_tsCardLeft, top:256, width:561, height:231, overflow:"hidden", background:`linear-gradient(to bottom, ${SB_CHART_BG} calc(100% - 80px), ${SB_AXIS_BG} calc(100% - 80px))` }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ts1hData} margin={{top:5,right:10,bottom:20,left:10}}>
              <XAxis dataKey="t" type="number" domain={[tMinTs1h, tsTime]} allowDataOverflow ticks={ticksTs1h} tickFormatter={fmt1hTick} stroke={sbDark?"#666":"#aaa"} tick={{fontSize:12,fontFamily:"Lucida Sans Unicode",fill:sbDark?"#999":"#555"}} axisLine={{stroke:sbDark?"#555":"#aaa"}} tickLine={{stroke:sbDark?"#666":"#aaa",strokeWidth:1}}/>
              <YAxis hide domain={[sDomTs1h[0]-(sDomTs1h[1]-sDomTs1h[0])*0.22, sDomTs1h[1]]} allowDataOverflow/>
              <Line type="monotone" dataKey="tt" stroke={salmon} dot={false} strokeWidth={3} isAnimationActive={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Center column backdrop - bounds computed from card edges so it doesn't clip into PDP/TS */}
        {(()=>{ const cl=_pdpCardLeft+544*_pdpCardScale, cw=_tsCardLeft-cl; return (<>
          <div style={{ position:"absolute", left:cl, top:0, width:cw, height:480, background:SB_CENTER_BG, pointerEvents:"none" }}/>
          {!sbDark && <div style={{ position:"absolute", left:cl, top:381, width:cw, height:78, background:SB_CARD_BG, pointerEvents:"none" }}/>}
          {/* Race to 100M / Battle For #1 Most Subscribed - rendered after backdrop so it's on top */}
          {(()=>{const isBattle=curTime<Date.UTC(2019,2,21,10,0,0);return(<div style={{position:"absolute",left:cl+(cw-75)/2,top:15,width:75,height:133,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",fontFamily:"Arial, sans-serif",fontSize:isBattle?22:31,color:"#fff",lineHeight:1.15}}>{isBattle?<>Battle<br/>For<br/>#1<br/>Most<br/>Subscribed</>:<>Race<br/>to<br/>100M<br/>Subs</>}</div>);})()}
        </>); })()}

        {/* = Upper Sub Gap = */}
        <div style={{ position:"absolute", left:546, top:155, width:172, height:106 }}>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={gap1dData} margin={{top:2,right:2,bottom:2,left:2}}>
              <XAxis dataKey="t" type="number" domain={[tMinGap1d, gapTime]} allowDataOverflow hide/>
              <YAxis hide domain={sDomGap1d} allowDataOverflow/>
              <Line type="monotone" dataKey="g" stroke="#daeeff" dot={false} strokeWidth={1.3} isAnimationActive={false}/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{ textAlign:"center", fontFamily:"Arial, sans-serif", fontSize:12, color:"#fff", marginTop:-5, position:"relative", left:3 }}>1 Day Sub Gap</div>
        </div>

        {/* = Lower Sub Gap = */}
        <div style={{ position:"absolute", left:546, top:262, width:172, height:106 }}>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={gap1hData} margin={{top:2,right:2,bottom:2,left:2}}>
              <XAxis dataKey="t" type="number" domain={[tMinGap1h, gapTime]} allowDataOverflow hide/>
              <YAxis hide domain={sDomGap1h} allowDataOverflow/>
              <Line type="monotone" dataKey="g" stroke="#daeeff" dot={false} strokeWidth={1.3} isAnimationActive={false}/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{ textAlign:"center", fontFamily:"Arial, sans-serif", fontSize:13, color:"#fff", marginTop:-2, position:"relative", left:6 }}>1hr Sub Gap</div>
        </div>

        {/* SB Sub Count - same component as the main cards, downscaled to 0.375.
            Downscale factor derived from the SB block's pre-unification
            dimensions: 19/50 icon, 12/32 name, 36/95 counter all sit at
            ~0.375. Wrapper dimensions in unscaled coords are 130/0.375 ~= 347
            and 60/0.375 = 160 so visualSize = unscaledSize * 0.375 matches
            the previous 130x60 footprint. Offsets are likewise in unscaled
            coords. No bgWatermark and no subtitle (subtitlePos omitted).
            ytIcon at scale 0.375 renders ~8x7, matching ytIconSmall. */}
        {sbChannelCard({
          key: "sb",
          left: 580, top: 379, width: 451, height: 208, scale: 0.375, contentScale: 1,
          iconSrc: sbIcon,
          iconPos: {x: 2.67, y: 8},
          namePos: {x: 64, y: 21.33},
          nameText: "Social Blade",
          nameIcon: ytIcon,
          counterPos: {x: -84, y: 98.67},
          counterValue: displaySB,
          bgWatermark: {x: 80, y: -53, w: 386, h: 266},
          bgWatermarkBelow: true,
          bgExtendLeft: 580 - (_pdpCardLeft + 544*_pdpCardScale),
          bgClipW: _tsCardLeft - 580,
        })}

        {/* = Sub Gap Text = */}
        <div style={{ position:"absolute", left:812, top:456, fontFamily:"Times New Roman, serif", color:"#fff", zIndex:10, whiteSpace:"nowrap", overflow:"visible" }}>
          <span ref={gapLabelRef} style={{ background:SB_BOTTOM_BG, color:sbDark?"#fff":"#000", lineHeight:1, fontSize:36, display:"inline-block", transformOrigin:"left center", transform:`scaleX(${gapLabelScale})` }}>{gapLabel}</span>
        </div>

        {/* = Historical Gap Chart = */}
        <div style={{ position:"absolute", left:698, top:501, width:572, height:241, overflow:"hidden", zIndex:10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={histGapData} margin={{top:5,right:15,bottom:20,left:60}}>
              <CartesianGrid vertical={false} stroke={sbDark?"#D0D0D0":"#ddd"}/>
              <XAxis dataKey="t" type="number" domain={[tMinHist, gapTime]} allowDataOverflow ticks={ticksHist} tickFormatter={fmtHistTick} stroke={sbDark?"#D0D0D0":"#ddd"} tick={{fontSize:10,fontFamily:"Lucida Sans Unicode",fill:sbDark?lightGray:"#777"}} axisLine={false} tickLine={{stroke:sbDark?"#D0D0D0":"#ddd",strokeWidth:1}} tickSize={6}/>
              <YAxis tick={{fontSize:10,fontFamily:"Lucida Sans Unicode",fill:sbDark?lightGray:"#777"}} axisLine={false} tickLine={false} tickFormatter={v=>v===0?"0":v.toLocaleString()} domain={histGapAxis.domain} ticks={histGapAxis.ticks} allowDataOverflow/>
              <Line type="monotone" dataKey="g" stroke={gapBlue} dot={false} strokeWidth={2} isAnimationActive={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom half background: tables + historical gap chart */}
        <div style={{ position:"absolute", left:0, top:456, width:1280, height:264, background:SB_BOTTOM_BG, pointerEvents:"none" }}/>

        {/* = Subs/Min Table (with milestone prediction rows) = */}
        <div style={{ position:"absolute", left:0, top:456, width:747, height:131, zIndex:10 }}>
          <table style={{ borderCollapse:"collapse", fontFamily:"Times New Roman, serif", fontSize:15, color:sbDark?"#fff":"#000", tableLayout:"fixed" }}>
            <thead><tr>
              {["Avg\nSubs/Min","1 min\navg","5 min\navg","1 hr\navg","12 hr\navg","1 day\navg","2 day\navg","3 day\navg","5 day\navg","7 day\navg","14 day\navg","30 day\navg"].map((h,i)=>
                <th key={i} style={{...cellStyle(i===0?83:60,37,"center",sbDark),fontWeight:"bold",whiteSpace:"pre-line",lineHeight:1.2,verticalAlign:"middle",fontSize:15}}>{h}</th>
              )}
            </tr></thead>
            <tbody>
              {(() => { const lbs=[1/60,5/60,1,12,24,48,72,120,168,336,720]; return (<>
              <tr>{["PewDiePie",...subsPerMinTable.pdp.map((v,i)=>fmtSpm(v,lbs[i]))].map((v,i)=><td key={i} style={cellStyle(i===0?83:60,21,"left",sbDark)}>{v}</td>)}</tr>
              <tr>{["T-Series",...subsPerMinTable.ts.map((v,i)=>fmtSpm(v,lbs[i]))].map((v,i)=><td key={i} style={cellStyle(i===0?83:60,21,"left",sbDark)}>{v}</td>)}</tr>
              </>); })()}
              {sbOvertake ? (() => {
                const fmtOT = (ri) => {
                  const pr = Math.round(subsPerMinTable.pdp[ri]), tr = Math.round(subsPerMinTable.ts[ri]);
                  const otGap = tableDisplayPt != null && tableDisplayTt != null ? tableDisplayPt - tableDisplayTt : currentGap;
                  if (otGap != null && otGap <= 0) return "Passed";
                  if (subsPerMinTable.pdp[ri] == null || subsPerMinTable.ts[ri] == null || otGap == null || tr <= pr) return "";
                  const otMs = tableTime + (otGap / (tr - pr)) * 60000;
                  const off = _getEasternOffset(otMs);
                  const d = new Date(otMs + off * 3600000);
                  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()];
                  const h = d.getUTCHours(), h12 = h % 12 || 12, ap = h < 12 ? 'am' : 'pm';
                  return `${mon} ${String(d.getUTCDate()).padStart(2,'0')} ${h12}${ap}`;
                };
                const wrapCell = (cs) => ({ ...cs, whiteSpace:"normal", lineHeight:1.2, height:42, maxHeight:42, verticalAlign:"middle", padding:"1px 3px" });
                return (
                  <tr>
                    <td colSpan={5} style={wrapCell({...cellStyle(323,42,"left",sbDark), fontWeight:"bold", fontSize:15})}>T-Series Passes PewDiePie Estimate<br/>(Time Zone ET)</td>
                    {[4,5,6,7,8,9,10].map(ri => (
                      <td key={ri} style={wrapCell({...cellStyle(60,42,"left",sbDark), fontWeight:"bold", fontSize:15})}>{fmtOT(ri)}</td>
                    ))}
                  </tr>
                );
              })() : (
              <tr>
                <td colSpan={6} style={{...cellStyle(383,21,"left",sbDark),fontSize:15}}>{tableDisplayPt!=null&&tableDisplayPt<99000000?`PewDiePie to 100M by: ${fmtEta(pdp100Eta)}`:""}</td>
                <td colSpan={6} style={{...cellStyle(360,21,"left",sbDark),fontSize:15}}>{tableDisplayTt!=null&&tableDisplayTt<99000000?`T-Series to 100M by: ${fmtEta(ts100Eta)}`:""}</td>
              </tr>
              )}
              <tr>
                <td colSpan={6} style={{...cellStyle(383,21,"left",sbDark),fontSize:15}}>PewDiePie to {pdpNextMs!=null?(pdpNextMs/1e6).toFixed(0)+"M":"\u2014"} by: {fmtEta(pdpMsEta)}</td>
                <td colSpan={6} style={{...cellStyle(360,21,"left",sbDark),fontSize:15}}>T-Series to {tsNextMs!=null?(tsNextMs/1e6).toFixed(0)+"M":"\u2014"} by: {fmtEta(tsMsEta)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* = Audit Table = */}
        <div style={{ position:"absolute", left:sbOvertake?497:479, top:sbOvertake?606:593, width:232, height:58, zIndex:10, transform:sbOvertake?"scale(0.88)":"none", transformOrigin:"top left" }}>
          <table style={{ borderCollapse:"collapse", fontFamily:"Times New Roman, serif", fontSize:13, color:sbDark?"#fff":"#000", lineHeight:"17px" }}>
            <thead><tr>
              <th style={{...auditCellStyle("center",sbDark),fontWeight:"bold"}}>Name</th>
              <th style={{...auditCellStyle("center",sbDark),fontWeight:"bold"}}>Audit Time (USA ET)</th>
              <th style={{...auditCellStyle("center",sbDark),fontWeight:"bold"}}>Change</th>
            </tr></thead>
            <tbody>
              <tr><td style={auditCellStyle("left",sbDark)}>PewDiePie</td><td style={auditCellStyle("left",sbDark)}>{auditDisplay.pdp?.time||""}</td><td style={auditCellStyle("left",sbDark)}>{fmtAuditChange(auditDisplay.pdp?.change)}</td></tr>
              <tr><td style={auditCellStyle("left",sbDark)}>T-Series</td><td style={auditCellStyle("left",sbDark)}>{auditDisplay.ts?.time||""}</td><td style={auditCellStyle("left",sbDark)}>{fmtAuditChange(auditDisplay.ts?.change)}</td></tr>
            </tbody>
          </table>
        </div>

        {/* = Time Zones = */}
        {(() => {
          const zones = [
            { title: "Social Blade HQ", flagCode: "us", city: "Raleigh",   getOffset: _getEasternOffset },
            { title: "PewDiePie HQ",    flagCode: "gb", city: "Brighton",  getOffset: _getUKOffset },
            { title: "T-Series HQ",     flagCode: "in", city: "New Delhi", getOffset: () => 5.5 },
          ];
          const containerLeft = 0, containerTop = 610, containerWidth = 475;
          const frameWidth = 150, frameHeight = 80;
          const gap = (containerWidth - frameWidth * zones.length) / (zones.length - 1);
          return (
            <div style={{ position:"absolute", left:containerLeft, top:containerTop, width:containerWidth, height:frameHeight, zIndex:10 }}>
              {zones.map((z, i) => (
                <div key={z.title}
                  style={{
                    position:"absolute",
                    left: i * (frameWidth + gap),
                    top: 0,
                    width: frameWidth,
                    height: frameHeight,
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"space-between",
                    alignItems:"flex-start",
                    padding:"6px 8px 8px",
                    boxSizing:"border-box",
                    whiteSpace:"nowrap",
                  }}>
                  <div style={{ fontFamily:"Arial, sans-serif", fontSize:14, fontStyle:"italic", color:sbDark?medGray:"#555", lineHeight:1 }}>
                    {z.title}
                  </div>
                  <div style={{ fontFamily:"Arial, sans-serif", fontSize:16, fontWeight:700, color:sbDark?medGray:"#555", lineHeight:1, display:"flex", alignItems:"center", gap:6 }}>
                    <img src={`https://c.tadst.com/gfx/n/fl/32/${z.flagCode}.png`} style={{ height:16, display:"inline-block", boxShadow:"0 0 1px rgba(0,0,0,0.4)" }}/>
                    <span>{z.city}</span>
                  </div>
                  <div style={{ fontFamily:"Arial, sans-serif", fontSize:14, color:sbDark?medGray:"#555", lineHeight:1 }}>
                    {fmtSBTime(clockTime, z.getOffset(clockTime))}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* SB Header Logo */}
        <img src={sbLogo} style={{ position:"absolute", left:480, top:658, width:240, height:62.2 }} alt=""/>

      </div>
      </>}

      {/* ----- SocialBlade V2 Layout (active after May 20 19:30 EDT) ----- */}
      {/* LAYOUT: SocialBlade v2 entry point - see LAYOUTS.md */}
      {showSBv2 && (() => {
        // V2 CONFIG - all layout constants here; nothing hardcoded below
        const V2 = {
          badgeW: 195, badgeH: 45, badgeRadius: 5, badgeColor: "#d3602d",
          pfpDiam: 40,       // circle diameter = 40px
          pfpOffX: 30,       // PFP center X offset from badge left edge
          subFontSize: 88,   // 66pt converted to CSS px
          subFontW: 700,     // match old sbChannelCard weight
          subOffY: 4,        // px gap: badge bottom to sub counter top
          subAreaH: 80,      // approx rendered height of sub counter
          chartOffX: 244, chartOffY: -12,  // mini chart TL relative to badge TL
          chartW: 188, chartH: 60,
          sepX: 942,
          orange: "#c24928",
          gray: "#373737",
          blocks: showTsOverMode ? [
            { label:"T-SERIES",  labelPx:20, badgeLeft:53, badgeTop:41,  pfpSrc:tsIcon,    value:displayTt,    data1h:ts1hData,   dataKey:"tt", domY:sDomTs1h,    xMin:tMinTs1h,   xMax:tsTime  },
            { label:"PEWDIEPIE", labelPx:19, badgeLeft:53, badgeTop:262, pfpSrc:pdpIcon,   value:displayPt,    data1h:pdp1hData,  dataKey:"pt", domY:sDomPdp1h,   xMin:tMinPdp1h,  xMax:pdpTime },
          ] : [
            { label:"PEWDIEPIE", labelPx:19, badgeLeft:53, badgeTop:41,  pfpSrc:pdpIcon,   value:displayPt,    data1h:pdp1hData,  dataKey:"pt", domY:sDomPdp1h,   xMin:tMinPdp1h,  xMax:pdpTime },
            { label:"T-SERIES",  labelPx:20, badgeLeft:53, badgeTop:262, pfpSrc:tsIcon,    value:displayTt,    data1h:ts1hData,   dataKey:"tt", domY:sDomTs1h,    xMin:tMinTs1h,   xMax:tsTime  },
          ],
          tblLeft: 943, tblTop: 185,
          tblHdrH: 38, tblRowH: 24,
          tblRows: ["1 min avg","5 min avg","1 hr avg","12 hr avg","1 day avg","2 day avg","3 day avg","5 day avg","7 day avg","14 day avg","30 day avg"],
        };
        // LAYOUT: SocialBlade v2 render body - see LAYOUTS.md
        return (
        <div ref={containerRef} style={{ width:1280, height:720, background:sbDark?"#000":"#fff", position:"relative", overflow:"hidden", fontFamily:"Roboto, Arial, sans-serif", color:sbDark?"#fff":"#000", margin:"0 auto", zoom:scale, border:"none" }}>

          {/* Center column dark backdrop (light mode only) - keeps gap charts dark */}
          {!sbDark && <div style={{ position:"absolute", left:473, top:0, width:469, height:720, background:"#000", pointerEvents:"none" }}/>}

          {/* === LEFT COLUMN: Channel Blocks === */}
          {V2.blocks.map((blk) => {
            const pfpCX   = blk.badgeLeft + V2.pfpOffX;
            const pfpCY   = blk.badgeTop  + V2.badgeH / 2;
            const pfpR    = V2.pfpDiam / 2;
            const subTop  = blk.badgeTop + V2.badgeH + V2.subOffY;
            return (
              <React.Fragment key={blk.label}>
                {/* SB watermark - clip box: text width (473) + 20px padding each side, 10px above, 20px below */}
                <div style={{ position:"absolute", left:blk.badgeLeft - 40, top:subTop, width:513, height:118, overflow:"hidden", zIndex:0, pointerEvents:"none" }}>
                  {sbWatermark(20, -195, 473, 330, sbDark)}
                </div>
                {/* Badge rectangle */}
                <div style={{ position:"absolute", left:blk.badgeLeft, top:blk.badgeTop, width:V2.badgeW, height:V2.badgeH, borderRadius:V2.badgeRadius, background:V2.badgeColor, zIndex:2 }}>
                  {/* Channel name - right of PFP */}
                  <div style={{ position:"absolute", left:54, top:0, right:4, bottom:0, display:"flex", alignItems:"center", fontFamily:"Roboto, sans-serif", fontWeight:900, fontSize:blk.labelPx, color:"#fff", letterSpacing:0.5, textShadow:"0 1px 3px rgba(0,0,0,0.5)" }}>
                    {blk.label}
                  </div>
                </div>
                {/* PFP circle (overlaps badge vertically) */}
                <div style={{ position:"absolute", left:pfpCX - pfpR, top:pfpCY - pfpR, width:V2.pfpDiam, height:V2.pfpDiam, borderRadius:"50%", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.7)", zIndex:3 }}>
                  <img src={blk.pfpSrc} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} alt=""/>
                </div>
                {/* Sub counter */}
                <div style={{ position:"absolute", left:blk.badgeLeft - 40, top:subTop + 10, width:V2.badgeW, fontFamily:"Roboto, sans-serif", fontWeight:V2.subFontW, fontSize:V2.subFontSize, color:sbDark?"#fff":"#111", textAlign:"center", lineHeight:1, letterSpacing:-1, zIndex:2 }}>
                  {blk.value != null ? renderCounter(blk.value) : <span style={{opacity:0.3}}>-</span>}
                </div>
                {/* 60m mini chart - per-channel total subs */}
                {blk.data1h != null && (
                  <div style={{ position:"absolute", left:blk.badgeLeft + V2.chartOffX, top:blk.badgeTop + V2.chartOffY, width:V2.chartW, height:V2.chartH, zIndex:2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={blk.data1h} margin={{top:1,right:1,bottom:1,left:1}}>
                        <XAxis dataKey="t" type="number" domain={[blk.xMin, blk.xMax]} allowDataOverflow hide/>
                        <YAxis hide domain={blk.domY} allowDataOverflow/>
                        <Line type="monotone" dataKey={blk.dataKey} stroke={salmon} dot={false} strokeWidth={1} isAnimationActive={false}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* === ORANGE SEPARATOR LINES === */}
          <div style={{ position:"absolute", left:547, top:367, width:V2.sepX - 547, height:1, background:V2.orange }}/>
          <div style={{ position:"absolute", left:V2.sepX, top:0, width:1, height:720, background:V2.orange }}/>

          {/* === MIDDLE COLUMN BOTTOM: PDP/TS gap === */}
          <div style={{ position:"absolute", left:587, top:381, fontFamily:"Roboto, sans-serif", fontWeight:400, fontSize:13, color:"#fff" }}>1hr Sub Gap</div>
          <div style={{ position:"absolute", left:764, top:381, fontFamily:"Roboto, sans-serif", fontWeight:400, fontSize:13, color:"#fff" }}>1 Day Sub Gap</div>
          <div style={{ position:"absolute", left:570, top:403, width:175, height:75 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gap1hData} margin={{top:1,right:1,bottom:1,left:1}}>
                <XAxis dataKey="t" type="number" domain={[tMinGap1h, gapTime]} allowDataOverflow hide/>
                <YAxis hide domain={sDomGap1h} allowDataOverflow/>
                <Line type="monotone" dataKey="g" stroke="#fff" dot={false} strokeWidth={1.3} isAnimationActive={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ position:"absolute", left:756, top:403, width:175, height:75 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gap1dData} margin={{top:1,right:1,bottom:1,left:1}}>
                <XAxis dataKey="t" type="number" domain={[tMinGap1d, gapTime]} allowDataOverflow hide/>
                <YAxis hide domain={sDomGap1d} allowDataOverflow/>
                <Line type="monotone" dataKey="g" stroke="#fff" dot={false} strokeWidth={1.3} isAnimationActive={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ position:"absolute", left:550, top:483, fontFamily:"Roboto, sans-serif", fontWeight:500, fontSize:21, color:"#fff" }}>PDP/TS Sub Gap: {gapLabel.replace(/^Sub Gap: /,"")}</div>
          <div style={{ position:"absolute", left:476, top:516, width:469, height:234, overflow:"hidden" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={histGapData} margin={{top:0,right:10,bottom:20,left:55}}>
                <CartesianGrid vertical={false} stroke="#D0D0D0"/>
                <XAxis dataKey="t" type="number" domain={[tMinHist, gapTime]} allowDataOverflow ticks={ticksHist} tickFormatter={fmtHistTick} stroke="#D0D0D0" tick={{fontSize:7,fontFamily:"Lucida Sans Unicode",fill:lightGray}} axisLine={false} tickLine={{stroke:"#D0D0D0",strokeWidth:1}} tickSize={5}/>
                <YAxis tick={{fontSize:7,fontFamily:"Lucida Sans Unicode",fill:lightGray}} axisLine={false} tickLine={false} tickFormatter={v=>v===0?"0":v.toLocaleString()} domain={histGapAxis.domain} ticks={histGapAxis.ticks} allowDataOverflow/>
                <Line type="monotone" dataKey="g" stroke={gapBlue} dot={false} strokeWidth={2} isAnimationActive={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* === RIGHT COLUMN === */}
          {/* SB Header Logo */}
          <div style={{ position:"absolute", left:944, top:0, width:336, height:185, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
            <img src={sbLogoV2} style={{ width:"100%", height:"100%", objectFit:"contain" }} alt=""/>
          </div>
          {/* Stats table */}
          {(() => {
            const tblW = 337;
            const tblStyle = { borderCollapse:"separate", borderSpacing:0, tableLayout:"fixed", width:tblW, fontFamily:"Roboto, sans-serif", color:sbDark?"#fff":"#000" };
            const bw = `${scale}px`;
            const cellS = (ri, ci) => ({ textAlign:"left", padding:"0 3px", fontSize:12, background: sbDark ? (ri % 2 === 0 ? "#000" : V2.gray) : (ri % 2 === 0 ? "#fff" : "#f0f0f0"), height:V2.tblRowH, lineHeight:V2.tblRowH+"px", overflow:"hidden", whiteSpace:"nowrap", borderTop: ri === 0 ? `${bw} solid #161616` : "none", borderLeft: ci === 0 ? `${bw} solid #161616` : "none", borderRight:`${bw} solid #161616`, borderBottom:`${bw} solid #161616` });
            const fmtPredDate = (ts) => {
              const d = new Date(ts);
              const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              const h = d.getUTCHours(), h12 = h % 12 || 12, ampm = h < 12 ? 'am' : 'pm';
              return `${months[d.getUTCMonth()]} ${d.getUTCDate()} ${h12}${ampm}`;
            };
            const predEta = (ri) => {
              if (ri < 4) return "";
              if (!showMidMode) return "";
              // TS Pass PDP
              const chaserRate = subsPerMinTable.ts[ri];
              const targetRate = subsPerMinTable.pdp[ri];
              const gap = currentGap;
              if (chaserRate == null || targetRate == null || gap == null) return "";
              const cr = minuteSnap ? Math.round(chaserRate) : chaserRate;
              const tr = minuteSnap ? Math.round(targetRate) : targetRate;
              if (cr <= tr || gap <= 0) return "";
              return fmtPredDate(curTime + (gap / (cr - tr)) * 60000);
            };
            const passLabel = "TS Pass PDP";
            const headers = ["Subs/min","PewDiePie","T-Series", passLabel];
            const charPx = 7, charPad = 10;
            const maxRowLen = Math.max(...V2.tblRows.map(r => r.length));
            const rawW = headers.map((h,i) => (i === 0 ? Math.max(h.length, maxRowLen) : h.length) * charPx + charPad);
            const rawTotal = rawW.reduce((a,b) => a+b, 0);
            const colW = rawW.map(w => Math.round(w / rawTotal * tblW));
            colW[colW.length-1] += tblW - colW.reduce((a,b) => a+b, 0);
            return (
            <div style={{ position:"absolute", left:V2.tblLeft, top:V2.tblTop, width:tblW }}>
              <table style={tblStyle}>
                <colgroup>{colW.map((w,i) => <col key={i} style={{width:w}}/>)}</colgroup>
                <thead>
                  <tr style={{ height:V2.tblHdrH, background:V2.orange }}>
                    {headers.map((h,i) => (
                      <th key={i} style={{ fontWeight:500, textAlign:"left", fontSize:12, padding:"0 2px", verticalAlign:"middle", fontFamily:"Roboto, sans-serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {V2.tblRows.map((label, ri) => (
                    <tr key={ri}>
                      <td style={cellS(ri, 0)}>{label}</td>
                      <td style={cellS(ri, 1)}>{subsPerMinTable.pdp[ri] != null ? fmtSpm(subsPerMinTable.pdp[ri]) : "-"}</td>
                      <td style={cellS(ri, 2)}>{subsPerMinTable.ts[ri]  != null ? fmtSpm(subsPerMinTable.ts[ri])  : "-"}</td>
                      <td style={cellS(ri, 3)}>{predEta(ri)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            );
          })()}
          {/* Milestone predictions */}
          <div style={{ position:"absolute", left:1010, top:518, fontFamily:"Roboto, sans-serif", fontWeight:500, fontSize:13, color:sbDark?"#fff":"#111" }}>
            PewDiePie to {pdpNextMs != null ? (pdpNextMs/1e6).toFixed(0)+"M" : "-"} by: {fmtEta(pdpMsEta)}
          </div>
          <div style={{ position:"absolute", left:1010, top:535, fontFamily:"Roboto, sans-serif", fontWeight:500, fontSize:13, color:sbDark?"#fff":"#111" }}>
            T-Series to {tsNextMs != null ? (tsNextMs/1e6).toFixed(0)+"M" : "-"} by: {fmtEta(tsMsEta)}
          </div>
          {/* SB bottom counter - same sbChannelCard structure as v1, repositioned */}
          {sbChannelCard({
            key: "sb-v2",
            left: 1010, top: 573, width: 451, height: 208, scale: 0.7, contentScale: 1,
            iconSrc: sbIcon,
            iconPos: {x: 2.67, y: 8},
            namePos: {x: 64, y: 21.33},
            nameText: "Social Blade",
            nameIcon: ytIcon,
            counterPos: {x: -84, y: 98.67},
            counterValue: displaySB,
            bgWatermark: {x: -30, y: -72, w: 429, h: 295},
          bgWatermarkBelow: true,
          bgClipW: 128,
          })}

        </div>
        );
      })()}

      </>}

      {/* - Flare View - */}
      {/* LAYOUT: Flare entry point - see LAYOUTS.md */}
      {view === "flare" && (() => {
        // Per-frame Flare lead-time lookup: binary search the precomputed
        // crossings array for the last timestamp ≤ clockTime. O(log N),
        // no rescanning, no cached ref. `gapCrossings` is built lazily
        // by the useEffect above when this view (or the dashboard) is
        // visible.
        let flareLeadMs = null;
        if (displayPt != null && displayTt != null && gapCrossings.length > 0) {
          let lo = 0, hi = gapCrossings.length - 1, best = -1;
          while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (gapCrossings[mid] <= clockTime) { best = mid; lo = mid + 1; }
            else { hi = mid - 1; }
          }
          const crossT = best >= 0 ? gapCrossings[best] : REAL_DATA_START_MS;
          flareLeadMs = Math.floor((clockTime - crossT) / 1000) * 1000;
        }
        // LAYOUT: Flare render body - see LAYOUTS.md
        return (
        <div style={{
          width: 1280, height: 720,
          // Using `zoom` rather than `transform: scale()` so the browser
          // re-rasterises text at the final visual size. transform:scale
          // renders text at the internal 1280x720 coordinate space and then
          // stretches the resulting raster, which splits every glyph's
          // real-pixel position by the scale factor and produces the
          // inconsistent inter-digit gaps at non-1:1 zoom. zoom instead
          // rescales the coordinate system itself - internal px becomes
          // zoomxpx at the device, and text shaping/hinting runs at the
          // final size, so spacing stays coherent at any scale. The 1280x720
          // layout coords remain intact (absolute positioning inside
          // FlareView is unaffected); only the outer coordinate space is
          // zoomed.
          zoom: scale,
          margin: "0 auto",
          border: "none",
        }}>
          <FlareView
            displayPt={displayPt}
            displayTt={displayTt}
            currentGap={currentGap}
            pdpLeading={pdpLeading}
            clockTime={clockTime}
            seekToken={seekToken}
            displayFTV={displayFTV}
            isRTMode={isRTMode}
            rtPeriodSec={rtPeriodSec}
            dark={flareDark}
            extraInfo={flareExtraInfo}
            subsPerMinTable={subsPerMinTable}
            leadMs={flareLeadMs}
            mult={effectiveMult}
            playing={pb.playing}
            scale={scale}
            rareBannerUpd={rareBannerUpd}
          />
        </div>
        );
      })()}

      {/* - Dashboard View - */}
      {/* LAYOUT: Dashboard entry point - see LAYOUTS.md */}
      {view === "dashboard" && (() => {
        const barH = barHidden ? 0 : (document.querySelector('[data-controlbar]')?.offsetHeight || 0);
        const normalMilestoneEl = <DashMilestone pdpSubs={mileDisplayPt} tsSubs={mileDisplayTt} pdpDaily={predRatePdp} tsDaily={predRateTs} curTime={curTime} dc={eDC} duration={isRTMode?dur:0} seekToken={seekToken} altLayout={false}/>;
        const dashMilestoneEl = normalMilestoneEl;
        if (dashShowCharts) {
          return renderDualDashboard({
            barH,
            chanA:{ icon:pdpIcon, name:"PewDiePie", color:eDC.PDP, display:displayPt,
              rateLabels:["1 Min","1 Hour","1 Day"],
              rates:[subsPerMinTable.pdp[0]!=null?Math.round(subsPerMinTable.pdp[0]):null, subsPerMinTable.pdp[2]!=null?Math.round(subsPerMinTable.pdp[2]*60):null, subsPerMinTable.pdp[4]!=null?Math.round(subsPerMinTable.pdp[4]*1440):null] },
            chanB:{ icon:tsIcon, name:"T-Series", color:eDC.TS, display:displayTt,
              rateLabels:["1 Min","1 Hour","1 Day"],
              rates:[subsPerMinTable.ts[0]!=null?Math.round(subsPerMinTable.ts[0]):null, subsPerMinTable.ts[2]!=null?Math.round(subsPerMinTable.ts[2]*60):null, subsPerMinTable.ts[4]!=null?Math.round(subsPerMinTable.ts[4]*1440):null] },
            gap:currentGap, leadingIsA:pdpLeading, renderGap:dashRenderGap,
            diffLabel:"Subscriber Difference", aheadLabel:"Channel Ahead",
            aheadName:pdpLeading?"PewDiePie":"T-Series", leadDuration:fmtLeadDuration(dashLeadMs),
            subsLabel:"Subscribers", showRates:!flareHides("rateDisplays"),
            chartCfg:{ gainData:appMode==='real'?rdDashGainData:dashGainData, dataStart:appMode==='real'?REAL_DATA_START_MS:RAW[0].t,
              lineA:{key:'gp',color:eDC.PDP,name:'PDP'}, lineB:{key:'gt',color:eDC.TS,name:'T-S'},
              auditMarks: effectiveFilterAudits ? [{ch:'pdp',color:eDC.PDP},{ch:'ts',color:eDC.TS}] : null,
              gainLabels:GAIN_CHARTS.map(g=>g[2]),
              skGain:'xg',skDGain:'dg',skGap:'xgap',skDGap:'dgap',gapName:'Gap',
              totalData:appMode==='real'?rdDashTotalData:dashTotalData,
              totalLineA:{key:'pt',color:eDC.PDP,name:'PewDiePie'}, totalLineB:{key:'tt',color:eDC.TS,name:'T-Series'},
              totalGapKey:'g',totalGapName:'Gap',
              totalTitle:'Total Subscribers',gapTitle:'Subscriber Gap',
              skTot:'xtot',skDTot:'dtot',skXGapTot:'xgaptot',skDGapTot:'dgaptot',
              exactA:displayPt, exactB:displayTt, exactGap:currentGap,
              valAt:(t)=>{ const v=_altPdpTsAt(t, rtPeriodSec, useNoise); return v ? {a:v.pt, b:v.tt} : null; },
              altData:{ gainData:altGainData, gapData:altGapData, totalData:altTotalData } },
            pairedLabels:dashAltLayout?["1hr Gap","24hr Gap"]:["10min Gap","1hr Gap","24hr Gap"],
            legendItems:[{color:eDC.PDP,label:"PewDiePie"},{color:eDC.TS,label:"T-Series"},{color:"#e2e5eb",label:"Gap (PDP - TS)"}],
            altLayout:dashAltLayout,
            milestoneEl:dashMilestoneEl,
            timezonesEl:!flareHides("timezones")&&(curPoint?.t||tzDisplayMs)?(<div style={{textAlign:"left",fontSize:16,color:eDC.TEXT,fontVariantNumeric:"tabular-nums"}}>
              {TIMEZONES.map(z=>{const off=z.getOffset(tzDisplayMs);const label=z.label==="EST"?(off===-4?"EDT":"EST"):z.label==="GMT"?(off===1?"BST":"GMT"):z.label;const d=new Date(tzDisplayMs+off*3600000);const dateStr=d.toLocaleDateString("en-US",{timeZone:"UTC",weekday:"short",month:"long",day:"numeric",year:"numeric"});const timeStr=String(d.getUTCHours()).padStart(2,"0")+":"+String(d.getUTCMinutes()).padStart(2,"0")+":"+String(d.getUTCSeconds()).padStart(2,"0");return(<div key={z.label} style={{marginBottom:3}}><div>{dateStr}</div><div><span style={{color:eDC.TEXT,fontWeight:600}}>{timeStr}{" "}{label}</span>{" "}<span style={{fontSize:14,fontFamily:"'Twemoji Country Flags',Arial,sans-serif"}}>{z.flag}</span></div></div>);})}
            </div>):null,
          });
        }
        // LAYOUT: Dashboard no-charts fallback entry point - see LAYOUTS.md
        return (
        <div style={{ background:eDC.BG, color:eDC.TEXT, fontFamily:dashFont, width:"100%", height:"calc(100vh - "+barH+"px)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:0, overflow:"hidden", padding:"0 32px" }}>
            <div ref={dashScoreRef} style={{
              zoom: dashScoreScale,
              ...(!dashShowCharts && dashTargetH > 0 ? {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                minHeight: dashTargetH + "px",
              } : {}),
            }}>
            {(() => { const nc = !dashShowCharts;
            const maxSubVal = Math.max(displayPt ?? 0, displayTt ?? 0);
            const subDigits = maxSubVal > 0 ? Math.floor(Math.log10(maxSubVal)) + 1 : 8;
            const counterFontSize = 62;
            return (<>
            {nc && !flareHides("channelAhead") && <div style={{ textAlign:"center", padding:"8px 0" }}>
              <div style={{ fontSize:9, color:eDC.DIM, marginBottom:2 }}>Channel Ahead</div>
              <div style={{ fontSize:16, fontWeight:700, color:pdpLeading?eDC.PDP:eDC.TS, marginBottom:1 }}>{pdpLeading?"PewDiePie":"T-Series"}</div>
              <div style={{ fontSize:11, color:eDC.TEXT, fontVariantNumeric:"tabular-nums" }}>{fmtLeadDuration(dashLeadMs)}</div>
            </div>}

            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"10px 8px 8px", gap:0, flexShrink:0, maxWidth:1100, margin:"0 auto", width:"100%" }}>
              {/* PDP */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                <img src={pdpIcon} alt="PDP" style={{ width:100, height:100, borderRadius:"50%", border:"4px solid "+eDC.PDP, objectFit:"cover" }}/>
                <div style={{ position:"relative", marginTop:2 }}>
                  {pdpLeading && <span style={{ position:"absolute", left:"100%", top:"50%", transform:"translateY(-50%)", marginLeft:6, fontSize:28 }}>👑</span>}
                  <div style={{ fontSize:34, fontWeight:700, color:eDC.PDP, lineHeight:1.1 }}>PewDiePie</div>
                </div>
                <div className="sub-count" style={{ fontSize:counterFontSize, fontWeight:800, fontVariantNumeric:"tabular-nums", color:eDC.TEXT, letterSpacing:0, lineHeight:1, marginTop:0 }}>
                  {dashRenderCounter(displayPt)}
                </div>
                <div style={{ fontSize:16, color:eDC.DIM, marginTop:0 }}>Subscribers</div>
                {!flareHides("rateDisplays") && <div style={{ display:"flex", gap:0, marginTop:6 }}>
                  <DashRateDisplay label="1 Min" value={subsPerMinTable.pdp[0]!=null?Math.round(subsPerMinTable.pdp[0]):null} color={eDC.PDP} dc={eDC}/>
                  <DashRateDisplay label="1 Hour" value={subsPerMinTable.pdp[2]!=null?Math.round(subsPerMinTable.pdp[2]*60):null} color={eDC.PDP} dc={eDC}/>
                  <DashRateDisplay label="1 Day" value={subsPerMinTable.pdp[4]!=null?Math.round(subsPerMinTable.pdp[4]*1440):null} color={eDC.PDP} dc={eDC}/>
                </div>}
              </div>
              <div style={{ textAlign:"center", padding:"0 32px", minWidth:280, alignSelf:"center" }}>
                <div style={{ fontSize:19, color:eDC.TEXT, fontWeight:700, marginBottom:18, whiteSpace:"nowrap" }}>Subscriber Difference</div>
                <div style={{ fontSize:44, fontWeight:800, fontVariantNumeric:"tabular-nums", lineHeight:1, color:currentGap!=null?(currentGap>=0?eDC.GAP_POS:eDC.GAP_NEG):eDC.DIM }}>
                  {dashRenderGap(currentGap)}
                </div>
              </div>
              {/* TS */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                <img src={tsIcon} alt="TS" style={{ width:100, height:100, borderRadius:"50%", border:"4px solid "+eDC.TS, objectFit:"cover" }}/>
                <div style={{ position:"relative", marginTop:2 }}>
                  <div style={{ fontSize:34, fontWeight:700, color:eDC.TS, lineHeight:1.1 }}>T-Series</div>
                  {!pdpLeading && <span style={{ position:"absolute", right:"100%", top:"50%", transform:"translateY(-50%)", marginRight:6, fontSize:28 }}>👑</span>}
                </div>
                <div className="sub-count" style={{ fontSize:counterFontSize, fontWeight:800, fontVariantNumeric:"tabular-nums", color:eDC.TEXT, letterSpacing:0, lineHeight:1, marginTop:0 }}>
                  {dashRenderCounter(displayTt)}
                </div>
                <div style={{ fontSize:16, color:eDC.DIM, marginTop:0 }}>Subscribers</div>
                {!flareHides("rateDisplays") && <div style={{ display:"flex", gap:0, marginTop:6 }}>
                  <DashRateDisplay label="1 Min" value={subsPerMinTable.ts[0]!=null?Math.round(subsPerMinTable.ts[0]):null} color={eDC.TS} dc={eDC}/>
                  <DashRateDisplay label="1 Hour" value={subsPerMinTable.ts[2]!=null?Math.round(subsPerMinTable.ts[2]*60):null} color={eDC.TS} dc={eDC}/>
                  <DashRateDisplay label="1 Day" value={subsPerMinTable.ts[4]!=null?Math.round(subsPerMinTable.ts[4]*1440):null} color={eDC.TS} dc={eDC}/>
                </div>}
              </div>
            </div>

            {nc && !flareHides("timezones") && <div style={{ textAlign:"center" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, fontSize:10, color:eDC.DIM, fontVariantNumeric:"tabular-nums" }}>
                {curPoint?.t && TIMEZONES.map(z => (
                  <div key={z.label}>
                    <span style={{ fontSize:12 }}>{z.flag}</span>{" "}
                    <span style={{ color:eDC.TEXT, fontWeight:600 }}>{z.label}</span>{" "}
                    {fmtTZ(curPoint.t, z.getOffset(curPoint.t))}
                  </div>
                ))}
              </div>
            </div>}
            </>); })()}

            {<div ref={dashMileRef}>
            <DashMilestone pdpSubs={mileDisplayPt} tsSubs={mileDisplayTt} pdpDaily={predRatePdp} tsDaily={predRateTs} curTime={curTime} dc={eDC} duration={isRTMode ? dur : 0} seekToken={seekToken}/>
            </div>}
            </div>{/* end scaling wrapper */}

          </div>
        </div>
        );
      })()}

      {/* Data Inspector */}
      {inspectorOpen && _realDataBuf && (() => {
        const cTime = inspectorPinned && inspectorPinnedTime != null ? inspectorPinnedTime : (curTime ?? REAL_DATA_START_MS);
        const halfN = Math.floor(inspectorCount / 2);
        const startIdx = Math.max(1, Math.round((cTime - halfN * 1000 - REAL_DATA_START_MS) / 1000));
        const rows = [];
        for (let i = startIdx; i < startIdx + inspectorCount && i < REAL_DATA_PAIR_COUNT; i++) {
          const pdp = _realDataBuf[i * 2], ts = _realDataBuf[i * 2 + 1];
          const dPdp = pdp - _realDataBuf[(i-1)*2], dTs = ts - _realDataBuf[(i-1)*2+1];
          rows.push({ i, t: REAL_DATA_START_MS + i * 1000, pdp, ts, dPdp, dTs });
        }
        const absDs = rows.flatMap(r=>[Math.abs(r.dPdp),Math.abs(r.dTs)]).sort((a,b)=>a-b);
        const med = absDs[Math.floor(absDs.length/2)] || 1;
        const jThr = Math.max(med * 5, 5);
        const bS = { background:"#111318", color:"#9bbfdf", border:"1px solid #2a2d3a", borderRadius:3, padding:"1px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" };
        const thS = { padding:"3px 8px", textAlign:"right", color:"#555", fontWeight:400, whiteSpace:"nowrap" };
        const tdS = { padding:"2px 8px", textAlign:"right", whiteSpace:"nowrap" };
        const copyTable = () => {
          const hdr = "idx\ttime\tpdp\tpdp_d\tts\tts_d";
          const lines = rows.map(r=>`${r.i}\t${new Date(r.t).toISOString().slice(11,19)}\t${r.pdp}\t${r.dPdp>=0?"+":""}${r.dPdp}\t${r.ts}\t${r.dTs>=0?"+":""}${r.dTs}`);
          navigator.clipboard.writeText([hdr,...lines].join('\n'));
        };
        return <div style={{position:"fixed",right:16,bottom:16,width:580,maxHeight:"58vh",background:"#0a0c14",border:"1px solid #2a2d3a",borderRadius:6,display:"flex",flexDirection:"column",zIndex:9999,fontFamily:"monospace",fontSize:11,boxShadow:"0 4px 24px #000a"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",borderBottom:"1px solid #1e2030",flexShrink:0}}>
            <span style={{color:"#7cb9f7",fontWeight:600,flex:1,fontSize:12}}>Data Inspector</span>
            <button onClick={()=>{ setInspectorPinned(p=>{ if(!p) setInspectorPinnedTime(curTime); return !p; }); }} style={{...bS, background:inspectorPinned?"#1e3050":"transparent", color:inspectorPinned?"#7cb9f7":"#666", border:"1px solid "+(inspectorPinned?"#2d4060":"#2a2d3a")}}>{inspectorPinned?"Pinned":"Follow"}</button>
            <span style={{color:"#555",fontSize:10}}>rows:</span>
            <input type="number" value={inspectorCount} min={10} max={300} onChange={e=>setInspectorCount(Math.max(10,Math.min(300,+e.target.value||60)))} style={{width:46,background:"#111",color:"#ccc",border:"1px solid #2a2d3a",borderRadius:3,padding:"1px 4px",fontSize:11,fontFamily:"monospace",textAlign:"right"}}/>
            <button onClick={copyTable} style={bS}>Copy</button>
            <button onClick={()=>setInspectorOpen(false)} style={{...bS,color:"#e05",border:"1px solid #3a1520"}}>X</button>
          </div>
          <div style={{padding:"4px 10px",borderBottom:"1px solid #111318",flexShrink:0,color:"#555",fontSize:10}}>
            center: {new Date(cTime).toISOString().replace('T',' ').slice(0,19)} UTC
            {" | "} jitter threshold: >{jThr.toFixed(0)} (5x median {med.toFixed(0)})
          </div>
          <div style={{overflowY:"auto",flex:1}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#0d0f18",position:"sticky",top:0}}>
                <th style={{...thS,textAlign:"left",paddingLeft:10}}>idx</th>
                <th style={{...thS,textAlign:"left"}}>time</th>
                <th style={thS}>pdp</th>
                <th style={thS}>pdp d</th>
                <th style={thS}>ts</th>
                <th style={thS}>ts d</th>
              </tr></thead>
              <tbody>
                {rows.map(r=>{
                  const pJ=Math.abs(r.dPdp)>jThr, tJ=Math.abs(r.dTs)>jThr;
                  return <tr key={r.i} style={{background:(pJ||tJ)?"#1a0a08":"transparent",borderBottom:"1px solid #0d0f18"}}>
                    <td style={{...tdS,textAlign:"left",paddingLeft:10,color:"#444"}}>{r.i}</td>
                    <td style={{...tdS,textAlign:"left",color:"#666"}}>{new Date(r.t).toISOString().slice(11,19)}</td>
                    <td style={{...tdS,color:"#bbb"}}>{r.pdp.toLocaleString()}</td>
                    <td style={{...tdS,color:pJ?(r.dPdp>0?"#4f4":"#f44"):(r.dPdp>0?"#4a6044":"#604040"),fontWeight:pJ?700:400}}>{r.dPdp>=0?"+":""}{r.dPdp}</td>
                    <td style={{...tdS,color:"#bbb"}}>{r.ts.toLocaleString()}</td>
                    <td style={{...tdS,color:tJ?(r.dTs>0?"#4f4":"#f44"):(r.dTs>0?"#4a6044":"#604040"),fontWeight:tJ?700:400}}>{r.dTs>=0?"+":""}{r.dTs}</td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>;
      })()}

      {patchEditorOpen && (() => {
        const bS     = { background:"#111318", color:"#9bbfdf", border:"1px solid #2a2d3a", borderRadius:3, padding:"1px 7px", fontSize:10, cursor:"pointer", fontFamily:"inherit" };
        const inputS = { background:"#0d0f18", color:"#ccc", border:"1px solid #2a2d3a", borderRadius:3, padding:"2px 6px", fontSize:11, fontFamily:"monospace", width:"100%", boxSizing:"border-box" };
        const selS   = { background:"#0d0f18", color:"#ccc", border:"1px solid #2a2d3a", borderRadius:3, padding:"2px 5px", fontSize:11, fontFamily:"monospace", cursor:"pointer" };
        const lblS   = { fontSize:9, color:"#555", fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase", whiteSpace:"nowrap" };

        // Flatten smooth_report into channel-tagged arrays
        const allFreezes = smoothReport ? [
          ...(smoothReport.pdp?.freeze_windows || []).map(w => ({ ...w, channel:'pdp' })),
          ...(smoothReport.ts?.freeze_windows  || []).map(w => ({ ...w, channel:'ts'  })),
        ].sort((a,b) => a.start_ms - b.start_ms) : null;

        const allJitter = smoothReport ? [
          ...(smoothReport.pdp?.jitter_bursts || []).map(b => ({ ...b, channel:'pdp' })),
          ...(smoothReport.ts?.jitter_bursts  || []).map(b => ({ ...b, channel:'ts'  })),
        ].sort((a,b) => a.start_ms - b.start_ms) : null;

        const invertSet = new Set(patches.invalidated_ids || []);

        const toggleInvalidate = (id) => {
          setPatches(p => {
            const ids = p.invalidated_ids || [];
            return { ...p, invalidated_ids: ids.includes(id) ? ids.filter(x=>x!==id) : [...ids, id] };
          });
        };

        const PAGE_SIZE = 100;
        const applyFilter = (items) => {
          if (!items) return null;
          let f = items;
          if (patchFilter.ch !== 'all')            f = f.filter(e => e.channel === patchFilter.ch);
          if (patchFilter.status === 'applied')     f = f.filter(e => e.is_manual || !invertSet.has(e.id));
          if (patchFilter.status === 'invalidated') f = f.filter(e => !e.is_manual && invertSet.has(e.id));
          if (patchWindow > 0)                      f = f.filter(e => Math.abs(e.start_ms - curTime) <= patchWindow);
          return f;
        };

        const freezeFiltered = applyFilter(allFreezes);
        const jitterFiltered = applyFilter(allJitter);
        const activeList = patchTab === 'freezes' ? freezeFiltered : patchTab === 'jitter' ? jitterFiltered : null;
        const totalPages  = 0;
        const pageItems   = activeList || [];

        const canAddAudit  = _parsePatchTime(patchForm.at) !== null;
        const canAddSmooth = _parsePatchTime(patchForm.ss) !== null && _parsePatchTime(patchForm.se) !== null;

        const addAudit = () => {
          const ms = _parsePatchTime(patchForm.at);
          if (!ms) return;
          setPatches(p => ({ ...p, audit_invalidations: [...p.audit_invalidations, { id:_mkPatchId(), ms, channel:patchForm.ac, note:patchForm.an }] }));
          setPatchForm(f => ({ ...f, at:'', an:'' }));
        };
        const addSmooth = () => {
          const start_ms = _parsePatchTime(patchForm.ss), end_ms = _parsePatchTime(patchForm.se);
          if (!start_ms || !end_ms) return;
          setPatches(p => ({ ...p, smooth_windows: [...p.smooth_windows, { id:_mkPatchId(), start_ms, end_ms, channels:patchForm.sc, note:patchForm.sn }] }));
          setPatchForm(f => ({ ...f, ss:'', se:'', sn:'' }));
        };
        const delAudit  = id => setPatches(p => ({ ...p, audit_invalidations: p.audit_invalidations.filter(x=>x.id!==id) }));
        const delSmooth = id => setPatches(p => ({ ...p, smooth_windows: p.smooth_windows.filter(x=>x.id!==id) }));

        const renderEntry = (e) => {
          const skipped = !e.is_manual && invertSet.has(e.id);
          const dur = e.end_ms && e.start_ms ? Math.round((e.end_ms - e.start_ms) / 1000) + 's' : '';
          return (
            <div key={e.id} style={{background:"#0d0f18",border:"1px solid "+(skipped?"#2a1520":"#1a2030"),borderRadius:4,padding:"5px 8px",display:"flex",alignItems:"center",gap:6}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:1}}>
                  <span style={{fontSize:9,color:e.channel==='pdp'?"#5af":"#f75",fontWeight:700}}>{e.channel}</span>
                  {e.is_manual && <span style={{fontSize:8,color:"#7fdf9b",border:"1px solid #2d6040",borderRadius:2,padding:"0 3px"}}>manual</span>}
                  <span style={{fontSize:8,color:skipped?"#844":"#484",marginLeft:"auto"}}>{skipped?"SKIP":"APPLY"}</span>
                </div>
                <div style={{display:"flex",gap:12}}>
                  <span style={{color:"#999",fontSize:10,fontVariantNumeric:"tabular-nums"}}>{_fmtPatchMs(e.start_ms)}</span>
                  {dur && <span style={{color:"#555",fontSize:10}}>{dur}</span>}
                </div>
                {e.organic_rate != null && <div style={{fontSize:9,color:"#3a3a4a"}}>organic {e.organic_rate > 0 ? '+' : ''}{e.organic_rate.toFixed(2)}/s  freeze {e.freeze_dur}s</div>}
              </div>
              {e.is_manual
                ? <button onClick={()=>delSmooth(e.id)} style={{...bS,color:"#e05",border:"1px solid #3a1520",fontSize:9,flexShrink:0}}>Del</button>
                : <button onClick={()=>toggleInvalidate(e.id)}
                    style={{...bS,color:skipped?"#7fdf9b":"#e05",borderColor:skipped?"#2d6040":"#3a1520",fontSize:9,flexShrink:0}}>
                    {skipped?'Restore':'Invalidate'}
                  </button>
              }
            </div>
          );
        };

        // Audits tab data
        const invAuditKeys = new Set((patches.invalidated_audits || []).map(a => `${a.ms}:${a.channel}`));
        const toggleInvalidateAudit = (ms, channel) => {
          const key = `${ms}:${channel}`;
          setPatches(p => {
            const arr = p.invalidated_audits || [];
            return { ...p, invalidated_audits: invAuditKeys.has(key) ? arr.filter(a => !(a.ms===ms&&a.channel===channel)) : [...arr, { ms, channel }] };
          });
        };
        const nearbyAudits = REAL_AUDITS.filter(a => Math.abs(a.ms - curTime) <= patchWindow);

        const TABS = [
          ['freezes', 'Freeze Fixes',  allFreezes ? allFreezes.length : '?'],
          ['jitter',  'Jitter Fixes',  allJitter  ? allJitter.length  : '?'],
          ['audits',  'Audits', nearbyAudits.length || ''],
          ['manual',  'Manual', patches.smooth_windows.length + patches.audit_invalidations.length || ''],
        ];

        return (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center"}}
            onClick={e=>{if(e.target===e.currentTarget)setPatchEditorOpen(false);}}>
            <div style={{background:"#0a0c14",border:"1px solid #2a2d3a",borderRadius:8,width:"min(740px,93vw)",maxHeight:"82vh",display:"flex",flexDirection:"column",boxShadow:"0 8px 32px #000d",fontFamily:"monospace",fontSize:11}}>
              {/* Header */}
              <div style={{display:"flex",alignItems:"center",padding:"8px 12px",borderBottom:"1px solid #1a1d28",flexShrink:0}}>
                <span style={{color:"#7fdf9b",fontWeight:700,fontSize:12,flex:1,letterSpacing:"0.06em"}}>SMOOTH PATCH EDITOR</span>
                <span style={{fontSize:9,color:"#444",marginRight:10}}>{invertSet.size} invalidated</span>
                <button onClick={()=>{setSmoothReport(null);setSmoothReportLoading(false);}} style={{...bS,fontSize:9,marginRight:6}}>Reload Report</button>
                <button onClick={()=>setPatchEditorOpen(false)} style={{...bS,color:"#e05",border:"1px solid #3a1520",padding:"1px 9px"}}>X</button>
              </div>
              {/* Tabs */}
              <div style={{display:"flex",borderBottom:"1px solid #1a1d28",flexShrink:0}}>
                {TABS.map(([id,label,cnt])=>(
                  <button key={id} onClick={()=>{setPatchTab(id);setPatchPage(0);}}
                    style={{flex:1,background:patchTab===id?"#0f1420":"transparent",color:patchTab===id?"#7fdf9b":"#555",border:"none",borderBottom:patchTab===id?"2px solid #7fdf9b":"2px solid transparent",padding:"6px 0",fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:patchTab===id?700:400}}>
                    {label}{cnt!==''?' ('+cnt+')':''}
                  </button>
                ))}
              </div>
              {/* Filter bar */}
              {(patchTab==='freezes'||patchTab==='jitter') && (
                <div style={{display:"flex",gap:6,padding:"5px 12px",borderBottom:"1px solid #111820",flexShrink:0,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:9,color:"#444"}}>window:</span>
                  {[[60000,'1m'],[600000,'10m'],[1800000,'30m'],[3600000,'1h']].map(([ms,label])=>(
                    <button key={label} onClick={()=>{setPatchWindow(ms);setPatchPage(0);}}
                      style={{...bS,background:patchWindow===ms?"#1a2535":"transparent",color:patchWindow===ms?"#9bbfdf":"#555",fontSize:9,padding:"0 6px"}}>{label}</button>
                  ))}
                  <span style={{fontSize:9,color:"#2a3040",marginLeft:2}}>around current time</span>
                  <span style={{fontSize:9,color:"#444",marginLeft:6}}>ch:</span>
                  {['all','pdp','ts'].map(v=>(
                    <button key={v} onClick={()=>{setPatchFilter(f=>({...f,ch:v}));setPatchPage(0);}}
                      style={{...bS,background:patchFilter.ch===v?"#1a2535":"transparent",color:patchFilter.ch===v?"#9bbfdf":"#555",fontSize:9,padding:"0 6px"}}>{v}</button>
                  ))}
                  <span style={{fontSize:9,color:"#444",marginLeft:4}}>status:</span>
                  {['all','applied','invalidated'].map(v=>(
                    <button key={v} onClick={()=>{setPatchFilter(f=>({...f,status:v}));setPatchPage(0);}}
                      style={{...bS,background:patchFilter.status===v?"#1a2535":"transparent",color:patchFilter.status===v?"#9bbfdf":"#555",fontSize:9,padding:"0 6px"}}>{v}</button>
                  ))}
                  {activeList && <span style={{fontSize:9,color:"#2a2d3a",marginLeft:"auto"}}>{activeList.length}{patchWindow>0?' near':''}</span>}
                </div>
              )}
              {/* Body */}
              <div style={{flex:1,overflowY:"auto",padding:"8px 12px",display:"flex",flexDirection:"column",gap:4}}>
                {(patchTab==='freezes'||patchTab==='jitter') && <>
                  {smoothReportLoading && <div style={{color:"#555",fontSize:10,textAlign:"center",padding:20}}>Loading smooth_report.json...</div>}
                  {!smoothReportLoading && smoothReport===null && <div style={{color:"#444",fontSize:10,textAlign:"center",padding:20}}>smooth_report.json not found -- run smooth-binary.js first, then click Reload Report.</div>}
                  {activeList && activeList.length===0 && <div style={{color:"#333",fontSize:10,textAlign:"center",padding:12}}>no entries match filter</div>}
                  {pageItems.map(e => renderEntry(e))}
                </>}

                {patchTab==='audits' && <>
                  {nearbyAudits.length===0 && <div style={{color:"#333",fontSize:10,textAlign:"center",padding:20}}>no audits in current window</div>}
                  {nearbyAudits.map(a => {
                    const key = `${a.ms}:${a.channel}`;
                    const inv = invAuditKeys.has(key);
                    return (
                      <div key={key} style={{background:"#0d0f18",border:"1px solid "+(inv?"#2a1520":"#1a2030"),borderRadius:4,padding:"5px 8px",display:"flex",alignItems:"center",gap:6}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:1}}>
                            <span style={{fontSize:9,color:a.channel==='pdp'?"#5af":"#f75",fontWeight:700}}>{a.channel}</span>
                            <span style={{fontSize:9,color:a.type==='audit'?"#f90":"#555"}}>{a.type}</span>
                            <span style={{fontSize:9,color:inv?"#844":"#484",marginLeft:"auto"}}>{inv?"SKIP":"KEEP"}</span>
                          </div>
                          <div style={{color:"#999",fontSize:10,fontVariantNumeric:"tabular-nums"}}>{_fmtPatchMs(a.ms)}</div>
                          <div style={{fontSize:9,color:"#3a3a4a"}}>magnitude {a.magnitude > 0 ? '+' : ''}{a.magnitude}  min_total {a.minute_total > 0 ? '+' : ''}{a.minute_total}</div>
                        </div>
                        <button onClick={()=>toggleInvalidateAudit(a.ms, a.channel)}
                          style={{...bS,color:inv?"#7fdf9b":"#e05",borderColor:inv?"#2d6040":"#3a1520",fontSize:9,flexShrink:0}}>
                          {inv?'Restore':'Invalidate'}
                        </button>
                      </div>
                    );
                  })}
                </>}

                {patchTab==='manual' && <>
                  {/* Add smooth window */}
                  <div style={{background:"#0d0f18",border:"1px solid #1e2535",borderRadius:5,padding:"8px 10px"}}>
                    <div style={{fontSize:9,color:"#7fdf9b",fontWeight:700,letterSpacing:"0.06em",marginBottom:7}}>ADD SMOOTH WINDOW (force Skellam-fill a range)</div>
                    <div style={{display:"grid",gridTemplateColumns:"50px 1fr",gap:"5px 8px",alignItems:"center"}}>
                      <span style={lblS}>Start</span>
                      <input value={patchForm.ss} onChange={e=>setPatchForm(f=>({...f,ss:e.target.value}))}
                        placeholder="2019-01-03 01:38:46  or  idx:6644325"
                        style={{...inputS,borderColor:patchForm.ss&&!_parsePatchTime(patchForm.ss)?"#803030":"#2a2d3a"}}/>
                      <span style={lblS}>End</span>
                      <input value={patchForm.se} onChange={e=>setPatchForm(f=>({...f,se:e.target.value}))}
                        placeholder="2019-01-03 01:41:30  or  idx:6644490"
                        style={{...inputS,borderColor:patchForm.se&&!_parsePatchTime(patchForm.se)?"#803030":"#2a2d3a"}}/>
                      <span style={lblS}>Channels</span>
                      <select value={patchForm.sc} onChange={e=>setPatchForm(f=>({...f,sc:e.target.value}))} style={selS}>
                        <option value="both">both</option><option value="pdp">pdp only</option><option value="ts">ts only</option>
                      </select>
                      <span style={lblS}>Note</span>
                      <input value={patchForm.sn} onChange={e=>setPatchForm(f=>({...f,sn:e.target.value}))} placeholder="optional" style={inputS}/>
                    </div>
                    <button onClick={addSmooth} disabled={!canAddSmooth} style={{...bS,marginTop:7,color:canAddSmooth?"#7fdf9b":"#333",borderColor:canAddSmooth?"#2d6040":"#1e1e1e",cursor:canAddSmooth?"pointer":"default"}}>+ Add</button>
                  </div>
                  {patches.smooth_windows.length===0
                    ? <div style={{color:"#333",fontSize:10,textAlign:"center",padding:"6px 0"}}>no manual smooth windows</div>
                    : patches.smooth_windows.map(e => {
                        const isEditing = editingSwId === e.id;
                        const startEdit = () => {
                          setEditSwForm({
                            ss: new Date(e.start_ms).toISOString().replace('T',' ').replace('.000Z',''),
                            se: new Date(e.end_ms).toISOString().replace('T',' ').replace('.000Z',''),
                            sc: e.channels, sn: e.note || ''
                          });
                          setEditingSwId(e.id);
                        };
                        const saveEdit = () => {
                          const start_ms = _parsePatchTime(editSwForm.ss), end_ms = _parsePatchTime(editSwForm.se);
                          if (!start_ms || !end_ms) return;
                          setPatches(p => ({ ...p, smooth_windows: p.smooth_windows.map(w => w.id===e.id ? { ...w, start_ms, end_ms, channels:editSwForm.sc, note:editSwForm.sn } : w) }));
                          setEditingSwId(null);
                        };
                        const canSave = _parsePatchTime(editSwForm.ss) && _parsePatchTime(editSwForm.se);
                        if (isEditing) return (
                          <div key={e.id} style={{background:"#0d1018",border:"1px solid #2d4060",borderRadius:4,padding:"7px 8px"}}>
                            <div style={{display:"grid",gridTemplateColumns:"50px 1fr",gap:"4px 8px",alignItems:"center",marginBottom:6}}>
                              <span style={lblS}>Start</span>
                              <input value={editSwForm.ss} onChange={ev=>setEditSwForm(f=>({...f,ss:ev.target.value}))}
                                style={{...inputS,borderColor:editSwForm.ss&&!_parsePatchTime(editSwForm.ss)?"#803030":"#2a2d3a"}}/>
                              <span style={lblS}>End</span>
                              <input value={editSwForm.se} onChange={ev=>setEditSwForm(f=>({...f,se:ev.target.value}))}
                                style={{...inputS,borderColor:editSwForm.se&&!_parsePatchTime(editSwForm.se)?"#803030":"#2a2d3a"}}/>
                              <span style={lblS}>Channels</span>
                              <select value={editSwForm.sc} onChange={ev=>setEditSwForm(f=>({...f,sc:ev.target.value}))} style={selS}>
                                <option value="both">both</option><option value="pdp">pdp only</option><option value="ts">ts only</option>
                              </select>
                              <span style={lblS}>Note</span>
                              <input value={editSwForm.sn} onChange={ev=>setEditSwForm(f=>({...f,sn:ev.target.value}))} placeholder="optional" style={inputS}/>
                            </div>
                            <div style={{display:"flex",gap:6}}>
                              <button onClick={saveEdit} disabled={!canSave} style={{...bS,color:canSave?"#7fdf9b":"#333",borderColor:canSave?"#2d6040":"#1e1e1e",fontSize:9}}>Save</button>
                              <button onClick={()=>setEditingSwId(null)} style={{...bS,fontSize:9}}>Cancel</button>
                              <button onClick={()=>{delSmooth(e.id);setEditingSwId(null);}} style={{...bS,color:"#e05",border:"1px solid #3a1520",fontSize:9,marginLeft:"auto"}}>Del</button>
                            </div>
                          </div>
                        );
                        return (
                          <div key={e.id} style={{background:"#0d0f18",border:"1px solid #1e2535",borderRadius:4,padding:"5px 8px",display:"flex",alignItems:"center",gap:6}}>
                            <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={startEdit}>
                              <div style={{display:"flex",gap:6,marginBottom:1}}><span style={{fontSize:9,color:"#7fdf9b",fontWeight:700}}>{e.channels}</span></div>
                              <div style={{color:"#999",fontSize:10,fontVariantNumeric:"tabular-nums"}}>{_fmtPatchMs(e.start_ms)}</div>
                              <div style={{color:"#999",fontSize:10,fontVariantNumeric:"tabular-nums"}}>{_fmtPatchMs(e.end_ms)}</div>
                              {e.note&&<div style={{color:"#444",fontSize:9}}>{e.note}</div>}
                            </div>
                            <button onClick={startEdit} style={{...bS,fontSize:9,flexShrink:0}}>Edit</button>
                            <button onClick={()=>delSmooth(e.id)} style={{...bS,color:"#e05",border:"1px solid #3a1520",fontSize:9,flexShrink:0}}>Del</button>
                          </div>
                        );
                      })
                  }
                  <div style={{height:1,background:"#181a28",margin:"4px 0",flexShrink:0}}/>
                  {/* Add audit mark */}
                  <div style={{background:"#0d0f18",border:"1px solid #1e2535",borderRadius:5,padding:"8px 10px"}}>
                    <div style={{fontSize:9,color:"#9bbfdf",fontWeight:700,letterSpacing:"0.06em",marginBottom:7}}>ADD AUDIT MARK (protect from smoothing; force-classify in detect-audits)</div>
                    <div style={{display:"grid",gridTemplateColumns:"50px 1fr",gap:"5px 8px",alignItems:"center"}}>
                      <span style={lblS}>Time</span>
                      <input value={patchForm.at} onChange={e=>setPatchForm(f=>({...f,at:e.target.value}))}
                        placeholder="2019-01-03 01:38:49  or  idx:6644329"
                        style={{...inputS,borderColor:patchForm.at&&!canAddAudit?"#803030":"#2a2d3a"}}/>
                      <span style={lblS}>Channel</span>
                      <select value={patchForm.ac} onChange={e=>setPatchForm(f=>({...f,ac:e.target.value}))} style={selS}>
                        <option value="pdp">pdp</option><option value="ts">ts</option>
                      </select>
                      <span style={lblS}>Note</span>
                      <input value={patchForm.an} onChange={e=>setPatchForm(f=>({...f,an:e.target.value}))} placeholder="optional" style={inputS}/>
                    </div>
                    <button onClick={addAudit} disabled={!canAddAudit} style={{...bS,marginTop:7,color:canAddAudit?"#9bbfdf":"#333",borderColor:canAddAudit?"#2d4060":"#1e1e1e",cursor:canAddAudit?"pointer":"default"}}>+ Add</button>
                  </div>
                  {patches.audit_invalidations.length===0
                    ? <div style={{color:"#333",fontSize:10,textAlign:"center",padding:"6px 0"}}>no audit marks</div>
                    : patches.audit_invalidations.map(e=>(
                        <div key={e.id} style={{background:"#0d0f18",border:"1px solid #1e2535",borderRadius:4,padding:"5px 8px",display:"flex",alignItems:"center",gap:6}}>
                          <div style={{flex:1,minWidth:0}}>
                            <span style={{fontSize:9,color:"#9bbfdf",fontWeight:700}}>{e.channel}</span>
                            <div style={{color:"#999",fontSize:10,fontVariantNumeric:"tabular-nums",marginTop:1}}>{_fmtPatchMs(e.ms)}</div>
                            {e.note&&<div style={{color:"#444",fontSize:9}}>{e.note}</div>}
                          </div>
                          <button onClick={()=>delAudit(e.id)} style={{...bS,color:"#e05",border:"1px solid #3a1520",fontSize:9,flexShrink:0}}>Del</button>
                        </div>
                      ))
                  }
                </>}
              </div>
              {/* Footer */}
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderTop:"1px solid #1a1d28",flexShrink:0,flexWrap:"wrap"}}>
                <button onClick={()=>savePatchesToServer(patches)}
                  style={{...bS,color:patchSaveStatus==='error'?"#f66":patchSaveStatus==='saved'?"#7fdf9b":"#9bbfdf",borderColor:patchSaveStatus==='error'?"#603030":patchSaveStatus==='saved'?"#2d6040":"#2a2d3a",padding:"2px 12px",fontSize:11}}>
                  {patchSaveStatus==='saving'?'Saving...':patchSaveStatus==='saved'?'Saved!':patchSaveStatus==='error'?'Error!':'Save'}
                </button>
                {[['da','detect-audits'],['sb','smooth-binary']].map(([key,script])=>{
                  const st = runStatus[key];
                  return (
                    <button key={key} disabled={!!st&&st!=='ok'&&st!=='error'} onClick={()=>{
                      setRunStatus(r=>({...r,[key]:'running'}));
                      fetch('/api/run/'+script,{method:'POST'})
                        .then(r=>r.json())
                        .then(d=>{
                          setRunStatus(r=>({...r,[key]:d.ok?'ok':'error'}));
                          if(d.ok && script==='smooth-binary'){setSmoothReport(null);setSmoothReportLoading(false);}
                          setTimeout(()=>setRunStatus(r=>({...r,[key]:null})),3000);
                        })
                        .catch(()=>{setRunStatus(r=>({...r,[key]:'error'}));setTimeout(()=>setRunStatus(r=>({...r,[key]:null})),3000);});
                    }} style={{...bS,
                      color:st==='error'?"#f66":st==='ok'?"#7fdf9b":st==='running'?"#fa0":"#9bbfdf",
                      borderColor:st==='error'?"#603030":st==='ok'?"#2d6040":st==='running'?"#604000":"#2a2d3a",
                      padding:"2px 10px",fontSize:10,cursor:st==='running'?"default":"pointer"}}>
                      {st==='running'?'Running...':st==='ok'?'Done!':st==='error'?'Error!':'Run '+script}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
