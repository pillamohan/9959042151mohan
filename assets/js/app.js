const IMAGES = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.png', 'img8.jpg', 'img9.jpg', 'img10.jpg', 'img11.jpg'];
const audio = document.getElementById('bgAudio');
const playBtn = document.getElementById('playBtn');
const enterBtn = document.getElementById('enterBtn');
const intro = document.getElementById('intro');
const main = document.getElementById('main');
const slideshow = document.getElementById('slideshow');
const grid = document.getElementById('grid');
const events = document.getElementById('events');
const surprise = document.getElementById('surprise');
const surpriseText = document.getElementById('surpriseText');
const surpriseBtn = document.getElementById('surpriseBtn');
const closeSurprise = document.getElementById('closeSurprise');

// revealMore helper (attached via inline onclick)
function revealMore() {
  const surpriseText = document.getElementById('surpriseText');
  if (!surpriseText) return;
  surpriseText.textContent = "Sowmya — you light up every day. Today I promise more laughter, more adventures and more 'us'. Love you forever. — Pichii 💖";
  try { runConfetti(); } catch(e) {}
}


IMAGES.forEach((name, idx) => {
  const src = 'assets/images/' + name;
  const div = document.createElement('div');
  div.className = 'slide';
  div.style.position='absolute';
  div.style.inset=0;
  div.style.opacity = idx===0?1:0;
  div.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover">`;
  slideshow.appendChild(div);
  const g = document.createElement('div');
  const im = document.createElement('img');
  im.src = src; im.alt = 'photo'+(idx+1); g.appendChild(im); grid.appendChild(g);
  const ev = document.createElement('div'); ev.className='event';
  ev.innerHTML = `<strong>Memory ${(idx+1)}</strong><p>A beautiful moment we shared.</p>`;
  events.appendChild(ev);
});

let cur = 0;
setInterval(()=>{ 
  const slides = slideshow.children;
  if(!slides.length) return;
  slides[cur].style.transition='opacity .9s';
  slides[cur].style.opacity='0';
  cur = (cur+1) % slides.length;
  slides[cur].style.transition='opacity .9s';
  slides[cur].style.opacity='1';
  document.querySelector('.big-photo img').src = slides[cur].querySelector('img').src;
},4200);

enterBtn && enterBtn.addEventListener('click', ()=>{ 
  gsap.to(intro.querySelector('.center'), {duration:0.9, y:-40, opacity:0, onComplete: ()=>{ intro.classList.add('hidden'); main.classList.remove('hidden'); playAudio(); }});
});

function playAudio(){ audio.play().catch(()=>{}); playBtn.textContent='Pause Music'; }
function pauseAudio(){ audio.pause(); playBtn.textContent='Play Music'; }
playBtn.addEventListener('click', ()=>{ if(audio.paused) playAudio(); else pauseAudio(); });

surpriseBtn.addEventListener('click', ()=>{ surprise.classList.remove('hidden'); });
closeSurprise && closeSurprise.addEventListener('click', ()=>{ surprise.classList.add('hidden'); });

document.getElementById('confetti').addEventListener('click', ()=>{ runConfetti(); });
function runConfetti(){ const canvas=document.createElement('canvas'); canvas.style.position='fixed'; canvas.style.left=0; canvas.style.top=0; canvas.style.width='100%'; canvas.style.height='100%'; canvas.style.zIndex=9999; document.body.appendChild(canvas); canvas.width=innerWidth; canvas.height=innerHeight; const ctx=canvas.getContext('2d'); let parts=[]; for(let i=0;i<160;i++) parts.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height-200, vx:-2+Math.random()*4, vy:2+Math.random()*6, r:4+Math.random()*8, c:`hsl(${Math.random()*360} 70% 60%)`}); let t=0; function anim(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(const p of parts){ p.x+=p.vx; p.y+=p.vy; p.vy+=0.05; ctx.fillStyle=p.c; ctx.fillRect(p.x,p.y,p.r,p.r*1.6);} t++; if(t<240) requestAnimationFrame(anim); else document.body.removeChild(canvas); } anim(); }

(function(){ try{ const canvas = document.getElementById('heroCanvas'); const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000); const renderer = new THREE.WebGLRenderer({canvas, alpha:true}); renderer.setSize(window.innerWidth, window.innerHeight); camera.position.z = 80; const geom = new THREE.BufferGeometry(); const count = 600; const pos = new Float32Array(count*3); for(let i=0;i<count*3;i++){ pos[i] = (Math.random()-0.5)*200; } geom.setAttribute('position', new THREE.BufferAttribute(pos,3)); const mat = new THREE.PointsMaterial({size:2, color:0xff5da2}); const points = new THREE.Points(geom, mat); scene.add(points); function animate(){ requestAnimationFrame(animate); points.rotation.y += 0.001; renderer.render(scene,camera); } animate(); }catch(e){console.warn(e);} })();

const quotes = [
  "Every moment with you is my favorite.",
  "You are my today and all of my tomorrows.",
  "I fell in love with you in a hundred tiny ways.",
  "With you, simple moments become magical."
];
document.getElementById('moreLove').addEventListener('click', ()=>{ surpriseText.textContent = quotes[Math.floor(Math.random()*quotes.length)] + " — Pichii"; });

window.addEventListener('resize', ()=>{ try{ const c=document.getElementById('heroCanvas'); if(c){ c.width=window.innerWidth; c.height=window.innerHeight; } }catch(e){} });
