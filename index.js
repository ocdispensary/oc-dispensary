/* global zuix */

let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  deferredPrompt = e;
});

const installApp = document.getElementById('installApp');
installApp?.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') deferredPrompt = null;
  }
});

/* ───────────────────────────── zUIx assets ───────────────────────────── */
zuix.using('script', './service-worker.js');
zuix.using('style',
  'https://cdnjs.cloudflare.com/ajax/libs/flex-layout-attribute/1.0.3/css/flex-layout-attribute.min.css');
zuix.using('style', './stlye.css');
zuix.$.find('.profile').on('click', () => { if (drawerLayout) drawerLayout.open(); });

/* Turn off debug output */
window.zuixNoConsoleOutput = true;

/* ───────────────────────── Orientation lock ──────────────────────────── */
/* When the PWA runs in standalone/fullscreen, enforce portrait mode       */
if (window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone) {           // iOS fallback
  if (screen.orientation?.lock) {
    screen.orientation.lock('portrait').catch(() => { /* ignore errors */ });
  }
}

/* ───────────────────────── URL rewrite helper ────────────────────────── */
/*   – Any click on https://ocdispensary.co/… inside the PWA is silently   */
/*     rewritten to https://ocdispensary.github.io/oc-dispensary/…        */
document.addEventListener('click', e => {
  const anchor = e.target.closest('a');
  if (!anchor) return;

  const src = 'https://ocdispensary.co/';
  if (anchor.href.startsWith(src)) {
    e.preventDefault();
    const dest = anchor.href.replace(
      src,
      'https://ocdispensary.github.io/oc-dispensary/'
    );
    /* Use the SPA‑friendly way if you have a router, otherwise fall back   */
    window.location.href = dest;
  }
});

/* ────────────────── Hide the browser bar on re‑open (Android only) ───── */
window.addEventListener('load', () => setTimeout(() => window.scrollTo(0, 1), 50));
