/* ضع هنا Project URL و Publishable/anon key من Supabase > Project Settings > API.
   المفتاح publishable/anon آمن للاستخدام في المتصفح مع سياسات RLS الصحيحة.
   لا تضع service_role أو secret key هنا أبدًا. */
window.MASAR_SUPABASE_CONFIG = {
  url: 'https://ouawgyoolrozrlvepoze.supabase.co',
  anonKey: 'sb_publishable_onIaE-4IP7zJlfkNAjUyEA_rvniH9rY',
  // false (الافتراضي): مواقع قاعدة البيانات تُضاف إلى المواقع المضمّنة في الموقع.
  // true: قاعدة البيانات وحدها هي مصدر المواقع (تختفي المواقع المضمّنة عند وجود موقع منشور واحد على الأقل).
  replaceBundled: false,
  // اسم حاوية الصور (Storage bucket) التي ينشئها supabase-multi-images.sql
  imagesBucket: 'masar-images'
};
