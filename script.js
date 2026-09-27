/* =========================================================
   Yadamreddy Meena Sai — Portfolio
   script.js — navigation, theming, animation, form logic
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

//   /* ---------- Footer year ---------- */
//   document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Dark / Light mode toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }

  // Use saved preference, or fall back to system preference
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after clicking a link
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function setActiveLink() {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Scroll reveal animations ---------- */
  const revealItems = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(item => revealObserver.observe(item));

  /* ---------- Project filtering ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        const show = filter === 'all' || categories.includes(filter);
        card.classList.toggle('hidden', !show);
      });
    });
  });

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(key) {
    const { el, error } = fields[key];
    const value = el.value.trim();
    let message = '';

    if (!value) {
      message = 'This field is required.';
    } else if (key === 'email' && !emailPattern.test(value)) {
      message = 'Enter a valid email address.';
    } else if (key === 'message' && value.length < 10) {
      message = 'Message should be at least 10 characters.';
    }

    error.textContent = message;
    el.closest('.form-field').classList.toggle('error', Boolean(message));
    return !message;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map(validateField);
    const isValid = results.every(Boolean);

    if (!isValid) {
      formStatus.textContent = 'Please fix the highlighted fields.';
      formStatus.classList.remove('success');
      return;
    }

    // No backend is connected — this simulates a successful send.
    formStatus.textContent = 'Message sent! Thanks for reaching out — I\'ll get back to you soon.';
    formStatus.classList.add('success');
    form.reset();

    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.classList.remove('success');
    }, 5000);
  });

});