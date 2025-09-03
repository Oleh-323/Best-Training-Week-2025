const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
if(burger){
  burger.addEventListener('click', ()=> menu.classList.toggle('active'));
  document.addEventListener('click', (e)=>{
    if(!menu.contains(e.target) && !burger.contains(e.target)) menu.classList.remove('active');
  });
  // close menu on link click
  menu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> menu.classList.remove('active')));
}

// Carousel
const track = document.getElementById('track');
const slides = Array.from(track.children);
let i = 0;
function go(dir){ i = (i + dir + slides.length) % slides.length; track.style.transform = `translateX(${-i*100}%)`; }
document.getElementById('prev').addEventListener('click', ()=> go(-1));
document.getElementById('next').addEventListener('click', ()=> go(1));

// Swipe for mobile
let startX=0, dx=0; const TH=40;
track.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; dx=0; }, {passive:true});
track.addEventListener('touchmove', e=>{ dx = e.touches[0].clientX - startX; }, {passive:true});
track.addEventListener('touchend', ()=>{ if(Math.abs(dx) > TH){ go(dx>0 ? -1 : 1); } });


//Функція для організаторів
(function(){
  const root   = document.querySelector('.carousel_second');
  const track  = root.querySelector('.track_second');
  const radios = [...root.querySelectorAll('input[name="c_second"]')];
  const slides = [...root.querySelectorAll('.slide_second')];

  function currentIndex(){ return radios.findIndex(r => r.checked); }

  function centerSlide(i){
    const slot = slides[i];
    const viewportW = root.clientWidth;           // ширина каруселі
    const slotW     = slot.clientWidth;
    // відняти половину вьюпорта мінус половину слайда → центр у вікні
    const offset = -(slot.offsetLeft - (viewportW - slotW)/2);
    track.style.transform = `translate3d(${Math.round(offset)}px,0,0)`; // без субпікселів
  }

  function update(){
    const i = currentIndex();

    slides.forEach((s, idx) => {
      s.classList.toggle('is-active', idx === i);
      s.classList.toggle('is-peek',   idx === i-1 || idx === i+1);
    });

    centerSlide(i);
  }

  radios.forEach(r => r.addEventListener('change', update));
  window.addEventListener('resize', update);
  update();
})();

