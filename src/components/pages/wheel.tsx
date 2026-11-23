'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Dices, Sparkles } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { useAuthStore } from '@/store/auth';
import type { SpinResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Coin, CoinAmount, EmptyState, LoadingBlock, PageHeader } from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';

const PARTICLE_COLORS = ['#ffffff', '#a3a3a3', '#a855f7'];

/* Дот-матричная палитра колеса: монохром + один красный сегмент (Nothing). */
const SEGMENT_COLORS = ['#ffffff', '#3f3f3f', '#a3a3a3', '#1f1f1f', '#a855f7'];
const segmentColor = (i: number) => SEGMENT_COLORS[i % SEGMENT_COLORS.length];

/** Luminance heuristic: dark text on light segments, white on dark. */
function labelTextColor(hex?: string): string {
  if (!hex || hex[0] !== '#' || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 150 ? '#0b0b0e' : '#ffffff';
}

export default function WheelPage(props: { params?: Record<string, string> }) {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const infoQ = useQuery({ queryKey: ['wheel'], queryFn: api.wheel.info });
  const info = infoQ.data;
  const prizes = info?.prizes ?? [];
  const prizeCount = Math.max(prizes.length, 1); // guard division by zero
  const seg = 360 / prizeCount;

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  const spinMutation = useMutation({ mutationFn: api.wheel.spin });

  const gradient = prizes.length
    ? `conic-gradient(${prizes
        .map((p, i) => `${segmentColor(i)} ${(i / prizes.length) * 100}% ${((i + 1) / prizes.length) * 100}%`)
        .join(', ')})`
    : undefined;

  const colorFor = (label: string) => {
    const idx = prizes.findIndex((p) => p.label === label);
    return idx >= 0 ? segmentColor(idx) : undefined;
  };

  const handleSpin = async () => {
    if (!info || !info.canSpin || spinning) return;
    setSpinning(true);
    setSpinKey((k) => k + 1);
    try {
      const res = await spinMutation.mutateAsync();
      const count = Math.max(info.prizes.length, 1);
      const step = 360 / count;
      const idx = info.prizes.findIndex((p) => p.label === res.prize.label);
      const i = idx >= 0 ? idx : 0;
      const target = rotation + 360 * (5 + (i % 3)) + (360 - (i * step + step / 2));
      setRotation(target);
      window.setTimeout(() => {
        setSpinning(false);
        setResult(res);
        setResultOpen(true);
        qc.invalidateQueries({ queryKey: ['wheel'] });
        qc.invalidateQueries({ queryKey: ['me'] });
      }, 4700);
    } catch (error) {
      setSpinning(false);
      toast.error(error instanceof Error ? error.message : 'Ошибка вращения');
    }
  };

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="spotlight" />
      <PageContainer>
        <PageHeader
          title="Колесо Фортуны"
          backHref="/room"
          description="Мини-игра для сотрудников: добавьте азарта в геймификацию. Крутить можно раз в день."
          actions={
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              <CoinAmount value={user?.balance ?? 0} className="text-amber-300" />
            </span>
          }
        />

        {infoQ.isLoading ? (
          <LoadingBlock />
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* LEFT — the wheel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="panel relative p-6 sm:p-10"
            >
              {prizes.length === 0 ? (
                <LoadingBlock label="Загружаем призы..." />
              ) : (
                <>
                  <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                    <motion.div
                      animate={{ scale: spinning ? 1.02 : 1 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="absolute inset-0"
                    >
                      {/* Pointer */}
                      <div
                        className="absolute -top-2 left-1/2 z-10 -translate-x-1/2"
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: '11px solid transparent',
                          borderRight: '11px solid transparent',
                          borderTop: '20px solid #ffffff',
                          filter: 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.5))',
                        }}
                      />

                      {/* Disc */}
                      <div
                        className={`absolute inset-0 overflow-hidden rounded-full border border-white/15 shadow-[0_0_90px_-25px_rgba(255,255,255,0.35)] ${
                          spinning ? 'wheel-spin' : ''
                        }`}
                        style={{ background: gradient, transform: `rotate(${rotation}deg)` }}
                      >
                        {prizes.map((p, i) => {
                          const mid = i * seg + seg / 2;
                          return (
                            <div
                              key={p.id}
                              className="absolute inset-0"
                              style={{ transform: `rotate(${mid}deg)` }}
                            >
                              <span
                                className="absolute left-1/2 top-[13%] w-24 text-center text-[11px] font-semibold leading-tight sm:text-xs"
                                style={{
                                  color: labelTextColor(segmentColor(i)),
                                  transform: `translateX(-50%) rotate(${-mid}deg)`,
                                }}
                              >
                                {p.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Decorative inner ring */}
                      <div className="pointer-events-none absolute inset-2 rounded-full border border-white/10" />

                      {/* Center hub */}
                      <div className="absolute left-1/2 top-1/2 z-[5] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-background shadow-[0_0_34px_rgba(245,181,46,0.3)]">
                        <Coin className="h-7 w-7" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-2">
                    <Button
                      size="lg"
                      className="w-full max-w-[420px] font-display font-semibold"
                      onClick={handleSpin}
                      disabled={spinning || !info?.canSpin || spinMutation.isPending}
                    >
                      <Sparkles className="h-4 w-4" />
                      {spinning ? 'Крутим...' : 'Крутить колесо'}
                    </Button>
                    {info && !info.canSpin && !spinning && (
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Возвращайтесь завтра — вращение уже использовано
                      </p>
                    )}
                  </div>
                </>
              )}
            </motion.div>

            {/* RIGHT — prizes & history */}
            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                className="panel p-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <p className="font-display font-semibold">Возможные выигрыши</p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {prizes.map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: segmentColor(i) }} />
                        <span className="truncate text-sm">{p.label}</span>
                      </div>
                      {p.amount > 0 ? (
                        <CoinAmount value={p.amount} className="shrink-0 text-amber-300" />
                      ) : (
                        <span className="shrink-0 text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
                className="panel p-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                    <Dices className="h-4 w-4" />
                  </span>
                  <p className="font-display font-semibold">История вращений</p>
                </div>
                <div
                  className="mt-4 flex max-h-72 flex-col gap-2 overflow-y-auto pr-1"
                  data-lenis-prevent
                >
                  {(info?.history ?? []).length === 0 ? (
                    <EmptyState
                      title="Вращений пока нет"
                      description="Крутите колесо — результаты появятся здесь"
                    />
                  ) : (
                    info!.history.map((s) => {
                      const c = colorFor(s.prizeLabel) ?? '#9d9daa';
                      return (
                        <div
                          key={s.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2"
                        >
                          <span
                            className="shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium"
                            style={{ color: c, borderColor: `${c}55`, background: `${c}14` }}
                          >
                            {s.prizeLabel}
                          </span>
                          <div className="flex min-w-0 items-center gap-3">
                            {s.amount > 0 ? (
                              <CoinAmount value={s.amount} className="shrink-0 text-amber-300" />
                            ) : (
                              <span className="shrink-0 text-sm text-muted-foreground">—</span>
                            )}
                            <span className="truncate text-xs tabular-nums-tight text-muted-foreground">
                              {formatDateTime(s.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                className="panel flex items-start gap-3 p-4"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                  <Dices className="h-4 w-4" />
                </span>
                <p className="text-sm text-muted-foreground">
                  История вращений позволяет отслеживать результаты — каждый приз фиксируется с датой
                  и суммой.
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </PageContainer>

      {/* Result dialog */}
      <Dialog
        open={resultOpen}
        onOpenChange={(open) => {
          setResultOpen(open);
          if (!open) setResult(null);
        }}
      >
        <DialogContent className="text-center sm:max-w-sm" aria-describedby={undefined}>
          {result && (
            <>
              <DialogHeader className="items-center">
                <DialogTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Ваш выигрыш
                </DialogTitle>
              </DialogHeader>

              <div key={`${spinKey}-${result.prize.label}`} className="relative py-6">
                {result.prize.amount > 0 && (
                  <div className="pointer-events-none absolute inset-0">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const angle = (i / 12) * Math.PI * 2 + ((i * 37) % 17) / 17;
                      const dist = 90 + ((i * 53) % 60);
                      return (
                        <motion.span
                          key={i}
                          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                          style={{ background: PARTICLE_COLORS[i % PARTICLE_COLORS.length] }}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                          animate={{
                            x: Math.cos(angle) * dist,
                            y: Math.sin(angle) * dist,
                            opacity: 0,
                            scale: 0.3,
                          }}
                          transition={{ duration: 1, ease: 'easeOut', delay: (i % 4) * 0.06 }}
                        />
                      );
                    })}
                  </div>
                )}

                <p
                  className="font-display text-2xl font-bold leading-tight sm:text-3xl"
                  style={{ color: colorFor(result.prize.label) || '#ffffff' }}
                >
                  {result.prize.label}
                </p>

                {result.prize.amount > 0 ? (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="font-display text-3xl font-bold text-amber-300">+</span>
                    <CoinAmount
                      value={result.prize.amount}
                      className="font-display text-3xl font-bold text-amber-300"
                      iconClassName="h-7 w-7"
                    />
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">Пусто — не расстраивайтесь</p>
                )}
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  setResultOpen(false);
                  setResult(null);
                }}
              >
                Отлично
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
