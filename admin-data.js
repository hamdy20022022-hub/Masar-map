(function(){
  const KEY='masar-admin-data-v1';
  const clone=o=>JSON.parse(JSON.stringify(o));
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
  function write(x){localStorage.setItem(KEY,JSON.stringify(x))}
  function hydrate(){
    const s=read(), base=window.MASAR_DATA;
    if(!base)return;
    const governors=s.governorates||clone(base.governorates);
    const destinations=s.destinations||clone(base.destinations);
    const articles=s.articles||clone(base.articles);
    const categories=base.categories, tripTypes=base.tripTypes, images=base.images;
    window.MASAR_DATA={...base,governorates, destinations, articles,
      govBySlug:(id)=>governors.find(x=>x.slug===id),
      destById:(id)=>destinations.find(x=>x.id===id),
      destCountForGov:(id)=>destinations.filter(x=>x.gov===id).length,
      catLabel:(c,l)=>categories.find(x=>x.id===c)?.[l]??c};
  }
  window.MASAR_ADMIN_STORE={
    key:KEY, read, write, reset:()=>{localStorage.removeItem(KEY);hydrate();}, hydrate,
    getReviews:()=>{try{return JSON.parse(localStorage.getItem('masar-reviews')||'[]')}catch{return[]}},
    saveReviews:(x)=>localStorage.setItem('masar-reviews',JSON.stringify(x)),
    getStats:()=>({visits:+localStorage.getItem('masar-admin-visits')||0, favorites:(JSON.parse(localStorage.getItem('masar-favs')||'[]')||[]).length, trip:(JSON.parse(localStorage.getItem('masar-trip')||'[]')||[]).length})
  };
  hydrate();
})();
