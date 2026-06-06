import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let id;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const colors = ['99,102,241','139,92,246','6,182,212','16,185,129','249,115,22'];
    const particles = Array.from({ length: 60 }, () => {
      const p = { x: 0, y: 0, size: 0, sx: 0, sy: 0, opacity: 0, color: '', life: 0, maxLife: 0 };
      const reset = () => {
        p.x = Math.random() * canvas.width;
        p.y = canvas.height + 20;
        p.size = Math.random() * 3 + 1;
        p.sy = -(Math.random() * 0.8 + 0.2);
        p.sx = (Math.random() - 0.5) * 0.3;
        p.opacity = Math.random() * 0.5 + 0.1;
        p.color = colors[Math.floor(Math.random() * colors.length)];
        p.life = 0;
        p.maxLife = Math.random() * 300 + 200;
      };
      p.reset = reset;
      reset();
      p.y = Math.random() * canvas.height;
      return p;
    });
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.sx; p.y += p.sy; p.life++;
        if (p.life > p.maxLife || p.y < -20) p.reset();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
      });
      id = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(id); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.5 }} />;
}
