const track = document.getElementById('track');
const slides = track.children;
let i = 0;

function show(){ track.style.transform = `translateX(-${i*100}%)`; }
document.getElementById('prev').onclick = () => { i = (i-1+slides.length)%slides.length; show(); };
document.getElementById('next').onclick = () => { i = (i+1)%slides.length; show(); };
show();