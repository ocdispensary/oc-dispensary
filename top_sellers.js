import data from './top_sellers.json'  assert { type: 'json' };

const wrapper = document.getElementById('featured-wrapper');

data.forEach((item) => {
  const url = new URL(item.link);

  const slide = document.createElement('div');
  slide.className = 'swiper-slide';
      slide.innerHTML = `
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
      wrap.appendChild(slide);
    });

    /* Initialise Swiper once slides exist */
    new Swiper('.tm-special-carousel', {
      loop: true,
      autoplay: { delay: 10000 },      /* 5‑second auto‑advance */
      slidesPerView: 2,
      spaceBetween: 20,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {                 /* responsive rows */
        600:  { slidesPerView: 3 },
        992:  { slidesPerView: 3 },
        1200: { slidesPerView: 4 }
      }
    });
