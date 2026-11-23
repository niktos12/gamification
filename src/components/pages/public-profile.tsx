'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  ClipboardCheck,
  Crown,
  Flame,
  Gem,
  Rocket,
  Send,
  ShoppingBag,
  Star,
  Timer,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate, formatDateTime, fullName } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { UserBadge } from '@/lib/types';
import {
  Avatar,
  CoinAmount,
  EmptyState,
  LoadingBlock,
  PageHeader,
  SectionTitle,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';

/* ------------------------------------------------------------------ */
/* Badge icon map                                                      */
/* ------------------------------------------------------------------ */

const BADGE_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket,
  'clipboard-check': ClipboardCheck,
  users: Users,
  timer: Timer,
  gem: Gem,
  'shopping-bag': ShoppingBag,
  flame: Flame,
  crown: Crown,
  star: Star,
};

function BadgeCard({ badge }: { badge: UserBadge }) {
  const Icon = BADGE_ICONS[badge.icon] ?? Star;
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: `${badge.color}55`,
        background: `linear-gradient(135deg, ${badge.color}14, transparent 60%)`,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${badge.color}1f`, color: badge.color }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="font-medium">{badge.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{badge.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">Получен {formatDate(badge.awardedAt)}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Activity row                                                        */
/* ------------------------------------------------------------------ */

function ActivityAmount({ amount }: { amount: number }) {
  const positive = amount >= 0;
  return (
    <span className={cn('shrink-0 font-medium', positive ? 'text-emerald-400' : 'text-red-400')}>
      {positive && <span className="mr-1">+</span>}
      <CoinAmount value={amount} iconClassName="h-3.5 w-3.5" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PublicProfilePage(props: { params?: Record<string, string> }) {
  const id = Number(props.params?.id);

  const profileQuery = useQuery({
    queryKey: ['user', id],
    queryFn: () => api.users.get(id),
    enabled: Number.isFinite(id) && id > 0,
  });

  if (profileQuery.isLoading) {
    return (
      <div className="relative py-8 sm:py-12">
        <PageDecor variant="side" />
        <PageContainer>
          <LoadingBlock />
        </PageContainer>
      </div>
    );
  }

  const profile = profileQuery.data;

  if (!profile) {
    return (
      <div className="relative py-8 sm:py-12">
        <PageDecor variant="side" />
        <PageContainer>
          <PageHeader title="Профиль сотрудника" backHref="/employees" />
          <EmptyState
            icon={<UserRound className="h-5 w-5" />}
            title="Сотрудник не найден"
            description="Возможно, профиль был скрыт или ссылка устарела."
          />
        </PageContainer>
      </div>
    );
  }

  const { user, badges, activity, stats } = profile;

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="side" />
      <PageContainer>
        <PageHeader
          title="Профиль сотрудника"
          backHref="/employees"
          description="Публичная страница достижений коллеги."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ------------------------- LEFT: profile ------------------------ */}
          <div className="lg:col-span-1">
            <div className="panel h-full p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar user={user} size={88} />
                <h2 className="mt-4 font-display text-xl font-bold">{fullName(user)}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{user.position}</p>
                <span className="mt-3 inline-block max-w-full truncate rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                  {user.department}
                </span>
              </div>

              <div className="mt-5 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  В компании с {formatDate(user.hireDate)}
                </div>
                {user.telegram && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Send className="h-4 w-4 shrink-0" />
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs">
                      @{user.telegram.replace(/^@/, '')}
                    </span>
                  </div>
                )}
                {user.bio && <p className="pt-1 text-sm leading-relaxed text-muted-foreground">{user.bio}</p>}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/5 pt-5">
                <div className="text-center">
                  <p className="font-display text-xl font-bold tabular-nums-tight">{stats.tasksCompleted}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">задач выполнено</p>
                </div>
                <div className="text-center">
                  <p className="flex justify-center font-display text-xl font-bold">
                    <CoinAmount value={stats.totalEarned} className="text-amber-300" iconClassName="h-4.5 w-4.5" />
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">коинов заработано</p>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------- RIGHT: stack ------------------------- */}
          <div className="space-y-8 lg:col-span-2">
            <section>
              <div className="mb-4 flex items-center gap-2">
                <SectionTitle>Бейджи</SectionTitle>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-muted-foreground">
                  {badges.length}
                </span>
              </div>
              {badges.length === 0 ? (
                <EmptyState title="Бейджи пока не получены" description="Достижения появятся здесь автоматически." />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {badges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionTitle className="mb-4">Последние активности</SectionTitle>
              <div className="panel">
                {activity.length === 0 ? (
                  <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Активностей пока нет
                  </p>
                ) : (
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/5" data-lenis-prevent>
                    {activity.map((t) => (
                      <div key={t.id} className="flex items-center justify-between gap-3 px-5 py-3">
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-sm">{t.description}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(t.createdAt)}</p>
                        </div>
                        <ActivityAmount amount={t.amount} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
