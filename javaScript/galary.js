
(() => {
  const root = document.querySelector('.galary');
  if(!root) return;

  const viewport = root.querySelector('.viewport');
  const placeholder = root.querySelector('.columns');        // твоя наявна обгортка з <ul><li><img>
  const prevBtn = root.querySelector('.nav.prev');
  const nextBtn = root.querySelector('.nav.next');
  const dotsEl = root.querySelector('#gallery-dots');

  // зібрати всі картинки з твоєї розмітки
  let imgs = Array.from(placeholder.querySelectorAll('img'))
                 .map(img => ({src: img.getAttribute('src'), alt: img.getAttribute('alt') || ''}));

  // якщо непарна кількість — дублюємо останню, щоб кожна колонка мала 2 фото
  if (imgs.length % 2 === 1 && imgs.length > 0) imgs.push(imgs[imgs.length-1]);

  // перетворити .columns у .track і побудувати базові картки
  placeholder.classList.remove('columns');
  placeholder.classList.add('track');
  placeholder.id = 'gallery-track';
  placeholder.innerHTML = '';
  const track = placeholder;

  const makeCell = ({src, alt}) => {
    const d = document.createElement('div');
    d.className = 'cell';
    const i = document.createElement('img');
    i.src = src; i.alt = alt;
    d.appendChild(i);
    return d;
  };

  const baseCells = imgs.map(makeCell);
  baseCells.forEach(c => track.appendChild(c));

  // стан каруселі
  let colW = 0, colGap = 0, realCols = 0, visibleCols = 0, cloneCols = 0, colIndex = 0;

  // допоміжні
  const applyTransform = () => {
    const x = -(colIndex * (colW + colGap));
    track.style.transform = `translateX(${x}px)`;
  };

  const clearClones = () => track.querySelectorAll('[data-clone]').forEach(n => n.remove());

  const buildDots = () => {
    dotsEl.innerHTML = '';
    for (let i=0; i<realCols; i++){
      const b = document.createElement('button');
      b.type='button'; b.className='dot';
      b.setAttribute('aria-label', `До колонки ${i+1}`);
      b.addEventListener('click', () => { colIndex = cloneCols + i; animate(); });
      dotsEl.appendChild(b);
    }
  };

  const updateDots = () => {
    if (!realCols) return;
    const idx = ((colIndex - cloneCols) % realCols + realCols) % realCols;
    Array.from(dotsEl.children).forEach((d,i)=> d.classList.toggle('active', i===idx));
  };

  const animate = () => {
    track.style.transition = 'transform .5s ease';
    applyTransform();
  };

  // основне налаштування/перерахунок (resize тощо)
  const setup = () => {
    if (!track.querySelector('.cell')) return;

    // видалити попередні клони і знову виміряти
    track.classList.add('no-anim');
    clearClones();

    // виміри
    const firstCell = track.querySelector('.cell');
    colW = firstCell.getBoundingClientRect().width;
    const cs = getComputedStyle(track);
    colGap = parseFloat(cs.columnGap || cs.gap || 0) || 0;

    // реальна кількість колонок (2 фото на колонку)
    realCols = Math.ceil(track.querySelectorAll('.cell:not([data-clone])').length / 2);

    // скільки колонок видно у viewport
    visibleCols = Math.max(1, Math.round(viewport.clientWidth / (colW + colGap)));

    // скільки колонок клонувати для безшовного кільця
    cloneCols = Math.min(realCols, visibleCols + 1);

    // клонування (по 2 елементи на колонку)
    const cells = Array.from(track.querySelectorAll('.cell:not([data-clone])'));
    const perCol = 2, cloneCountCells = cloneCols * perCol;

    // префікс (з кінця)
    const prefix = cells.slice(cells.length - cloneCountCells).map(n => n.cloneNode(true));
    prefix.forEach(n => { n.dataset.clone='1'; track.insertBefore(n, track.firstChild); });

    // суфікс (з початку)
    const suffix = cells.slice(0, cloneCountCells).map(n => n.cloneNode(true));
    suffix.forEach(n => { n.dataset.clone='1'; track.appendChild(n); });

    // стартова позиція — перша «реальна» колонка після клона
    colIndex = cloneCols;
    applyTransform();

    track.classList.remove('no-anim');

    buildDots();
    updateDots();
  };

  // події
  nextBtn?.addEventListener('click', () => { colIndex++; animate(); });
  prevBtn?.addEventListener('click', () => { colIndex--; animate(); });

  track.addEventListener('transitionend', () => {
    // «перестрибування» коли доїхали до клонів
    if (colIndex >= cloneCols + realCols){
      track.classList.add('no-anim');
      colIndex -= realCols;
      applyTransform();
      requestAnimationFrame(() => track.classList.remove('no-anim'));
    } else if (colIndex < cloneCols){
      track.classList.add('no-anim');
      colIndex += realCols;
      applyTransform();
      requestAnimationFrame(() => track.classList.remove('no-anim'));
    }
    updateDots();
  });

  // ресайз
  let t=null;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(setup, 180);
  });

  // ініціалізація
  setup();
})();
