const nav = document.getElementById('navbar');
const toggle = document.getElementById('navToggle');
const right = document.querySelector('.nav-right');
const heroBg = document.querySelector('.hero-bg');
const heroOverlay = document.querySelector('.hero-overlay');
const heroHolder = document.querySelector('.hero-holder');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const vh = window.innerHeight;
  nav.classList.toggle('scrolled', y > 80);
  if (heroBg) heroBg.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
  if (heroOverlay) heroOverlay.style.opacity = Math.max(0.4, 1 - y / vh * 0.6);
  if (heroHolder) heroHolder.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
  document.querySelectorAll('.parallax-img').forEach(img => {
    const rect = img.getBoundingClientRect();
    const offset = (rect.top + rect.height / 2 - vh / 2) * 0.06;
    img.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
});

toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  right.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    right.classList.remove('open');
  });
});

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.menu-panel');

function animateMenuItems() {
  const active = document.querySelector('.menu-panel.active');
  if (!active) return;
  active.querySelectorAll('.menu-item').forEach((item, i) => {
    item.style.animation = 'none';
    void item.offsetWidth;
    item.style.animation = `menuItemIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards`;
    item.style.animationDelay = `${i * 0.08}s`;
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    panels.forEach(p => p.classList.remove('active'));
    const target = document.getElementById('panel-' + tab.dataset.tab);
    target.classList.add('active');
    animateMenuItems();
  });
});

const track = document.getElementById('galleryTrack');
const slides = document.querySelectorAll('.gallery-slide');
const prev = document.getElementById('galleryPrev');
const next = document.getElementById('galleryNext');
const dots = document.getElementById('galleryDots');
let index = 0;

for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => go(i));
  dots.appendChild(dot);
}

const dotBtns = dots.querySelectorAll('button');

function go(i) {
  index = i;
  track.style.transform = `translateX(-${i * 100}%)`;
  dotBtns.forEach(d => d.classList.remove('active'));
  dotBtns[i].classList.add('active');
}

next.addEventListener('click', () => go((index + 1) % slides.length));
prev.addEventListener('click', () => go((index - 1 + slides.length) % slides.length));

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      el.classList.add('visible');
      if (el.id === 'menu') animateMenuItems();
    } else {
      el.classList.remove('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-gallery, .reveal-reviews, .stagger').forEach(el => {
  scrollObserver.observe(el);
});

const heroObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      heroBg.classList.remove('dezoom');
      void heroBg.offsetWidth;
      heroBg.classList.add('dezoom');
    } else {
      heroBg.classList.remove('dezoom');
    }
  });
}, { threshold: 0.3 });
if (heroBg) {
  heroBg.classList.add('dezoom');
  heroObs.observe(document.getElementById('hero'));
}

document.querySelectorAll('.gallery-slide').forEach((slide, i) => {
  slide.style.transitionDelay = `${i * 0.08}s`;
});

document.querySelectorAll('.collage-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.12}s`;
});

document.querySelectorAll('.chef-image, .chef-text').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.15}s`;
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || !href) { e.preventDefault(); return; }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

const ratingEl = document.getElementById('ratingNum');
const starsEl = document.getElementById('starsFill');

if (ratingEl && starsEl) {
  const ratingObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateRating(0, 4.4, 1500);
        animateStars(0, 88, 1200);
      } else {
        ratingEl.textContent = '0';
        starsEl.style.width = '0%';
      }
    });
  }, { threshold: 0.3 });
  ratingObs.observe(ratingEl.parentElement.parentElement);
}

function animateRating(from, to, duration) {
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (to - from) * eased;
    ratingEl.textContent = current.toFixed(1);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function animateStars(from, to, duration) {
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (to - from) * eased;
    starsEl.style.width = current + '%';
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* Cookie */
(function() {
  try {
    var notice = document.getElementById('cookieNotice');
    if (!notice) return;
    if (localStorage.getItem('cookieConsent')) return;

    notice.classList.add('show');

    function accept() {
      localStorage.setItem('cookieConsent', 'accepted');
      notice.classList.remove('show');
      closePanel();
    }

    function refuse() {
      localStorage.setItem('cookieConsent', 'refused');
      notice.classList.remove('show');
      closePanel();
    }

    function openPanel() {
      var p = document.getElementById('cookiePanel');
      if (p) p.classList.add('open');
    }

    function closePanel() {
      var p = document.getElementById('cookiePanel');
      if (p) p.classList.remove('open');
    }

    var ok = document.getElementById('cookieOk');
    var nope = document.getElementById('cookieNope');
    var customize = document.getElementById('cookieCustomize');
    if (ok) ok.onclick = accept;
    if (nope) nope.onclick = refuse;
    if (customize) customize.onclick = openPanel;

    var closeBtn = document.getElementById('cookiePanelClose');
    if (closeBtn) closeBtn.onclick = closePanel;

    var save = document.getElementById('panelSave');
    var all = document.getElementById('panelAll');
    var none = document.getElementById('panelNone');

    if (save) save.onclick = accept;
    if (all) all.onclick = function() {
      var cb = document.getElementById('mapsCheck');
      if (cb) cb.checked = true;
      accept();
    };
    if (none) none.onclick = function() {
      var cb = document.getElementById('mapsCheck');
      if (cb) cb.checked = false;
      refuse();
    };

    var overlay = document.querySelector('.cookie-panel-overlay');
    if (overlay) overlay.addEventListener('click', closePanel);

  } catch(err) {
    console.warn('Cookie init error:', err);
  }
})();

/* Formulaire reservation */
(function() {
  var form = document.getElementById('reservationForm');
  var success = document.getElementById('formSuccess');
  var submitBtn = document.getElementById('formSubmit');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    var data = new FormData(form);
    data.append('_gotcha', '');

    fetch('https://formspree.io/f/xaqgvgzp', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function() {
      form.reset();
      submitBtn.style.display = 'none';
      success.classList.add('show');
    }).catch(function() {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer la demande';
      alert('Erreur lors de l\'envoi. Veuillez reessayer.');
    });
  });
})();