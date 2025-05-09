/*  top_sellers.js  (no build step, works with a plain <script defer>)  */

(async () => {
  const wrapper = document.getElementById('featured-wrapper');
  if (!wrapper) return;                   // safety‑net

  // 1.  Load JSON – adjust the path only if you move the file
  const response = await fetch('top_sellers.json', { cache: 'reload' });
  const products = await response.json();

  // 2.  Build one <div class="swiper‑slide"> per product
  for (const p of products) {
    const url = new URL(p.link);

    wrapper.insertAdjacentHTML('beforeend', `
      <div class="swiper-slide">
        <a
          href="${url.pathname + url.search}"  <!-- /oc-dispensary/menu?dtche… -->
          data-internal
          target="_self"
          rel="noopener"
          class="product-card"
        >
          <img src="${p.img}" alt="">
          <h4>${p.name}</h4>
          <p>${p.price}</p>
        </a>
      </div>
    `);
  }



      <div class="tm-special-img-container tm-special-item">
        <a href="${item.link}" target="_blank" aria-label="${item.name}">
          <img src="${item.img}" alt="${item.name}"></div>
          <div class="tm-special-item-description">
            <h2 class="tm-text-primary tm-special-item-title">
              ${item.name}
            </h2>
            <p class="tm-special-item-text">
              <small>${item.brand}</small><br>
              <span class="tm-list-item-price">${item.price}</span>
            </p>
          </div>
        </a>`;






  /* 3.  (Re)initialise Swiper only after slides exist.
         If you already create it somewhere else, just call .update() instead. */
  if (window.featuredSwiper) {
    window.featuredSwiper.update();        // Swiper was created earlier
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
