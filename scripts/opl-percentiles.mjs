// Builds src/data/opl-percentiles.json from an OpenPowerlifting CSV export.
//
// Usage:
//   1. Download https://openpowerlifting.gitlab.io/opl-csv/files/openpowerlifting-latest.zip
//      (public domain) and unzip it anywhere outside the repo.
//   2. node scripts/opl-percentiles.mjs path/to/openpowerlifting-YYYY-MM-DD-xxxx.csv
//
// What is counted (kept deliberately simple and explainable on the page):
// - Full-power meets (Event = SBD), Raw equipment (bare knees or knee sleeves),
//   a valid placing (not disqualified), sex M or F, and all three lifts > 0.
// - ONE entry per lifter: their best competition total. Its bodyweight decides
//   the IPF weight class, and its squat, bench and deadlift are used.
// - For each sex x weight class x lift: the 1st..99th percentiles (kg, 0.5 kg).
import { createReadStream, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { basename } from 'node:path';
import { CLASSES, classFor } from '../src/lib/strength-percentile.js';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/opl-percentiles.mjs <openpowerlifting.csv>');
  process.exit(1);
}
const dateMatch = basename(file).match(/(\d{4}-\d{2}-\d{2})/);
if (!dateMatch) {
  console.error('Could not read the export date from the file name.');
  process.exit(1);
}

/** Split one CSV line, honouring double-quoted fields. */
function splitCsv(line) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const best = new Map(); // key: sex|name -> { total, bw, s, b, d, date }
let header = null;
let rows = 0;
let kept = 0;

const rl = createInterface({ input: createReadStream(file, 'utf8'), crlfDelay: Infinity });
for await (const line of rl) {
  if (!header) {
    header = Object.fromEntries(splitCsv(line).map((h, i) => [h, i]));
    for (const col of ['Name', 'Sex', 'Event', 'Equipment', 'BodyweightKg', 'Best3SquatKg', 'Best3BenchKg', 'Best3DeadliftKg', 'TotalKg', 'Place', 'Date']) {
      if (!(col in header)) throw new Error(`Missing column ${col}`);
    }
    continue;
  }
  rows++;
  const f = splitCsv(line);
  const sex = f[header.Sex];
  if ((sex !== 'M' && sex !== 'F') || f[header.Event] !== 'SBD' || f[header.Equipment] !== 'Raw') continue;
  if (!/^\d+$/.test(f[header.Place])) continue; // DQ, DD, NS, G
  const bw = Number(f[header.BodyweightKg]);
  const s = Number(f[header.Best3SquatKg]);
  const b = Number(f[header.Best3BenchKg]);
  const d = Number(f[header.Best3DeadliftKg]);
  const total = Number(f[header.TotalKg]);
  if (!(bw > 0 && s > 0 && b > 0 && d > 0 && total > 0)) continue;
  kept++;
  const key = `${sex}|${f[header.Name]}`;
  const date = f[header.Date];
  const prev = best.get(key);
  if (!prev || total > prev.total || (total === prev.total && date > prev.date)) {
    best.set(key, { sex, total, bw, s, b, d, date });
  }
}

const LIFTS = { squat: 's', bench: 'b', deadlift: 'd', total: 'total' };
const groups = {};
for (const sex of ['M', 'F']) {
  groups[sex] = {};
  for (const c of [...CLASSES[sex].map((c) => c.id), 'all']) {
    groups[sex][c] = { squat: [], bench: [], deadlift: [], total: [] };
  }
}
for (const e of best.values()) {
  const cls = classFor(e.sex, e.bw).id;
  for (const [lift, k] of Object.entries(LIFTS)) {
    groups[e.sex][cls][lift].push(e[k]);
    groups[e.sex].all[lift].push(e[k]);
  }
}

/** 1st..99th percentiles with linear interpolation, rounded to 0.5 kg. */
function percentiles(values) {
  const v = values.slice().sort((a, b) => a - b);
  const out = [];
  for (let p = 1; p <= 99; p++) {
    const pos = (p / 100) * (v.length - 1);
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    const x = v[lo] + (v[hi] - v[lo]) * (pos - lo);
    out.push(Math.round(x * 2) / 2);
  }
  return out;
}

const data = { source: 'OpenPowerlifting', exportDate: dateMatch[1], lifters: best.size, groups: {} };
for (const sex of ['M', 'F']) {
  data.groups[sex] = {};
  for (const [cls, lifts] of Object.entries(groups[sex])) {
    const count = lifts.total.length;
    data.groups[sex][cls] = { count };
    for (const lift of Object.keys(LIFTS)) data.groups[sex][cls][lift] = percentiles(lifts[lift]);
  }
}

writeFileSync(new URL('../src/data/opl-percentiles.json', import.meta.url), JSON.stringify(data) + '\n');
console.log(`Rows read: ${rows}. Valid raw SBD entries: ${kept}. Lifters: ${best.size}.`);
for (const sex of ['M', 'F']) {
  console.log(sex, Object.entries(data.groups[sex]).map(([c, g]) => `${c}:${g.count}`).join(' '));
}
