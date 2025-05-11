/* Simple age‑gate — blacks‑out page and asks “Are you 21+?”.
   • Dismisses forever once the user clicks “Yes” (saved in localStorage).
   • If “No”, shows a polite rejection message. */

(function () {
  const AGE_KEY = 'is21';                     // localStorage flag
  if (localStorage.getItem(AGE_KEY) === 'true') return; // already verified

  // Prevent the main page from scrolling while the gate is up
  document.documentElement.style.overflow = 'hidden';

  // ---------- Overlay ----------
  const overlay = Object.assign(document.createElement('div'), {
    id: 'age-overlay'
  });
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0,0,0,.85)',            // dim everything behind
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999'
  });

  // ---------- Modal ----------
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    background: '#fff',
    borderRadius: '8px',
    maxWidth: '380px',
    width: '90%',
    padding: '24px',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    boxShadow: '0 0 16px rgba(0,0,0,.4)'
  });

  modal.innerHTML = `
    <h2 style="margin-top:0">Are you 21&nbsp;or older?</h2>
    <p style="margin:16px 0">You must be at least 21 years old to view this content.</p>
    <div style="display:flex;gap:12px;justify-content:center">
      <button id="age-yes" style="padding:10px 20px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer">Yes</button>
      <button id="age-no"  style="padding:10px 20px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer">No</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // ---------- Button handlers ----------
  document.getElementById('age-yes').addEventListener('click', () => {
    localStorage.setItem(AGE_KEY, 'true');    // remember choice
    overlay.remove();                         // hide gate
    document.documentElement.style.overflow = ''; // restore scroll
  });

  document.getElementById('age-no').addEventListener('click', () => {
    modal.innerHTML = `
      <h2 style="margin-top:0">Sorry!</h2>
      <p>You must be 21 years or older to enter this site.</p>
    `;
  });
})();