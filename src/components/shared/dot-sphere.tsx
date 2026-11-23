'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * DotSphere — интерактивная точечная сфера на чистом 2D-canvas.
 *
 * Полная замена three.js-сцене: ни WebGL, ни зависимостей, ни чанков —
 * один canvas, ~440 точек на сфере Фибоначчи и пару сотен строк кода.
 * Идеально ложится на dot-matrix ДНК Nothing-стиля.
 *
 *  - Проекция с перспективой: ближние точки крупнее и ярче, дальние тают;
 *  - ~12% точек — фиолетовые «LED» с мягким ореолом;
 *  - Автовращение + инерция: сферу можно раскрутить перетаскиванием,
 *    по вертикали она наклоняется и плавно возвращается;
 *  - Клик/тап — импульс: расходящееся кольцо + вспышка яркости;
 *  - DPR ограничен 1.5, рендер останавливается вне вьюпорта и на
 *    скрытой вкладке; при prefers-reduced-motion рисуется один кадр.
 */

type SphereNode = {
  /* Единичный вектор на сфере (x, y, z). */
  x: number;
  y: number;
  z: number;
  violet: boolean;
};

type Pulse = { t: number };

const NODE_COUNT = 440;
const VIOLET_RGB = '168, 85, 247';
const BASE_VEL = 0.16; // рад/с — базовая скорость вращения
const TILT_BASE = -0.32; // постоянный наклон оси (радианы)

/* Красивая последовательность Фибоначчи — равномерное покрытие сферы. */
function buildNodes(count: number): SphereNode[] {
  const nodes: SphereNode[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // от +1 до -1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    nodes.push({
      x: Math.cos(theta) * radiusAtY,
      y,
      z: Math.sin(theta) * radiusAtY,
      violet: Math.random() < 0.12,
    });
  }
  return nodes;
}

