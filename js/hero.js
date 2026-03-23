/* ==============================
   PARTICLE NETWORK CANVAS
   ============================== */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles, mouse, animationId;
  const CONNECTION_DIST = 150;
  const MOUSE_RADIUS = 200;

  function getParticleCount() {
    if (window.innerWidth < 480) return 15;
    if (window.innerWidth < 768) return 25;
    if (window.innerWidth < 1024) return 45;
    return 80;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          this.vx += (dx / dist) * force * 0.5;
          this.vy += (dy / dist) * force * 0.5;
        }
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Clamp velocity
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 2) {
        this.vx = (this.vx / speed) * 2;
        this.vy = (this.vy / speed) * 2;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.15;

          // Brighter connections near mouse
          let extraBright = 0;
          if (mouse.x !== null) {
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const mouseDist = Math.sqrt(
              (midX - mouse.x) ** 2 + (midY - mouse.y) ** 2
            );
            if (mouseDist < MOUSE_RADIUS) {
              extraBright = (1 - mouseDist / MOUSE_RADIUS) * 0.2;
            }
          }

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${opacity + extraBright})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawConnections();
    for (const p of particles) {
      p.update();
      p.draw();
    }
    animationId = requestAnimationFrame(animate);
  }

  function init() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;

    mouse = { x: null, y: null };
    particles = [];

    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function onResize() {
    cancelAnimationFrame(animationId);
    init();
    animate();
  }

  // Events
  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(onResize, 200);
  });

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  // Start
  init();
  animate();
})();

/* ==============================
   TEXT SCRAMBLE EFFECT
   ============================== */
class TextScrambler {
  constructor(element, texts, interval) {
    this.element = element;
    this.texts = texts;
    this.interval = interval || 3000;
    this.currentIndex = 0;
    this.chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';
    this.isAnimating = false;
    this.frameRequest = null;
  }

  start() {
    this._scheduleNext();
  }

  _scheduleNext() {
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.texts.length;
      this._scrambleTo(this.texts[this.currentIndex]).then(() => {
        this._scheduleNext();
      });
    }, this.interval);
  }

  _scrambleTo(newText) {
    return new Promise((resolve) => {
      const oldText = this.element.textContent;
      const length = Math.max(oldText.length, newText.length);
      let frame = 0;
      const totalFrames = 30;

      const update = () => {
        let output = '';
        for (let i = 0; i < length; i++) {
          if (i < newText.length) {
            const progress = frame / totalFrames;
            const charProgress = progress * length;
            if (charProgress > i) {
              output += newText[i];
            } else {
              output += this.chars[Math.floor(Math.random() * this.chars.length)];
            }
          }
        }
        this.element.textContent = output;

        if (frame < totalFrames) {
          frame++;
          this.frameRequest = requestAnimationFrame(update);
        } else {
          this.element.textContent = newText;
          resolve();
        }
      };

      update();
    });
  }
}

// Initialize text scramble
window.addEventListener('DOMContentLoaded', function () {
  const roleText = document.getElementById('role-text');
  if (roleText) {
    const scrambler = new TextScrambler(
      roleText,
      ['Cloud Architect', 'DevOps Engineer', 'Full-Stack Developer', 'Team Lead', 'AWS Solutions Architect'],
      3000
    );
    // Delay start until hero animation completes
    setTimeout(() => scrambler.start(), 2500);
  }
});
