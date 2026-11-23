'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Coins,
  Crown,
  Timer,
  Trophy,
  Wallet,
} from 'lucide-react';
import { api } from '@/lib/api';
import { navigate } from '@/lib/router';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import type { Leaderboard, LeaderboardEntry } from '@/lib/types';
import {
  Avatar,
  CoinAmount,
  EmptyState,
  LoadingBlock,
  PageHeader,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type BoardMeta = { icon: typeof Coins; tile: string };

function resolveBoardMeta(metric: string): BoardMeta {
  const m = (metric || '').toLowerCase();
  if (m.includes('bonus')) return { icon: Coins, tile: 'bg-amber-400/10 text-amber-300' };
  if (m.includes('balance')) return { icon: Wallet, tile: 'bg-primary/10 text-primary' };
  if (m.includes('task')) return { icon: ClipboardCheck, tile: 'bg-white/10 text-white' };
  if (m.includes('focus') || m.includes('pomodoro') || m.includes('minute')) {
    return { icon: Timer, tile: 'bg-white/10 text-neutral-200' };
  }
  return { icon: Trophy, tile: 'bg-primary/10 text-primary' };
}

function isCoinMetric(metric: string): boolean {
  const m = (metric || '').toLowerCase();
  return m.includes('balance') || m.includes('earned') || m.includes('bonus');
}

function MetricValue({ metric, value }: { metric: string; value: number }) {
  const m = (metric || '').toLowerCase();
  if (isCoinMetric(m)) {
    return <CoinAmount value={value} className="text-amber-300" iconClassName="h-3.5 w-3.5" />;
  }
  if (m.includes('task')) return <span className="tabular-nums-tight">{value} задач</span>;
  if (m.includes('pomodoro') || m.includes('minute')) {
    return <span className="tabular-nums-tight">{value} мин</span>;
  }
  return <span className="tabular-nums-tight">{value}</span>;
}

const RANK_TEXT: Record<number, string> = {
  1: 'text-amber-300',
  2: 'text-zinc-300',
  3: 'text-orange-400',
};

/* ------------------------------------------------------------------ */
/* Podium card                                                         */
/* ------------------------------------------------------------------ */

function PodiumCard({
  entry,
  rank,
  metric,
}: {
  entry: LeaderboardEntry;
  rank: number;
  metric: string;
}) {
  const medalCls =
    rank === 1
      ? 'border-amber-400/60 text-amber-300'
      : rank === 2
        ? 'border-zinc-400/40 text-zinc-300'
        : 'border-orange-700/70 text-orange-400';

  return (
    <div
      className={cn(
        'panel p-4 text-center sm:p-5',
        rank === 1 && '-translate-y-2 border-amber-400/40 shadow-[0_0_36px_-12px_rgba(245,181,46,0.35)]'
      )}
    >
      <div
        className={cn(
          'mx-auto flex h-9 w-9 items-center justify-center rounded-full border font-display text-sm font-bold',
          medalCls
        )}
      >
        {rank === 1 ? <Crown className="h-4 w-4" /> : rank}
      </div>
      <div className="mt-3 flex justify-center">
        <Avatar
          user={{ firstName: entry.firstName, lastName: entry.lastName, avatarUrl: entry.avatarUrl, id: entry.userId }}
          size={52}
        />
      </div>
      <p className="mt-3 truncate font-medium">
        {entry.firstName} {entry.lastName}
      </p>
      <p className="truncate text-xs text-muted-foreground">{entry.position}</p>
      <div className="mt-3 flex justify-center text-sm font-semibold">
        <MetricValue metric={metric} value={entry.value} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LeaderboardsPage(props: { params?: Record<string, string> }) {
  const { user } = useAuthStore();
  const [slug, setSlug] = useState<string | null>(null);

  const boardsQuery = useQuery({
    queryKey: ['leaderboards'],
    queryFn: api.leaderboards.list,
  });

  const detailQuery = useQuery({
    queryKey: ['leaderboard', slug],
    queryFn: () => api.leaderboards.get(slug as string),
    enabled: Boolean(slug),
  });

  const boards: Leaderboard[] = boardsQuery.data?.boards ?? [];

  /* ------------------------------- List --------------------------- */
  if (!slug) {
    return (
      <div className="relative py-8 sm:py-12">
        <PageDecor variant="grid" />
        <PageContainer>
          <PageHeader
            title="Лидерборды"
            backHref="/room"
            description="Выберите свой арен для соревнований! Рейтинги сотрудников по ключевым параметрам."
          />

          {boardsQuery.isLoading ? (
            <LoadingBlock />
          ) : boards.length === 0 ? (
            <EmptyState
              icon={<Trophy className="h-5 w-5" />}
              title="Рейтинги пока не настроены"
              description="Загляните позже — администраторы готовят первые арены."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {boards.map((board) => {
                const meta = resolveBoardMeta(board.metric);
                const Icon = meta.icon;
                return (
                  <button
                    key={board.slug}
                    type="button"
                    onClick={() => setSlug(board.slug)}
                    className="panel panel-hover p-6 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                          meta.tile
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-semibold">{board.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{board.description}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
                      Войти в рейтинг
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </PageContainer>
      </div>
    );
  }

  /* ------------------------------ Detail -------------------------- */
  const board = detailQuery.data?.board;
  const entries: LeaderboardEntry[] = detailQuery.data?.entries ?? [];
  const top = entries.slice(0, 3);
  // Classic podium: 2nd — left, 1st — center (elevated), 3rd — right.
  const podiumOrder: { entry: LeaderboardEntry; rank: number }[] = [];
  if (top[1]) podiumOrder.push({ entry: top[1], rank: 2 });
  if (top[0]) podiumOrder.push({ entry: top[0], rank: 1 });
  if (top[2]) podiumOrder.push({ entry: top[2], rank: 3 });

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="grid" />
      <PageContainer>
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setSlug(null)}>
          <ArrowLeft className="h-4 w-4" />
          К списку лидербордов
        </Button>

        {detailQuery.isLoading ? (
          <LoadingBlock />
        ) : !board ? (
          <EmptyState
            icon={<Trophy className="h-5 w-5" />}
            title="Рейтинг не найден"
            description="Возможно, он был удалён. Вернитесь к списку лидербордов."
            action={
              <Button variant="outline" size="sm" onClick={() => setSlug(null)}>
                Назад к списку
              </Button>
            }
          />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{board.title}</h1>
              {board.description && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  {board.description}
                </p>
              )}
            </div>

            {podiumOrder.length === 3 && (
              <div className="mb-8 grid grid-cols-3 items-end gap-3 sm:gap-4">
                {podiumOrder.map(({ entry, rank }) => (
                  <PodiumCard key={entry.userId} entry={entry} rank={rank} metric={board.metric} />
                ))}
              </div>
            )}

            {entries.length === 0 ? (
              <EmptyState
                icon={<Trophy className="h-5 w-5" />}
                title="В рейтинге пока никого нет"
                description="Станьте первым — начните выполнять задачи и зарабатывать коины."
              />
            ) : (
              <div className="panel divide-y divide-white/5">
                {entries.map((entry, index) => {
                  const rank = entry.rank ?? index + 1;
                  const isMe = user != null && entry.userId === user.id;
                  return (
                    <div
                      key={entry.userId}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/employees/${entry.userId}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/employees/${entry.userId}`);
                        }
                      }}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 border-l-2 border-transparent px-4 py-3 transition-colors hover:bg-white/5 sm:gap-4 sm:px-5',
                        isMe && 'border-primary bg-primary/5'
                      )}
                    >
                      <span
                        className={cn(
                          'w-7 shrink-0 text-right font-display text-base font-bold tabular-nums-tight',
                          RANK_TEXT[rank]
                        )}
                      >
                        {rank}
                      </span>
                      <Avatar
                        user={{
                          firstName: entry.firstName,
                          lastName: entry.lastName,
                          avatarUrl: entry.avatarUrl,
                          id: entry.userId,
                        }}
                        size={38}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {entry.firstName} {entry.lastName}
                          {isMe && <span className="ml-2 text-xs text-primary">— это вы</span>}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{entry.position}</p>
                      </div>
                      <div className="shrink-0 text-sm font-semibold">
                        <MetricValue metric={board.metric} value={entry.value} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </PageContainer>
    </div>
  );
}
