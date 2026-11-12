// Aldeia Staff Desk service worker: always tries the network first so updates show straight away,
// skips the phone's own web cache for the app's files, falls back to the saved copy when the phone is offline, and opens the app when a notification is tapped.
const CACHE='staff-desk-v9';
const HOSTS=['www.gstatic.com','cdnjs.cloudflare.com'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png']).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('staff-desk-v')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  if(u.origin!==location.origin&&!HOSTS.includes(u.hostname))return;
  if(u.origin===location.origin&&u.pathname.includes('/pilot/'))return;
  const req=u.origin===location.origin?fetch(e.request.url,{cache:'no-cache'}):fetch(e.request);
  e.respondWith(req.then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{});return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{const c=cs.find(x=>!x.url.includes('/pilot/'));return c?c.focus():self.clients.openWindow('./')}))});
