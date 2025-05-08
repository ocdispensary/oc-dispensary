/*  PWA Service‑Worker  –  version bump forces clients to take the update  */
const version = 'v4';

const config = {
  cacheRemote: true,
  version:     version + '::',
  preCachingItems: [
    'app.bundle.js',
    'index.html',
    'index.js',
    'offline.html',
    '404.html',
    'sw.js'
  ],
  blacklistCacheItems: ['index.html', 'service-worker.js'],
  offlineImage:
    '<svg role="img" aria-labelledby="title" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
    '<title id="title">Offline</title><rect width="400" height="300" fill="#f2f2f2"/>' +
    '<text x="140" y="160" font-family="monospace" font-size="26" font-weight="700" fill="#222">offline</text></svg>',
  offlinePage: 'offline.html',
  notFoundPage:'404.html'
};

/* ─────────────────────────── Cache Helpers ───────────────────────────── */
const cacheName = (key, o) => `${o.version}${key}`;

function addToCache(cacheKey, req, res) {
  if (res.ok) caches.open(cacheKey).then(c => c.put(req, res.clone()));
  return res;
}
function fetchFromCache(event) {
  return caches.match(event.request).then(r => {
    if (!r) throw Error(`${event.request.url} not found in cache`);
    return r.status === 404 ? caches.match(config.notFoundPage) : r;
  });
}
const offlineResponse = (type, o) =>
  type === 'content' ? caches.match(o.offlinePage) :
  type === 'image'   ? new Response(o.offlineImage, { headers:{'Content-Type':'image/svg+xml'} }) :
                       undefined;

/* ───────────────────── install / activate events ─────────────────────── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName('static', config))
          .then(c => c.addAll(config.preCachingItems))
          .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => !k.startsWith(config.version)).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

/* ────────────────────────── Fetch strategy ───────────────────────────── */
const CO_ORIGIN = 'https://ocdispensary.co';
const GH_ORIGIN = 'https://ocdispensary.github.io';

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  /* ---------- Custom redirect rules ---------- */
  if (url.origin === CO_ORIGIN) {
    const tail = url.href.slice((CO_ORIGIN + '/').length);      // “path?query”
    const isBrooklynMenu = tail.startsWith('brooklyn-menu/');
    const isPlainBrooklynMenu = isBrooklynMenu && (
      tail === 'brooklyn-menu/' || tail === 'brooklyn-menu'
    ) && !url.search;

    /* Allow deep menu links – no redirect */
    if (isBrooklynMenu && !isPlainBrooklynMenu) {
      return;                     // ⇢ fall through to default fetch below
    }

    /* Everything else: proxy to GitHub‑Pages */
    const proxy = `${GH_ORIGIN}/oc-dispensary/${tail}`;
    event.respondWith(fetch(proxy));
    return;
  }

  /* ---------- Default “network‑first” / “cache‑first” mix ---------- */
  if (req.method !== 'GET' ||
      (!config.cacheRemote && url.origin !== self.location.origin) ||
      config.blacklistCacheItems.includes(url.pathname)) {
    return;                       // let the browser handle it
  }

  const isImage = /(\.jpe?g|\.png|\.webp|\.gif|\.svg)$/i.test(url.pathname);
  const isFont  = /\/\/fonts\.(?:googleapis|gstatic)\.com/.test(url.origin);
  const type    = isImage ? 'image' : isFont ? 'font' : 'content';
  const cKey    = cacheName(type, config);

  if (type === 'content') {
    event.respondWith(
      fetch(req)
        .then(r => addToCache(cKey, req, r))
        .catch(() => fetchFromCache(event))
        .catch(() => offlineResponse(type, config))
    );
  } else {
    event.respondWith(
      fetchFromCache(event)
        .catch(() => fetch(req))
        .then(r => addToCache(cKey, req, r))
        .catch(() => offlineResponse(type, config))
    );
  }
});
