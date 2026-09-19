// Downloads the LFS binary directly via GitHub LFS batch API (no git-lfs required)
const https = require('https');
const fs = require('fs');
const path = require('path');

const OID = '03ac57e7844c60fe781c3617667f80160961ac47cfebeb3e5b0d760b7bb1ce37';
const SIZE = 135475208;
const OUT = path.join(__dirname, 'app/dist/data/every_second_counts_pvt_u32le.bin');

function get(url, headers) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get({ hostname: u.hostname, path: u.pathname + u.search, headers }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        resolve(get(res.headers.location, headers));
      } else {
        resolve(res);
      }
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching LFS batch...');
  const body = JSON.stringify({
    operation: 'download',
    transfers: ['basic'],
    objects: [{ oid: OID, size: SIZE }]
  });

  const batchRes = await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'github.com',
      path: '/tylrexd-gif/PewDiePieVsTSeriesLiveRealtime.git/info/lfs/objects/batch',
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.git-lfs+json',
        'Content-Type': 'application/vnd.git-lfs+json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, resolve);
    req.on('error', reject);
    req.write(body);
    req.end();
  });

  let raw = '';
  for await (const chunk of batchRes) raw += chunk;
  const json = JSON.parse(raw);

  if (json.objects[0].error) {
    throw new Error('LFS batch error: ' + JSON.stringify(json.objects[0].error));
  }

  const { href, header = {} } = json.objects[0].actions.download;
  console.log('Downloading binary (~129 MB)...');

  const dlRes = await get(href, header);
  const file = fs.createWriteStream(OUT);
  let received = 0;
  dlRes.on('data', chunk => {
    received += chunk.length;
    if (received % (10 * 1024 * 1024) < chunk.length) {
      console.log(`  ${(received / 1024 / 1024).toFixed(0)} MB`);
    }
  });
  await new Promise((resolve, reject) => {
    dlRes.pipe(file);
    file.on('finish', resolve);
    file.on('error', reject);
  });

  console.log(`Done: ${(received / 1024 / 1024).toFixed(1)} MB written to ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
