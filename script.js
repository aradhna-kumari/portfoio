/* script.js
   Interactivity:
   - Mobile menu toggle
   - Smooth scrolling
   - Animate progress bars on scroll
   - Theme toggle (light/dark)
   - Contact form light validation + fake send feedback
*/

(() => {
  // DOM elements
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const progressBars = document.querySelectorAll('.progress');
  const themeToggle = document.getElementById('themeToggle');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const yearEl = document.getElementById('year');

  // Set current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------
     Mobile menu
  ------------------------- */
  function toggleMobileMenu(force) {
    const isOpen = !(mobileMenu.hidden);
    const willOpen = typeof force === 'boolean' ? force : !isOpen;
    if (willOpen) {
      mobileMenu.hidden = false;
      hamburger.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.hidden = true;
      hamburger.setAttribute('aria-expanded', 'false');
    }
  }
  hamburger.addEventListener('click', () => toggleMobileMenu());

  // Close mobile menu when a mobile link is clicked
  mobileLinks.forEach(link => link.addEventListener('click', () => toggleMobileMenu(false)));

  /* ------------------------
     Smooth scroll for all anchor links
  ------------------------- */
  const smoothScroll = (target, offset = 16) => {
    const el = document.querySelector(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  };
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href === '#!') return;
      // If it's a hash link on the page, smooth-scroll and prevent default jump
      if (href.startsWith('#')) {
        e.preventDefault();
        smoothScroll(href, 72);
        // close mobile menu if visible
        if (!mobileMenu.hidden) toggleMobileMenu(false);
      }
    });
  });

  /* ------------------------
     Animate progress bars on scroll into view
  ------------------------- */
  const animateProgressBars = () => {
    progressBars.forEach(p => {
      const rect = p.getBoundingClientRect();
      const inView = rect.top < window.innerHeight - 60;
      if (inView && !p.classList.contains('animated')) {
        const percent = parseInt(p.dataset.value || '0', 10);
        const bar = p.querySelector('.progress-bar');
        if (bar) {
          bar.style.width = percent + '%';
          p.classList.add('animated');
        }
      }
    });
  };

  // Run on load and scroll
  window.addEventListener('scroll', () => {
    // fade-in sections (simple)
    document.querySelectorAll('.section').forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (r.top < window.innerHeight - 100) sec.style.opacity = 1;
      else sec.style.opacity = 0.25;
    });
    animateProgressBars();
  });
  // initial
  window.addEventListener('load', () => {
    // small stagger reveal for sections
    document.querySelectorAll('.section').forEach((s, i) => {
      s.style.opacity = 0;
      s.style.transition = `opacity 600ms ease ${i*120}ms`;
    });
    animateProgressBars();
  });

  /* ------------------------
     Theme toggle: remember in localStorage
  ------------------------- */
  const root = document.documentElement;
  const saved = localStorage.getItem('site-theme');
  if (saved === 'light') {
    root.classList.add('light');
  }

  themeToggle.addEventListener('click', () => {
    root.classList.toggle('light');
    const active = root.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('site-theme', active);
  });

  /* ------------------------
     Contact form handler (fake)
     - Validate basic fields
     - Show success message (you can wire a real API later)
  ------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formStatus.textContent = '';
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      // Basic validation
      if (!name || !email || !message) {
        formStatus.textContent = 'Please complete all fields.';
        formStatus.style.color = 'crimson';
        return;
      }
      // very simple email check
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        formStatus.textContent = 'Please provide a valid email.';
        formStatus.style.color = 'crimson';
        return;
      }

      // Simulate send
      formStatus.style.color = '';
      formStatus.textContent = 'Sending…';

      // fake async behaviour (visual only)
      setTimeout(() => {
        formStatus.textContent = 'Thanks — your message was sent (demo). I will reply soon!';
        formStatus.style.color = '';
        contactForm.reset();
      }, 900);
    });
  }

  /* Accessibility: close mobile menu on ESC */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMobileMenu(false);
  });

})();
