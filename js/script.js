// ─── STATE ─────────────────────────────────────────────
const sections = ['professional', 'music', 'adventure'];
let currentIdx = 0;

// Portrait images per section
const heroPortraits = {
  professional: 'resources/computer_drawn.png',
  music:        'resources/music_drawn.png',
  adventure:    'resources/adventure_drawn.png',
};
const peekPortraits = {
  professional: 'resources/normal_peek_drawn.png',
  music:        'resources/music_peek_drawn.png',
  adventure:    'resources/adventure_peek_drawn.png',
};

// ─── NAVIGATION ──────────────────────────────────────
function switchSection(idx) {
  const prev = sections[currentIdx];
  const next = sections[idx];
  currentIdx = idx;

  // Update body data attributes
  document.body.setAttribute('data-section', next);

  // Hide all sections
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + next).classList.add('active');

  // Update banner buttons
  document.querySelectorAll('.banner-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
  });

  // Swap hero portrait
  /*const heroImg = document.getElementById('heroPortrait');
  heroImg.style.opacity = '0';
  heroImg.style.transform = 'translateY(10px)';
  setTimeout(() => {
    heroImg.src = heroPortraits[next];
    heroImg.style.opacity = '1';
    heroImg.style.transform = '';
  }, 200);*/

  // Swap peek portrait 
  const peekImg = document.getElementById('peekPortrait');
  peekImg.classList.remove('visible');
  setTimeout(() => {
    peekImg.src = peekPortraits[next];
    peekImg.classList.add('visible');
  }, 300);

  // Update courtyard logo visibility / music theme
  updateMusicLogo();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
  const scrollHint = document.getElementById('scroll-hint');

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
    scrollHint.classList.add('hidden');
  } else {
    scrollHint.classList.remove('hidden');
  }
  console.log("test");
});

document.querySelectorAll('.banner-btn').forEach((btn, i) => {
  btn.addEventListener('click', () => switchSection(i));
});

document.getElementById('prevBtn').addEventListener('click', () => {
  switchSection((currentIdx - 1 + sections.length) % sections.length);
});
document.getElementById('nextBtn').addEventListener('click', () => {
  switchSection((currentIdx + 1) % sections.length);
});

// ─── THEME TOGGLE ─────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeKnob   = document.getElementById('themeKnob');

function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeKnob.textContent = dark ? '🌙' : '☀️';
  updateMusicLogo();
  updateSignature();
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(!isDark);
});

// Restore saved theme
const saved = localStorage.getItem('theme');
if (saved === 'dark') setTheme(true);

// ─── MUSIC LOGO ───────────────────────────────────────
function updateMusicLogo() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const logo = document.getElementById('courtyardLogo');
  if (!logo) return;
  // white.png works on dark; for light mode use inverted/dark version
  if (isDark) {
    logo.src = 'resources/courtyard white.png';
    logo.style.filter = 'none';
  } else {
    // Use the dark text version
    logo.src = 'resources/courtyard_text (1).png';
    logo.style.filter = 'none';
  }
}

function updateSignature() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const sig = document.getElementById('signatureImg');
  if (!sig) return;
  sig.src = isDark
    ? './resources/signature white.png'
    : './resources/signature.png';
}

// ─── INIT ─────────────────────────────────────────────
// Show peek portrait after load
setTimeout(() => {
  document.getElementById('peekPortrait').classList.add('visible');
}, 600);

updateMusicLogo();
updateSignature();

// ─── PHOTO CAROUSELS ──────────────────────────────────────
// Works for any number of .coop-carousel elements on the page.
// Each carousel is self-contained — no IDs needed.
function initPhotoCarousel(carousel) {
  const track    = carousel.querySelector('.carousel-track');
  const dotsWrap = carousel.querySelector('.carousel-dots');
  const prevBtn  = carousel.querySelector('.carousel-arrow.prev');
  const nextBtn  = carousel.querySelector('.carousel-arrow.next');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', () => { next(); resetTimer(); });
  prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 3500);
  }

  carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', () => resetTimer());
  
  // Touch / swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; e.stopPropagation(); }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX; e.stopPropagation();
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); resetTimer(); }
  });

  resetTimer();
}

// Init every photo carousel on the page
document.querySelectorAll('.coop-carousel').forEach(initPhotoCarousel);

// ─── HERO PORTRAIT TRANSITION STYLES ──────────────────
//const heroImg = document.getElementById('heroPortrait');
//heroImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

// ─── EXPERIENCE CAROUSEL ───────────────────────────────
(function () {
  const track    = document.getElementById('expTrack');
  const dotsWrap = document.getElementById('expDots');
  const prevBtn  = document.getElementById('expPrev');
  const nextBtn  = document.getElementById('expNext');
  if (!track) return;

  const slides = track.querySelectorAll('.exp-slide');
  const total  = slides.length;
  let current  = 0;

  // Build dot indicators
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'exp-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to experience ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    // Slide the track
    track.style.transform = `translateX(-${current * 100}%)`;
    // Update dots
    dotsWrap.querySelectorAll('.exp-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Swipe support
  let touchStartX = 0;
  const carousel = document.getElementById('expCarousel');
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? goTo(current + 1) : goTo(current - 1); }
  });
})();