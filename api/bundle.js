const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'app', 'dist', 'data');

function read(file) {
  return fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
}

function parseNum(s) {
  if (s == null || s.trim() === '') return null;
  return parseFloat(s.replace(/[",\s+]/g, '').replace(/,/g, ''));
}

function parseDate(s) {
  const clean = s.trim().replace(/:$/, '');
  const [datePart, timePart] = clean.split(' ');
  const [mo, dy, yr] = datePart.split('/').map(Number);
  const hr = timePart ? parseInt(timePart) : 0;
  return Date.UTC(yr, mo - 1, dy, hr, 0, 0);
}

function parseSimpleSheet(text) {
  return text.trim().split('\n').slice(1).map(line => {
    const cols = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur); cur = ''; }
      else cur += ch;
    }
    cols.push(cur);
    return [parseDate(cols[0]), parseNum(cols[1]) ?? 0];
  });
}

function parseRealDataAudits(text) {
  return text.trim().split('\n').slice(1).filter(Boolean).map(line => {
    const cols = line.split('\t');
    return { ms: +cols[0], channel: cols[2], type: cols[3], magnitude: +cols[4], minute_total: +cols[5] };
  });
}

function buildDataBundle() {
  const data = {
    H: [],
    audits: [],
    REAL_AUDITS: (() => {
      try { return parseRealDataAudits(read('real_data_audits.tsv')); }
      catch (e) { return []; }
    })(),
    SBD_REAL: (() => {
      try { return parseSimpleSheet(read('SB Daily Real.csv')); }
      catch (e) { return []; }
    })(),
    FTVD_REAL: (() => {
      try { return parseSimpleSheet(read('FTV Daily Real.csv')); }
      catch (e) { return []; }
    })(),
    GAP_CROSSINGS: (() => {
      try { return JSON.parse(read('gap_crossings.json')); }
      catch (e) { return []; }
    })(),
    MANUAL_PATCHES: { invalidated_audits: [], invalidated_ids: [], audit_invalidations: [], smooth_windows: [] },
  };
  return `window.__DATA = ${JSON.stringify(data)};`;
}

module.exports = function handler(req, res) {
  try {
    const bundle = buildDataBundle();
    res.setHeader('Content-Type', 'application/javascript');
    res.status(200).send(bundle);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
};
