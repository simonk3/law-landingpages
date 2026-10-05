#!/usr/bin/env node

/**
 * Fails the build once the martial-law period the blog asserts has lapsed.
 *
 * Ukraine's martial law and general mobilisation are not open-ended: parliament
 * extends them in ~90-day increments, each by its own law with its own end date.
 * The posts here are written against the current window — mobilizatsiya-2026.md
 * states it outright ("Чинний період — з 2 серпня до 31 жовтня 2026 року"), and
 * much of what the other posts explain (raised fines, deferral and booking rules)
 * holds only while that regime is in force.
 *
 * So the day the window closes, prose that reads as current silently becomes
 * wrong, on a law firm's own advice pages, with nothing in the build objecting.
 * Clients act on these pages. That is worth a red build rather than a reader
 * noticing, so the deadline is checked against the calendar here.
 *
 * Three ways this reports trouble:
 *
 *   1. The declared period has passed — martial law was extended by a new law and
 *      every post still describing the old window needs revisiting.
 *   2. A post states an end date that is not the declared one — the usual shape of
 *      a half-finished update, where one post was revised and the rest were not.
 *   3. No post states the window at all — a reword that drops the sentence would
 *      otherwise disable this check quietly, which is the failure it exists to stop.
 *
 * Inside `warnDaysBefore` the build stays green and prints a warning, so the
 * extension lands while there is still time to write it up.
 *
 * Only dates governed by a boundary cue (`до`, `датою`) inside a regime clause
 * count. The content is full of dates that are deliberately historical — when a
 * simplified SZCH window closed, when a VLK category was abolished — and those
 * must stay untouched; a check that flagged them would be noise and get ignored.
 *
 * Source-only, so it needs no build. After a real extension, update the posts and
 * run `npm run check:dates -- --update` to record the new date from the content.
 * Pass `--today=YYYY-MM-DD` to see what a future build would say.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(root, 'src/content/blog');
const PERIOD_FILE = path.join(root, 'scripts/martial-law-period.json');

const MONTHS = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
];

// A date is the regime boundary only when a cue governs it ("до 31 жовтня 2026
// року") *and* a regime phrase introduces it close by. Both halves are needed:
// the cue alone also matches unrelated deadlines, and the regime phrase alone
// matches the date a law was signed.
const BOUNDARY_CUE = /(?:до|датою)\s*$/;
const REGIME_CUE =
  /(чинн[а-яіїєґ]* (?:період|режим)[а-яіїєґ]*|воєнн[а-яіїєґ]* стан[а-яіїєґ]*|загальна мобілізація|мобілізація продовжен)/i;
const REGIME_WINDOW = 160;

const datePattern = new RegExp(`(\\d{1,2})\\s+(${MONTHS.join('|')})\\s+(\\d{4})`, 'g');

const iso = (d) => d.toISOString().slice(0, 10);
const utc = (y, m, d) => new Date(Date.UTC(y, m, d));
const parseIso = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return utc(y, m - 1, d);
};
const formatUk = (d) =>
  `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} року`;
const daysBetween = (from, to) => Math.round((to - from) / 86400000);

// Emphasis sits between the cue and the date in the posts ("до **31 жовтня 2026
// року**"), so matching has to see through it. Offsets are only used for context.
const stripEmphasis = (text) => text.replace(/[*_]/g, ' ');

/** Every regime end date stated in the posts, with where it was found. */
function findStatedPeriodEnds() {
  const found = [];

  for (const file of fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).sort()) {
    const lines = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8').split('\n');

    lines.forEach((rawLine, index) => {
      const line = stripEmphasis(rawLine);

      for (const match of line.matchAll(datePattern)) {
        const before = line.slice(0, match.index);
        if (!BOUNDARY_CUE.test(before)) continue;
        if (!REGIME_CUE.test(before.slice(-REGIME_WINDOW))) continue;

        const [, day, month, year] = match;
        found.push({
          file,
          line: index + 1,
          date: utc(Number(year), MONTHS.indexOf(month), Number(day)),
          text: match[0],
        });
      }
    });
  }

  return found;
}

