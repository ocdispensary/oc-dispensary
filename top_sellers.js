/*  top_sellers.js  –  classic script, no build step required
 *  – Re‑creates the original OC Dispensary “Top Sellers” slide markup
 *  – Converts any absolute product URL to a relative in‑scope link
 *  – Adds target="_self" + data‑internal so our click‑interceptor keeps it inside the PWA
 */

(async () => {
  const wrap = document.getElementById('featured-wrapper');
  if (!wrap) return;                     // safety‑net for pages without the carousel

  // 1.  Load the JSON feed
  const res      = await fetch('top_sellers.json', { cache: 'reload' });
  const products = await res.json();

  // 2.  Build the slides
  products.forEach(item => {
    const slide  = document.createElement('div');
    slide.className = 'swiper-slide';

    // Convert absolute URL → relative path + query so it’s always “in scope”
    const u         = new URL(item.link);
    const relative  = u.pathname + u.search;   //  /oc-dispensary/menu?dtche[product]=…

    slide.innerHTML = `
      <a
        href="${relative}"
        data-internal
        target="_self"
        aria-label="${item.name}"
        class="tm-special-item"
      >
        <div class="tm-special-img-container">
          <img src="${item.img}" alt="${item.name}">
        </div>

        <div class="tm-special-item-description">
          <h2 class="tm-text-primary tm-special-item-title">${item.name}</h2>
          <p class="tm-special-item-text">
            <small>${item.brand}</small><br>
            <span class="tm-list-item-price">${item.price}</span>
          </p>
        </div>
      </a>`;
    wrap.appendChild(slide);
  });

  // 3.  Initialise (or refresh) Swiper after the slides exist
  if (window.featuredSwiper) {
    window.featuredSwiper.update();        // If Swiper was created earlier
  } else {
    window.featuredSwiper = new Swiper('.tm-special-carousel', {
      slidesPerView: 2,
      spaceBetween: 16,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: { 640: { slidesPerView: 3 } }
    });
  }
})();
