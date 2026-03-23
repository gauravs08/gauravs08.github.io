/* ==============================
   MAGNETIC HOVER EFFECT
   ============================== */
(function () {
  // Disable on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const magneticElements = document.querySelectorAll('.magnetic');

  magneticElements.forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.3;
      const deltaY = (e.clientY - centerY) * 0.3;

      el.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
      el.style.transition = 'transform 0.2s ease-out';
    });

    el.addEventListener('mouseleave', function () {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.4s ease-out';
    });
  });

  // 3D tilt for certification cards
  const certCard = document.getElementById('aws-cert');
  if (certCard) {
    certCard.addEventListener('mousemove', function (e) {
      const rect = certCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      certCard.style.transform =
        'perspective(1000px) rotateX(' + (-y * 10) + 'deg) rotateY(' + (x * 10) + 'deg) translateY(-8px)';
      certCard.style.transition = 'transform 0.1s ease-out';
    });

    certCard.addEventListener('mouseleave', function () {
      certCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      certCard.style.transition = 'transform 0.5s ease-out';
    });
  }
})();
