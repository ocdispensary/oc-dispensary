/*  OC‑Dispensary PWA ▸ sw.js  – FULL REWRITE
 *  Combines your custom logic with PWABuilder’s “offline page” helper.
 *  Increment BUILD_VERSION (or inject a timestamp/SHA) on every deploy.
 *
 *  ────────────────────────────────────────────────────────────────────── */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const BUILD_VERSION = '2025‑05‑12‑01';
const CACHE_PREFIX  = `v${BUILD_VERSION}::`;

/* ---------- shared config ---------- */
const CONFIG = {
  version:      CACHE_PREFIX,
  cacheRemote:  true,
  precache: [
    '/',                // root
    '/index.html',
    '/offline.html',    // offline fallback page
    '/404.html',
    '/app.bundle.js',
    '/manifest.json',
    '/sw.js'
  ],
  blacklist:   ['service-worker.js'],          // never cache the dev SW
  offlineSVG:  `<svg role="img" viewBox="0 0 400 300"
                    xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300"
                    fill="#aaa"/><text x="50%" y="50%" dominant-baseline="central"
                    text-anchor="middle" font-family="monospace" font-size="32"
                    fill="#222">offline</text></svg>`,
  offlinePage: '/offline.html',
  notFound:    '/404.html'
};

/* ---------- small helpers ---------- */
const cacheName = (key) => `${CONFIG.version}${key}`;

const stash = async (store, req, res) => {
  if (res && res.ok) (await caches.open(store)).put(req, res.clone());
  return res;
};

const hit = (req) =>
  caches.match(req).then((r) => r || Promise.reject('no‑match'));

/* ---------- install ---------- */
self.addEventListener('install', (e) =>
  e.waitUntil(
    caches
      .open(cacheName('static'))
      .then((c) => c.addAll(CONFIG.precache))
      .then(() => self.skipWaiting())
  )
);

/* ---------- activate ---------- */
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

/* ---------- enable navigation preload (PWABuilder) ---------- */
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

/* ---------- fetch ---------- */
self.addEventListener('fetch', (e) => {
  const { request } = e;

  // ignore POST/PUT/etc. and blacklisted files
  if (
    request.method !== 'GET' ||
    CONFIG.blacklist.some((p) => request.url.endsWith(p))
  ) {
    return;
  }

  // If this is a navigation request (address‑bar / link tap),
  // use the PWABuilder pattern: try preload → network → cached offline page.
  if (request.mode === 'navigate') {
    e.respondWith(
      (async () => {
        try {
          // 1) whatever the browser pre‑fetched for us
          const preloadResp = await e.preloadResponse;
          if (preloadResp) return preloadResp;

          // 2) live network
          const networkResp = await fetch(request);
          // stash for next time:
          stash(cacheName('content'), request, networkResp.clone());
          return networkResp;
        } catch (_) {
          // 3) offline fallback
          return caches.match(CONFIG.offlinePage);
        }
      })()
    );
    return; // navigation handled, bail out of the rest
  }

  /* ----- everything else (imgs, css, js, json …) ----- */

  const url    = new URL(request.url);
  const isImg  = /\.(png|jpe?g|webp|gif|svg)$/i.test(url.pathname);
  const bucket = cacheName(isImg ? 'img' : 'content');

  if (isImg) {
    // IMAGE  ▸ cache‑first ⇒ network ⇒ minimal SVG placeholder
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
    // OTHER FILES  ▸ network‑first ⇒ cache ⇒ offline.html
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
