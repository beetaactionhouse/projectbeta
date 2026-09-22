/* =========================================================
   BEETA AUCTION HOUSE — main script
   Starfield canvas, nav toggle, animated counters,
   live auction countdown timers, contact form handling.
   ========================================================= */

/* ---------- Starfield canvas ---------- */
(function starfield(){
  const canvas = document.getElementById('starfield');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars = [];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }

  function makeStars(){
    const count = Math.floor((w * h) / 9000);
    stars = new Array(count).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.25,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2
    }));
  }

  let t = 0;
  function draw(){
    t += 1;
    ctx.clearRect(0, 0, w, h);
    for(const s of stars){
      const a = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.25;
      ctx.beginPath();
      ctx.fillStyle = `rgba(246,247,251,${Math.max(0, a)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); makeStars(); });
  resize();
  makeStars();
  draw();
})();

/* ---------- Occasional shooting star ---------- */
(function shootingStars(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return;

  function spawn(){
    const star = document.createElement('div');
    star.className = 'shooting-star';
    const startY = Math.random() * 40;
    star.style.top = startY + '%';
    star.style.left = '-5%';
    document.body.appendChild(star);

    const duration = 1400 + Math.random() * 600;
    const travel = window.innerWidth * 1.2;

    star.animate([
      { transform: 'translate(0,0)', opacity: 1, boxShadow: '0 0 8px 2px rgba(255,255,255,.8), -60px 6px 40px 0 rgba(255,255,255,.25)' },
      { transform: `translate(${travel}px, ${travel * 0.35}px)`, opacity: 0 }
    ], { duration, easing: 'ease-in' });

    setTimeout(() => star.remove(), duration + 100);
  }

  setInterval(spawn, 4500 + Math.random() * 3000);
  setTimeout(spawn, 1200);
})();

/* ---------- Nav (mobile toggle + active link) ---------- */
(function nav(){
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.main-links');
  if(burger && links){
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open-mobile');
      if(open){
        links.style.display = 'flex';
        links.style.flexDirection = 'column';
        links.style.position = 'absolute';
        links.style.top = '68px';
        links.style.left = '0';
        links.style.right = '0';
        links.style.background = 'rgba(6,7,20,0.97)';
        links.style.padding = '24px 32px';
        links.style.gap = '18px';
        links.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
      } else {
        links.style.display = '';
      }
    });
  }

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-links a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });
})();

/* ---------- Animated stat counters ---------- */
(function counters(){
  const nums = document.querySelectorAll('.stat .num[data-count]');
  if(!nums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  nums.forEach(n => observer.observe(n));

  function animateCount(el){
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if(progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(tick);
  }
})();

/* ---------- Live auction countdown timers ---------- */
(function countdowns(){
  const timers = document.querySelectorAll('.lot-timer[data-ends]');
  if(!timers.length) return;

  function pad(n){ return String(n).padStart(2,'0'); }

  function update(){
    const now = Date.now();
    timers.forEach(t => {
      let remaining = parseInt(t.dataset.ends, 10) - now;
      if(remaining < 0){
        // loop the demo countdown so it always shows "closing soon" energy
        remaining = remaining % (1000 * 60 * 60 * 26) + (1000 * 60 * 60 * 26);
        t.dataset.ends = (now + remaining).toString();
      }
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      t.textContent = `Closes in ${pad(h)}:${pad(m)}:${pad(s)}`;
    });
  }

  timers.forEach(t => {
    const hours = 3 + Math.random() * 22;
    t.dataset.ends = (Date.now() + hours * 3600000).toString();
  });

  update();
  setInterval(update, 1000);
})();

/* ---------- Contact form (demo submit handling) ---------- */
(function contactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const success = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    success.classList.add('show');
    form.reset();
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();

/* ---------- Portfolio filter chips ---------- */
(function portfolioFilter(){
  const chips = document.querySelectorAll('.portfolio-filter .chip');
  const items = document.querySelectorAll('.pf-item');
  if(!chips.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      items.forEach(item => {
        if(filter === 'all' || item.dataset.cat === filter){
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });
})();

/* ---------- Reveal-on-scroll for cards/sections ---------- */
(function reveal(){
  const targets = document.querySelectorAll('.card, .member, .value-card, .lot-card, .tl-item, .pf-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });
})();
