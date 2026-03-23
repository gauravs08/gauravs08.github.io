/* ==============================
   EXPERIENCE TIMELINE ANIMATIONS
   ============================== */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Timeline line growth
  const timelineLine = document.getElementById('timeline-line');
  if (timelineLine) {
    // Create a pseudo-element effect by animating a gradient
    gsap.to(timelineLine, {
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
      '--line-progress': '100%',
      ease: 'none',
    });

    // Use a child element approach instead
    const lineAfter = document.createElement('div');
    lineAfter.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:0%;background:var(--color-accent);transition:none;';
    timelineLine.appendChild(lineAfter);

    ScrollTrigger.create({
      trigger: '.timeline',
      start: 'top 80%',
      end: 'bottom 20%',
      onUpdate: function (self) {
        lineAfter.style.height = (self.progress * 100) + '%';
      },
    });
  }

  // Timeline card reveals
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(function (item) {
    const isLeft = item.classList.contains('left');

    gsap.fromTo(
      item,
      {
        x: isLeft ? -60 : 60,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Stagger tags within each card
    const tags = item.querySelectorAll('.timeline-tags span');
    if (tags.length) {
      gsap.fromTo(
        tags,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  });
})();
