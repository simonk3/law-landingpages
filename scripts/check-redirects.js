#!/usr/bin/env node

/**
 * Guards the published blog URLs against silent renames.
 *
 * Blog posts are markdown files whose filename IS the published slug, and six of
 * those slugs are the destinations of permanent redirects from the old Cyrillic
 * URLs Prismic generated. Nothing in the build enforces that link: renaming a file
 * still produces a green build, while an indexed URL starts 404ing and the redirect
 * pointing at it leads nowhere. That failure is silent and expensive, so it is
 * checked here instead of being discovered in Search Console.
 *
 * Only six posts carry a redirect, but all of them are indexed URLs, so a snapshot of
 * known slugs covers the rest: a slug may only disappear by editing known-slugs.json,
 * which puts the decision in the diff where a reviewer can see it. Bless a deliberate
 * rename with `node scripts/check-redirects.js --update`.
 *
 * Runs in postbuild, after dist exists, and also works standalone against src alone.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(root, 'src/content/blog');
const DIST_BLOG = path.join(root, 'dist/blog');
const SLUGS_FILE = path.join(root, 'scripts/known-slugs.json');

const slugOf = (destination) =>
  destination.replace(/^\/+|\/+$/g, '').split('/').pop();

const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const blogRedirects = (vercel.redirects ?? []).filter((r) =>
  (r.destination ?? '').startsWith('/blog/')
);

const problems = [];

// Two redirects pointing at the same place, or one slug reached by two sources, is
// not itself an error — but the same source listed twice is a config mistake.
const sources = blogRedirects.map((r) => r.source);
const duplicateSources = sources.filter((s, i) => sources.indexOf(s) !== i);
for (const source of new Set(duplicateSources)) {
  problems.push(`vercel.json lists the redirect source twice: ${source}`);
}

// dist is only there after a build; standalone runs check the source tree alone.
const builtPagesChecked = fs.existsSync(DIST_BLOG);

for (const { source, destination } of blogRedirects) {
  const slug = slugOf(destination);

  if (!fs.existsSync(path.join(CONTENT_DIR, `${slug}.md`))) {
    problems.push(
      `${source} redirects to ${destination}, but src/content/blog/${slug}.md does not exist`
    );
    continue;
  }

  if (builtPagesChecked && !fs.existsSync(path.join(DIST_BLOG, slug, 'index.html'))) {
    problems.push(
      `${destination} has a source file but was not built — expected dist/blog/${slug}/index.html`
    );
  }
}

// Every post is a live URL, not just the six with redirects. The snapshot catches a
// rename that no redirect points at — the case a redirect-only check sails past.
const currentSlugs = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''))
  .sort();

if (process.argv.includes('--update')) {
  fs.writeFileSync(SLUGS_FILE, JSON.stringify(currentSlugs, null, 2) + '\n');
  console.log(`✓ known-slugs.json updated — ${currentSlugs.length} slugs recorded`);
  process.exit(0);
}

if (fs.existsSync(SLUGS_FILE)) {
  const known = JSON.parse(fs.readFileSync(SLUGS_FILE, 'utf8'));
  for (const slug of known) {
    if (!currentSlugs.includes(slug)) {
      problems.push(
        `/blog/${slug}/ was published but src/content/blog/${slug}.md is gone — ` +
          'rename it back, or run with --update if the URL was meant to change'
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`\n✗ Published blog URLs would break (${problems.length}):\n`);
  for (const p of problems) console.error(`  • ${p}`);
  console.error(
    '\n  A post filename is its URL. Restore the name, or — if the change is intended —\n' +
      '  update vercel.json and run `npm run check:redirects -- --update`.\n'
  );
  process.exit(1);
}

const scope = builtPagesChecked ? 'source and built output' : 'source only';
console.log(
  `✓ ${blogRedirects.length} redirects resolve, ${currentSlugs.length} slugs intact (${scope})`
);
