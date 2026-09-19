// Local HTTP server - serves the app + reads CSVs on every /data/bundle.js request.
// Run: node server.js  (from app/ folder)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, 'dist');
const PATCHES_PATH = path.join(ROOT, 'data', 'manual_patches.json');

// --data flag: serve only the data/API routes on port 8081 for use with `vite dev`.
// Without the flag: full static server + Chrome launch on port 8080 (production mode).
const DATA_ONLY = process.argv.includes('--data');
const PORT = process.env.PORT ? parseInt(process.env.PORT) : DATA_ONLY ? 8081 : 8080;


const MIME = {
  '.html': 'text/html', '.js': 'application/javascript',
  '.css': 'text/css',   '.jpg': 'image/jpeg',
  '.png': 'image/png',  '.csv': 'text/csv',
  '.ttf': 'font/ttf',   '.woff2': 'font/woff2',
  '.bin': 'application/octet-stream',
};

// ── parsers ───────────────────────────────────────────────────────────────────
function parseNum(s) {
  if (s == null || s.trim() === '') return null;
  return parseFloat(s.replace(/[",\s+]/g, '').replace(/,/g, ''));
}

function parseDate(s) {
  // "MM/DD/YYYY HH:00" or "M/D/YYYY H:00:"
  const clean = s.trim().replace(/:$/, '');
  const [datePart, timePart] = clean.split(' ');
  const [mo, dy, yr] = datePart.split('/').map(Number);
  const hr = timePart ? parseInt(timePart) : 0;
  return Date.UTC(yr, mo - 1, dy, hr, 0, 0);
}


// Simple datetime,value CSVs
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


function read(file) { return fs.readFileSync(path.join(ROOT, 'data', file), 'utf8'); }

// real_data_audits.tsv columns: ms, datetime, channel, type, magnitude, raw_growth, baseline, z_score
// cols: ms, datetime, channel, type, magnitude, minute_total, baseline, organic_n
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
    MANUAL_PATCHES: (() => {
      try { return JSON.parse(fs.readFileSync(PATCHES_PATH, 'utf8')); }
      catch (e) { return { invalidated_audits: [], invalidated_ids: [], audit_invalidations: [], smooth_windows: [] }; }
    })(),
  };
  return `window.__DATA = ${JSON.stringify(data)};`;
}

// ── Heartbeat watchdog ────────────────────────────────────────────────────────
let lastPing = null;
let watchdog = null;
function startWatchdog() {
  if (watchdog) return;
  watchdog = setInterval(() => {
    if (Date.now() - lastPing > 120000) {
      console.log('Browser closed — shutting down.');
      process.exit(0);
    }
  }, 5000);
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/ping') {
    lastPing = Date.now();
    startWatchdog();
    res.writeHead(200);
    res.end('ok');
    return;
  }

  if (url.startsWith('/api/run/')) {
    const script = url.slice(9); // 'detect-audits' or 'smooth-binary'
    const allowed = new Set(['detect-audits', 'smooth-binary']);
    if (!allowed.has(script)) { res.writeHead(400); res.end('unknown script'); return; }
    const scriptPath = path.join(__dirname, '..', 'helper', script + '.js');
    exec(`node "${scriptPath}"`, { cwd: path.join(__dirname, '..'), maxBuffer: 10 * 1024 * 1024, timeout: 300000 }, (err, stdout, stderr) => {
      const out = (stdout + (stderr ? '\n' + stderr : '')).trim();
      res.writeHead(err ? 500 : 200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: !err, out }));
    });
    return;
  }

  if (url === '/api/manual-patches') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', d => { body += d; });
      req.on('end', () => {
        try {
          JSON.parse(body);
          fs.writeFileSync(PATCHES_PATH, body, 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"ok":true}');
        } catch (e) {
          res.writeHead(400);
          res.end('Bad JSON: ' + e.message);
        }
      });
    } else {
      try {
        const data = fs.existsSync(PATCHES_PATH)
          ? fs.readFileSync(PATCHES_PATH, 'utf8')
          : '{"invalidated_audits":[],"invalidated_ids":[],"audit_invalidations":[],"smooth_windows":[]}';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      } catch (e) {
        res.writeHead(500); res.end('error');
      }
    }
    return;
  }

  if (url === '/data/bundle.js') {
    try {
      const bundle = buildDataBundle();
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(bundle);
    } catch (e) {
      console.error('CSV parse error:', e.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('CSV read error: ' + e.message);
    }
    return;
  }

  if (DATA_ONLY) {
    if (url.startsWith('/data/')) {
      const filePath = path.join(ROOT, 'data', decodeURIComponent(url.slice(6)));
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
      });
    } else {
      res.writeHead(404); res.end('Not found');
    }
    return;
  }

  const filePath = path.join(ROOT, decodeURIComponent(url === '/' ? 'index.html' : url));
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    const fallback = PORT + 1;
    console.warn(`Port ${PORT} in use, trying ${fallback}...`);
    server.listen(fallback);
  } else throw e;
});

server.listen(PORT, () => {
  const actualPort = server.address().port;
  if (DATA_ONLY) {
    console.log(`\nData server running at http://localhost:${actualPort}`);
    console.log('Now run `npm run dev` in another terminal.\n');
    return;
  }
  const url = `http://localhost:${actualPort}`;
  console.log(`\nPVT Live running at ${url}`);
  console.log('Views: SocialBlade | Flare | Dashboard — switch via VIEW buttons in control bar');
  console.log('Play/Pause: spacebar or play button | Reverse: back arrow button');
  console.log('Speed: dropdown (Realtime or 1 Min/s) + multiplier slider');
  console.log('Seek: arrow keys or click the timeline scrubber\n');
  exec(`start "" chrome --app=${url} --user-data-dir=%TEMP%\\ScenarioChrome --no-first-run --disable-sync --disable-extensions`);
});

// Die automatically if run non-interactively (e.g. from Claude's test harness)
if (!DATA_ONLY && !process.stdin.isTTY) {
  setTimeout(() => process.exit(0), 3000);
}