const todayArg = process.argv.find((a) => a.startsWith('--today='));
const today = todayArg ? parseIso(todayArg.slice('--today='.length)) : parseIso(iso(new Date()));
if (Number.isNaN(today.getTime())) {
  console.error('✗ --today must be a date as YYYY-MM-DD');
  process.exit(1);
}

const stated = findStatedPeriodEnds();

if (process.argv.includes('--update')) {
  if (stated.length === 0) {
    console.error(
      '\n✗ Nothing to record — no post states a martial-law period end.\n\n' +
        '  Update the posts to the new window first, then run this again.\n'
    );
    process.exit(1);
  }

  const distinct = [...new Set(stated.map((s) => iso(s.date)))];
  if (distinct.length > 1) {
    console.error(
      `\n✗ The posts state ${distinct.length} different period ends: ${distinct.join(', ')}\n\n` +
        '  Reconcile them before recording one of them as current:\n' +
        stated.map((s) => `    • ${s.file}:${s.line} — ${s.text}`).join('\n') +
        '\n'
    );
    process.exit(1);
  }

  const period = JSON.parse(fs.readFileSync(PERIOD_FILE, 'utf8'));
  period.periodEnd = distinct[0];
  fs.writeFileSync(PERIOD_FILE, JSON.stringify(period, null, 2) + '\n');
  console.log(`✓ martial-law-period.json now records ${distinct[0]}, as stated in the posts.`);
  process.exit(0);
}

const period = JSON.parse(fs.readFileSync(PERIOD_FILE, 'utf8'));
const periodEnd = parseIso(period.periodEnd);
const warnDaysBefore = period.warnDaysBefore ?? 21;
const daysLeft = daysBetween(today, periodEnd);

const problems = [];

// The window runs through its final day, so only a date strictly in the past is stale.
if (daysLeft < 0) {
  const overdue = -daysLeft;
  problems.push(
    `the martial-law period ended ${formatUk(periodEnd)} — ${overdue} day${overdue === 1 ? '' : 's'} ago. ` +
      'It will have been extended by a new law, so any post describing the old window is now wrong.'
  );
}

if (stated.length === 0) {
  problems.push(
    'no post states the martial-law period end any more. It is declared as ' +
      `${formatUk(periodEnd)} in scripts/martial-law-period.json, but nothing in src/content/blog ` +
      'asserts it — if the sentence was reworded, this check can no longer see the date it guards.'
  );
}

for (const { file, line, date, text } of stated) {
  if (iso(date) !== iso(periodEnd)) {
    problems.push(
      `${file}:${line} states the period ends ${text}, but ${formatUk(periodEnd)} is declared as ` +
        'current — one of the two is out of date.'
    );
  }
}

if (problems.length > 0) {
  console.error(`\n✗ Martial-law dates are stale (${problems.length}):\n`);
  for (const p of problems) console.error(`  • ${p}`);
  console.error(
    '\n  Check the current режим against an official source, revise the posts that state the\n' +
      '  window and their "станом на" dates, then record it with\n' +
      '  `npm run check:dates -- --update`.\n'
  );
  process.exit(1);
}

if (daysLeft <= warnDaysBefore) {
  console.warn(
    `\n⚠ The martial-law period ends ${formatUk(periodEnd)} — ${daysLeft} day${daysLeft === 1 ? '' : 's'} left.\n` +
      `  The build fails from ${formatUk(utc(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth(), periodEnd.getUTCDate() + 1))}. ` +
      'Watch for the extending law and update the posts.\n'
  );
  process.exit(0);
}

console.log(
  `✓ Martial-law period current until ${formatUk(periodEnd)} (${daysLeft} days), ` +
    `stated in ${stated.length} place${stated.length === 1 ? '' : 's'}`
);
