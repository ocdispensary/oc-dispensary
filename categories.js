// categories.js
fetch('categories.json')
  .then(r => r.json())
  .then(cats => {
    const wrap = document.getElementById('categories-wrapper');

    cats.forEach(cat => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <a href="${cat.link}" class="tm-black-bg category-card" aria-label="${cat.name}">
          <img src="${cat.img}" alt="${cat.name}" loading="lazy">
          <h3 class="tm-text-primary tm-mt-10">${cat.name}</h3>
        </a>`;
      wrap.appendChild(slide);
    });

    /* Init Swiper once slides are in */
    new Swiper('.categories-carousel', {
      loop: true,
      autoplay: { delay: 8000 },
      slidesPerView: 2,
      spaceBetween: 16,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {
        600:  { slidesPerView: 3 },
        992:  { slidesPerView: 4 },
        1200: { slidesPerView: 5 }
      }
    });
  })
  .catch(err => console.error('🚨 Could not load categories.json', err));
