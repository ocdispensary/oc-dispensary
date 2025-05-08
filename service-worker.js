/*  service-worker.js  ▸  registers and controls sw.js  */
(() => {
    if (!('serviceWorker' in navigator)) return;
  
    let waitingSW;
  
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        /* track a waiting or installing worker */
        const track = () => {
          waitingSW = reg.installing || reg.waiting || null;
        };
        track();
        reg.addEventListener('updatefound', track);
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
  
        /* periodic check (every 2 h while tab open) */
        setInterval(() => reg.update(), 2 * 60 * 60 * 1000);
  
        /* expose helper for manual check */
        window.__checkForPwaUpdate = async () => {
          await reg.update();
          if (waitingSW) {
            waitingSW.postMessage({ type: 'SKIP_WAITING' });
            return 'updated';
          }
          return 'up‑to‑date';
        };
      })
      .catch((err) => console.error('[PWA] SW registration failed', err));
  })();
  