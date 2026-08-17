-- ============================================================================
-- Living Trail: schema
-- Run this FIRST in the Supabase SQL editor. Safe to re-run (idempotent).
--
-- Security model
-- --------------
-- Nothing in this file grants the browser access to a base table. The anon
-- role can read ONLY the `public_*` views, and each view is filtered to
-- visibility = 'public' and projects only publishable columns. A private row,
-- a hidden org name or a private note is not "hidden by the UI" -- it never
-- leaves the database.
--
-- The views are intentionally NOT security_invoker: they run with the owner's
-- privileges so they can read the base tables that anon cannot touch. That is
-- the mechanism that makes the filtering non-bypassable.
--
-- ---------------------------------------------------------------------------
-- Supabase will flag every view here as "Security Definer View", CRITICAL.
-- That warning is expected, and following it would make this database less
-- safe, not more. Do not "fix" it.
--
-- The lint exists because a definer view bypasses RLS, which is dangerous when
-- it is accidental. Here it is the entire design. Setting
-- `security_invoker = true` was tested and it breaks the site outright:
--
--     ERROR: permission denied for table trail_entries
--
-- To make invoker views work, `anon` needs SELECT on the base tables plus an
-- RLS policy. That was tested too, and it publishes:
--
--     private_note        -- working notes never meant to leave the database
--     org                 -- employers hidden behind show_org = false
--     people              -- names, employers and LinkedIn URLs of people
--                            who have not consented to appear
--
-- because the redaction lives in the view's CASE expressions, and a column
-- grant cannot express "hide this value on rows where a flag is false".
--
-- What actually protects the data, verified by request against the live
-- project rather than assumed:
--
--   * anon has SELECT on the public_* views and nothing else
--   * anon has no privilege of any kind on any base table  -> 401
--   * anon cannot INSERT, UPDATE or DELETE through a view   -> 401
--   * each view filters to visibility = 'public' and redacts per row
--
-- Acknowledge the lint in the Supabase dashboard with that reasoning.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enumerated vocabulary. These live in tables (not Postgres enums) so the
-- filter bar is data-driven: add a trait, it appears on the site, no deploy.
-- ---------------------------------------------------------------------------

create table if not exists chapters (
  id          text primary key,
  title       text not null,
  subtitle    text not null,
  sort_order  int  not null default 0
);

comment on table chapters is
  'The narrative arc. Groups the timeline top-to-bottom; not a filter.';

create table if not exists domains (
  slug        text primary key,
  label       text not null,
  description text,
  sort_order  int  not null default 0
);

comment on table domains is
  'Axis A: where in life something happened. Filter chip.';

create table if not exists traits (
  slug        text primary key,
  label       text not null,
  description text,
  sort_order  int  not null default 0
);

comment on table traits is
  'Axis B: what an entry demonstrates. CV competency verbs. Filter chip.';

-- ---------------------------------------------------------------------------
-- The timeline
-- ---------------------------------------------------------------------------

create table if not exists trail_entries (
  id              uuid primary key default gen_random_uuid(),

  -- stable human key: survives re-seeding, and anchors a permalink (#slug)
  slug            text not null unique,

  -- when
  date            date not null,
  end_date        date,
  precision       text not null default 'day'
                    check (precision in ('day', 'month', 'year')),

  -- where it sits
  chapter         text not null references chapters(id),
  domain          text not null references domains(slug),
  type            text not null default 'milestone'
                    check (type in ('milestone', 'win', 'learning', 'obstacle')),

  -- what it says
  title           text not null,
  note            text,
  obstacle        text,
  learning        text,

  -- attribution, each independently redactable
  org             text,
  show_org        boolean not null default true,
  outcome         text,
  show_outcome    boolean not null default true,

  -- People named in this entry, each with their OWN consent flag:
  --   [{"name": "...", "role": "...", "org": "...", "url": "...", "consent": true}]
  -- Without consent BOTH the name and the employer are stripped, and only the
  -- role survives: "a principal software engineer". Role plus employer would
  -- still identify most people, which is not anonymity.
  people          jsonb not null default '[]'::jsonb,

  -- Evidence. An array, because one milestone can have many homes: a channel
  -- lives on Instagram, Facebook and YouTube at once, and a shipped project
  -- has both a live site and a repo.
  --   [{"label": "YouTube", "url": "https://..."}]
  links           jsonb not null default '[]'::jsonb,

  -- an unlaunched thing: render the title and a "live soon" line, nothing else
  teaser          boolean not null default false,

  -- never exposed by any view; your own working notes
  private_note    text,

  visibility      text not null default 'private'
                    check (visibility in ('public', 'private')),

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Upgrade an already-created table. `create table if not exists` above is a
-- no-op once the table exists, so column changes have to be spelled out.
--
-- The view has to go first: Postgres refuses to drop a column while a view
-- selects it. Every view is rebuilt further down anyway.
drop view if exists public_trail_entries;

alter table trail_entries add column if not exists people jsonb not null default '[]'::jsonb;
alter table trail_entries add column if not exists links  jsonb not null default '[]'::jsonb;

-- Fold the old single link into the array, then retire the two columns.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'trail_entries' and column_name = 'link_url'
  ) then
    update trail_entries
    set links = jsonb_build_array(jsonb_build_object(
      'label', coalesce(link_label, 'Link'), 'url', link_url))
    where links = '[]'::jsonb and link_url is not null;

    alter table trail_entries drop column link_url;
    alter table trail_entries drop column if exists link_label;
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'trail_entries' and column_name = 'teammates'
  ) then
    -- Carry existing names across with consent = false, ALWAYS. Not inherited
    -- from show_teammates: that flag meant "this entry may display names", not
    -- "this person agreed to be named". Treating it as consent would publish
    -- everyone the moment the upgrade ran, which is the exact failure this
    -- column exists to prevent. Consent is granted per person, by hand.
    update trail_entries e
    set people = coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', t, 'role', null, 'org', null, 'consent', false
      ))
      from unnest(e.teammates) t
    ), '[]'::jsonb)
    where people = '[]'::jsonb and array_length(e.teammates, 1) > 0;

    alter table trail_entries drop column teammates;
    alter table trail_entries drop column if exists show_teammates;
  end if;
