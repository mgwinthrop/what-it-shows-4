// Counts the reports merged into #4471 by cause. Run from the repo root: node analysis/count.mjs
// Mirrors support-kb/src/lib/kb/causes.ts; the one-day group is the desk's own list in desk-notes.json.
import fs from 'fs';
const dir = 'support-kb/src/lib/data/';
const reports = JSON.parse(fs.readFileSync(dir + 'reports-4471.json', 'utf8'));
const oneDay = JSON.parse(fs.readFileSync(dir + 'desk-notes.json', 'utf8')).oneDayMove;
const tenants = Object.fromEntries(fs.readdirSync(dir + 'tenants').map((f) => {
  const t = JSON.parse(fs.readFileSync(dir + 'tenants/' + f, 'utf8'));
  return [t.handle, t];
}));
const dayFirst = (l) => {
  const o = new Intl.DateTimeFormat(l, { year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date(Date.UTC(2026, 0, 2, 12))).map((p) => p.type);
  return o.indexOf('day') < o.indexOf('month');
};
const HINT = { 'booking-v2': 'DD/MM/YYYY', 'booking-v3': 'MM/DD/YYYY' };
const unique = [...new Map(reports.map((r) => [r.id, r])).values()].filter((r) => r.mergedInto === 4471);
const groups = { parser: [], hint: [], 'one-day': [], unplaced: [] };
for (const r of unique) {
  const t = tenants[r.tenant];
  if (oneDay.includes(r.id)) groups['one-day'].push(r);
  else if (!t || !dayFirst(t.locale)) groups.unplaced.push(r);
  else if (r.channel === 'form' && HINT[t.form].startsWith('MM')) groups.hint.push(r);
  else groups.parser.push(r);
}
console.log(`exported ${reports.length}, unique ${unique.length}, repeats ${reports.length - unique.length}`);
const out = {};
for (const [k, rs] of Object.entries(groups)) {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  console.log(k.padEnd(9), String(rs.length).padStart(4), 'tenants', new Set(rs.map((r) => r.tenant)).size, days[0] ?? '-', days.at(-1) ?? '-');
  out[k] = rs.map((r) => r.id);
}
fs.writeFileSync('analysis/groups.json', JSON.stringify(out, null, 2) + '\n');
