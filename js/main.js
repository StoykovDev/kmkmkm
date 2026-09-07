/* ==========================================================================
   KAYO BULGARIA — site interactivity (vanilla JS, no dependencies)
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');

    toggleBackToTop();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  var scrim = document.getElementById('navScrim');

  function closeNav() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (scrim) scrim.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function openNav() {
    mainNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    if (scrim) scrim.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.contains('is-open');
      if (isOpen) closeNav(); else openNav();
    });
    mainNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    if (scrim) scrim.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Active nav link ---------- */
  (function highlightActive() {
    var current = document.body.getAttribute('data-page');
    if (!current) return;
    document.querySelectorAll('.main-nav a[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === current) a.classList.add('is-active');
    });
  })();

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById('toTop');
  function toggleBackToTop() {
    if (!toTop) return;
    if (window.scrollY > 600) toTop.classList.add('is-visible');
    else toTop.classList.remove('is-visible');
  }
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Reveal on scroll (section headers) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Testimonial slider ---------- */
  var slides = document.querySelectorAll('.testi-slide');
  var dots = document.querySelectorAll('.testi-dot');
  if (slides.length) {
    var activeIndex = 0;
    var testiTimer = null;

    function showSlide(i) {
      slides.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
      dots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === i); });
      activeIndex = i;
    }
    function nextSlide() { showSlide((activeIndex + 1) % slides.length); }
    function startAuto() {
      stopAuto();
      testiTimer = setInterval(nextSlide, 6000);
    }
    function stopAuto() { if (testiTimer) clearInterval(testiTimer); }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        showSlide(idx);
        startAuto();
      });
    });
    showSlide(0);
    startAuto();
  }

  /* ---------- Product filter chips ---------- */
  var chips = document.querySelectorAll('.filter-chip');
  var products = document.querySelectorAll('[data-category]');
  if (chips.length && products.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var filter = chip.getAttribute('data-filter');
        products.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ---------- Contact form (no backend — front-end only demo) ---------- */
  var form = document.getElementById('contactForm');
  var successBox = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var fields = form.querySelectorAll('[required]');

      fields.forEach(function (field) {
        var wrap = field.closest('.form-field');
        var value = field.value.trim();
        var ok = value.length > 0;

        if (ok && field.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (ok && field.type === 'tel') {
          ok = /^[0-9+()\s-]{6,}$/.test(value);
        }
        if (wrap) wrap.classList.toggle('has-error', !ok);
        if (!ok) valid = false;
      });

      if (!valid) return;

      form.classList.add('is-hidden');
      if (successBox) successBox.classList.add('is-visible');
    });

    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        var wrap = field.closest('.form-field');
        if (wrap) wrap.classList.remove('has-error');
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
