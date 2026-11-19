const C='lector-v4';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon.svg'])));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url),own=u.origin==location.origin;
 if(e.request.method!='GET'||!(own||u.host=='cdnjs.cloudflare.com'||u.host=='fonts.gstatic.com'))return;
 const save=r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r};
 e.respondWith(own?fetch(e.request).then(save).catch(()=>caches.match(e.request).then(h=>h||caches.match('index.html'))):caches.match(e.request).then(h=>h||fetch(e.request).then(save)))});
