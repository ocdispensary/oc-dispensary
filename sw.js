/*  OC‑Dispensary PWA  ▸  sw.js
 *  Increment BUILD_VERSION (or inject a timestamp/SHA) on every deploy.
 */
const BUILD_VERSION = '2025‑05‑09‑01';
const CACHE_PREFIX  = `v${BUILD_VERSION}::`;

const CONFIG = {
  version:      CACHE_PREFIX,
  cacheRemote:  true,
  spaRoot:  '/oc-dispensary/index.html',
  inScopePrefix: self.location.origin + '/oc-dispensary/',
  precache: [
    '/',
    '/index.html',
    '/offline.html',
    '/404.html',
    '/app.bundle.js',
    '/manifest.json',
    '/sw.js'
  ],
  blacklist: ['service-worker.js'],
  offlineSVG: `<svg role="img" viewBox="0 0 400 300"
    xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300"
    fill="#aaa"/><text x="50%" y="50%" dominant-baseline="central"
    text-anchor="middle" font-family="monospace" font-size="32"
    fill="#222">offline</text></svg>`,
  offlinePage: '/offline.html',
  notFound:    '/404.html'
};

/* ---------- helpers ---------- */
const cacheName = (key) => `${CONFIG.version}${key}`;

const stash = async (store, req, res) => {
  if (res && res.ok) (await caches.open(store)).put(req, res.clone());
  return res;
};

const hit = (req) =>
  caches.match(req).then((r) => r || Promise.reject('no‑match'));

/* ---------- lifecycle ---------- */
self.addEventListener('install', (e) =>
  e.waitUntil(
    caches
      .open(cacheName('static'))
      .then((c) => c.addAll(CONFIG.precache))
      .then(() => self.skipWaiting())
  )
);

self.addEventListener('activate', (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((ks) =>
        Promise.all(ks.filter((k) => !k.startsWith(CACHE_PREFIX)).map(caches.delete))
      )
      .then(() => self.clients.claim())
  )
);

/* ---------- fetch ---------- */
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (
    request.method !== 'GET' ||
    CONFIG.blacklist.some((p) => request.url.endsWith(p))
  )
    return;

  const url    = new URL(request.url);
  const isImg  = /\.(png|jpe?g|webp|gif|svg)$/i.test(url.pathname);
  const bucket = cacheName(isImg ? 'img' : 'content');

  if (isImg) {
    // cache‑first for images
    e.respondWith(
      hit(request)
        .catch(() => fetch(request).then((r) => stash(bucket, request, r)))
        .catch(
          () =>
            new Response(CONFIG.offlineSVG, {
              headers: { 'Content-Type': 'image/svg+xml' }
            })
        )
    );
  } else {
    // network‑first for HTML/JS/CSS/etc.
    e.respondWith(
      fetch(request)
        .then((r) => stash(bucket, request, r))
        .catch(() => hit(request))
        .catch(() => caches.match(CONFIG.offlinePage))
    );
  }
});

/* ---------- instant update channel ---------- */
self.addEventListener('message', (e) => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
