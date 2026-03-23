/* ==============================
   ACHIEVEMENTS: COUNTERS & REVEALS
   ============================== */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(function (el) {
    const target = parseInt(el.getAttribute('data-count'), 10);

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.to(el, {
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            const progress = this.progress();
            el.textContent = Math.round(target * progress);
          },
        });
      },
    });
  });

  // Bento card staggered reveals
  const bentoCards = document.querySelectorAll('.bento-card');
  if (bentoCards.length) {
    gsap.fromTo(
      bentoCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.bento-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Subtle hover scale on bento cards
  bentoCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', function () {
      gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  });
})();
