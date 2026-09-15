CREATE POLICY "No direct member folder access"
ON public.member_drive_folders
FOR SELECT
TO authenticated
USING (false);