ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.member_tasks ADD COLUMN IF NOT EXISTS assigned_by uuid;
ALTER TABLE public.member_tasks ADD COLUMN IF NOT EXISTS details text;

CREATE POLICY "Admins manage all tasks"
ON public.member_tasks FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));