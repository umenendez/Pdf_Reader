const C='lector-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon.svg'])));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(e.request.method!='GET'||!(u.origin==location.origin||u.host=='cdnjs.cloudflare.com'||u.host=='fonts.gstatic.com'))return;
 e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match('index.html'))))});
