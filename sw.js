/* =========================================================================
   Service‑Worker for OC Dispensary PWA
   -------------------------------------------------------------------------
   – v3 bumps the cache key and refines the redirect rules so that…
       • ONLY the bare https://ocdispensary.co/ (and its trivial variants)
         is redirected to the GitHub‑Pages mirror.
       • Any request whose path starts with /brooklyn-menu/ is **never**
         rewritten – those pages must stay on the live WordPress host.
   ======================================================================= */

// ⚠️ Increase this every time you publish so clients pick up the new SW.
const version = 'v3';

// ---- Domain helpers -----------------------------------------------------
const ROOT_ORIGIN   = 'https://ocdispensary.co';
const GITHUB_ROOT   = 'https://ocdispensary.github.io/oc-dispensary/';
const ROOT_PATHS    = ['', '/', '/index.html', '/#', '/#/']; // paths to redirect

// ---- Cache & Offline config --------------------------------------------
const config = {
  cacheRemote: true,                   // cache third‑party assets too
  version:     version + '::',
  preCachingItems: [
    'app.bundle.js',
    'index.html',
    'index.js',
    'offline.html',
    '404.html',
    'sw.js'
  ],
  blacklistCacheItems: [
    'index.html',                      // fetched fresh each visit
    'service-worker.js',               // never cache SW itself
    'sw.js'
  ],
  offlineImage:
    '<svg role="img" aria-labelledby="offline-title" xmlns="http://www.w3.org/2000/svg" ' +
    'viewBox="0 0 400 300"><title id="offline-title">Offline</title>' +
    '<rect width="400" height="300" fill="#f2f2f2"/>' +
    '<text fill="#222" font-family="monospace" font-size="26" font-weight="700">' +
    '<tspan x="136" y="156">offline</tspan></text></svg>',
  offlinePage: 'offline.html',
  notFoundPage: '404.html'
};

// ---- Small helpers ------------------------------------------------------
const cacheName = (key, opt) => `${opt.version}${key}`;

const addToCache = (cacheKey, req, res) => {
  if (res.ok) {
    const copy = res.clone();
    caches.open(cacheKey).then(c => c.put(req, copy));
  }
  return res;
};

const fetchFromCache = event =>
  caches.match(event.request).then(r => {
    if (!r)           throw Error('not‑in‑cache');
    if (r.status === 404) return caches.match(config.notFoundPage);
    return r;
  });

const offlineResponse = (type, opt) =>
  type === 'content' ? caches.match(opt.offlinePage) :
  type === 'image'   ? new Response(opt.offlineImage, { headers:{'Content-Type':'image/svg+xml'} }) :
  undefined;

// ---- Install ------------------------------------------------------------
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName('static', config))
          .then(c => c.addAll(config.preCachingItems))
          .then(() => self.skipWaiting())
  );
});

// ---- Activate -----------------------------------------------------------
self.addEventListener('activate', event => {
  const clearOld = caches.keys().then(keys =>
    Promise.all(keys
      .filter(k => !k.startsWith(config.version))
      .map(k => caches.delete(k))));
  event.waitUntil(clearOld.then(() => self.clients.claim()));
});

// ---- Fetch --------------------------------------------------------------
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* 1 ▸ Redirect ONLY the bare root of ocdispensary.co to GitHub Pages —— */
  if (url.origin === ROOT_ORIGIN && ROOT_PATHS.includes(url.pathname)) {
    event.respondWith(Response.redirect(GITHUB_ROOT, 302));
    return;
  }

  /*    Everything under /brooklyn-menu/ stays on the live site (and thus
        skips the redirect above by design).                              */

  /* 2 ▸ For non‑GET or blacklisted items, let the network handle it ——   */
  if (request.method !== 'GET' ||
      (!config.cacheRemote && url.origin !== self.location.origin) ||
      config.blacklistCacheItems.includes(url.pathname)) {
    return;                                     // default browser path
  }

  /* 3 ▸ Decide cache bucket by file‑type —— */
  let resourceType = 'content';
  if (/(?:jpe?g|png|webp|gif|svg)$/i.test(url.pathname)) {
    resourceType = 'image';
  } else if (/\/fonts\.(?:googleapis|gstatic)\.com$/.test(url.origin)) {
    resourceType = 'font';
  }
  const cacheKey = cacheName(resourceType, config);

  /* 4 ▸ Strategy: Network‑first for HTML/JS/CSS, cache‑first for others */
  if (resourceType === 'content') {
    event.respondWith(
      fetch(request)
        .then(r => addToCache(cacheKey, request, r))
        .catch(() => fetchFromCache(event))
        .catch(() => offlineResponse(resourceType, config))
    );
  } else {
    event.respondWith(
      fetchFromCache(event)
        .catch(() => fetch(request))
        .then(r => addToCache(cacheKey, request, r))
        .catch(() => offlineResponse(resourceType, config))
    );
  }
});
