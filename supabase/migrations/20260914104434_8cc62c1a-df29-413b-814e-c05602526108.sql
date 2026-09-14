alter table public.profiles add column if not exists designation text;

update public.profiles set designation = case username
  when 'aayush' then 'Founder & Team Lead'
  when 'rishi' then 'Research & Operations'
  when 'vaibhav' then 'Electronics, Mechanics & Website'
  when 'manan' then 'Mechatronics & Documentation'
  when 'adarsh' then 'Team Management & HR'
  when 'annapurna' then 'Pitching & Presentation'
  when 'satvik' then 'Pitch Handler'
  else designation end;

-- file sharing
create table if not exists public.file_shares (
  id uuid primary key default gen_random_uuid(),
  file_id text not null,
  file_name text not null,
  mime_type text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  shared_with uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (file_id, shared_with)
);
grant select, insert, delete on public.file_shares to authenticated;
grant all on public.file_shares to service_role;
alter table public.file_shares enable row level security;
create policy "Owners manage their shares" on public.file_shares for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Recipients read their shares" on public.file_shares for select to authenticated using (auth.uid() = shared_with);

-- leave requests
create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  status text not null default 'pending',
  decided_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.leave_requests to authenticated;
grant all on public.leave_requests to service_role;
alter table public.leave_requests enable row level security;
create policy "Members manage their leave" on public.leave_requests for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage all leave" on public.leave_requests for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- activity log
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  detail text,
  created_at timestamptz not null default now()
);
grant select, insert on public.activity_log to authenticated;
grant all on public.activity_log to service_role;
alter table public.activity_log enable row level security;
create policy "Members write their activity" on public.activity_log for insert to authenticated with check (auth.uid() = user_id);
create policy "Members read their activity" on public.activity_log for select to authenticated using (auth.uid() = user_id);
create policy "Admins read all activity" on public.activity_log for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- meeting notes
create table if not exists public.meeting_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  meeting_date date not null default (now() at time zone 'utc')::date,
  created_by uuid,
  created_at timestamptz not null default now()
);
grant select on public.meeting_notes to authenticated;
grant all on public.meeting_notes to service_role;
alter table public.meeting_notes enable row level security;
create policy "Members read meeting notes" on public.meeting_notes for select to authenticated using (true);
create policy "Admins write meeting notes" on public.meeting_notes for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- leaderboard (no task details exposed)
create or replace function public.task_leaderboard()
returns table (display_name text, avatar_url text, done_count bigint, open_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select p.display_name,
         p.avatar_url,
         count(t.id) filter (where t.status = 'done') as done_count,
         count(t.id) filter (where t.status <> 'done') as open_count
  from public.profiles p
  left join public.member_tasks t on t.user_id = p.user_id
  group by p.display_name, p.avatar_url
  order by done_count desc, p.display_name
$$;
revoke all on function public.task_leaderboard() from public, anon;
grant execute on function public.task_leaderboard() to authenticated;