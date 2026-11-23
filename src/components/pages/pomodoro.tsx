'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Brain,
  Coffee,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatTimer } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LoadingBlock,
  PageHeader,
  SectionTitle,
  StatCard,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** "2026-02-03" -> "03.02" */
function shortDay(iso: string): string {
  const parts = iso.split('-');
  if (parts.length === 3) return `${parts[2]}.${parts[1]}`;
  return iso;
}

function Stepper({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        disabled={value <= min}
        onClick={() => onChange(value - step)}
        aria-label="Уменьшить"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-10 text-center font-display text-lg font-semibold tabular-nums-tight">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        disabled={value >= max}
        onClick={() => onChange(value + step)}
        aria-label="Увеличить"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function PomodoroPage() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['pomodoro'],
    queryFn: api.pomodoro.stats,
  });

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  /* Mirror ref kept in sync inside effects; the interval reads fresh value. */
  const secondsRef = useRef(secondsLeft);
  const handlingZeroRef = useRef(false);

  useEffect(() => {
    secondsRef.current = secondsLeft;
  }, [secondsLeft]);

  /* Single interval owns the tick and the zero-crossing transition. */
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (secondsRef.current <= 0) return;
      const next = secondsRef.current - 1;
      secondsRef.current = next;
      setSecondsLeft(next);
      if (next !== 0 || handlingZeroRef.current) return;
      handlingZeroRef.current = true;
      window.setTimeout(() => {
        handlingZeroRef.current = false;
      }, 600);
      if (mode === 'focus') {
        api.pomodoro
          .addSession(focusMinutes, 'focus')
          .then(() => queryClient.invalidateQueries({ queryKey: ['pomodoro'] }))
          .catch(() => undefined);
        toast.success('Рабочая сессия завершена! Перерыв — заслуженный');
        setMode('break');
        secondsRef.current = breakMinutes * 60;
        setSecondsLeft(breakMinutes * 60);
      } else {
        toast.info('Перерыв окончен — время работать!');
        setMode('focus');
        secondsRef.current = focusMinutes * 60;
        setSecondsLeft(focusMinutes * 60);
        setRunning(false);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, mode, focusMinutes, breakMinutes, queryClient]);

  const totalSeconds = (mode === 'focus' ? focusMinutes : breakMinutes) * 60;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const strokeColor = mode === 'focus' ? '#ffffff' : '#a3a3a3';

  const switchMode = (next: 'focus' | 'break') => {
    if (next === mode) return;
    setMode(next);
    setSecondsLeft((next === 'focus' ? focusMinutes : breakMinutes) * 60);
    setRunning(false);
  };

  const reset = () => {
    setSecondsLeft((mode === 'focus' ? focusMinutes : breakMinutes) * 60);
    setRunning(false);
  };

  const updateFocusMinutes = (next: number) => {
    const clamped = Math.min(90, Math.max(1, next));
    setFocusMinutes(clamped);
    if (!running && mode === 'focus') setSecondsLeft(clamped * 60);
  };

  const updateBreakMinutes = (next: number) => {
    const clamped = Math.min(30, Math.max(1, next));
    setBreakMinutes(clamped);
    if (!running && mode === 'break') setSecondsLeft(clamped * 60);
  };

  const week = stats?.week ?? [];
  const maxMinutes = Math.max(1, ...week.map((day) => day.minutes));

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="aurora" />
      <PageContainer>
        <PageHeader
          title="Помодоро-таймер"
          accent="text-gradient"
          description="Техника 25/5: глубоко работайте, вовремя отдыхайте и копите фокус-минуты."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="panel flex flex-col items-center gap-8 p-6 sm:p-10"
          >
            <div className="relative h-[260px] w-[260px] sm:h-[300px] sm:w-[300px]">
              <svg viewBox="0 0 260 260" className="h-full w-full -rotate-90">
                <circle
                  cx="130"
                  cy="130"
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="10"
                />
                <circle
                  cx="130"
                  cy="130"
                  r={RADIUS}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                  style={{
                    transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
                    mode === 'focus'
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-white/30 bg-white/10 text-white'
                  )}
                >
                  {mode === 'focus' ? 'Рабочая сессия' : 'Перерыв'}
                </span>
                <span className="font-display text-5xl font-bold tabular-nums-tight sm:text-6xl">
                  {formatTimer(secondsLeft)}
                </span>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {mode === 'focus'
                    ? `${focusMinutes} минут фокуса`
                    : `${breakMinutes} минут отдыха`}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => setRunning((prev) => !prev)}>
                {running ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {running ? 'Пауза' : 'Старт'}
              </Button>
              <Button size="lg" variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Сброс
              </Button>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => switchMode('focus')}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  mode === 'focus'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Рабочая сессия
              </button>
              <button
                type="button"
                onClick={() => switchMode('break')}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  mode === 'break'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Перерыв
              </button>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            className="panel h-fit p-5 sm:p-6"
          >
            <SectionTitle>Настройки</SectionTitle>
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between gap-4 py-2.5">
                <div>
                  <p className="text-sm font-medium">Рабочее время</p>
                  <p className="text-xs text-muted-foreground">минут</p>
                </div>
                <Stepper
                  value={focusMinutes}
                  min={1}
                  max={90}
                  step={5}
                  onChange={updateFocusMinutes}
                />
              </div>
              <div className="h-px w-full bg-white/5" />
              <div className="flex items-center justify-between gap-4 py-2.5">
                <div>
                  <p className="text-sm font-medium">Перерыв</p>
                  <p className="text-xs text-muted-foreground">минут</p>
                </div>
                <Stepper
                  value={breakMinutes}
                  min={1}
                  max={30}
                  step={1}
                  onChange={updateBreakMinutes}
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Пока таймер не запущен, изменения сразу применяются к длительности
              выбранного режима.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <section className="mt-10">
          <SectionTitle>Ваша статистика за сегодня</SectionTitle>
          {statsLoading ? (
            <LoadingBlock />
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<Timer className="h-4 w-4" />}
                label="Помодоро сегодня"
                value={stats?.todayFocusCount ?? 0}
              />
              <StatCard
                icon={<Brain className="h-4 w-4" />}
                label="Фокус сегодня"
                value={`${stats?.todayFocusMinutes ?? 0} мин`}
              />
              <StatCard
                icon={<Coffee className="h-4 w-4" />}
                label="Перерывов"
                value={stats?.todayBreaks ?? 0}
              />
              <StatCard
                icon={<TrendingUp className="h-4 w-4" />}
                label="Всего фокуса"
                value={`${stats?.totalFocusMinutes ?? 0} мин`}
              />
            </div>
          )}
        </section>

        {/* Week chart */}
        <section className="mt-8">
          <div className="panel p-5 sm:p-6">
            <SectionTitle>Последние 7 дней</SectionTitle>
            {week.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Пока нет данных за неделю — запустите первую сессию.
              </p>
            ) : (
              <>
                <div className="mt-5 flex h-28 items-end gap-2">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className="flex h-full flex-1 items-end"
                      title={`${day.minutes} мин`}
                    >
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-primary/30 to-primary"
                        style={{
                          height: `${Math.max(4, (day.minutes / maxMinutes) * 100)}%`,
                          minHeight: 4,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className="flex-1 text-center text-[10px] text-muted-foreground"
                    >
                      {shortDay(day.date)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <p className="mt-8 text-sm text-muted-foreground">
          Результаты учитываются в общей системе геймификации. Помодоро делает
          работу динамичной, а выполнение задач — более осознанным.
        </p>
      </PageContainer>
    </div>
  );
}
