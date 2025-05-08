/* global zuix */
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => (deferredPrompt = e));

document.getElementById('installApp')?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') deferredPrompt = null;
});

/* ──────────────────────────────────────────────────────────────────────── */
/*  zUIx assets + misc helpers                                             */
zuix.using('script', './service-worker.js');
zuix.using('style',
  'https://cdnjs.cloudflare.com/ajax/libs/flex-layout-attribute/1.0.3/css/flex-layout-attribute.min.css');
zuix.using('style', './style.css');
window.zuixNoConsoleOutput = true;

/* Lock to portrait when running installed/fullscreen                     */
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
  screen.orientation?.lock?.('portrait').catch(() => {});
}

/* Scroll 1 px after load to push the browser bar off‑screen on Android    */
window.addEventListener('load', () => setTimeout(() => scrollTo(0, 1), 50));

/* ─────────────────────────── Link‑rewrite logic ───────────────────────── */
const GH_BASE = 'https://ocdispensary.github.io/oc-dispensary/';
const CO_BASE = 'https://ocdispensary.co/';

document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (!a || !a.href.startsWith(CO_BASE)) return;

  /* Get “/path?query#hash” after the domain */
  const tail = a.href.slice(CO_BASE.length);

  const isBrooklynMenu = tail.startsWith('brooklyn-menu/');
  const isPlainBrooklynMenu = isBrooklynMenu && (
    tail === 'brooklyn-menu/' ||                      // “…/brooklyn-menu/”
    tail === 'brooklyn-menu'  ||                      // “…/brooklyn-menu” (edge‑case)
    /^brooklyn-menu\/?$/.test(tail) && !a.search      // same but with no query
  );

  /* 1️⃣  Leave menu links alone — they keep the .co domain */
  if (isBrooklynMenu && !isPlainBrooklynMenu) {
    return;                                          // ← no rewrite
  }

  /* 2️⃣  Everything else goes to GitHub‑Pages */
  e.preventDefault();
  window.location.href = GH_BASE + tail;
});
