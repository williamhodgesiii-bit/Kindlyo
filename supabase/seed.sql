-- Development seed for Kindlyo family data (decision 034).
--
-- Run by `supabase db reset`. Safe to re-run: it removes the demo family first.
-- NOT for production — it invents a parent that has no real auth credentials.
--
-- The demo parent's user id. To see this family when you sign in locally, point
-- this at your Supabase Auth user's id (Dashboard → Authentication → Users), or
-- create an auth user with exactly this id. The app resolves a family from the
-- signed-in user id, so a family whose membership id does not match any auth
-- user is simply never shown — harmless, just invisible.
do $$
declare
  demo_user   text := '00000000-0000-0000-0000-000000000001';
  demo_family uuid;
  ada         uuid;
  ben         uuid;
begin
  -- Fresh each run: drop any previous demo family (its children, progress, and
  -- missions cascade away with it).
  delete from public.families f
  using public.family_memberships m
  where m.family_id = f.id
    and m.user_id = demo_user;

  insert into public.families (onboarded_at)
  values (now())
  returning id into demo_family;

  insert into public.family_memberships (family_id, user_id, role)
  values (demo_family, demo_user, 'owner');

  insert into public.child_profiles (family_id, nickname, age_band, avatar_id)
  values (demo_family, 'Ada', '5–6', 'fox')
  returning id into ada;

  insert into public.child_profiles (family_id, nickname, age_band, avatar_id)
  values (demo_family, 'Ben', '7–9', 'star')
  returning id into ben;

  -- Ada is the one currently learning.
  update public.families set selected_profile_id = ada where id = demo_family;

  -- Ada finished lesson one two days ago, and is part-way through lesson two.
  insert into public.lesson_progress
    (child_profile_id, lesson_id, completed_lesson_version, completed_at, updated_at)
  values
    (ada, 'saying-hello', 1, now() - interval '2 days', now() - interval '2 days');

  insert into public.lesson_progress
    (child_profile_id, lesson_id, run_lesson_version, run_step_index, run_choices, updated_at)
  values
    (ada, 'introducing-yourself', 1, 2, '{}'::jsonb, now() - interval '1 day');

  -- Its offline mission has been marked done by the parent.
  insert into public.mission_completions (child_profile_id, lesson_id, marked_by_user_id)
  values (ada, 'saying-hello', demo_user);

  -- Ben is a fresh profile with nothing recorded yet.
end $$;
