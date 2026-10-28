// Guarda o caderno no celular para abrir sem internet.
const CACHE = 'caderno-la-juli-v2';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Página: tenta a versão nova na internet, senão usa a guardada. Resto (fontes, ícones): guardado primeiro.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copia)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(guardado => guardado || fetch(e.request).then(r => {
    if (r.ok || r.type === 'opaque') { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
    return r;
  })));
});
