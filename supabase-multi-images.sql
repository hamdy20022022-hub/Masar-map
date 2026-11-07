-- MASAR: صور متعددة لكل موقع + صور الصفحة الرئيسية + رفع الصور من لوحة التحكم
-- شغّل هذا الملف في Supabase > SQL Editor (بعد supabase-policies.sql). آمن للتكرار: يمكنك تشغيله أكثر من مرة.
-- يعتمد على وجود public.is_admin() التي أنشأتها سابقًا.

------------------------------------------------------------
-- 1) صور المواقع (destination_images): قراءة عامة للصور التابعة لمواقع منشورة
------------------------------------------------------------
ALTER TABLE public.destination_images ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public.destination_images TO anon, authenticated;

DROP POLICY IF EXISTS "Public read published destination images" ON public.destination_images;
CREATE POLICY "Public read published destination images"
ON public.destination_images FOR SELECT TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM public.destinations d
  WHERE d.id = destination_images.destination_id AND d.published = true
));

------------------------------------------------------------
-- 2) صور الصفحة الرئيسية (تُقلَّب تلقائيًا في أعلى الموقع)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section     text NOT NULL DEFAULT 'hero',
  image_url   text NOT NULL,
  title       text,
  sort_order  integer NOT NULL DEFAULT 0,
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public.site_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.site_images TO authenticated;

DROP POLICY IF EXISTS "Public read active site images" ON public.site_images;
CREATE POLICY "Public read active site images"
ON public.site_images FOR SELECT TO anon, authenticated
USING (active = true);

DROP POLICY IF EXISTS "Admins manage site images" ON public.site_images;
CREATE POLICY "Admins manage site images"
ON public.site_images FOR ALL TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

------------------------------------------------------------
-- 3) حاوية رفع الصور (Storage bucket عامة: masar-images)
--    القراءة عامة عبر الرابط، والرفع/التعديل/الحذف للمدير فقط. الحد الأقصى 10MB للصورة.
------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('masar-images', 'masar-images', true, 10485760,
        ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif'])
ON CONFLICT (id) DO UPDATE
SET public = true, file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif'];

DROP POLICY IF EXISTS "Admins upload masar images" ON storage.objects;
CREATE POLICY "Admins upload masar images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'masar-images' AND (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins update masar images" ON storage.objects;
CREATE POLICY "Admins update masar images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'masar-images' AND (SELECT public.is_admin()))
WITH CHECK (bucket_id = 'masar-images' AND (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins delete masar images" ON storage.objects;
CREATE POLICY "Admins delete masar images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'masar-images' AND (SELECT public.is_admin()));
