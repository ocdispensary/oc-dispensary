/*  OC‑Dispensary PWA  ▸  sw.js  (BUILD_VERSION must change on every deploy) */
const BUILD_VERSION = '2025‑05‑08‑02';          // ← bump each release
const CACHE_PREFIX  = `v${BUILD_VERSION}::`;

const CONFIG = {
  version:      CACHE_PREFIX,
  cacheRemote:  true,

  /* pre‑cached core shell — keep this short and stable */
  precache: [
    '/',                  // root request
    '/index.html',        // SPA entry‑point
    '/offline.html',
    '/404.html',
    '/app.bundle.js',
    '/manifest.json',
    '/sw.js'
  ],

  /* NEW ► single‑page‑app options */
  spaRoot:  '/index.html',                                        // what we serve for in‑scope navigations
  inScopePrefix: 'https://ocdispensary.github.io/', // links that must stay in‑app

  /* misc */
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
  caches.match(req, { ignoreSearch: true }).then((r) => r || Promise.reject('no‑match'));

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

  /* ignore non‑GET and black‑listed requests */
  if (
    request.method !== 'GET' ||
    CONFIG.blacklist.some((p) => request.url.endsWith(p))
  )
    return;

  const url    = new URL(request.url);
  const isImg  = /\.(png|jpe?g|webp|gif|svg)$/i.test(url.pathname);
  const bucket = cacheName(isImg ? 'img' : 'content');

  /* ── NEW: keep every in‑scope navigation inside the PWA ──────────────── */
  if (request.mode === 'navigate' && request.url.startsWith(CONFIG.inScopePrefix)) {
    /* network‑first ► fall back to cached shell ► fall back to offline page */
    e.respondWith(
      fetch(request)
        .then((r) => stash(bucket, request, r))
        .catch(() => hit(CONFIG.spaRoot))
        .catch(() => caches.match(CONFIG.offlinePage))
    );
    return; // stop here — we’ve handled it
  }

  /* ── existing image logic (cache‑first) ─────────────────────────────── */
  if (isImg) {
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
    return;
  }

  /* ── existing asset/page logic (network‑first) ──────────────────────── */
  e.respondWith(
    fetch(request)
      .then((r) => stash(bucket, request, r))
      .catch(() => hit(request))
      .catch(() => caches.match(CONFIG.offlinePage))
  );
});

/* ---------- instant update channel ---------- */
self.addEventListener('message', (e) => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
