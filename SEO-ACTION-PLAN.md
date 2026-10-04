# Lex Duo — SEO action plan

Audit date: 2026-10-03. Supersedes `SEO-REPORT.txt`, `SEO-SETUP.md` and
`SEO-OPTIMIZATION-GUIDE.md`, which describe work that is either done or no longer true.

---

## 1. Fixed in this pass (code, already built and verified)

| Problem | Why it mattered | Fix |
|---|---|---|
| Footer linked `/privacy`, `/terms`, `/legal` on every page — all three return 404 | ~19 pages × 3 internal links into nowhere. Shows up in GSC as **Not found (404)** and wastes crawl budget | Legal column removed from the footer. The pages still need to be written (see §4) |
| Three social icons pointed at `href="#"` | Dead links on every page, nothing for a visitor or a crawler | Replaced with the one profile that exists (Telegram) |
| No 404 page — Vercel served a blank 79-byte default | A visitor hitting a dead URL had no route back; no internal links from the error page | `src/pages/404.astro`: branded, `noindex`, links to all six practice areas, blog and contact |
| Every page existed at two URLs (`/poslugy/dtp-advokat` **and** `/poslugy/dtp-advokat/`, both HTTP 200), internal links used the non-slash form while the sitemap and canonical used the slash form | Google crawls both, reports the non-canonical one under **Duplicate / Alternate page with proper canonical tag**, and spends half the crawl budget on URLs you do not want indexed | `trailingSlash: 'always'` (Astro) + `"trailingSlash": true` (Vercel) + every internal link, breadcrumb and schema URL now emits the trailing-slash form. Verified: zero non-slash page links left in `dist/` |
| Blog reading time and `wordCount` were computed from `data.text` — the one-paragraph *excerpt*, not the article | Every post advertised "2 хв" and a 33-word body in its `Article` schema. A 33-word word count is a quality signal pointing the wrong way | Both now read the rich-text body. Real figures appear (e.g. 220 words) |
| `Article.author` was `Organization` | Legal advice is YMYL content; Google weighs a named, credentialed author | `author` is now `Person` — Кушніренко Семен, Адвокат, `worksFor` the organization `@id` |
| Meta description was `text.slice(0, 160)` | Cut words in half mid-snippet | Trims at the last word boundary and appends an ellipsis |

Not changed, deliberately: the `keywords`, `geo.*` and `ICBM` meta tags are ignored by
Google but harmless, and `robots.txt` is already correct.

---

## 2. Google Search Console — what to check, in priority order

I cannot read your GSC account, so this is the list of what to open and what the fix is.
Work top to bottom; the first three are where the real losses are.

### 2.1 Pages → "Not found (404)" — do this first
Expect to see `/privacy`, `/terms` and `/legal` listed. They are no longer linked after
this pass, so **mark them Validate Fix** once deployed. If other 404s show up, they are
almost certainly old blog slugs — see §3.

### 2.2 Pages → "Page with redirect" and "Duplicate, Google chose a different canonical"
Before this pass both URL spellings returned 200. After deploying, the non-slash form
308-redirects to the slash form. Google will reprocess this on its own, but you should:
1. Re-submit the sitemap (`https://www.lexduo.com.ua/sitemap-index.xml`) to force a recrawl.
2. Use **URL Inspection → Request indexing** on the six `/poslugy/*/` pages and `/blog/`.
   Those are the pages that earn money; do not spend the daily quota on blog posts.
3. Re-check in two weeks. The "Duplicate" bucket should drain.

### 2.3 Pages → "Crawled - currently not indexed"
This is the bucket to expect your blog posts in, and the cause is thin content: **every
post is roughly 220–240 words** (confirmed by counting the rendered bodies — the whole site
indexes to 1,781 unique words). Google does not reject them, it just does not consider them
worth indexing. There is no technical fix. §3 is the fix.

### 2.4 Experience → Core Web Vitals (mobile first)
Fonts load from Google Fonts with a `preload`+`onload` swap, GTM, Hotjar and Clarity all
run on every page. Three analytics tools on a 20-page brochure site is a lot of main-thread
work. If mobile LCP or INP is flagged, drop Clarity or Hotjar — they overlap almost
entirely — before optimising anything else.

