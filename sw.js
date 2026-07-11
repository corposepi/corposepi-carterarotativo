// Service Worker CORPOSEPI — red primero, con caché de respaldo para el "app shell".
// NO intercepta Firebase ni gstatic (otros orígenes) → la nube funciona normal.
const CACHE = 'corposepi-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  // Solo el propio sitio (mismo origen). Lo demás (Firebase, fuentes) pasa directo.
  if (req.method === 'GET' && new URL(req.url).origin === self.location.origin) {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return r;
      }).catch(() => caches.match(req))
    );
  }
});
