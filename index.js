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
    const a = e.target.closest('a');
    if (!a) return;
  
    const root1 = 'https://ocdispensary.co';
    const root2 = root1 + '/'; // with trailing slash
    const GH    = 'https://ocdispensary.github.io/oc-dispensary/';
  
    const href = a.href;
    if (href === root1 || href === root2) {
      e.preventDefault();
      window.location.href = GH;           // stay fullscreen, same origin
    }
  });