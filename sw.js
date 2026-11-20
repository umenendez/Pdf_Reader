const C='lector-v7',CDN='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
const CORE=['./','index.html','manifest.webmanifest'];
const EXTRA=['icon.svg','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png',CDN+'pdf.min.js',CDN+'pdf.worker.min.js'];
const HOSTS=['cdnjs.cloudflare.com','fonts.gstatic.com','fonts.googleapis.com'];
const okR=r=>r&&r.status===200&&(r.type==='basic'||r.type==='cors');

/* Instalación: lo esencial es obligatorio; iconos y pdf.js son tolerantes (si falta un icono no se rompe la instalación) */
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(C);
  await c.addAll(CORE);
  await Promise.all(EXTRA.map(u=>c.add(u).catch(()=>{})));
  self.skipWaiting();
})())});

self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));

self.addEventListener('fetch',e=>{
  const q=e.request,u=new URL(q.url),own=u.origin===location.origin;
  if(q.method!=='GET'||!(own||HOSTS.includes(u.host)))return;
  /* solo se guardan respuestas completas y válidas (nada de 404, 206 ni errores) */
  const put=r=>{if(okR(r)){const k=r.clone();caches.open(C).then(c=>c.put(q,k)).catch(()=>{})}return r};

  if(own){
    /* Red primero con límite de 3 s: se ve la versión nueva si hay red, y con mala red/offline entra al instante desde caché */
    e.respondWith((async()=>{
      const hit=await caches.match(q,{ignoreSearch:q.mode==='navigate'});
      const fresh=fetch(q).then(put);
      if(!hit)return fresh.catch(async()=>(await caches.match('index.html'))||Response.error());
      return Promise.race([fresh,new Promise(r=>setTimeout(()=>r(hit),3000))]).catch(()=>hit);
    })());
    return;
  }
  /* pdf.js, tipografías: caché primero, y se actualiza en segundo plano el CSS de fuentes */
  e.respondWith(caches.match(q).then(h=>{
    const net=fetch(q).then(put);
    if(h){e.waitUntil(net.catch(()=>{}));return h}
    return net;
  }));
});
