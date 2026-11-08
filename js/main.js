const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const header = document.querySelector('.site-header');
const topProgressBar = document.getElementById('topProgressBar');
const sectionCurrent = document.getElementById('sectionCurrent');
const sectionLineFill = document.getElementById('sectionLineFill');
const sections = [...document.querySelectorAll('.chapter[data-section]')];
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const customCursor = document.querySelector('.custom-cursor');
const portraitFrame = document.getElementById('portraitFrame');

// Enable entrance animations only after the page has loaded its initial markup.
document.body.classList.add('js-ready');
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Smooth scrolling: Lenis is progressively enhanced; native scrolling remains the fallback.
let lenisInstance = null;
if (!reduceMotion) {
  try {
    const lenisModule = await import('https://cdn.jsdelivr.net/npm/lenis@1.3.27/+esm');
    const Lenis = lenisModule.default;
    lenisInstance = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1
    });
  } catch (error) {
    // The page still works with native scrolling if the CDN is unavailable.
    document.documentElement.classList.add('native-scroll-fallback');
  }
}

// Anchor navigation works with or without Lenis and respects reduced-motion preferences.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;

    if (lenisInstance && !reduceMotion) {
      event.preventDefault();
      lenisInstance.scrollTo(target, { offset: -70, duration: 1.05 });
    }

    if (mainNav.classList.contains('is-open')) closeMenu();
  });
});

// Responsive navigation.
function closeMenu() {
  mainNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mainNav.classList.toggle('is-open', !isOpen);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
}, { passive: true });

// Reveal-on-scroll.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

// Track the current chapter for the 01 / 06 reading indicator.
const chapterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const current = Number(entry.target.dataset.section || 1);
    sectionCurrent.textContent = String(current).padStart(2, '0');
    const progress = `${(current / sections.length) * 100}%`;
    sectionLineFill.style.setProperty('--chapter-progress', progress);
    if (window.innerWidth <= 600) {
      sectionLineFill.style.height = '100%';
      sectionLineFill.style.width = progress;
    } else {
      sectionLineFill.style.width = '100%';
      sectionLineFill.style.height = progress;
    }
  });
}, { rootMargin: '-43% 0px -43% 0px', threshold: 0 });
sections.forEach((section) => chapterObserver.observe(section));

// Header state and total page progress.
let scrollTicking = false;
function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  topProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollUI);
    scrollTicking = true;
  }
}, { passive: true });
updateScrollUI();

// Pointer spotlight, custom cursor and subtle portrait movement (desktop only).
if (!coarsePointer && !reduceMotion) {
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let pointerFrame = 0;

  window.addEventListener('pointermove', (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    document.documentElement.style.setProperty('--pointer-x', `${cursorX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${cursorY}px`);

    if (!pointerFrame) {
      pointerFrame = window.requestAnimationFrame(() => {
        customCursor.style.left = `${cursorX}px`;
        customCursor.style.top = `${cursorY}px`;
        customCursor.classList.add('is-visible');
        pointerFrame = 0;
      });
    }

    if (portraitFrame) {
      const rect = portraitFrame.getBoundingClientRect();
      const inside = cursorX >= rect.left && cursorX <= rect.right && cursorY >= rect.top && cursorY <= rect.bottom;
      if (inside) {
        const x = (cursorX - rect.left) / rect.width - 0.5;
        const y = (cursorY - rect.top) / rect.height - 0.5;
        portraitFrame.style.transform = `perspective(900px) rotateY(${x * 3.5}deg) rotateX(${-y * 3.5}deg) translateY(-2px)`;
      } else {
        portraitFrame.style.transform = '';
      }
    }
  }, { passive: true });

  window.addEventListener('pointerleave', () => customCursor.classList.remove('is-visible'));
  document.querySelectorAll('a, button, .look-card, .project-card').forEach((element) => {
    element.addEventListener('pointerenter', () => customCursor.classList.add('is-hover'));
    element.addEventListener('pointerleave', () => customCursor.classList.remove('is-hover'));
  });

  // Small 3D tilt on project cards. The effect is deliberately restrained.
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 2.2}deg) rotateY(${x * 2.2}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

// Category tabs for the Full Stack projects.
const filterButtons = [...document.querySelectorAll('.filter-button')];
const projectCards = [...document.querySelectorAll('.project-card[data-category]')];
function activateFilter(button) {
  const category = button.dataset.filter;
  filterButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach((card) => {
    const visible = card.dataset.category === category;
    card.hidden = !visible;
    if (visible) {
      card.classList.add('is-visible');
      card.animate?.([
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  });
}
filterButtons.forEach((button) => button.addEventListener('click', () => activateFilter(button)));
if (filterButtons.length) activateFilter(filterButtons[0]);

// Certificate lightbox.
const certificateDialog = document.getElementById('certificateDialog');
const dialogImage = document.getElementById('dialogImage');
const dialogClose = document.getElementById('dialogClose');

document.querySelectorAll('[data-certificate]').forEach((button) => {
  button.addEventListener('click', () => {
    dialogImage.src = button.dataset.certificate;
    dialogImage.alt = button.dataset.alt || 'Certificado ampliado';
    if (typeof certificateDialog.showModal === 'function') certificateDialog.showModal();
  });
});

dialogClose.addEventListener('click', () => certificateDialog.close());
certificateDialog.addEventListener('click', (event) => {
  if (event.target === certificateDialog) certificateDialog.close();
});
certificateDialog.addEventListener('close', () => {
  dialogImage.removeAttribute('src');
});

// A horizontal drag helper for lookdev cards on desktop trackpads/mice.
const lookdevTrack = document.getElementById('lookdevTrack');
if (lookdevTrack && !coarsePointer) {
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  lookdevTrack.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') return;
    isDown = true;
    startX = event.clientX;
    scrollStart = lookdevTrack.scrollLeft;
    lookdevTrack.classList.add('is-dragging');
  });
  window.addEventListener('pointerup', () => {
    isDown = false;
    lookdevTrack.classList.remove('is-dragging');
  });
  lookdevTrack.addEventListener('pointermove', (event) => {
    if (!isDown) return;
    lookdevTrack.scrollLeft = scrollStart - (event.clientX - startX);
  });
}
