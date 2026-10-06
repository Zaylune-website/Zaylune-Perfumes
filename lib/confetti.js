/**
 * Luxury Confetti Celebration Effect
 * Custom zero-dependency HTML5 Canvas particle system for Zaylune.
 * Colors tuned to luxury gold, champagne, emerald discount, terracotta, and amber.
 */

function spawnBurst({ origins = null, count = 100 } = {}) {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = (canvas.width = window.innerWidth * dpr);
  const height = (canvas.height = window.innerHeight * dpr);

  // Luxury palette: Gold, Emerald, Warm Terracotta, Champagne, Amber
  const colors = [
    "#d4af37", // Antique Gold
    "#10b981", // Emerald discount green
    "#059669", // Deep Emerald
    "#c04a1c", // Terracotta
    "#f59e0b", // Warm Amber
    "#fbbf24", // Champagne
    "#e0a96d", // Rose Gold
    "#ffffff", // Shimmer pearl white
  ];

  const defaultOrigins = [
    { x: width * 0.15, y: height * 0.95, angleRange: [-75, -25], speed: [14, 25] },
    { x: width * 0.85, y: height * 0.95, angleRange: [-155, -105], speed: [14, 25] },
    { x: width * 0.5, y: height * 0.95, angleRange: [-110, -70], speed: [16, 27] },
  ];

  const actualOrigins = origins || defaultOrigins;
  const particles = [];
  const perOrigin = Math.ceil(count / actualOrigins.length);

  actualOrigins.forEach((origin) => {
    for (let i = 0; i < perOrigin; i++) {
      const angle =
        (origin.angleRange[0] + Math.random() * (origin.angleRange[1] - origin.angleRange[0])) * (Math.PI / 180);
      const speed = (origin.speed[0] + Math.random() * (origin.speed[1] - origin.speed[0])) * dpr;

      particles.push({
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: (6 + Math.random() * 8) * dpr,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.08 + Math.random() * 0.12,
        shape: Math.random() > 0.4 ? "rect" : Math.random() > 0.5 ? "circle" : "sparkle",
        opacity: 1,
        life: 1,
        decay: 0.007 + Math.random() * 0.006,
      });
    }
  });

  let animationFrameId;
  const gravity = 0.48 * dpr;
  const drag = 0.982;

  function render() {
    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.life <= 0) continue;
      activeParticles++;

      p.vx *= drag;
      p.vy = p.vy * drag + gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.life -= p.decay;
      p.opacity = Math.max(0, p.life);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      const scaleX = Math.cos(p.wobble);

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, (-p.size / 2) * scaleX, p.size, p.size * 0.55);
      } else if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, (p.size / 2) * Math.abs(scaleX), 0, Math.PI * 2);
        ctx.fill();
      } else {
        // 4-point sparkle star
        ctx.beginPath();
        for (let s = 0; s < 4; s++) {
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-p.size * 0.08, -p.size * 0.5, p.size * 0.16, p.size);
        }
      }
      ctx.restore();
    }

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  }

  animationFrameId = requestAnimationFrame(render);

  setTimeout(() => {
    cancelAnimationFrame(animationFrameId);
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }, 4000);
}

export function fireConfetti() {
  // Wave 1: Immediate cannon burst
  spawnBurst({ count: 90 });

  // Wave 2: Layered shower after 200ms
  setTimeout(() => {
    spawnBurst({ count: 70 });
  }, 200);
}
