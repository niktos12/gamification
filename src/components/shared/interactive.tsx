'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, PointerEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* CursorHalo — мягкое световое пятно, следующее за курсором.          */
/* Только для точных указателей (desktop), полностью pointer-events-0. */
/* ------------------------------------------------------------------ */
export function CursorHalo({ className }: { className?: string }) {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 70, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 70, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className={cn('pointer-events-none fixed left-0 top-0 z-[35] hidden md:block', className)}
      style={{ x: sx, y: sy }}
    >
      <div
        className="h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.03) 38%, transparent 62%)',
        }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic — элемент-магнит: тянется к курсору и пружинит назад.      */
/* ------------------------------------------------------------------ */
export function Magnetic({
  children,
  className,
  strength = 0.26,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 210, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 210, damping: 15, mass: 0.4 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn('inline-block will-change-transform', className)}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* InteractiveCard — 3D-tilt за курсором + прожектор-подсветка.        */
/* Внутренний элемент должен иметь класс `spot-target` (см. CSS).      */
/* ------------------------------------------------------------------ */
export function InteractiveCard({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 190, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 190, damping: 18 });

  const onMove = (e: PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / Math.max(1, r.width));
    my.set((e.clientY - r.top) / Math.max(1, r.height));
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn('spot-card relative [perspective:900px]', className)}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — число «докручивается» при появлении во вьюпорте.          */
/* ------------------------------------------------------------------ */
export function CountUp({
  to,
  pad = 2,
  duration = 1.4,
  className,
}: {
  to: number;
  pad?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {String(val).padStart(pad, '0')}
    </span>
  );
}
