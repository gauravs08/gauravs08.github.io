/* ==============================
   MAIN APP INITIALIZATION
   ============================== */
(function () {
  // ---- Lenis Smooth Scroll ----
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ---- GSAP + ScrollTrigger ----
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Connect Lenis to ScrollTrigger
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ---- Page Loader ----
  window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    setTimeout(function () {
      if (loader) loader.classList.add('hidden');
      // Trigger hero entrance after loader
      initHeroEntrance();
    }, 800);
  });

  // ---- Hero Entrance Animation ----
  function initHeroEntrance() {
    // Initialize Splitting.js
    if (typeof Splitting !== 'undefined') {
      Splitting();
    }

    if (typeof gsap === 'undefined') {
      // Fallback: just show everything
      document.querySelectorAll('.hero-name .char').forEach(function (c) {
        c.style.opacity = '1';
        c.style.transform = 'none';
      });
      return;
    }

    // Animate hero name characters
    const chars = document.querySelectorAll('.hero-name .char');
    if (chars.length) {
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.out',
        delay: 0.2,
      });
    }

    // Animate pretitle
    const pretitle = document.querySelector('.hero-pretitle');
    if (pretitle) {
      gsap.fromTo(
        pretitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0 }
      );
    }

    // Animate roles
    const roles = document.querySelector('.hero-roles');
    if (roles) {
      gsap.fromTo(
        roles,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1 }
      );
    }

    // Animate location
    const location = document.querySelector('.hero-location');
    if (location) {
      gsap.fromTo(
        location,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.3 }
      );
    }
  }

  // ---- Navigation ----
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Scroll state for nav background
  window.addEventListener('scroll', function () {
    if (nav) {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      navToggle.setAttribute(
        'aria-expanded',
        navToggle.classList.contains('active')
      );
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll for nav links (with Lenis)
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -60 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Active nav link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navAnchors.forEach(function (a) {
              a.classList.remove('active');
              if (a.getAttribute('href') === '#' + entry.target.id) {
                a.classList.add('active');
              }
            });
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ---- Section Reveals ----
  const reveals = document.querySelectorAll('.reveal');
  if (typeof IntersectionObserver !== 'undefined') {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach(function (el) {
      // Skip timeline items (handled by GSAP)
      if (!el.classList.contains('timeline-item')) {
        revealObserver.observe(el);
      }
    });
  }

  // ---- Back to Top ----
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
})();
