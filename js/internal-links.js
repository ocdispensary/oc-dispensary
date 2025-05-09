/* internal-links.js
 *  Keeps every same‑origin /oc‑dispensary/ link inside the standalone PWA,
 *  even if the element was added later or accidentally carries target="_blank".
 */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-internal], a[href^="https://ocdispensary.github.io/oc-dispensary/"]');
  if (!a) return;

  // Same‑origin check (extra safety if someone edits HTML by hand)
  if (a.href.startsWith(location.origin + '/oc-dispensary/')) {
    e.preventDefault();
    // Always replace the current history entry instead of spawning Chrome
    window.location.href = a.href;
  }
});