### 2.5 Enhancements → Breadcrumbs / FAQ / Structured data
Check for errors on `Article` (the author change should clear "author field missing/invalid"
style warnings) and on `BreadcrumbList`. All breadcrumb `item` URLs now use the canonical
trailing-slash form, so any "URL not matching canonical" warnings should clear.

### 2.6 Settings → Domain property + Bing
- Confirm the property is a **Domain property** (`lexduo.com.ua`), not a URL-prefix one.
  A URL-prefix property for `https://www.…` hides everything happening on the apex domain.
- Add the site to Bing Webmaster Tools and import from GSC. Bing is a non-trivial share of
  Ukrainian desktop traffic and the import takes two minutes.

### 2.7 Google Business Profile (not GSC, same priority)
`GOOGLE-BUSINESS-OPTIMIZATION.md` exists in the repo. For a Kyiv law firm, the GBP listing
and its reviews outrank almost everything the website can do for "адвокат Київ". Verify the
listing, match the NAP exactly to `src/config/contact.ts` (вул. Успішна, 28 / 01001 /
+380 67 643 8000), and ask every closed client for a review. Once you have real reviews,
add `aggregateRating` to the `LegalService` schema — never invent them.

---

## 3. Blog content: the plan

### 3.1 Current state
Seven posts, all military law, all ~220 words. The military topic choice is right — it is
where the demand is and where the firm has depth — but 220 words will not rank for anything
with competition. The other five practice areas have **zero** supporting content, and no
blog post links to the service page it should feed.

### 3.2 Two rules that apply to every article
1. **1,200–2,000 words, structured.** H2 per sub-question, numbered steps for procedures,
   a table where there are amounts or deadlines, and the article must cite the actual norm
   (статтю закону, постанову КМУ, № і дату) — that citation is the thing a competitor's
   AI-written copy will not have, and it is what wins YMYL legal queries.
2. **Every article links to exactly one service page** with descriptive anchor text
   (`військовий адвокат у Києві`, not `тут`), plus two sibling articles. Rewrite the seven
   existing posts to do this too — right now the blog feeds the service pages nothing.

### 3.3 First: rewrite what exists (before writing anything new)
Seven posts already have URLs, internal links and whatever history they have accumulated.
Expanding them from 220 → 1,400 words is cheaper and faster than seven new articles, and
the existing URL keeps any equity. Priority order:

1. `мобілізація-у-2025-році-хто-має-право-на-відстрочку` → retitle to **2026**, rebuild
   around the current відстрочка grounds with a table of ground → document → where to file.
   Highest-volume query in the set.
2. `як-звільнитися-з-віиськовоі-служби-за-станом-здоровя` → full ВЛК procedure, the
   "непридатний / обмежено придатний" distinction, how to appeal a ВЛК decision, timelines.
3. `поранення-на-фронті-які-виплати-та-пільги` → every payment with its amount, the legal
   basis and the refusal grounds. Add an "updated" date; amounts change.
4. `арешт-віиськовослужбовця-права-та-порядок-захисту`
5. `віиськовии-юрист-права-мобілізованого`
6. `zsu-advokat` — drop the ✍️ emoji from the title; it eats snippet width and looks like spam.
7. `віиськовии-квиток-що-робити-якщо-загубив`

### 3.4 Fix the slugs while you are in there
The Prismic auto-slugger mangles `й` into `и`. Five of seven URLs are misspelled:
`віиськовии` instead of `військовий`, `віини` instead of `війни`, `здоровя` instead of
`здоров'я`. Percent-encoded, these become 200+ character URLs containing a misspelling of
the exact keyword they target.

Fix: set `custom_url.uid` in Prismic to a clean Latin slug for each post (the code already
prefers it — `postSlug()` in `src/lib/prismic.ts`), e.g.:

| Current | Set `custom_url.uid` to |
|---|---|
| `мобілізація-у-2025-році-хто-має-право-на-відстрочку` | `vidstrochka-vid-mobilizatsii` |
| `як-звільнитися-з-віиськовоі-служби-за-станом-здоровя…` | `zvilnennya-za-stanom-zdorovya-vlk` |
| `поранення-на-фронті-які-виплати-та-пільги-ви-отримуєте` | `vyplaty-za-poranennya` |
| `арешт-віиськовослужбовця-права-та-порядок-захисту` | `aresht-viyskovosluzhbovtsya` |
| `віиськовии-юрист-права-мобілізованого--що-треба-знати` | `prava-mobilizovanogo` |
| `віиськовии-квиток-що-робити-якщо-загубив-під-час-віини` | `zagublenyy-viyskovyy-kvytok` |

