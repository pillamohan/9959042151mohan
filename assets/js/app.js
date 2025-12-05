// Defensive: ensure modal starts hidden (prevents auto-show from interfering scripts)
(function(){
  try{
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => { try{ const s = document.getElementById('surprise'); if(s && !s.classList.contains('hidden')) s.classList.add('hidden'); } catch(e){} });
    } else { try{ const s = document.getElementById('surprise'); if(s && !s.classList.contains('hidden')) s.classList.add('hidden'); } catch(e){} }
  }catch(e){ console.warn('startup modal guard error', e); }
})();

// revealMore helper (ensures 'Tell her more' works)
function revealMore() {
  try {
    const surpriseText = document.getElementById('surpriseText');
    if (surpriseText) {
      surpriseText.textContent = "Sowmya — you light up every day. Today I promise more laughter, more adventures and more 'us'. Love you forever. — Pichii 💖";
    }
    try { runConfetti(); } catch(e) {}
  } catch(e) { console.warn('revealMore error', e); }
}

// App script for Sowmya site
const IMAGES = ['img1.png', 'img10.png', 'img11.jpg', 'img12.png', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.png', 'img9.jpg'];
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

// build slideshow and grid
IMAGES.forEach((name, idx) => {
  const src = 'assets/images/' + name;
  // slideshow
  const div = document.createElement('div');
  div.className = 'slide';
  div.style.position='absolute';
  div.style.inset=0;
  div.style.opacity = idx===0?1:0;
  div.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover">`;
  slideshow.appendChild(div);
  // grid
  const g = document.createElement('div');
  const im = document.createElement('img');
  im.src = src;
  im.alt = 'photo'+(idx+1);
  g.appendChild(im);
  grid.appendChild(g);
  // timeline event
  const ev = document.createElement('div');
  ev.className='event';
  ev.innerHTML = `<strong>Memory ${(idx+1)}</strong><p>A beautiful moment we shared.</p>`;
  events.appendChild(ev);
});

// slideshow rotation
let cur = 0;
setInterval(()=>{ 
  const slides = slideshow.children;
  if(!slides.length) return;
  slides[cur].style.transition='opacity .9s';
  slides[cur].style.opacity='0';
  cur = (cur+1) % slides.length;
  slides[cur].style.transition='opacity .9s';
  slides[cur].style.opacity='1';
  const big = document.querySelector('.big-photo img');
  if (big) big.src = slides[cur].querySelector('img').src;
},4200);

// enter button
enterBtn && enterBtn.addEventListener('click', ()=>{ 
  gsap.to(intro.querySelector('.center'), {duration:0.9, y:-40, opacity:0, onComplete: ()=>{ intro.classList.add('hidden'); main.classList.remove('hidden'); playAudio(); }}); 
});// auto show main if user reloads
// play/pause
function playAudio(){ audio && audio.play().catch(()=>{}); playBtn.textContent='Pause Music'; }
function pauseAudio(){ audio && audio.pause(); playBtn.textContent='Play Music'; }
playBtn && playBtn.addEventListener('click', ()=>{ if(audio && audio.paused) playAudio(); else pauseAudio(); });

// surprise popup
surpriseBtn && surpriseBtn.addEventListener('click', ()=>{ surprise && surprise.classList.remove('hidden'); });
closeSurprise && closeSurprise.addEventListener('click', ()=>{ surprise && surprise.classList.add('hidden'); });

// confetti
document.getElementById('confetti')?.addEventListener('click', ()=>{ runConfetti(); });
function runConfetti(){ const canvas=document.createElement('canvas'); canvas.style.position='fixed'; canvas.style.left=0; canvas.style.top=0; canvas.style.width='100%'; canvas.style.height='100%'; canvas.style.zIndex=9999; document.body.appendChild(canvas); canvas.width=innerWidth; canvas.height=innerHeight; const ctx=canvas.getContext('2d'); let parts=[]; for(let i=0;i<160;i++) parts.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height-200, vx:-2+Math.random()*4, vy:2+Math.random()*6, r:4+Math.random()*8, c:`hsl(${Math.random()*360} 70% 60%)`}); let t=0; function anim(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(const p of parts){ p.x+=p.vx; p.y+=p.vy; p.vy+=0.05; ctx.fillStyle=p.c; ctx.fillRect(p.x,p.y,p.r,p.r*1.6);} t++; if(t<240) requestAnimationFrame(anim); else document.body.removeChild(canvas); } anim(); }

// three.js particle background — guarded version
(function(){
  if (typeof THREE === 'undefined') {
    try {
      const hero = document.getElementById('heroCanvas');
      if (hero) {
        hero.style.background = "radial-gradient(circle at 10% 10%, rgba(255,93,162,0.03), transparent 20%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent)";
      }
    } catch(e) { console.warn('heroCanvas fallback error', e); }
    return;
  }

  try {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 80;

    const geom = new THREE.BufferGeometry();
    const count = 600;
    const pos = new Float32Array(count*3);
    for (let i=0;i<count*3;i++) pos[i] = (Math.random()-0.5)*200;
    geom.setAttribute('position', new THREE.BufferAttribute(pos,3));

    const mat = new THREE.PointsMaterial({size:2, color:0xff5da2});
    const points = new THREE.Points(geom, mat);
    scene.add(points);

    function animate(){
      requestAnimationFrame(animate);
      points.rotation.y += 0.001;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      try {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      } catch(e) {}
    });
  } catch(e){
    console.warn('three.js init error', e);
  }
})();

// --- START: Robust popup handlers (append at end) ---
(function() {
  function initPopupHandlers() {
    try {
      const surprise = document.getElementById('surprise');
      const surpriseBtn = document.getElementById('surpriseBtn');
      const closeSurprise = document.getElementById('closeSurprise');
      const moreLove = document.getElementById('moreLove');
      function safeHide(){ if(surprise) surprise.classList.add('hidden'); }
      function safeShow(){ if(surprise) surprise.classList.remove('hidden'); }
      if (closeSurprise) closeSurprise.addEventListener('click', safeHide);
      if (surpriseBtn) surpriseBtn.addEventListener('click', safeShow);
      if (moreLove) moreLove.addEventListener('click', () => { if (typeof revealMore === 'function') revealMore(); else { const st=document.getElementById('surpriseText'); if(st) st.textContent='Sowmya — you light up every day. — Pichii'; try{ runConfetti(); }catch(e){} } });
      if (surprise) surprise.addEventListener('click', (e) => { if (e.target === surprise) safeHide(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') safeHide(); });
    } catch(err) { console.warn('Popup init error', err); }
  }
  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', initPopupHandlers); else initPopupHandlers();
})();
// --- END: Robust popup handlers ---