end $$;

create index if not exists trail_entries_date_idx on trail_entries (date desc);
create index if not exists trail_entries_visibility_idx on trail_entries (visibility);

comment on column trail_entries.links is
  'Evidence, as [{label, url}]. Many per entry: a channel has three homes.';
comment on column trail_entries.people is
  'Per-person consent. consent=false strips name and org, keeping role only.';
comment on column trail_entries.show_org is
  'false => the org name is stripped in the public view, not merely hidden in the UI.';
comment on column trail_entries.teaser is
  'true => public view returns title + teaser flag only. Flip to false on launch.';
comment on column trail_entries.private_note is
  'Never selected by any public view. Safe for anything you would not publish.';

-- Many-to-many: an entry can demonstrate several traits, one of them primary.
create table if not exists entry_traits (
  entry_id    uuid not null references trail_entries(id) on delete cascade,
  trait_slug  text not null references traits(slug),
  is_primary  boolean not null default false,
  primary key (entry_id, trait_slug)
);

create index if not exists entry_traits_trait_idx on entry_traits (trait_slug);

-- At most one primary trait per entry.
create unique index if not exists entry_traits_one_primary_idx
  on entry_traits (entry_id) where is_primary;

-- ---------------------------------------------------------------------------
-- Site content. Everything the components used to hardcode.
-- ---------------------------------------------------------------------------

create table if not exists profile (
  id          int primary key default 1 check (id = 1),
  name        text not null,
  handle      text,
  role        text not null,
  bio         text not null,
  location    text,
  latitude    double precision,
  longitude   double precision,
  email       text,
  phone       text,
  show_phone  boolean not null default false,
  avatar_url  text,
  open_to_work boolean not null default true,
  growing_since int,
  roots       text[] not null default '{}',
  creed_belief   text,
  creed_practice text,
  socials     jsonb not null default '[]'::jsonb,
  core_stack  text[] not null default '{}',
  updated_at  timestamptz not null default now()
);

comment on table profile is
  'Single row (id = 1). Edit here and /about, /resume and the PDF all follow.';

create table if not exists experience (
  id          uuid primary key default gen_random_uuid(),
  company     text not null,
  company_url text,
  role        text not null,
  location    text,
  start_date  date not null,
  end_date    date,
  summary     text,
  bullets     text[] not null default '{}',
  stack       text[] not null default '{}',
  links       jsonb not null default '[]'::jsonb,
  sort_order  int not null default 0,
  visibility  text not null default 'private'
                check (visibility in ('public', 'private'))
);

create table if not exists projects (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  tagline       text,
  category      text not null default 'personal'
                  check (category in ('professional', 'client', 'personal')),
  period        text,
  description   text,
  highlights    text[] not null default '{}',
  technologies  text[] not null default '{}',
  live_url      text,
  repo_url      text,
  teaser        boolean not null default false,
  -- The one-page resume shows a chosen few, not everything you have built.
  on_resume     boolean not null default false,
  sort_order    int not null default 0,
  visibility    text not null default 'private'
                  check (visibility in ('public', 'private'))
);