Then add a 301 for each old path in `vercel.json` so nothing 404s:

```json
"redirects": [
  { "source": "/blog/мобілізація-у-2025-році-хто-має-право-на-відстрочку",
    "destination": "/blog/vidstrochka-vid-mobilizatsii/", "permanent": true }
]
```

Verify each redirect with `curl -I` after deploy — Vercel's matching of non-ASCII sources
needs checking rather than assuming.

### 3.5 New articles, by cluster

Each cluster feeds one service page. Build them in this order: cluster A is already half
built and has the demand; E and F are the highest-value-per-client.

**A. Військове право → `/poslugy/viyskovyy-advokat/`** (continue after the rewrites)
1. СЗЧ: що робити, якщо ви самовільно залишили частину — відповідальність і шляхи повернення
2. Оскарження рішення ВЛК: покрокова інструкція 2026
3. Переведення до іншої військової частини: законні підстави та порядок
4. Відпустка військовослужбовця: види, тривалість, що робити при відмові
5. Статус УБД: як отримати і що робити при відмові
6. Виплати родині загиблого військовослужбовця: повний перелік
7. Чи законна повістка, вручена на вулиці? Розбір практики
8. Бронювання працівників: що має зробити роботодавець

**B. Кримінальні справи → `/poslugy/kryminalni-spravy/`** (zero content today)
9. Вас викликали на допит: 7 правил, які зберігають вашу позицію
10. Обшук у квартирі чи офісі: що можна і чого не можна слідчому
11. Запобіжні заходи: від особистого зобов'язання до тримання під вартою
12. Угода про визнання винуватості: коли це вигідно, а коли ні
13. Як оскаржити вирок: строки апеляції та касації

**C. Сімейне право → `/poslugy/simeyne-pravo/`**
14. Розлучення в Україні у 2026: процедура, строки, вартість
15. Аліменти: як розраховуються і як стягнути заборгованість
16. Розлучення, коли один із подружжя за кордоном або на фронті
17. Поділ майна подружжя: що є спільним, а що ні
18. Визначення місця проживання дитини: на що дивиться суд

**D. ДТП → `/poslugy/dtp-advokat/`**
19. Що робити одразу після ДТП: чекліст на місці події
20. Страхова занижує виплату за ОСЦПВ: як оскаржити
21. Позбавлення водійських прав: за що і як оскаржити протокол
22. ДТП з потерпілим: межа між адмін- і кримінальною відповідальністю

**E. Господарські та цивільні спори → `/poslugy/gospodarski-tsyvilni-spory/`**
23. Контрагент не платить: претензія, суд, виконавче провадження
24. Стягнення боргу за розпискою: строки давності та докази
25. Форс-мажор у договорі під час війни: коли спрацьовує насправді
26. Спадкування: строки, відмова, спір про спадщину

**F. Адміністративні справи → `/poslugy/administratyvni-spravy/`**
27. Оскарження рішення ТЦК в адміністративному суді
28. Спір із податковою: оскарження ППР у 2026
29. Відмова державного органу: досудове оскарження vs позов

### 3.6 Cadence and measurement
Two articles a week, sequenced as: all seven rewrites → cluster A → B → E → C → D → F.
Each one gets its service-page link and two sibling links before it ships. Judge the
programme at 90 days on impressions per cluster in GSC (Performance → Pages, filtered by
`/blog/`), not on rankings — impressions move first.

---

## 4. Still outstanding (not code I should write for you)

1. **Privacy policy / terms pages.** The site runs GTM, Hotjar and Microsoft Clarity and
   collects names and phone numbers through a lead form. It needs a real
   «Політика конфіденційності» naming those processors. I removed the dead links rather
   than invent legal text for a law firm — the content is yours to write, and then the
   footer column goes back.
2. **An author / attorneys page.** `3f6d86a` removed the attorneys page for having
   placeholder content, which was the right call, but the blog's `Article.author` now
   points at a person with no page to land on. For YMYL legal content a real bio — bar
   admission number, years of practice, case types, photo — is one of the highest-value
   pages you can add, and it is the one thing competitors cannot copy.
3. **Reviews.** Real GBP reviews, then `aggregateRating` in the schema.
