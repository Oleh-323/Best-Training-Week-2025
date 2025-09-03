// reviews.js
(() => {
    const viewport = document.querySelector('.reviews__viewport');
    if (!viewport) return; // якщо секції нема на сторінці
  
    const track = viewport.querySelector('.reviews__track');
    const slides = [...track.children];
    const prevBtn = viewport.querySelector('.reviews__arrow--prev');
    const nextBtn = viewport.querySelector('.reviews__arrow--next');
    const dotsWrap = document.querySelector('.reviews__dots');
  
    let index = 0;
  
    // генеруємо крапки
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Слайд ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  
    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
  
      // оновлюємо крапки
      [...dotsWrap.children].forEach((d, i) => {
        d.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
  
      // блокування стрілок на краях
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === slides.length - 1;
    }
  
    function goTo(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      update();
    }
  
    // події на стрілки
    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));
  
    // свайп (мобільні)
    let startX = 0, dx = 0;
    viewport.addEventListener('pointerdown', e => {
      startX = e.clientX; dx = 0;
      viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener('pointermove', e => {
      if (!startX) return;
      dx = e.clientX - startX;
    });
    viewport.addEventListener('pointerup', () => {
      if (Math.abs(dx) > 40) {
        if (dx < 0) goTo(index + 1);
        else goTo(index - 1);
      }
      startX = 0; dx = 0;
    });
  
    // управління з клавіатури
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
    });
    viewport.tabIndex = 0;
  
    // стартове оновлення
    update();
  })();
  