comment on column projects.teaser is
  'Unlaunched: public view returns name + teaser flag, no description or links.';

create table if not exists education (
  id           uuid primary key default gen_random_uuid(),
  institution  text not null,
  degree       text not null,
  location     text,
  period       text,
  detail       text,
  -- The one-page resume lists degrees, not every school.
  on_resume    boolean not null default false,
  sort_order   int not null default 0,
  visibility   text not null default 'private'
                 check (visibility in ('public', 'private'))
);

create table if not exists volunteering (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  org         text not null,
  period      text,
  bullets     text[] not null default '{}',
  sort_order  int not null default 0,
  visibility  text not null default 'private'
                check (visibility in ('public', 'private'))
);

create table if not exists skills (
  id          uuid primary key default gen_random_uuid(),
  "group"     text not null,
  items       text[] not null default '{}',
  -- Presentation hints. The icon is a key, resolved to a component in the UI;
  -- storing a React component in Postgres is not a thing.
  icon        text,
  accent      text not null default 'zinc',
  -- The site shows six detailed groups; the one-page resume shows five
  -- condensed lines. Same table, different audience.
  context     text not null default 'site'
                check (context in ('site', 'resume')),
  sort_order  int not null default 0,
  visibility  text not null default 'private'
                check (visibility in ('public', 'private'))
);

create table if not exists judge_profiles (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  handle      text not null,
  url         text not null,
  rating      text,
  sort_order  int not null default 0,
  visibility  text not null default 'private'
                check (visibility in ('public', 'private'))
);

create table if not exists stats (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  value       text not null,
  context     text not null default 'hero'
                check (context in ('hero', 'competitive')),
  sort_order  int not null default 0,
  visibility  text not null default 'private'
                check (visibility in ('public', 'private'))
);

-- ---------------------------------------------------------------------------
-- Natural keys, so the seed can upsert instead of duplicating on re-run.
-- ---------------------------------------------------------------------------

create unique index if not exists experience_key_idx     on experience (company, role);
create unique index if not exists projects_key_idx       on projects (name);
create unique index if not exists education_key_idx      on education (institution, degree);
create unique index if not exists volunteering_key_idx   on volunteering (title, org);
create unique index if not exists skills_key_idx         on skills (context, "group");
create unique index if not exists judge_profiles_key_idx on judge_profiles (name);
create unique index if not exists stats_key_idx          on stats (label, context);

-- ---------------------------------------------------------------------------
-- Growth algorithm knobs. Tunable without a deploy, which is the point of
-- rescaling: you can watch the tree respond and adjust.
-- ---------------------------------------------------------------------------

create table if not exists growth_weights (
  key    text primary key,
  value  double precision not null,
  note   text
);

-- ---------------------------------------------------------------------------
-- Lock the base tables. RLS with no policy = nobody but the owner reads them.
-- ---------------------------------------------------------------------------

alter table chapters        enable row level security;
alter table domains         enable row level security;
alter table traits          enable row level security;
alter table trail_entries   enable row level security;
alter table entry_traits    enable row level security;
alter table profile         enable row level security;
alter table experience      enable row level security;
alter table projects        enable row level security;
alter table education       enable row level security;
alter table volunteering    enable row level security;
alter table skills          enable row level security;
alter table judge_profiles  enable row level security;
alter table stats           enable row level security;
alter table growth_weights  enable row level security;

revoke all on chapters, domains, traits, trail_entries, entry_traits,
              profile, experience, projects, education, volunteering,
              skills, judge_profiles, stats, growth_weights
  from anon, authenticated;

-- ---------------------------------------------------------------------------
-- The only surface the browser sees.
-- ---------------------------------------------------------------------------

-- Dropped and recreated rather than replaced, so that adding or removing a
-- column in any view is a re-runnable change rather than an error.
drop view if exists public_chapters, public_domains, public_traits,
  public_trail_entries, public_profile, public_experience, public_projects,
  public_education, public_volunteering, public_skills, public_judge_profiles,
  public_stats, public_growth_weights;

create or replace view public_chapters as
  select id, title, subtitle, sort_order
  from chapters
  order by sort_order;

create or replace view public_domains as
  select slug, label, description, sort_order
  from domains
  order by sort_order;

create or replace view public_traits as
  select slug, label, description, sort_order
  from traits
  order by sort_order;

