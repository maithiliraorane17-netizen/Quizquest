import { useEffect, useRef } from 'react';

export default function SpaceBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
      color: ['99,102,241', '139,92,246', '6,182,212', '16,185,129', '249,115,22'][Math.floor(Math.random() * 5)],
    }));

    // Shooting stars
    const shoots = Array.from({ length: 4 }, () => ({
      x: 0, y: 0, len: 0, angle: 0,
      timer: Math.random() * 300,
      delay: Math.floor(Math.random() * 300 + 120),
      active: false,
      progress: 0,
    }));
    const resetShoot = (s) => {
      s.x = Math.random() * canvas.width * 0.7;
      s.y = Math.random() * canvas.height * 0.4;
      s.len = Math.random() * 140 + 80;
      s.angle = (Math.random() * 20 + 15) * Math.PI / 180;
      s.progress = 0;
      s.active = true;
    };

    // Floating orbs (nebula)
    const orbs = [
      { cx: 0.1, cy: 0.1, r: 260, color: '165,148,255', phase: 0, speedX: 0.0003, speedY: 0.00025 },
      { cx: 0.85, cy: 0.08, r: 200, color: '147,197,253', phase: 1.2, speedX: -0.0002, speedY: 0.0003 },
      { cx: 0.08, cy: 0.8, r: 180, color: '167,243,208', phase: 2.5, speedX: 0.00025, speedY: -0.0002 },
      { cx: 0.88, cy: 0.85, r: 160, color: '253,230,138', phase: 3.8, speedX: -0.0003, speedY: -0.00025 },
      { cx: 0.5, cy: 0.5, r: 130, color: '196,181,253', phase: 0.8, speedX: 0.0002, speedY: 0.0002 },
    ].map(o => ({ ...o, ox: o.cx * window.innerWidth, oy: o.cy * window.innerHeight }));

    let t = 0;

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebula orbs
      orbs.forEach(o => {
        o.ox += Math.sin(t * o.speedX * 60 + o.phase) * 0.4;
        o.oy += Math.cos(t * o.speedY * 60 + o.phase) * 0.35;
        const grd = ctx.createRadialGradient(o.ox, o.oy, 0, o.ox, o.oy, o.r);
        grd.addColorStop(0, `rgba(${o.color},0.18)`);
        grd.addColorStop(0.5, `rgba(${o.color},0.08)`);
        grd.addColorStop(1, `rgba(${o.color},0)`);
        ctx.beginPath();
        ctx.arc(o.ox, o.oy, o.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      // Draw stars (twinkling)
      stars.forEach(s => {
        const alpha = 0.15 + Math.sin(t * s.speed + s.phase) * 0.45 + 0.4;
        const size = s.r * (0.9 + Math.sin(t * s.speed * 0.7 + s.phase) * 0.2);
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.3, size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${Math.min(1, Math.max(0, alpha))})`;
        ctx.fill();

        // Occasional cross sparkle on bright stars
        if (s.r > 1.4 && Math.sin(t * s.speed + s.phase) > 0.7) {
          ctx.strokeStyle = `rgba(${s.color},0.4)`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 2.5, s.y); ctx.lineTo(s.x + s.r * 2.5, s.y);
          ctx.moveTo(s.x, s.y - s.r * 2.5); ctx.lineTo(s.x, s.y + s.r * 2.5);
          ctx.stroke();
        }
      });

      // Draw shooting stars
      shoots.forEach(s => {
        if (!s.active) {
          s.timer++;
          if (s.timer >= s.delay) resetShoot(s);
          return;
        }
        s.progress += 3.5;
        const tail = Math.min(s.progress, s.len);
        const headX = s.x + Math.cos(s.angle) * s.progress;
        const headY = s.y + Math.sin(s.angle) * s.progress;
        const tailX = s.x + Math.cos(s.angle) * Math.max(0, s.progress - tail);
        const tailY = s.y + Math.sin(s.angle) * Math.max(0, s.progress - tail);
        const fade = s.progress > s.len * 1.2 ? 1 - (s.progress - s.len * 1.2) / (s.len * 0.8) : 1;

        if (fade > 0) {
          const grd = ctx.createLinearGradient(tailX, tailY, headX, headY);
          grd.addColorStop(0, `rgba(99,102,241,0)`);
          grd.addColorStop(0.6, `rgba(99,102,241,${0.6 * fade})`);
          grd.addColorStop(1, `rgba(255,255,255,${0.9 * fade})`);
          ctx.beginPath();
          ctx.moveTo(tailX, tailY); ctx.lineTo(headX, headY);
          ctx.strokeStyle = grd;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          s.active = false;
          s.timer = 0;
          s.delay = Math.floor(Math.random() * 400 + 150);
        }

        if (s.progress > s.len * 2) { s.active = false; s.timer = 0; s.delay = Math.floor(Math.random() * 400 + 150); }
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* CSS background base */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(160deg, #faf9ff 0%, #f0eeff 30%, #e8f4ff 65%, #f0fff8 100%)',
      }} />
      {/* Dot grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.09) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      {/* Canvas for stars, orbs, shoots */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}
      />
    </>
  );
}
