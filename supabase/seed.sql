-- Optional local seed for `supabase start` / `supabase db reset`.
-- Remote `supabase db push` applies migrations, not this seed file.

insert into public.prd (title, body)
select
  'ContentFlow AI Demo PRD',
  'A starter PRD seeded locally so the /prd screen has content on first run.'
where not exists (
  select 1 from public.prd where title = 'ContentFlow AI Demo PRD'
);
