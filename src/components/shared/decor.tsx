'use client';

import { motion } from 'framer-motion';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Background decor — MINIMAL edition.                                 */
/* Философия: чистый чёрный холст + редкие звёзды-точки + одно мягкое  */
/* свечение. Декор всегда -z-10 и pointer-events-none: он НИКОГДА не   */
/* накладывается на контент и текст.                                   */
/* ------------------------------------------------------------------ */

export type DecorVariant =
  | 'landing'
  | 'mesh'
  | 'grid'
  | 'dots'
  | 'aurora'
  | 'spotlight'
  | 'side';

function Glow({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <div
      className={cn('pointer-events-none absolute rounded-full blur-[130px]', className)}
      style={{ background: color }}
      aria-hidden="true"
    />
  );
}

/* Одна крошечная звезда-точка (KIUTA-style speck). */
function Speck({
  className,
  twinkle = false,
  delay = 0,
  red = false,
}: {
  className?: string;
  twinkle?: boolean;
  delay?: number;
  red?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute h-[3px] w-[3px] rounded-full',
        red
          ? 'bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.9)]'
          : 'bg-white/60',
        twinkle && 'animate-twinkle',
        className
      )}
      style={twinkle ? { animationDelay: `${delay}s` } : undefined}
    />
  );
}

/* Старые экспорты сохранены ради совместимости импортов других страниц. */
export function Sparkle({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-4 w-4', className)} style={style} aria-hidden="true">
      <path
        d="M12 0.6c0.9 6.6 4.8 10.5 11.4 11.4-6.6 0.9-10.5 4.8-11.4 11.4C11.1 16.8 7.2 12.9 0.6 12 7.2 11.1 11.1 7.2 12 0.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function StarBurst({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn('h-12 w-12', className)}
      style={style}
      aria-hidden="true"
    >
      <path d="M24 1v46M1 24h46M8.4 8.4l31.2 31.2M39.6 8.4L8.4 39.6" stroke="currentColor" strokeWidth="1" />
      <circle cx="24" cy="24" r="7.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
    </svg>
  );
}

export function CrossMark({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 16 16" className={cn('h-3.5 w-3.5', className)} style={style} aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function DiamondMark({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cn('h-3 w-3', className)} style={style} aria-hidden="true">
      <rect x="5.8" y="5.8" width="8.4" height="8.4" transform="rotate(45 10 10)" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function Constellation({ className }: { className?: string }) {
  const P: [number, number][] = [
    [14, 118],
    [52, 44],
    [96, 86],
    [138, 18],
    [176, 96],
    [120, 140],
    [36, 150],
  ];
  const L: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 5],
    [3, 4],
    [5, 6],
    [0, 6],
  ];
  return (
    <svg viewBox="0 0 190 165" fill="none" className={cn('h-40 w-48', className)} aria-hidden="true">
      {L.map(([a, b], i) => (
        <line
          key={i}
          x1={P[a][0]}
          y1={P[a][1]}
          x2={P[b][0]}
          y2={P[b][1]}
          stroke="rgba(255,255,255,0.20)"
          strokeWidth="1"
          strokeDasharray={i % 2 ? '2 5' : undefined}
        />
      ))}
      {P.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 3 ? 3 : 2}
          fill={i === 3 ? 'rgba(168,85,247,0.9)' : 'rgba(255,255,255,0.55)'}
        />
      ))}
      <circle cx={P[3][0]} cy={P[3][1]} r="8" stroke="rgba(168,85,247,0.5)" strokeWidth="1" />
    </svg>
  );
}

export function ZigzagField({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 120 60" className={cn('h-24 w-48', className)} aria-hidden="true">
      <defs>
        <pattern id={id} width="16" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 10 L4 4 L8 10 L12 4" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="120" height="60" fill={`url(#${id})`} />
    </svg>
  );
}

export function QuarterArc({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={cn('h-24 w-24', className)} aria-hidden="true">
      <path d="M2 98 A96 96 0 0 1 98 2" stroke="currentColor" strokeWidth="1" />
      <path d="M18 98 A80 80 0 0 1 98 18" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
      <path d="M34 98 A64 64 0 0 1 98 34" stroke="rgba(168,85,247,0.55)" strokeWidth="1" />
    </svg>
  );
}

export function TechLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('tech-label pointer-events-none select-none', className)} aria-hidden="true">
      [{children}]
    </span>
  );
}

export function DashedRing({
  className,
  reverse = false,
}: {
  className?: string;
  reverse?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none block',
        reverse ? 'animate-spin-reverse' : 'animate-spin-slower',
        className
      )}
    >
      <svg viewBox="0 0 100 100" fill="none" className="h-full w-full overflow-visible">
        <circle cx="50" cy="50" r="49.4" stroke="currentColor" strokeWidth="0.55" strokeDasharray="1.2 3.4" />
        <circle cx="50" cy="50" r="49.4" stroke="rgba(168,85,247,0.55)" strokeWidth="1.1" strokeDasharray="0.4 25.26" />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* PageDecor — минималистичные варианты фона                           */
