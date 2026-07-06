// ===================== SHARED SHOW DATA =====================
// Single source of truth for upcoming shows, used by home, events & repertoire pages.
const SHOWS = [
  {
    id: 'somnitelno',
    title: 'Сомнително лице',
    date: '2026-07-01T20:00:00',
    dateLabel: '1 Јули 2026 • 20:00',
    director: 'Томе Атанасов',
    cast: 'Даниел Захарчев, Бобан Мелов, Јосиф Чапов, Ана Крстевска',
    poster: 'https://teatarmirkaginova.vercel.app/somnitelnolice.jpg'
  },
  {
    id: 'ime',
    title: 'Име',
    date: '2026-08-15T20:00:00',
    dateLabel: '15 Август 2026 • 20:00',
    director: 'Марко Стојанов',
    cast: 'Елена Петрова, Стефан Иванов, Марија Николовска, Александар Трајков',
    poster: 'https://teatarmirkaginova.vercel.app/ime.jpg'
  },
  {
    id: 'teodos',
    title: 'Чорбаџи Теодос',
    date: '2026-10-10T20:00:00',
    dateLabel: '10 Октомври 2026 • 20:00',
    director: 'Томе Атанасов',
    cast: 'Даниел Захарчев, Бобан Мелов, Јосиф Чапов, Ана Крстевска',
    poster: 'https://teatarmirkaginova.vercel.app/teodos.jpg'
  },
  {
    id: 'begalka',
    title: 'Бегалка',
    date: '2026-11-20T20:00:00',
    dateLabel: '20 Ноември 2026 • 20:00',
    director: 'Виктор Андонов',
    cast: 'Сара Јованова, Игор Митрев, Тамара Спасовска, Никола Ангелов',
    poster: 'https://teatarmirkaginova.vercel.app/begalka.jpg'
  }
];

function getNextShow(){
  const now = new Date();
  const upcoming = SHOWS.filter(s => new Date(s.date) > now).sort((a,b)=> new Date(a.date)-new Date(b.date));
  return upcoming[0] || SHOWS[SHOWS.length-1];
}

// ===================== NAV: active link + mobile toggle =====================
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // ===================== SCROLL REVEAL =====================
  const revealEls = document.querySelectorAll('.reveal, .img-reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // ===================== HERO PARALLAX =====================
  const parallaxEl = document.querySelector('[data-parallax] img');
  if (parallaxEl) {
    document.addEventListener('scroll', () => {
      const offset = Math.min(window.scrollY * 0.25, 120);
      parallaxEl.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  // ===================== MAGNETIC BUTTONS =====================
  const magneticBtns = document.querySelectorAll('.btn-gold');
  if (window.matchMedia('(hover: hover)').matches) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ===================== SCROLL PROGRESS + HEADER SHRINK =====================
  const progressBar = document.querySelector('.scroll-progress');
  const header = document.querySelector('.site-header');
  function onScroll(){
    if (progressBar) {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      progressBar.style.width = (scrolled || 0) + '%';
    }
    if (header) header.classList.toggle('shrink', window.scrollY > 40);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===================== STAT COUNTERS =====================
  const statEls = document.querySelectorAll('.stat-num[data-count]');
  if (statEls.length && 'IntersectionObserver' in window) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        function step(now){
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        statIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statIO.observe(el));
  }

  // ===================== CARD TILT ON HOVER =====================
  const tiltEls = document.querySelectorAll('.tilt');
  if (window.matchMedia('(hover: hover)').matches) {
    tiltEls.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ===================== CURTAIN PAGE TRANSITION =====================
  const pt = document.querySelector('.page-transition');
  if (pt) {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        const href = link.getAttribute('href');
        if (!href || link.target === '_blank') return;
        e.preventDefault();
        pt.classList.add('closing');
        setTimeout(() => { window.location.href = href; }, 430);
      });
    });
  }

  // ===================== COUNTDOWN =====================
  const countdownRoot = document.querySelector('[data-countdown]');
  if (countdownRoot) {
    const show = getNextShow();
    const nameEl = countdownRoot.querySelector('[data-show-name]');
    if (nameEl) nameEl.textContent = show.title + ' — ' + show.dateLabel;

    const fields = {
      d: countdownRoot.querySelector('[data-d]'),
      h: countdownRoot.querySelector('[data-h]'),
      m: countdownRoot.querySelector('[data-m]'),
      s: countdownRoot.querySelector('[data-s]')
    };
    let prev = { d: null, h: null, m: null, s: null };

    function pad(n){ return String(Math.max(n,0)).padStart(2,'0'); }

    function tick(){
      const diff = new Date(show.date) - new Date();
      const d = Math.floor(diff / 86400000);
      const h = Math.floor(diff / 3600000) % 24;
      const m = Math.floor(diff / 60000) % 60;
      const s = Math.floor(diff / 1000) % 60;
      const vals = { d, h, m, s };
      Object.keys(fields).forEach(k => {
        if (!fields[k]) return;
        const val = pad(vals[k]);
        if (prev[k] !== val) {
          fields[k].textContent = val;
          fields[k].classList.remove('pulse');
          void fields[k].offsetWidth;
          fields[k].classList.add('pulse');
          prev[k] = val;
        }
      });
      if (diff <= 0) clearInterval(timer);
    }
    tick();
    const timer = setInterval(tick, 1000);
  }

  // ===================== RESERVATION MODAL (events page) =====================
  const resModal = document.getElementById('reservation-modal');
  if (resModal) {
    const nameSpan = resModal.querySelector('[data-res-title]');
    document.querySelectorAll('[data-reserve]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (nameSpan) nameSpan.textContent = btn.getAttribute('data-reserve');
        resModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    resModal.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', () => {
        resModal.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    resModal.addEventListener('click', (e) => {
      if (e.target === resModal) {
        resModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ===================== GALLERY LIGHTBOX =====================
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const imgEl = lightbox.querySelector('img');
    const thumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
    let current = 0;

    function openAt(i){
      current = (i + thumbs.length) % thumbs.length;
      imgEl.classList.remove('show');
      setTimeout(() => {
        imgEl.src = thumbs[current].dataset.full;
        imgEl.alt = thumbs[current].dataset.caption || '';
        requestAnimationFrame(() => imgEl.classList.add('show'));
      }, imgEl.getAttribute('src') ? 160 : 0);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    thumbs.forEach((t, i) => t.addEventListener('click', () => openAt(i)));

    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => openAt(current - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => openAt(current + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') openAt(current - 1);
      if (e.key === 'ArrowRight') openAt(current + 1);
    });
    function close(){
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});
