/* Masar Admin — Supabase Auth + RLS. لا يُستخدم مفتاح service-role في المتصفح أبدًا.
   الجديد: معرض صور متعدد لكل موقع (رفع أو رابط) + إدارة صور الصفحة الرئيسية. */
(() => {
  const root = document.getElementById('admin');
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cfg = () => { try { return {...(window.MASAR_SUPABASE_CONFIG||{}), ...(JSON.parse(localStorage.getItem('masar-supabase-config')||'{}'))}; } catch { return window.MASAR_SUPABASE_CONFIG || {}; } };
  const bucket = () => cfg().imagesBucket || 'masar-images';
  let client = null, user = null, section = 'dashboard';
  let destinations = [], governorates = [], categories = [], images = [], siteImages = [], siteImagesError = '';
  let G = null;          // حالة معرض الصور داخل نموذج الموقع
  let mgrDest = '';      // الموقع المختار في تبويب «صور المواقع»
  let busy = false;
  const ready = () => { const c=cfg(); return !!(window.supabase && c.url && !c.url.includes('YOUR-PROJECT') && c.anonKey && !c.anonKey.includes('YOUR_SUPABASE')); };
  const btn = (label, action, cls='secondary') => `<button class="btn ${cls}" data-action="${action}">${label}</button>`;
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2));

  /* ───────── إشعار صغير ───────── */
  function toast(msg, ms) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg || ''; t.classList.toggle('show', !!msg);
    clearTimeout(toast.h); if (ms) toast.h = setTimeout(() => t.classList.remove('show'), ms);
  }

  /* ───────── الدخول ───────── */
  function login(message='') {
    root.innerHTML = `<div class="login"><form class="login-box" id="loginForm"><img src="assets/logo-green.png"><h1>لوحة تحكم مسار</h1><p>سجّل الدخول بحساب المدير في Supabase</p>
      <div class="field"><label>رابط مشروع Supabase (Project URL)</label><input class="input" id="projectUrl" type="url" placeholder="https://xxxx.supabase.co" value="${esc(cfg().url||'')}" required></div>
      <div class="field"><label>Publishable / anon key</label><input class="input" id="anonKey" placeholder="sb_publishable_… أو anon key" value="${esc(cfg().anonKey||'')}" required></div>
      <div class="field"><label>البريد الإلكتروني لحساب المدير</label><input class="input" id="email" type="email" autocomplete="username" required></div>
      <div class="field"><label>كلمة مرور حساب Supabase Auth</label><input class="input" id="password" type="password" autocomplete="current-password" required></div>
      <div id="err" class="error">${esc(message)}</div><button class="btn primary" style="width:100%">دخول آمن</button><small style="display:block;margin-top:14px;color:#777;line-height:1.8">يُستخدم مفتاح anon/publishable فقط. لا تضع service_role أو secret key هنا.</small></form></div>`;
    document.getElementById('loginForm').onsubmit = async e => {
      e.preventDefault(); const error = document.getElementById('err'); error.textContent = 'جارٍ تسجيل الدخول والتحقق من صلاحية المدير…';
      try {
        const url = document.getElementById('projectUrl').value.trim(), key = document.getElementById('anonKey').value.trim();
        localStorage.setItem('masar-supabase-config', JSON.stringify({url,anonKey:key}));
        client = window.supabase.createClient(url, key, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
        const {data, error: authError} = await client.auth.signInWithPassword({email:document.getElementById('email').value.trim(),password:document.getElementById('password').value});
        if(authError) throw authError;
        const {data:isAdmin,error:roleError} = await client.rpc('is_admin');
        if(roleError) throw new Error('تعذر التحقق من صلاحية المدير: '+roleError.message);
        if(isAdmin !== true){await client.auth.signOut(); throw new Error('تم تسجيل الدخول، لكن هذا الحساب لا يملك صلاحية admin.');}
        user = data.user; await loadData(); render();
      } catch(err) { error.textContent = err.message || 'تعذر تسجيل الدخول. تحقق من الرابط والمفتاح وبيانات الحساب.'; }
    };
  }
  async function init() {
    if(!ready()){login('أدخل Project URL ومفتاح anon/publishable من Supabase.');return;}
    try {
      const c=cfg(); client = window.supabase.createClient(c.url,c.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      const {data:{session}} = await client.auth.getSession();
      if(!session){login();return;}
      const {data:isAdmin,error} = await client.rpc('is_admin');
      if(error || isAdmin !== true){await client.auth.signOut();login('الجلسة الحالية لا تملك صلاحية المدير. سجّل الدخول بحساب المدير.');return;}
      user=session.user; await loadData(); render();
    } catch(e){login(e.message||'تعذر الاتصال بـ Supabase.');}
  }
  async function loadData(){
    const queries = await Promise.all([
      client.from('destinations').select('*').order('created_at',{ascending:false}),
      client.from('governorates').select('*').order('name'),
      client.from('categories').select('*').order('name'),
      client.from('destination_images').select('*').order('created_at'),
      client.from('site_images').select('*').eq('section','hero').order('sort_order').order('created_at')
    ]);
    const names=['المواقع السياحية','المحافظات','التصنيفات','صور المواقع'];
    for(let i=0;i<4;i++) if(queries[i].error) throw new Error(`تعذر تحميل ${names[i]}: ${queries[i].error.message}`);
    [destinations,governorates,categories,images]=queries.slice(0,4).map(q=>q.data||[]);
    // جدول صور الصفحة الرئيسية يُنشأ بملف supabase-multi-images.sql؛ لا نعطّل اللوحة إن لم يكن موجودًا بعد
    siteImagesError = queries[4].error ? queries[4].error.message : '';
    siteImages = queries[4].error ? [] : (queries[4].data || []);
  }

  /* ───────── الصور: ضغط، رفع، حذف ───────── */
  async function compress(file, max=1800, q=.85){
    if(!/^image\/(jpeg|png|webp)$/.test(file.type) || !window.createImageBitmap) return file;
    try{
      const bmp = await createImageBitmap(file); let w=bmp.width,h=bmp.height; const k=Math.min(1,max/Math.max(w,h));
      if(k===1 && file.size < 1.2e6){ bmp.close?.(); return file; }
      w=Math.round(w*k); h=Math.round(h*k);
      const c=document.createElement('canvas'); c.width=w; c.height=h; const ctx=c.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h); ctx.drawImage(bmp,0,0,w,h); bmp.close?.();
      const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',q));
      return blob && blob.size < file.size ? blob : file;
    }catch{ return file; }
  }
  async function uploadImage(file, folder){
    if(!file.type.startsWith('image/')) throw new Error('الملف ليس صورة: '+file.name);
    if(file.size > 15*1024*1024) throw new Error('حجم الصورة أكبر من 15MB: '+file.name);
    const blob = await compress(file);
    const type = blob.type || file.type;
    const ext = type==='image/jpeg' ? 'jpg' : (type.split('/')[1]||'jpg').replace(/[^a-z0-9]/g,'').slice(0,5);
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
    const {error} = await client.storage.from(bucket()).upload(path, blob, {contentType:type, cacheControl:'31536000', upsert:false});
    if(error) throw new Error(/bucket not found/i.test(error.message||'') ? 'حاوية الصور غير موجودة — شغّل ملف supabase-multi-images.sql في Supabase.' : 'تعذر رفع '+file.name+': '+error.message);
    return client.storage.from(bucket()).getPublicUrl(path).data.publicUrl;
  }
  const storagePath = url => { const parts = String(url||'').split(`/object/public/${bucket()}/`); return parts.length>1 ? decodeURIComponent(parts[1].split('?')[0]) : null; };
  async function removeFiles(urls){ const paths=urls.map(storagePath).filter(Boolean); if(paths.length){ try{ await client.storage.from(bucket()).remove(paths); }catch{} } }
  const validUrl = u => /^https?:\/\/\S+$/i.test(u);
  async function insertRows(table, rows){ if(!rows.length) return; const {error}=await client.from(table).insert(rows); if(error) throw error; }
  async function guarded(fn){ if(busy) return; busy=true; try{ await fn(); } catch(err){ toast('',0); showError(err); } finally{ busy=false; toast('',0); } }

  /* ───────── عناصر الواجهة ───────── */
  const name = row => row.name || row.name_ar || row.title || row.id;
  const destName = id => name(destinations.find(d=>d.id===id) || {id:'—'});
  function shell(content,title){return `<div class="layout"><aside class="sidebar" id="side"><div class="brand"><img src="assets/logo-white.png"><div><b>مسار MASAR</b><small>إدارة الموقع — متصل بقاعدة البيانات</small></div></div><div class="menu">${[['dashboard','لوحة المعلومات'],['destinations','المواقع السياحية'],['images','صور المواقع'],['hero','صور الصفحة الرئيسية'],['governorates','المحافظات'],['categories','التصنيفات']].map(([id,label])=>`<button class="${section===id?'active':''}" data-section="${id}">${label}</button>`).join('')}</div><div class="bottom"><a class="back" href="index.html">← فتح الموقع</a><button class="menu" data-action="logout" style="margin-top:12px;background:transparent;color:#f5caca;border:0;text-align:right;width:100%;padding:10px">تسجيل الخروج</button></div></aside><section class="main"><div class="topbar"><div style="display:flex;align-items:center;gap:14px"><button class="mobile-menu" data-action="mobile">☰</button><h1>${title}</h1></div><div class="user"><span>${esc(user?.email||'مدير مسار')}</span><span class="avatar">م</span></div></div><div class="content">${content}</div></section></div><div id="modal" class="modal"></div>`}
  function dashboard(){return `<div class="notice">هذه اللوحة متصلة مباشرة بقاعدة بيانات Supabase. عمليات الحفظ تمر عبر تسجيل الدخول وسياسات RLS؛ لا يوجد رمز إدارة تجريبي داخل الصفحة.</div>${siteImagesError?`<div class="notice warn">لم يتم العثور على جدول صور الصفحة الرئيسية أو حاوية الصور. شغّل الملف <b>supabase-multi-images.sql</b> في Supabase SQL Editor مرة واحدة ثم أعد تحميل الصفحة. (${esc(siteImagesError)})</div>`:''}<div class="grid stats"><div class="stat"><small>المواقع السياحية</small><strong>${destinations.length}</strong></div><div class="stat"><small>منشور</small><strong>${destinations.filter(x=>x.published).length}</strong></div><div class="stat"><small>مسودات</small><strong>${destinations.filter(x=>!x.published).length}</strong></div><div class="stat"><small>المحافظات</small><strong>${governorates.length}</strong></div><div class="stat"><small>صور المواقع</small><strong>${images.length}</strong></div><div class="stat"><small>صور الرئيسية</small><strong>${siteImages.length}</strong></div></div><div class="panel list"><div class="toolbar"><h2>أحدث المواقع السياحية</h2>${btn('＋ إضافة موقع','add-destination','primary')}</div>${destinations.slice(0,8).map(d=>`<div class="list-item"><span>${esc(d.name)}</span><span class="badge">${d.published?'منشور':'مسودة'}</span></div>`).join('')||'<div class="empty">لا توجد مواقع في قاعدة البيانات بعد.</div>'}</div>`}
  const imgCount = id => images.filter(i=>i.destination_id===id).length;
  function table(title, rows, type, addLabel){const addButton=type==='destinations'?btn('＋ '+addLabel,'add-'+type,'primary'):'';const headers=type==='destinations'?['الصورة','اسم الموقع','المحافظة','عدد الصور','الحالة','إجراءات']:type==='governorates'?['المحافظة','المعرّف','إجراءات']:['التصنيف','المعرّف','إجراءات'];return `<div class="toolbar"><h2>${title}</h2><div class="tools"><input class="input search" id="search" placeholder="بحث…">${addButton}</div></div><div class="panel table-wrap"><table class="table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(x=>rowHtml(x,type)).join('')||`<tr><td colspan="8"><div class="empty">لا توجد بيانات</div></td></tr>`}</tbody></table></div>`}
  function rowHtml(x,type){
    if(type==='destinations'){const cover=x.image_url||images.find(i=>i.destination_id===x.id)?.image_url;return `<tr data-search="${esc(x.name)}"><td>${cover?`<img class="thumb" src="${esc(cover)}" alt="">`:'<span class="thumb ph">—</span>'}</td><td><b>${esc(x.name)}</b><div style="font-size:11px;color:#888">${esc((x.description||'').slice(0,80))}</div></td><td>${esc(governorates.find(g=>g.id===x.governorate_id)?.name||'—')}</td><td><span class="badge">${imgCount(x.id)+(x.image_url?1:0)} صورة</span></td><td><span class="badge">${x.published?'منشور':'مسودة'}</span></td><td class="actions"><button class="mini" data-edit="destinations" data-id="${x.id}">تعديل</button><button class="mini" data-toggle-publish="${x.id}">${x.published?'إخفاء':'نشر'}</button><button class="mini" data-delete="destinations" data-id="${x.id}">حذف</button></td></tr>`}
    return `<tr data-search="${esc(name(x))}"><td>${esc(name(x))}</td><td>${esc(x.id)}</td><td>—</td></tr>`}
  function field(label,name,value='',type='text',required=false){return `<div class="field"><label>${label}</label><input class="input" name="${name}" type="${type}" ${type==='number'?'step="any"':''} value="${esc(value??'')}" ${required?'required':''}></div>`}
  function area(label,name,value=''){return `<div class="field full"><label>${label}</label><textarea class="textarea" name="${name}" rows="4">${esc(value||'')}</textarea></div>`}
  function select(label,name,rows,value){return `<div class="field"><label>${label}</label><select class="select" name="${name}"><option value="">— اختر —</option>${rows.map(r=>`<option value="${r.id}" ${r.id===value?'selected':''}>${esc(name==='destination_id'?r.name:(r.name||r.name_ar||r.title))}</option>`).join('')}</select></div>`}

  /* ───────── نموذج الموقع + معرض الصور ───────── */
  function form(type,id){const editing=!!id;let x=type==='destinations'?destinations.find(r=>r.id===id):type==='governorates'?governorates.find(r=>r.id===id):categories.find(r=>r.id===id);let html='';
    G = null;
    if(type==='destinations'){html=field('اسم الموقع','name',x?.name,'text',true)+area('الوصف','description',x?.description)+select('المحافظة','governorate_id',governorates,x?.governorate_id)+select('التصنيف','category_id',categories,x?.category_id)+field('الصورة الرئيسية (الغلاف) — رابط، أو اتركه فارغًا ليُختار تلقائيًا من المعرض','image_url',x?.image_url,'text')+field('خط العرض (Latitude)','latitude',x?.latitude,'number')+field('خط الطول (Longitude)','longitude',x?.longitude,'number')+`<div class="field"><label>حالة النشر</label><select class="select" name="published"><option value="false" ${!x?.published?'selected':''}>مسودة</option><option value="true" ${x?.published?'selected':''}>منشور</option></select></div><div class="field full"><label>معرض الصور — يمكنك رفع عدة صور دفعة واحدة، وتُقلَّب تلقائيًا في الموقع</label><div id="galleryBox"></div></div>`;
      G={existing:id?images.filter(i=>i.destination_id===id):[],removed:new Set(),files:[],urls:[]};}
    else if(type==='governorates'){html=field('اسم المحافظة','name',x?.name,'text',true);}
    else if(type==='categories'){html=field('اسم التصنيف','name',x?.name,'text',true);}
    document.getElementById('modal').innerHTML=`<div class="dialog"><div class="dialog-head"><b>${editing?'تعديل':'إضافة'} ${type==='destinations'?'موقع سياحي':type==='governorates'?'محافظة':'تصنيف'}</b><button data-action="close">×</button></div><form id="editForm" data-type="${type}" data-id="${id||''}"><div class="dialog-body"><div class="form-grid">${html}</div></div><div class="modal-foot"><button class="btn primary">حفظ</button><button type="button" class="btn secondary" data-action="close">إلغاء</button></div></form></div>`;document.getElementById('modal').classList.add('open');
    if(G) paintGallery();
  }
  function closeModal(){ if(G){ G.files.forEach(f=>URL.revokeObjectURL(f.preview)); G=null; } document.getElementById('modal')?.classList.remove('open'); }
  const coverInput = () => document.querySelector('#editForm [name=image_url]');
  function paintGallery(){
    const box=document.getElementById('galleryBox'); if(!box||!G) return;
    const cover=(coverInput()?.value||'').trim(), ex=G.existing.filter(r=>!G.removed.has(r.id));
    const item=(src,cls,inner)=>`<div class="g-item ${cls}"><img src="${esc(src)}" alt="" loading="lazy">${inner}</div>`;
    box.innerHTML=`<div class="gallery-grid">${
      ex.map(r=>item(r.image_url, r.image_url===cover?'is-cover':'', (r.image_url===cover?'<span class="g-badge">الغلاف</span>':`<button type="button" class="g-btn star" title="تعيين كغلاف" data-g-cover="${esc(r.id)}">★</button>`)+`<button type="button" class="g-btn del" title="حذف" data-g-del="${esc(r.id)}">✕</button>`)).join('')}${
      G.urls.map((u,i)=>item(u,'pending','<span class="g-badge new">جديدة</span><button type="button" class="g-btn del" data-g-delurl="'+i+'">✕</button>')).join('')}${
      G.files.map((f,i)=>item(f.preview,'pending','<span class="g-badge new">جديدة</span><button type="button" class="g-btn del" data-g-delfile="'+i+'">✕</button>')).join('')}
      <label class="g-add"><input type="file" id="gFiles" accept="image/*" multiple hidden><span>＋</span><small>رفع صور</small></label></div>
      <div class="g-url"><input class="input" id="gUrl" type="url" placeholder="أو الصق رابط صورة (https://…) ثم اضغط إضافة"><button type="button" class="btn secondary" data-g-addurl>إضافة الرابط</button></div>
      <small class="hint">الصور الجديدة تُرفع عند الضغط على «حفظ». يمكنك اختيار عدة ملفات مرة واحدة. ★ تعيّن الصورة كغلاف للموقع.</small>`;
  }
  function addPendingFiles(fileList){
    if(!G) return; const bad=[];
    [...fileList].forEach(f=>{ if(!f.type.startsWith('image/')) bad.push(f.name+' (ليست صورة)'); else if(f.size>15*1024*1024) bad.push(f.name+' (أكبر من 15MB)'); else G.files.push({file:f,preview:URL.createObjectURL(f)}); });
    if(bad.length) alert('تم تجاهل:\n'+bad.join('\n')); paintGallery();
  }
  async function saveDestination(formEl){
    const id=formEl.dataset.id, f=new FormData(formEl), o=Object.fromEntries(f.entries()), now=new Date().toISOString();
    const destId=id||uid(), uploaded=[];
    o.latitude=o.latitude===''?null:Number(o.latitude); o.longitude=o.longitude===''?null:Number(o.longitude); o.published=o.published==='true'; o.updated_at=now;
    if(!id){o.id=destId;o.created_at=now;}
    try{ for(let k=0;k<G.files.length;k++){ toast(`جارٍ رفع الصورة ${k+1} من ${G.files.length}…`); uploaded.push(await uploadImage(G.files[k].file,'destinations/'+destId)); } }
    catch(err){ await removeFiles(uploaded); throw err; }
    const newUrls=[...G.urls,...uploaded], remaining=G.existing.filter(r=>!G.removed.has(r.id));
    o.image_url=(o.image_url||'').trim() || remaining[0]?.image_url || newUrls[0] || '';
    toast('جارٍ حفظ الموقع…');
    const res=id?await client.from('destinations').update(o).eq('id',id):await client.from('destinations').insert(o);
    if(res.error){ await removeFiles(uploaded); throw res.error; }
    const gone=G.existing.filter(r=>G.removed.has(r.id));
    if(gone.length){ const {error}=await client.from('destination_images').delete().in('id',gone.map(r=>r.id)); if(error) throw error; await removeFiles(gone.map(r=>r.image_url).filter(u=>u!==o.image_url)); }
    await insertRows('destination_images', newUrls.map(u=>({id:uid(),destination_id:destId,image_url:u,created_at:now})));
  }
  async function saveForm(formEl){const type=formEl.dataset.type,id=formEl.dataset.id;
    if(type==='destinations'){ await saveDestination(formEl); }
    else { const o=Object.fromEntries(new FormData(formEl).entries()); const r=id?await client.from(type).update(o).eq('id',id):await client.from(type).insert(o); if(r.error)throw r.error; }
    closeModal(); await loadData(); render(); toast('تم الحفظ ✓',2000);
  }
  async function remove(type,id){
    if(type==='destinations'){
      if(!confirm('سيتم حذف الموقع وجميع صوره. هل أنت متأكد؟'))return;
      const urls=images.filter(i=>i.destination_id===id).map(i=>i.image_url), cover=destinations.find(d=>d.id===id)?.image_url;
      await client.from('destination_images').delete().eq('destination_id',id);   // قد تكون محذوفة تلقائيًا (cascade)
      const {error}=await client.from('destinations').delete().eq('id',id); if(error)throw error;
      await removeFiles([...urls,cover].filter(Boolean));
    } else {
      if(!confirm('هل أنت متأكد من الحذف؟'))return;
      const table=type==='images'?'destination_images':type==='hero'?'site_images':type; const row=(type==='images'?images:siteImages).find(r=>r.id===id);
      const {error}=await client.from(table).delete().eq('id',id); if(error)throw error;
      if(row) await removeFiles([row.image_url]);
    }
    await loadData();render();
  }
  async function togglePublish(id){const x=destinations.find(d=>d.id===id);const {error}=await client.from('destinations').update({published:!x.published,updated_at:new Date().toISOString()}).eq('id',id);if(error)throw error;await loadData();render();}

  /* ───────── تبويب «صور المواقع» ───────── */
  function imagesSection(){
    const rows=images.filter(i=>!mgrDest||i.destination_id===mgrDest), d=destinations.find(x=>x.id===mgrDest), cover=d?.image_url;
    const tile=(src,label,inner,cls='')=>`<div class="g-item big ${cls}"><img src="${esc(src)}" alt="" loading="lazy">${label?`<span class="g-name">${esc(label)}</span>`:''}${inner}</div>`;
    return `<div class="toolbar"><h2>صور المواقع السياحية</h2><div class="tools"><select class="select" id="mgrDest" style="min-width:230px"><option value="">كل المواقع</option>${destinations.map(x=>`<option value="${x.id}" ${x.id===mgrDest?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div></div>
    <div class="panel pad">${mgrDest?`<div class="mgr-add"><label class="btn primary">＋ رفع صور (يمكن اختيار عدة ملفات)<input type="file" id="mgrFiles" accept="image/*" multiple hidden></label><div class="g-url" style="flex:1;margin:0"><input class="input" id="mgrUrl" type="url" placeholder="أو الصق رابط صورة https://…"><button class="btn secondary" data-action="mgr-addurl">إضافة الرابط</button></div></div>`:`<div class="notice" style="margin:0 0 16px">اختر موقعًا من القائمة لإضافة صور له. الصور تُقلَّب تلقائيًا في صفحة الموقع وبطاقته.</div>`}
    <div class="gallery-grid mgr">${cover?tile(cover,'','<span class="g-badge">الغلاف</span>','is-cover'):''}${rows.filter(r=>r.image_url!==cover).map(r=>tile(r.image_url,mgrDest?'':destName(r.destination_id),`<button type="button" class="g-btn del" title="حذف" data-delete="images" data-id="${r.id}">✕</button>`)).join('')||(!cover?'<div class="empty" style="grid-column:1/-1">لا توجد صور بعد.</div>':'')}</div></div>`;
  }
  async function addImagesTo(destId, files, urls=[]){
    const out=[...urls]; const arr=[...files];
    for(let k=0;k<arr.length;k++){ toast(`جارٍ رفع الصورة ${k+1} من ${arr.length}…`); out.push(await uploadImage(arr[k],'destinations/'+destId)); }
    toast('جارٍ الحفظ…');
    try{ await insertRows('destination_images', out.map(u=>({id:uid(),destination_id:destId,image_url:u,created_at:new Date().toISOString()}))); }
    catch(err){ await removeFiles(out); throw err; }
    const d=destinations.find(x=>x.id===destId); if(d && !d.image_url){ await client.from('destinations').update({image_url:out[0],updated_at:new Date().toISOString()}).eq('id',destId); }
    await loadData(); render(); toast(`تمت إضافة ${out.length} صورة ✓`,2500);
  }

  /* ───────── تبويب «صور الصفحة الرئيسية» ───────── */
  function heroSection(){
    const list=[...siteImages].sort((a,b)=>(a.sort_order-b.sort_order)||String(a.created_at).localeCompare(String(b.created_at)));
    return `<div class="toolbar"><h2>صور الصفحة الرئيسية</h2></div>${siteImagesError?`<div class="notice warn">جدول <b>site_images</b> غير موجود بعد. شغّل <b>supabase-multi-images.sql</b> في Supabase SQL Editor ثم أعد تحميل الصفحة. (${esc(siteImagesError)})</div>`:''}
    <div class="panel pad"><p class="muted" style="margin-top:0;font-size:13px;line-height:1.9">هذه الصور تظهر في أعلى الموقع وتتبدّل تلقائيًا كل بضع ثوانٍ. اكتب عنوانًا قصيرًا لكل صورة (يظهر أسفل الصفحة)، ورتّبها بالأسهم، وأوقف أي صورة دون حذفها. إذا لم تُضف أي صورة تُستخدم الصور الافتراضية للموقع.</p>
    <div class="mgr-add"><label class="btn primary">＋ رفع صور (يمكن اختيار عدة ملفات)<input type="file" id="heroFiles" accept="image/*" multiple hidden></label><div class="g-url" style="flex:1;margin:0"><input class="input" id="heroUrl" type="url" placeholder="أو الصق رابط صورة https://…"><button class="btn secondary" data-action="hero-addurl">إضافة الرابط</button></div></div>
    <div class="hero-list">${list.map((r,i)=>`<div class="hero-item ${r.active?'':'off'}"><img src="${esc(r.image_url)}" alt="" loading="lazy"><div class="hero-main"><input class="input" data-hero-title="${r.id}" value="${esc(r.title||'')}" placeholder="عنوان الصورة (اختياري) — مثل: سقطرى، جزيرة دم الأخوين"><div class="hero-act"><span class="badge">${i+1}</span><button class="mini" data-hero-move="${r.id}" data-dir="-1" ${i===0?'disabled':''}>↑</button><button class="mini" data-hero-move="${r.id}" data-dir="1" ${i===list.length-1?'disabled':''}>↓</button><button class="mini" data-hero-toggle="${r.id}">${r.active?'إيقاف':'تفعيل'}</button><button class="mini danger" data-delete="hero" data-id="${r.id}">حذف</button></div></div></div>`).join('')||'<div class="empty">لا توجد صور مخصصة. الموقع يستخدم الصور الافتراضية حاليًا.</div>'}</div></div>`;
  }
  async function addHero(files, urls=[]){
    const out=[...urls], arr=[...files]; for(let k=0;k<arr.length;k++){ toast(`جارٍ رفع الصورة ${k+1} من ${arr.length}…`); out.push(await uploadImage(arr[k],'hero')); }
    let next=siteImages.reduce((m,r)=>Math.max(m,r.sort_order||0),0)+1;
    try{ await insertRows('site_images', out.map(u=>({id:uid(),section:'hero',image_url:u,title:'',sort_order:next++,active:true,created_at:new Date().toISOString()}))); }
    catch(err){ await removeFiles(out); throw err; }
    await loadData(); render(); toast(`تمت إضافة ${out.length} صورة ✓`,2500);
  }
  async function moveHero(id,dir){
    const list=[...siteImages].sort((a,b)=>(a.sort_order-b.sort_order)||String(a.created_at).localeCompare(String(b.created_at))), i=list.findIndex(r=>r.id===id), j=i+dir; if(i<0||j<0||j>=list.length) return;
    [list[i],list[j]]=[list[j],list[i]];
    const ups=list.map((r,k)=>({r,k})).filter(({r,k})=>r.sort_order!==k+1);
    for(const {r,k} of ups){ const {error}=await client.from('site_images').update({sort_order:k+1}).eq('id',r.id); if(error) throw error; }
    await loadData(); render();
  }

  function render(){
    const titles={dashboard:'لوحة المعلومات',destinations:'المواقع السياحية',images:'صور المواقع',hero:'صور الصفحة الرئيسية',governorates:'المحافظات',categories:'التصنيفات'};
    const content=section==='dashboard'?dashboard():section==='destinations'?table('المواقع السياحية',destinations,'destinations','إضافة موقع'):section==='governorates'?table('المحافظات',governorates,'governorates','إضافة محافظة'):section==='categories'?table('التصنيفات',categories,'categories','إضافة تصنيف'):section==='images'?imagesSection():heroSection();
    root.innerHTML=shell(content,titles[section]);
  }
  function showError(e){alert('تعذر تنفيذ العملية: '+(e?.message||e));}

  /* ───────── الأحداث ───────── */
  document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
    try{
      const d=b.dataset;
      if(d.section){section=d.section;render();}
      else if(d.action==='logout'){await client.auth.signOut();user=null;login('تم تسجيل الخروج.');}
      else if(d.action==='mobile'){document.getElementById('side')?.classList.toggle('open');}
      else if(d.action==='close'){closeModal();}
      else if(d.action?.startsWith('add-')&&d.action!=='add-'){ if(['add-destination','add-destinations','add-governorates','add-categories'].includes(d.action)) form(d.action==='add-destination'?'destinations':d.action.slice(4)); }
      else if(d.action==='mgr-addurl'){ const u=document.getElementById('mgrUrl').value.trim(); if(!validUrl(u)) return alert('ألصق رابط صورة صحيحًا يبدأ بـ https://'); await guarded(()=>addImagesTo(mgrDest,[],[u])); }
      else if(d.action==='hero-addurl'){ const u=document.getElementById('heroUrl').value.trim(); if(!validUrl(u)) return alert('ألصق رابط صورة صحيحًا يبدأ بـ https://'); await guarded(()=>addHero([],[u])); }
      else if(d.edit){form(d.edit,d.id);}
      else if(d.delete){await guarded(()=>remove(d.delete,d.id));}
      else if(d.togglePublish){await guarded(()=>togglePublish(d.togglePublish));}
      else if(d.heroToggle){ const r=siteImages.find(x=>x.id===d.heroToggle); await guarded(async()=>{ const {error}=await client.from('site_images').update({active:!r.active}).eq('id',r.id); if(error)throw error; await loadData(); render(); }); }
      else if(d.heroMove){ await guarded(()=>moveHero(d.heroMove,+d.dir)); }
      // معرض الصور داخل نموذج الموقع
      else if(d.gDel!==undefined){ const r=G.existing.find(x=>x.id===d.gDel); G.removed.add(d.gDel); if(r&&coverInput()&&coverInput().value.trim()===r.image_url) coverInput().value=''; paintGallery(); }
      else if(d.gCover!==undefined){ const r=G.existing.find(x=>x.id===d.gCover); if(r&&coverInput()){ coverInput().value=r.image_url; paintGallery(); } }
      else if(d.gDelurl!==undefined){ G.urls.splice(+d.gDelurl,1); paintGallery(); }
      else if(d.gDelfile!==undefined){ const [f]=G.files.splice(+d.gDelfile,1); if(f) URL.revokeObjectURL(f.preview); paintGallery(); }
      else if(d.gAddurl!==undefined){ const inp=document.getElementById('gUrl'),u=inp.value.trim(); if(!validUrl(u)) return alert('ألصق رابط صورة صحيحًا يبدأ بـ https://'); G.urls.push(u); paintGallery(); }
    }catch(err){showError(err);}});
  document.addEventListener('change',async e=>{const t=e.target;
    if(t.id==='gFiles'){ addPendingFiles(t.files); t.value=''; }
    else if(t.id==='mgrDest'){ mgrDest=t.value; render(); }
    else if(t.id==='mgrFiles'){ const fs=[...t.files]; t.value=''; if(fs.length) await guarded(()=>addImagesTo(mgrDest,fs)); }
    else if(t.id==='heroFiles'){ const fs=[...t.files]; t.value=''; if(fs.length) await guarded(()=>addHero(fs)); }
    else if(t.dataset?.heroTitle){ const id=t.dataset.heroTitle; await guarded(async()=>{ const {error}=await client.from('site_images').update({title:t.value.trim()}).eq('id',id); if(error)throw error; const r=siteImages.find(x=>x.id===id); if(r) r.title=t.value.trim(); toast('تم حفظ العنوان ✓',1500); }); }
  });
  document.addEventListener('submit',async e=>{if(e.target.id!=='editForm')return;e.preventDefault();if(busy)return;const submit=e.target.querySelector('button[type="submit"],button:not([type])');if(submit){submit.disabled=true;submit.textContent='جارٍ الحفظ…';}busy=true;try{await saveForm(e.target);}catch(err){toast('',0);showError(err);if(submit){submit.disabled=false;submit.textContent='حفظ';}}finally{busy=false;}});
  document.addEventListener('input',e=>{
    if(e.target.id==='search'){const q=e.target.value.toLowerCase();document.querySelectorAll('tbody tr[data-search]').forEach(r=>r.style.display=r.dataset.search.toLowerCase().includes(q)?'':'none');}
    else if(e.target.name==='image_url'&&G) paintGallery();
  });
  init();
})();
