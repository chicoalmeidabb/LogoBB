const CACHE = 'badajoz3d-v107';
const FILES = ['./', './index.html', './ajedrez.html', './damas.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // cada página se guarda con su propia dirección (el juego, el ajedrez y las damas no se mezclan)
    const pn = new URL(req.url).pathname, key = /ajedrez\.html$/.test(pn) ? './ajedrez.html' : /damas\.html$/.test(pn) ? './damas.html' : './index.html';
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(key, c)); return r; })
      .catch(() => caches.match(key)));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
