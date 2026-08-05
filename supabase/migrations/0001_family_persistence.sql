-- Kindlyo family persistence (decision 034).
--
-- Families, memberships, child profiles, lesson progress, and mission
-- completions — the data that used to live in one browser's local storage.
-- Every table is scoped to a family; a parent reaches only their own, resolved
-- from their user id (see src/server/families/service.ts) and, as a backstop,
-- by the row-level-security policies at the foot of this file.
--
-- Applied with the Supabase CLI (`supabase db push`, or `supabase db reset` for
-- a clean local database that also runs supabase/seed.sql). gen_random_uuid()
-- is built into PostgreSQL 13+ (Supabase is 15), so no extension is required.

-- A family is the unit everything else hangs off. `onboarded_at` gates the
-- parent onboarding flow (decision 024); `selected_profile_id` remembers which
-- child is learning right now. Its foreign key is added after child_profiles
-- exists, to avoid a chicken-and-egg between the two tables.
create table if not exists public.families (
  id                  uuid primary key default gen_random_uuid(),
  onboarded_at        timestamptz,
  selected_profile_id uuid,
  created_at          timestamptz not null default now()
);

-- One parent belongs to one family for the MVP (unique user_id). The role
-- column leaves room for a second guardian later without a schema change.
-- user_id is the Supabase auth user id, held as text so the in-memory
-- development stand-in (which uses non-uuid ids) shares the same shape.
create table if not exists public.family_memberships (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references public.families (id) on delete cascade,
  user_id    text not null,
  role       text not null default 'owner' check (role in ('owner', 'guardian')),
  created_at timestamptz not null default now(),
  unique (user_id),
  unique (family_id, user_id)
);

create index if not exists family_memberships_family_id_idx
  on public.family_memberships (family_id);

-- A child profile is a nickname, an age band, and optionally one drawn avatar —
-- and there is deliberately nowhere to put anything else (docs/PROFILES.md).
-- The check constraints mirror the union types the app validates against, so
-- hand-written SQL cannot widen them either. At most three profiles per family
-- is enforced in the service (a count, not a constraint); the comment records
-- that this is intentional.
create table if not exists public.child_profiles (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references public.families (id) on delete cascade,
  nickname   text not null check (char_length(nickname) between 1 and 24),
  age_band   text not null check (age_band in ('5–6', '7–9')),
  avatar_id  text check (avatar_id in ('fox', 'star', 'leaf', 'moon', 'boat', 'bird')),
  created_at timestamptz not null default now()
);

create index if not exists child_profiles_family_id_idx
  on public.child_profiles (family_id);

-- Deleting a child clears any selection pointing at them: a deleted child is no
-- longer "who is learning", matching the prototype's behaviour.
alter table public.families
  add constraint families_selected_profile_id_fkey
  foreign key (selected_profile_id)
  references public.child_profiles (id) on delete set null;

-- One row per (child, lesson): the resumable run and the durable completion
-- together. The run is version-tagged so a lesson revision can discard it
-- (decision 019); the completion records its version but survives revisions
-- (decision 022). `updated_at` is the child's own activity clock, moved only by
-- the child's actions and never by a parent marking a mission (decision 029).
create table if not exists public.lesson_progress (
  id                       uuid primary key default gen_random_uuid(),
  child_profile_id         uuid not null references public.child_profiles (id) on delete cascade,
  lesson_id                text not null,
  run_lesson_version       integer,
  run_step_index           integer,
  run_choices              jsonb not null default '{}'::jsonb,
  run_practice_option_id   text,
  run_completed_at         timestamptz,
  completed_lesson_version integer,
  completed_at             timestamptz,
  updated_at               timestamptz,
  unique (child_profile_id, lesson_id)
);

create index if not exists lesson_progress_child_profile_id_idx
  on public.lesson_progress (child_profile_id);

-- The offline mission's status, marked by the parent (decision 023). Its own
-- table, matching ARCHITECTURE.md's MissionCompletion entity, and kept apart
-- from lesson_progress so marking a mission never touches the activity clock.
-- The presence of a row means "done"; unmarking deletes it.
create table if not exists public.mission_completions (
  id                uuid primary key default gen_random_uuid(),
  child_profile_id  uuid not null references public.child_profiles (id) on delete cascade,
  lesson_id         text not null,
  marked_by_user_id text not null,
  created_at        timestamptz not null default now(),
  unique (child_profile_id, lesson_id)
);

create index if not exists mission_completions_child_profile_id_idx
  on public.mission_completions (child_profile_id);

-- Row-level security: defence in depth behind the service's own scoping. The
-- application uses the service-role key, which bypasses RLS, so the service is
-- the primary control (and the one the authorization tests cover). These
-- policies protect any OTHER path to the data — a parent's own anon session,
-- the auto-generated REST API, a future client-side read — by tying every row
-- to the caller's family through family_memberships.user_id = auth.uid().
alter table public.families enable row level security;
alter table public.family_memberships enable row level security;
alter table public.child_profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.mission_completions enable row level security;

create policy family_memberships_own on public.family_memberships
  for all
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy families_own on public.families
  for all
  using (
    id in (
      select family_id from public.family_memberships
      where user_id = auth.uid()::text
    )
  )
  with check (
    id in (
      select family_id from public.family_memberships
      where user_id = auth.uid()::text
    )
  );

create policy child_profiles_own on public.child_profiles
  for all
  using (
    family_id in (
      select family_id from public.family_memberships
      where user_id = auth.uid()::text
    )
  )
  with check (
    family_id in (
      select family_id from public.family_memberships
      where user_id = auth.uid()::text
    )
  );

-- Progress and missions are scoped one hop further out, through the child to
-- the family the caller belongs to.
create policy lesson_progress_own on public.lesson_progress
  for all
  using (
    child_profile_id in (
      select cp.id
      from public.child_profiles cp
      join public.family_memberships fm on fm.family_id = cp.family_id
      where fm.user_id = auth.uid()::text
    )
  )
  with check (
    child_profile_id in (
      select cp.id
      from public.child_profiles cp
      join public.family_memberships fm on fm.family_id = cp.family_id
      where fm.user_id = auth.uid()::text
    )
  );

create policy mission_completions_own on public.mission_completions
  for all
  using (
    child_profile_id in (
      select cp.id
      from public.child_profiles cp
      join public.family_memberships fm on fm.family_id = cp.family_id
      where fm.user_id = auth.uid()::text
    )
  )
  with check (
    child_profile_id in (
      select cp.id
      from public.child_profiles cp
      join public.family_memberships fm on fm.family_id = cp.family_id
      where fm.user_id = auth.uid()::text
    )
  );
