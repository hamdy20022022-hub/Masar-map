/* مزامنة الموقع العام مع Supabase (قراءة فقط، وفق سياسات RLS):
   - المواقع المنشورة + صورها المتعددة (destination_images)
   - صور الصفحة الرئيسية (site_images)
   افتراضيًا تُدمج مواقع قاعدة البيانات مع المواقع المضمّنة في الموقع. إذا أردت أن تحل قاعدة البيانات محلها بالكامل
   ضع replaceBundled: true في supabase-config.js. */
(async () => {
  let cfg = window.MASAR_SUPABASE_CONFIG || {};
  try { cfg = {...cfg, ...(JSON.parse(localStorage.getItem('masar-supabase-config')||'{}'))}; } catch {}
  if (!window.supabase || !cfg?.url || cfg.url.includes('YOUR-PROJECT') || !cfg.anonKey || cfg.anonKey.includes('YOUR_SUPABASE')) return;
  try {
    const sb = window.supabase.createClient(cfg.url, cfg.anonKey, {auth:{persistSession:false,autoRefreshToken:false}});
    const [dRes,gRes,cRes,iRes,hRes] = await Promise.all([
      sb.from('destinations').select('*').eq('published', true).order('created_at', {ascending:false}),
      sb.from('governorates').select('*'),
      sb.from('categories').select('*'),
      sb.from('destination_images').select('*').order('created_at', {ascending:true}),
      sb.from('site_images').select('*').eq('section','hero').eq('active',true).order('sort_order',{ascending:true}).order('created_at',{ascending:true})
    ]);
    const D = window.MASAR_DATA;
    let changed = false;

    // ── صور الصفحة الرئيسية ──
    if (hRes.error) console.warn('Masar: site_images غير متاحة (شغّل supabase-multi-images.sql):', hRes.error.message);
    else if (hRes.data?.length) {
      D.heroSlides = hRes.data.filter(r => r.image_url).map(r => ({image: r.image_url, title: r.title || ''}));
      changed = true;
    }

    // ── المواقع ──
    if (dRes.error) console.warn('Masar Supabase public destinations:', dRes.error.message);
    else if (dRes.data?.length) {
      if (iRes.error) console.warn('Masar: destination_images غير متاحة للقراءة العامة (شغّل supabase-multi-images.sql):', iRes.error.message);
      const norm = s => String(s||'').trim().toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه');
      const rowName = x => x.name_ar || x.name || x.title || x.name_en || '';
      const dbGovs = gRes.data || [], dbCats = cRes.data || [], dbImgs = iRes.data || [];
      const govSlug = id => {
        const row = dbGovs.find(g => g.id === id); if (!row) return '';
        const match = D.governorates.find(g => [g.ar,g.en,g.slug].some(v => norm(v)===norm(rowName(row)) || norm(v)===norm(row.slug)));
        if (match) return match.slug;
        const slug = 'db-'+String(row.id).slice(0,8);
        if (!D.governorates.some(g=>g.slug===slug)) D.governorates.push({slug,ar:rowName(row)||'محافظة',en:row.name_en||rowName(row)||'',capitalAr:row.capital||'',descAr:row.description||'',descEn:row.description_en||'',image:row.image_url||D.images.hero,lat:row.latitude||15.35,lng:row.longitude||44.2,mapQ:rowName(row)});
        return slug;
      };
      const catId = id => {
        const row = dbCats.find(c=>c.id===id); if(!row) return id || '';
        const match = D.categories.find(c=>[c.ar,c.en,c.id].some(v=>norm(v)===norm(rowName(row)) || norm(v)===norm(row.slug)));
        if (match) return match.id;
        const nid = 'db-'+String(row.id).slice(0,8), nm = rowName(row) || 'أخرى';
        if (!D.categories.some(c=>c.id===nid)) D.categories.push({id:nid,ar:nm,en:row.name_en||nm,titleAr:nm,titleEn:row.name_en||nm,q:nm,hero:D.images.hero,descAr:'',descEn:''});
        return nid;
      };
      const imgsOf = id => dbImgs.filter(i => i.destination_id === id && i.image_url).map(i => i.image_url);
      const mapped = dRes.data.map(r => {
        const gallery = [...new Set([r.image_url, ...imgsOf(r.id)].filter(Boolean))];
        return {
          id:r.id, ar:r.name, en:r.name_en||r.name, gov:govSlug(r.governorate_id), category:catId(r.category_id),
          rating:0, reviews:0, image:gallery[0]||'', gallery,
          descAr:r.description||'', longAr:r.description||'', lat:r.latitude, lng:r.longitude,
          visitors:'', hours:'', fee:'', bestTime:'', access:'', stay:''
        };
      });
      const empty = v => v === '' || v === null || v === undefined || (Array.isArray(v) && !v.length);
      const clean = o => Object.fromEntries(Object.entries(o).filter(([,v]) => !empty(v)));
      if (cfg.replaceBundled === true) {
        D.destinations.splice(0, D.destinations.length, ...mapped);
      } else {
        // دمج: إن طابق اسمُ موقع في القاعدة اسمَ موقع مضمّن يحل محله (مع الاحتفاظ بالحقول التي لا تحتويها القاعدة)
        const fresh = [];
        mapped.forEach(n => {
          const i = D.destinations.findIndex(o => norm(o.ar) === norm(n.ar));
          if (i >= 0) { const old = D.destinations[i]; D.destinations[i] = {...old, ...clean(n), rating: old.rating, reviews: old.reviews}; }
          else fresh.push(n);
        });
        D.destinations.unshift(...fresh);
      }
      changed = true;
    }
    if (changed && typeof window.render === 'function') window.render();
  } catch (e) { console.warn('Masar public sync unavailable; using bundled data.', e); }
})();
