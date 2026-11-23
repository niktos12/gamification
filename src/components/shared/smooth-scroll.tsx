'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/** Butter-smooth scrolling (used on long marketing pages). */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}
