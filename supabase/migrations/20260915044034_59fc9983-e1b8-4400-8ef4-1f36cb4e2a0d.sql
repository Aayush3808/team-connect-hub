CREATE POLICY "Members can view team directory"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);