/* ------------------------------------------------------------------ */

export function PageDecor({
  variant = 'mesh',
  className,
}: {
  variant?: DecorVariant;
  className?: string;
}) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)} aria-hidden="true">
      {variant === 'landing' && (
        <>
          {/* Одно мягкое свечение справа-сверху (за зоной кристалла) */}
          <Glow className="right-[-12%] top-[-14%] h-[560px] w-[560px]" color="rgba(255,255,255,0.07)" />
          {/* Едва заметный тёплый отсвет слева-снизу */}
          <Glow className="bottom-[-18%] left-[-10%] h-[460px] w-[460px]" color="rgba(168,85,247,0.05)" />
          {/* Тающая точечная сетка у верхней кромки */}
          <div className="absolute inset-x-0 top-0 h-[420px] dot-grid opacity-[0.32] [mask-image:radial-gradient(ellipse_65%_75%_at_50%_0%,black,transparent_82%)]" />
          {/* Редкие звёзды — как на референсе */}
          <Speck className="left-[8%] top-[18%]" twinkle delay={0.4} />
          <Speck className="left-[31%] top-[9%] !h-[2px] !w-[2px]" />
          <Speck className="right-[28%] top-[24%]" twinkle delay={1.6} />
          <Speck className="right-[6%] top-[46%] !h-[2px] !w-[2px]" />
          <Speck className="left-[16%] top-[58%] !h-[2px] !w-[2px]" />
          <Speck className="right-[14%] top-[72%]" twinkle delay={2.8} />
          <Speck className="left-[44%] top-[84%] !h-[2px] !w-[2px]" />
          <Speck className="left-[6%] top-[38%]" red />
        </>
      )}

      {variant === 'mesh' && (
        <>
          <Glow className="-top-40 -right-32 h-[480px] w-[480px]" color="rgba(255,255,255,0.06)" />
          <div className="absolute inset-x-0 top-0 h-[380px] dot-grid opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
          <Speck className="right-[14%] top-[22%]" twinkle delay={0.8} />
          <Speck className="left-[10%] top-[48%] !h-[2px] !w-[2px]" />
          <Speck className="right-[8%] bottom-[18%]" />
        </>
      )}

      {variant === 'grid' && (
        <>
          <div className="absolute inset-0 line-grid opacity-60" />
          <Glow className="-top-32 right-[12%] h-[380px] w-[380px]" color="rgba(255,255,255,0.05)" />
          <Speck className="right-[24%] top-[30%]" twinkle delay={1.1} />
        </>
      )}

      {variant === 'dots' && (
        <>
          <div className="absolute inset-0 dot-grid opacity-40 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,black,transparent_85%)]" />
          <Glow className="top-[-160px] left-1/2 h-[420px] w-[560px] -translate-x-1/2" color="rgba(255,255,255,0.05)" />
          <Speck className="left-[20%] top-[34%]" twinkle delay={0.5} />
        </>
      )}

      {variant === 'aurora' && (
        <>
          <motion.div
            className="absolute -top-44 left-[12%] h-[440px] w-[440px] rounded-full blur-[130px]"
            style={{ background: 'rgba(255,255,255,0.055)' }}
            animate={{ x: [0, 70, 0], y: [0, 26, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 right-[8%] h-[400px] w-[400px] rounded-full blur-[130px]"
            style={{ background: 'rgba(168,85,247,0.045)' }}
            animate={{ x: [0, -60, 0], y: [0, 34, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <Speck className="left-[30%] top-[26%]" twinkle delay={0.9} />
          <Speck className="right-[18%] top-[62%] !h-[2px] !w-[2px]" />
        </>
      )}

      {variant === 'spotlight' && (
        <>
          <Glow className="top-[-200px] left-1/2 h-[520px] w-[720px] -translate-x-1/2" color="rgba(255,255,255,0.07)" />
          <div className="absolute inset-0 dot-grid opacity-25" />
        </>
      )}

      {variant === 'side' && (
        <>
          <Glow className="top-[10%] -left-44 h-[440px] w-[440px]" color="rgba(255,255,255,0.05)" />
          <Glow className="bottom-[4%] -right-44 h-[440px] w-[440px]" color="rgba(255,255,255,0.04)" />
          <div className="absolute inset-0 line-grid opacity-40" />
        </>
      )}

      <div className="noise-overlay" />
    </div>
  );
}

export { Glow as GlowOrb };

/* ------------------------------------------------------------------ */
/* Marquee strip (бегущая строка)                                       */
/* ------------------------------------------------------------------ */

export function Marquee({
  children,
  className,
  speed = 36,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <div className={cn('marquee-hover relative overflow-hidden', className)}>
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap" style={{ animationDuration: `${speed}s` }}>
        <div className="flex items-center gap-10">{children}</div>
        <div className="flex items-center gap-10" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Standard page container. */
export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative mx-auto w-full max-w-6xl px-4 sm:px-6', className)}>{children}</div>
  );
}
