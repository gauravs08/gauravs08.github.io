/* ==============================
   CUSTOM CURSOR
   ============================== */
(function () {
  // Disable on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const cursor = document.getElementById('cursor');
  const glow = document.getElementById('cursor-glow');
  if (!cursor || !glow) return;

  // Hide default cursor
  document.body.style.cursor = 'none';

  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', function (e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function updateCursor() {
    // Direct positioning for cursor dot
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Smooth trailing for glow
    glowX += (cursorX - glowX) * 0.15;
    glowY += (cursorY - glowY) * 0.15;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';

    requestAnimationFrame(updateCursor);
  }

  updateCursor();

  // Hover states
  const interactiveElements = 'a, button, .magnetic, .project-card, .stat-card, .bento-card, .skill-tags span, .timeline-tags span';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(interactiveElements)) {
      cursor.classList.add('hover');
      glow.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(interactiveElements)) {
      cursor.classList.remove('hover');
      glow.classList.remove('hover');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', function () {
    cursor.style.opacity = '0';
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function () {
    cursor.style.opacity = '1';
    glow.style.opacity = '1';
  });
})();
