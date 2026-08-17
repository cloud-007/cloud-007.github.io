# Living Trail: Supabase setup

Everything on this site reads from Supabase. This is the one-time setup. Takes
about ten minutes, and you never need to touch code again to change content.

## What you are building

```
  Supabase (Postgres)
    trail_entries, projects, experience, ...     <- you edit these
        |
        |  base tables: anon has NO access at all
        v
    public_* views                               <- visibility='public' only
        |                                           private columns not selected
        v
  Your site (browser)  +  build-time snapshot
```

A row marked `private` is not hidden by the UI. It is never selected by any
view the browser can reach, so it cannot appear in the page source, the network
tab, or the committed snapshot.

---

## 1. Create the project

1. Go to <https://supabase.com> and sign in.
2. **New project**. Name it whatever you like (`living-trail` is fine).
3. Pick the region closest to your readers. **Singapore** or **Mumbai** is the
   right call from Bangladesh.
4. Save the database password somewhere safe. You will not need it for this
   site, but you will want it later.
5. Wait for provisioning (~2 minutes).

## 2. Create the schema

1. In the sidebar: **SQL Editor** -> **New query**.
2. Paste the entire contents of [`01-schema.sql`](./01-schema.sql).
3. **Run**. You should see `Success. No rows returned`.

## 3. Seed your data

> **These three files are gitignored on purpose.** `02-seed.sql`,
> `03-seed-content.sql` and `REVIEW.md` contain every row including the private
> ones: interview companies, unverified claims, and `private_note` text. This
> repo is public, so they live on your machine only. They are one-time bootstrap
> files; once they have run, the database is their home.

1. **SQL Editor** -> **New query**.
2. Paste the entire contents of `02-seed.sql`. **Run**.
3. **New query** again, paste `03-seed-content.sql`. **Run**.

Everything unverified or sensitive is seeded as `visibility = 'private'`. It is
in your database, invisible on the site, absent from the committed snapshot, and
waiting for you to review it. See `REVIEW.md` for the list and why each one is
held back.

## 4. Get your keys

**Project Settings** -> **API**. You need exactly two values:

| Field | Goes where | Safe in public? |
|---|---|---|
| **Project URL** | `.env.local` + GitHub secret | Yes |
| **anon / public key** | `.env.local` + GitHub secret | Yes, this key is designed to be public |
| service_role key | **nowhere** | **No. Never put this anywhere.** |

The anon key is safe precisely because of the schema above: it can read the
`public_*` views and nothing else. The service_role key bypasses all of that,
which is why this project never uses it.

## 5. Wire up local development

Create `.env.local` in the repo root (it is gitignored, and Claude is denied
read access to it by `.claude/settings.json`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Then:

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The trail should render from Supabase.

## 6. Wire up the deploy

GitHub -> your repo -> **Settings** -> **Secrets and variables** -> **Actions**
-> **New repository secret**. Add both:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The build uses them to generate the public snapshot. Without them the build
still succeeds and falls back to the last committed snapshot.

---

## Day-to-day: adding an entry

**Table Editor** -> `trail_entries` -> **Insert row**. Works fine on a phone.

The fields that matter:

| Field | What to put |
|---|---|
| `date` | when it happened |
| `end_date` | only for spans (a role, a bootcamp). Leave null for a moment. |
| `precision` | `day`, `month` or `year` -- controls how the date renders |
| `chapter` | `roots` / `foundations` / `building` / `leading` |
| `domain` | which part of life: `education`, `built`, `community`, ... |
| `type` | `milestone` / `win` / `learning` / `obstacle` |
| `title` | the headline |
| `note` | a sentence or two |
| `learning` | what it taught you (optional, and it raises the growth weight) |
| `visibility` | **starts `private`.** Set `public` when you are ready. |

Then add its traits in `entry_traits`: one row per trait, with `is_primary`
true on exactly one.

### The redaction switches

| Switch | Effect when off |
|---|---|
| `show_org` | the company name is stripped from the API response |
| `show_outcome` | the outcome is stripped |
| `show_teammates` | the names are stripped |
| `teaser` | only the title survives; everything else returns null |
| `private_note` | never published, whatever else you set |

Flipping `teaser` from `true` to `false` is how an unlaunched project reveals
itself on launch day. No deploy.

## Keeping a free project awake

Free Supabase projects can pause after a stretch with no requests. Two things
protect you:

1. The committed snapshot renders instantly whether or not Supabase answers.
2. `.github/workflows/keepalive.yml` pings the project weekly.

If it ever does pause, un-pause it from the dashboard; the site never breaks in
the meantime.

## Troubleshooting

**The page renders but the trail is empty.**
Nothing is `public` yet. That is the intended starting state -- open
`trail_entries` and promote the rows you want.

**`permission denied for table trail_entries`.**
Something is querying a base table instead of a `public_*` view. That error is
the security model working correctly.

**Local works, deploy shows old content.**
The two GitHub Actions secrets are missing, so the build fell back to the
committed snapshot.
