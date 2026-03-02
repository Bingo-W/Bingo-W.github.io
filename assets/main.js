/**
 * main.js — Personal Academic Website
 * =====================================
 * Features
 * ─────────
 *  1. Sticky nav: active section highlighting via IntersectionObserver
 *  2. Mobile nav toggle (hamburger menu)
 *  3. News "Show more / Show less" toggle
 *  4. BibTeX inline toggle (click to reveal, auto-selects text)
 *  5. Smooth-scroll polyfill (for browsers without CSS scroll-behavior)
 *  6. Scroll-triggered fade-in animation (skips if prefers-reduced-motion)
 *
 * No dependencies. No build step. Edit freely.
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────
     1. NAV — ACTIVE SECTION HIGHLIGHTING
     Uses IntersectionObserver to detect which section is in view
     and adds the .active class to the matching nav link.
  ────────────────────────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  /**
   * rootMargin top offset accounts for the sticky nav height (~60px).
   * The bottom threshold (-55%) means a section must occupy the
   * top half of the viewport before being considered "active".
   */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    {
      root: null,
      rootMargin: '-70px 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));


  /* ──────────────────────────────────────────────────────────────
     2. MOBILE NAV TOGGLE
  ────────────────────────────────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    // Toggle open/closed on hamburger click
    navToggle.addEventListener('click', () => {
      const willOpen = !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
    });

    // Close when any nav link is clicked (smooth scroll takes over)
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Close when clicking outside the nav
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeNav();
      }
    });

    function closeNav() {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }


  /* ──────────────────────────────────────────────────────────────
     3. NEWS — "SHOW MORE / SHOW LESS" TOGGLE
  ────────────────────────────────────────────────────────────── */
  const newsToggle = document.getElementById('news-toggle');
  const newsHidden = document.getElementById('news-hidden');

  if (newsToggle && newsHidden) {
    newsToggle.addEventListener('click', () => {
      const isExpanded = newsToggle.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        // Collapse
        newsHidden.hidden = true;
        newsToggle.setAttribute('aria-expanded', 'false');
        newsToggle.textContent = 'Show older news \u25be'; // ▾
      } else {
        // Expand
        newsHidden.hidden = false;
        newsToggle.setAttribute('aria-expanded', 'true');
        newsToggle.textContent = 'Show less \u25b4'; // ▴

        // Animate in (only if reduced-motion isn't preferred)
        if (!prefersReducedMotion()) {
          newsHidden.style.opacity = '0';
          newsHidden.style.transition = 'opacity 350ms ease';
          // Trigger reflow before setting opacity:1
          void newsHidden.offsetHeight;
          newsHidden.style.opacity = '1';
        }
      }
    });
  }


  /* ──────────────────────────────────────────────────────────────
     4. BIBTEX TOGGLE
     Each [data-bibtex] button/link reveals the matching <pre>
     block and auto-selects its text for easy copy-paste.
  ────────────────────────────────────────────────────────────── */
  document.querySelectorAll('[data-bibtex]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();

      const blockId = trigger.dataset.bibtex;
      const block   = document.getElementById(`bibtex-${blockId}`);
      if (!block) return;

      const willShow = block.hidden;
      block.hidden   = !willShow;
      trigger.setAttribute('aria-expanded', String(willShow));
      trigger.textContent = willShow ? 'BibTeX \u25b4' : 'BibTeX';

      if (willShow) {
        // Scroll block into view if needed
        block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-select text for easy copy
        try {
          const range = document.createRange();
          range.selectNodeContents(block);
          const sel = window.getSelection();
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
          }
        } catch (_) {
          // Selection not critical; swallow errors
        }
      }
    });
  });


  /* ──────────────────────────────────────────────────────────────
     5. SMOOTH-SCROLL POLYFILL
     Only activates on browsers that don't support the CSS
     scroll-behavior property (e.g., older Safari / Edge).
  ────────────────────────────────────────────────────────────── */
  if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetSelector = anchor.getAttribute('href');
        if (!targetSelector || targetSelector === '#') return;

        const target = document.querySelector(targetSelector);
        if (!target) return;

        e.preventDefault();

        const navHeight = document.querySelector('.site-header')?.offsetHeight ?? 60;
        const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({ top: targetY, behavior: 'smooth' });
      });
    });
  }


  /* ──────────────────────────────────────────────────────────────
     6. SCROLL FADE-IN ANIMATION
     Cards and publication entries start invisible and fade in
     as they enter the viewport. Skipped if user prefers
     reduced motion (respects OS-level accessibility setting).
  ────────────────────────────────────────────────────────────── */
  if (!prefersReducedMotion()) {
    const animatables = document.querySelectorAll(
      '.research-theme, .project-card, .pub-entry, .news-item'
    );

    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold:  0.06,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    animatables.forEach((el, index) => {
      // Stagger delay for cards in a grid (groups of 2)
      const delay = (index % 3) * 60;
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(14px)';
      el.style.transition = `opacity 420ms ease ${delay}ms, transform 420ms ease ${delay}ms`;
      fadeObserver.observe(el);
    });
  }


  /* ──────────────────────────────────────────────────────────────
     UTILITY HELPERS
  ────────────────────────────────────────────────────────────── */

  /** Returns true when the user has requested reduced motion at OS level. */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

})();
