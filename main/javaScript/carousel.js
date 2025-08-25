// carousel.js
document.addEventListener('DOMContentLoaded', () => {
  // знімаємо no-js якщо додаси його в <html class="no-js">
  document.documentElement.classList.remove('no-js');

  // Можна мати кілька таких каруселей у section6
  const carousels = document.querySelectorAll('.section6 .carousel');

  carousels.forEach((root) => {
    const track  = root.querySelector('.track');
    const slides = Array.from(track.querySelectorAll('.slide'));
    const prev   = root.querySelector('.nav.prev');
    const next   = root.querySelector('.nav.next');
    const dotsEl = root.querySelector('.dots');

    if (!slides.length) return;

    // точки
    slides.forEach((_, idx) => {
      const b = document.createElement('button');
      b.addEventListener('click', () => { i = idx; render(); });
      dotsEl.appendChild(b);
    });
    const dots = Array.from(dotsEl.children);

    let i = 0;
    const mod = (n,m) => ((n % m) + m) % m;

    function render(){
      slides.forEach(s => s.className = 'slide'); // скинути позиційні

      const left2  = slides[mod(i-2, slides.length)];
      const prevS  = slides[mod(i-1, slides.length)];
      const active = slides[mod(i,   slides.length)];
      const nextS  = slides[mod(i+1, slides.length)];
      const right2 = slides[mod(i+2, slides.length)];

      left2.classList.add('left2');
      prevS.classList.add('prev');
      active.classList.add('active');
      nextS.classList.add('next');
      right2.classList.add('right2');

      dots.forEach((d, k) => d.classList.toggle('active', k === i));
    }

    prev.addEventListener('click', () => { i = mod(i-1, slides.length); render(); });
    next.addEventListener('click', () => { i = mod(i+1, slides.length); render(); });

    // свайп
    let startX = null;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    track.addEventListener('touchend',   e => {
      if(startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev).click();
      startX = null;
    });

    render();
  });
});
