drop function if exists public.task_leaderboard();

create policy "Team can read all tasks" on public.member_tasks
for select to authenticated using (true);