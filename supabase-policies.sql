-- MASAR: run once in Supabase SQL Editor as postgres.
-- Requires public.is_admin() created earlier and returns true only for profiles.role='admin'.
-- Does not grant any role changes on public.profiles.

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.destinations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.destination_images TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.governorates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;

CREATE POLICY "Admins manage destinations"
ON public.destinations FOR ALL TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "Admins manage destination images"
ON public.destination_images FOR ALL TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "Admins manage governorates"
ON public.governorates FOR ALL TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "Admins manage categories"
ON public.categories FOR ALL TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