-- A teaser row yields its title and nothing else. A row with show_org = false
-- yields a null org. private_note is not in the select list at all.
create or replace view public_trail_entries as
  select
    e.id,
    e.slug,
    e.date,
    case when e.teaser then null else e.end_date end                as end_date,
    e.precision,
    e.chapter,
    e.domain,
    e.type,
    e.title,
    case when e.teaser then null else e.note end                    as note,
    case when e.teaser then null else e.obstacle end                as obstacle,
    case when e.teaser then null else e.learning end                as learning,
    case when e.teaser or not e.show_org then null else e.org end   as org,
    case when e.teaser or not e.show_outcome
         then null else e.outcome end                               as outcome,
    case when e.teaser then '[]'::jsonb else coalesce((
      select jsonb_agg(
        case when coalesce((p->>'consent')::boolean, false)
             -- consented: name, role and org all travel
             then jsonb_strip_nulls(jsonb_build_object(
                    'name', p->>'name', 'role', p->>'role',
                    'org',  p->>'org',
                    'url',  case when p->>'url' ~* '^https?://'
                                 then p->>'url' end))
             -- Not consented: name, employer and profile link all stay in the
             -- database. A profile link identifies someone completely, so it
             -- is gated exactly like the name.
             else jsonb_strip_nulls(jsonb_build_object('role', p->>'role'))
        end)
      from jsonb_array_elements(e.people) p
    ), '[]'::jsonb) end                                             as people,
    -- Scheme allowlist at the source. `javascript:` in an href executes on
    -- click, and every link here is data. The client checks again; this makes
    -- sure an unsafe scheme is never served in the first place.
    case when e.teaser then '[]'::jsonb else coalesce((
      select jsonb_agg(l)
      from jsonb_array_elements(e.links) l
      where l->>'url' ~* '^(https?://|mailto:)'
    ), '[]'::jsonb) end                                             as links,
    e.teaser,
    coalesce(
      (select array_agg(t.trait_slug order by t.is_primary desc, t.trait_slug)
       from entry_traits t where t.entry_id = e.id),
      '{}'::text[]
    ) as traits,
    (select t.trait_slug from entry_traits t
      where t.entry_id = e.id and t.is_primary limit 1) as primary_trait
  from trail_entries e
  where e.visibility = 'public'
  order by e.date desc;

create or replace view public_profile as
  select
    name, handle, role, bio, location, latitude, longitude, email,
    case when show_phone then phone end as phone,
    avatar_url, open_to_work, growing_since, roots,
    creed_belief, creed_practice, socials, core_stack
  from profile
  where id = 1;

create or replace view public_experience as
  select id, company, company_url, role, location, start_date, end_date,
         summary, bullets, stack, links, sort_order
  from experience
  where visibility = 'public'
  order by sort_order, start_date desc;

create or replace view public_projects as
  select
    id, name,
    case when teaser then null else tagline end       as tagline,
    category,
    case when teaser then null else period end        as period,
    case when teaser then null else description end   as description,
    case when teaser then '{}'::text[] else highlights end   as highlights,
    case when teaser then '{}'::text[] else technologies end as technologies,
    case when teaser then null else live_url end      as live_url,
    case when teaser then null else repo_url end      as repo_url,
    teaser, on_resume, sort_order
  from projects
  where visibility = 'public'
  order by sort_order;

create or replace view public_education as
  select id, institution, degree, location, period, detail, on_resume, sort_order
  from education
  where visibility = 'public'
  order by sort_order;

create or replace view public_volunteering as
  select id, title, org, period, bullets, sort_order
  from volunteering
  where visibility = 'public'
  order by sort_order;

create or replace view public_skills as
  select id, "group", items, icon, accent, context, sort_order
  from skills
  where visibility = 'public'
  order by context, sort_order;

create or replace view public_judge_profiles as
  select id, name, handle, url, rating, sort_order
  from judge_profiles
  where visibility = 'public'
  order by sort_order;

create or replace view public_stats as
  select id, label, value, context, sort_order
  from stats
  where visibility = 'public'
  order by sort_order;

create or replace view public_growth_weights as
  select key, value from growth_weights;

-- CRITICAL. Supabase runs `alter default privileges in schema public grant all
-- on tables to anon, authenticated`, so every view created here is
-- automatically granted INSERT, UPDATE and DELETE to the public role. A
-- `grant select` is ADDITIVE: it does not take those away.
--
-- Without this revoke, anyone holding the anon key (which is public by design
-- and shipped in the client bundle) can UPDATE through a view, and Postgres
-- propagates a simple-column update straight to the base table. That is write
-- access to the whole site for anybody who views source.
--
-- Revoke first, then grant back exactly the read that is wanted.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;

grant select on
  public_chapters, public_domains, public_traits, public_trail_entries,
  public_profile, public_experience, public_projects, public_education,
  public_volunteering, public_skills, public_judge_profiles, public_stats,
  public_growth_weights
to anon, authenticated;