export default function DotSphere({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup = () => {};

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('no 2d context');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
      host.appendChild(canvas);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const nodes = buildNodes(NODE_COUNT);
      const pulses: Pulse[] = [];

      /* Состояние сцены -------------------------------------------------- */
      let w = host.clientWidth || 480;
      let h = host.clientHeight || 480;
      let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      let radius = Math.min(w, h) * 0.3;

      let angle = -0.6; // текущий угол вращения вокруг оси Y
      let angularVel = BASE_VEL; // текущая угловая скорость (рад/с)
      let tiltOffset = 0; // наклон от вертикального драга (возвращается к 0)
      let parX = 0;
      let parY = 0; // параллакс от курсора (сглаженный)
      let parTX = 0;
      let parTY = 0; // цели параллакса
      let boost = 0; // импульс яркости/скорости по клику

      /* Drag-состояние ---------------------------------------------------- */
      let dragging = false;
      let dragMoved = 0;
      let lastX = 0;
      let lastY = 0;

      const resize = () => {
        w = host.clientWidth || 1;
        h = host.clientHeight || 1;
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        radius = Math.min(w, h) * 0.3;
        if (reducedMotion) drawFrame(0);
      };

      /* Отрисовка одного кадра ------------------------------------------- */
      const drawFrame = (dt: number) => {
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;

        /* Мягкое фиолетовое свечение ядра под точками. */
        const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.05);
        core.addColorStop(0, `rgba(${VIOLET_RGB}, ${0.1 + boost * 0.08})`);
        core.addColorStop(0.55, `rgba(${VIOLET_RGB}, 0.035)`);
        core.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
        ctx.fill();

        const tilt = TILT_BASE + tiltOffset + parY * 0.22;
        const spin = angle + parX * 0.18;
        const cosT = Math.cos(tilt);
        const sinT = Math.sin(tilt);
        const cosA = Math.cos(spin);
        const sinA = Math.sin(spin);
        const persp = 3.4;
        const bright = 1 + boost * 0.55;

        /* Точки: сортировка не нужна — alpha по глубине. */
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          /* Наклон оси вокруг X. */
          const y1 = n.y * cosT - n.z * sinT;
          const z1 = n.y * sinT + n.z * cosT;
          /* Вращение вокруг Y. */
          const x2 = n.x * cosA + z1 * sinA;
          const z2 = -n.x * sinA + z1 * cosA;

          const s = persp / (persp - z2);
          const px = cx + x2 * radius * s;
          const py = cy + y1 * radius * s;

          /* Глубина: z2 от -1 (дальняя) до +1 (ближняя). */
          const depth = (z2 + 1) / 2;
          const alpha = (0.16 + depth * 0.78) * bright;
          const size = (n.violet ? 1.5 : 1.1) * s * (0.75 + depth * 0.5);

          if (n.violet) {
            /* Фиолетовая «LED» с мягким ореолом. */
            ctx.beginPath();
            ctx.arc(px, py, size * 3.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${VIOLET_RGB}, ${Math.min(0.28, alpha * 0.3)})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${VIOLET_RGB}, ${Math.min(1, alpha)})`;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha)})`;
            ctx.fill();
          }
        }

        /* Расходящиеся кольца по клику. */
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.t += dt;
          const progress = p.t / 1.1;
          if (progress >= 1) {
            pulses.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(cx, cy, radius * (0.35 + progress * 1.55), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${VIOLET_RGB}, ${(1 - progress) * 0.45})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      };

      /* Основной цикл ------------------------------------------------------ */
      let raf = 0;
      let last = performance.now();
      let visible = true;

      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        /* Сглаженный параллакс курсора. */
        parX += (parTX - parX) * 0.05;
        parY += (parTY - parY) * 0.05;

        boost = Math.max(0, boost - dt * 1.5);
        if (!dragging) {
          /* Инерция раскрутки + плавный возврат наклона. */
          angularVel += (BASE_VEL - angularVel) * Math.min(1, dt * 1.6);
          tiltOffset += (0 - tiltOffset) * Math.min(1, dt * 2.2);
        }
        angle += angularVel * (1 + boost * 1.6) * dt;
        drawFrame(dt);
        raf = requestAnimationFrame(tick);
      };

      const updateLoop = () => {
        const should = visible && !document.hidden && !reducedMotion;
        if (should && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        } else if (!should && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      /* Взаимодействие ----------------------------------------------------- */
      const onPointerMove = (e: PointerEvent) => {
        if (dragging) {
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
          dragMoved += Math.abs(dx) + Math.abs(dy);
          angle += dx * 0.006;
          tiltOffset = Math.max(-0.55, Math.min(0.55, tiltOffset + dy * 0.004));
          angularVel = Math.max(-2.4, Math.min(2.4, dx * 0.006 * 60));
          return;
        }
        const r = host.getBoundingClientRect();
        parTX = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2;
        parTY = ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2;
      };

      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        dragMoved = 0;
        lastX = e.clientX;
        lastY = e.clientY;
        host.style.cursor = 'grabbing';
      };

      const onPointerUp = () => {
        if (dragging && dragMoved < 8) {
          /* Это был клик, а не драг — импульс. */
          if (pulses.length < 2) pulses.push({ t: 0 });
          boost = 1;
        }
        dragging = false;
        host.style.cursor = 'grab';
      };

      const onLeave = () => {
        parTX = 0;
        parTY = 0;
      };

      if (!reducedMotion) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        host.addEventListener('pointerdown', onPointerDown);
        host.addEventListener('pointerleave', onLeave);
        host.style.cursor = 'grab';
      }

      const io = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
          updateLoop();
        },
        { threshold: 0.05 }
      );
      io.observe(host);
      const onVis = () => updateLoop();
      document.addEventListener('visibilitychange', onVis);

      const ro = new ResizeObserver(resize);
      ro.observe(host);
      resize();

      cleanup = () => {
        if (raf) cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        if (!reducedMotion) {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          host.removeEventListener('pointerdown', onPointerDown);
          host.removeEventListener('pointerleave', onLeave);
        }
        document.removeEventListener('visibilitychange', onVis);
        canvas.remove();
      };
    } catch {
      if (!disposed) setFailed(true);
    }

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  if (failed) return <DotSphereFallback className={className} />;

  return (
    <div
      ref={hostRef}
      className={cn('relative', className)}
      aria-hidden="true"
      role="presentation"
    />
  );
}

/* Базовые константы сцены объявлены рядом с NODE_COUNT. */

/* CSS-фолбэк, если canvas недоступен — статичная dot-матрица. */
function DotSphereFallback({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex items-center justify-center', className)} aria-hidden="true">
      <div className="animate-pulse-glow absolute h-56 w-56 rounded-full bg-[#a855f7]/10 blur-2xl" />
      <div
        className="dot-grid-violet h-44 w-44 rounded-full opacity-70"
        style={{ maskImage: 'radial-gradient(circle, black 30%, transparent 72%)' }}
      />
    </div>
  );
}
