'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from '@/lib/router';
import { formatCoins, initials } from '@/lib/format';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Coin                                                                */
/* ------------------------------------------------------------------ */

export function Coin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-4 w-4 shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id="dotify-coin-gradient" x1="5" y1="4" x2="19" y2="20">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="55%" stopColor="#f5b52e" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#dotify-coin-gradient)" />
      <circle cx="12" cy="12" r="7.4" fill="none" stroke="rgba(120,53,15,0.4)" strokeWidth="1.4" strokeDasharray="2.4 2.4" />
      <path
        d="M12 6.6l1.5 3.4 3.7.45-2.75 2.4.85 3.65L12 14.55 8.7 16.5l.85-3.65L6.8 10.45l3.7-.45z"
        fill="rgba(120,53,15,0.55)"
      />
    </svg>
  );
}

export function CoinAmount({
  value,
  className,
  iconClassName,
}: {
  value: number | string | null | undefined;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-medium', className)}>
      <Coin className={cn('h-4 w-4', iconClassName)} />
      <span className="tabular-nums-tight">{formatCoins(value)}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Avatar (initials fallback with deterministic accent gradient)       */
/* ------------------------------------------------------------------ */

const AVATAR_PALETTES = [
  'from-zinc-400 to-zinc-600',
  'from-zinc-500 to-zinc-700',
  'from-zinc-600 to-zinc-800',
  'from-zinc-700 to-zinc-900',
  'from-neutral-500 to-neutral-700',
  'from-neutral-600 to-neutral-800',
];

export function Avatar({
  user,
  size = 40,
  className,
}: {
  user: { firstName: string; lastName: string; avatarUrl?: string; id?: number };
  size?: number;
  className?: string;
}) {
  const hasImage = Boolean(user.avatarUrl);
  const palette = AVATAR_PALETTES[Math.abs(user.id ?? 0) % AVATAR_PALETTES.length];
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full',
        !hasImage && `bg-gradient-to-br ${palette}`,
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {hasImage ? (
        <img src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="h-full w-full object-cover" />
      ) : (
        <span
          className="font-display font-semibold text-white/90"
          style={{ fontSize: Math.max(11, size * 0.36) }}
        >
          {initials(user.firstName, user.lastName)}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page chrome                                                         */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  description,
  backHref,
  actions,
  accent,
}: {
  title: ReactNode;
  description?: ReactNode;
  backHref?: string;
  actions?: ReactNode;
  accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Link>
        )}
        <h1 className={cn('font-display text-2xl font-bold leading-tight sm:text-4xl', accent)}>
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.div>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('font-display text-lg font-semibold tracking-tight sm:text-xl', className)}>
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="panel flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
        {icon ?? <Inbox className="h-5 w-5" />}
      </span>
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function LoadingBlock({ label = 'Загружаем данные...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <span className="relative flex h-9 w-9">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="absolute inset-1 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  hint,
  valueClassName,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
  valueClassName?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="panel panel-hover p-5"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className={cn('mt-3 font-display text-2xl font-bold', valueClassName)}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const map: Record<string, { label: string; cls: string }> = {
    open: { label: 'Открыта', cls: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25' },
    in_progress: { label: 'В работе', cls: 'bg-white/10 text-white border-white/25' },
    submitted: { label: 'На проверке', cls: 'bg-white/10 text-neutral-200 border-white/20' },
    completed: { label: 'Выполнено', cls: 'bg-primary/10 text-primary border-primary/30' },
    cancelled: { label: 'Отменена', cls: 'bg-[#a855f7]/10 text-[#c084fc] border-[#a855f7]/30' },
    active: { label: 'Активен', cls: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25' },
    finished: { label: 'Завершён', cls: 'bg-white/5 text-muted-foreground border-white/15' },
    new: { label: 'Новый', cls: 'bg-white/10 text-white border-white/25' },
    processing: { label: 'В обработке', cls: 'bg-white/10 text-neutral-200 border-white/20' },
  };
  const item = map[status] ?? { label: status, cls: 'bg-white/5 text-muted-foreground border-white/15' };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        item.cls,
        className
      )}
    >
      {item.label}
    </span>
  );
}
