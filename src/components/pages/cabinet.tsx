'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  ClipboardCheck,
  Gavel,
  MessageSquareText,
  Percent,
  PiggyBank,
  Rocket,
  Send,
  Settings,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/format';
import type { Transaction, User } from '@/lib/types';
import {
  CoinAmount,
  EmptyState,
  LoadingBlock,
  PageHeader,
  StatCard,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const TX_ICONS: Record<string, React.ElementType> = {
  task_reward: ClipboardCheck,
  wheel: Sparkles,
  challenge: Trophy,
  quest: Rocket,
  survey: MessageSquareText,
  purchase: ShoppingBag,
  cashback: Percent,
  auction: Gavel,
  admin: Settings,
};

const TX_LABELS: Record<string, string> = {
  task_reward: 'Биржа задач',
  wheel: 'Колесо фортуны',
  challenge: 'Челленджи',
  quest: 'Квесты',
  survey: 'Опросы',
  purchase: 'Покупка',
  cashback: 'Кэшбек',
  auction: 'Аукцион',
  admin: 'Администрация',
};

type TxFilter = 'all' | 'in' | 'out';

function TransactionRow({ tx }: { tx: Transaction }) {
  const positive = tx.amount >= 0;
  const Icon = TX_ICONS[tx.type] ?? Wallet;
  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03]">
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border',
          positive ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-red-400/20 bg-red-400/10 text-red-300'
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{tx.description || TX_LABELS[tx.type] || tx.type}</p>
        <p className="text-xs text-muted-foreground">
          {TX_LABELS[tx.type] ?? tx.type} · {formatDateTime(tx.createdAt)}
        </p>
      </div>
      <CoinAmount
        value={Math.abs(tx.amount)}
        className={cn('shrink-0 text-sm font-semibold', positive ? 'text-emerald-400' : 'text-red-400')}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile form — remounted via key so initial values stay in sync     */
/* ------------------------------------------------------------------ */

function ProfileForm({
  initial,
  onSaved,
}: {
  initial: User;
  onSaved: (user: User) => void;
}) {
  const [form, setForm] = useState({
    firstName: initial.firstName ?? '',
    lastName: initial.lastName ?? '',
    position: initial.position ?? '',
    phone: initial.phone ?? '',
    birthDate: (initial.birthDate ?? '').slice(0, 10),
    telegram: (initial.telegram ?? '').replace(/^@+/, ''),
    bio: initial.bio ?? '',
  });

  const mutation = useMutation({
    mutationFn: () => api.auth.updateMe(form),
    onSuccess: (data) => {
      onSaved(data.user);
      toast.success('Профиль обновлён');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="panel p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold">Изменить информацию</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Личные данные видны вам и администраторам платформы.
      </p>

      <form
        className="mt-5 grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">Имя</span>
          <input
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/50"
            value={form.firstName}
            onChange={(e) => set('firstName')(e.target.value)}
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">Фамилия</span>
          <input
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/50"
            value={form.lastName}
            onChange={(e) => set('lastName')(e.target.value)}
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">Должность</span>
          <input
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/50"
            value={form.position}
            onChange={(e) => set('position')(e.target.value)}
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">Телефон</span>
          <input
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/50"
            value={form.phone}
            onChange={(e) => set('phone')(e.target.value)}
            placeholder="+7 900 000-00-00"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">Дата рождения</span>
          <input
            type="date"
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-muted-foreground outline-none transition-colors focus:border-primary/50 [&::-webkit-calendar-picker-indicator]:invert"
            value={form.birthDate}
            onChange={(e) => set('birthDate')(e.target.value)}
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">E-mail</span>
          <input
            className="cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-muted-foreground opacity-60"
            value={initial.email}
            disabled
          />
        </label>
        <label className="grid gap-1.5 text-sm sm:col-span-2">
          <span className="text-muted-foreground">Telegram</span>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 focus-within:border-primary/50">
            <span className="text-sm text-muted-foreground">@</span>
            <input
              id="telegram-input"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
              value={form.telegram}
              onChange={(e) => set('telegram')(e.target.value.replace(/^@+/, ''))}
              placeholder="username"
            />
          </div>
        </label>
        <label className="grid gap-1.5 text-sm sm:col-span-2">
          <span className="text-muted-foreground">О себе</span>
          <textarea
            rows={3}
            className="resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/50"
            value={form.bio}
            onChange={(e) => set('bio')(e.target.value)}
            placeholder="Пара слов о себе, интересах и хобби"
          />
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
          >
            {mutation.isPending && <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />}
            Сохранить изменения
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CabinetPage(props: { params?: Record<string, string> }) {
  const storeUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();
  const [txFilter, setTxFilter] = useState<TxFilter>('all');

  const meQuery = useQuery({ queryKey: ['me'], queryFn: api.auth.me });
  const txQuery = useQuery({ queryKey: ['transactions'], queryFn: api.transactions.my });
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: api.settings.get });

  const meUser = meQuery.data?.user ?? storeUser;
  const transactions = useMemo(() => txQuery.data?.transactions ?? [], [txQuery.data]);

  const monthEarned = useMemo(() => {
    const now = new Date();
    return transactions.reduce((acc, t) => {
      if (t.amount <= 0) return acc;
      const d = new Date(t.createdAt);
      if (d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth()) return acc;
      return acc + t.amount;
    }, 0);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (txFilter === 'in') return transactions.filter((t) => t.amount >= 0);
    if (txFilter === 'out') return transactions.filter((t) => t.amount < 0);
    return transactions;
  }, [transactions, txFilter]);

  // Keep the header balance chip fresh after profile updates.
  useEffect(() => {
    if (meQuery.data?.user) setUser(meQuery.data.user);
  }, [meQuery.data, setUser]);

  if (meQuery.isLoading || !meUser) {
    return (
      <PageContainer>
        <LoadingBlock label="Загружаем личный кабинет..." />
      </PageContainer>
    );
  }

  const botName = settingsQuery.data?.settings?.telegramBot || '@dotify_bot';

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="mesh" />
      <PageContainer>
        <PageHeader
          title="Личный кабинет"
          backHref="/"
          description="Баланс, история начислений и настройки профиля — всё под рукой."
          actions={
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <CoinAmount value={meUser.balance} className="font-display text-base font-bold text-amber-300" />
            </span>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Wallet className="h-4 w-4" />}
            label="Текущий баланс"
            value={<CoinAmount value={meUser.balance} className="text-amber-300" />}
            hint="Доступно для трат"
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Всего заработано"
            value={<CoinAmount value={meUser.totalEarned} />}
            hint="За всё время"
          />
          <StatCard
            icon={<PiggyBank className="h-4 w-4" />}
            label="За текущий месяц"
            value={<CoinAmount value={monthEarned} />}
            hint="Начисления с 1 числа"
          />
          <StatCard
            icon={<CalendarDays className="h-4 w-4" />}
            label="В компании с"
            value={formatDate(meUser.hireDate) || '—'}
            hint={meUser.position || 'Сотрудник'}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:col-span-3"
          >
            <ProfileForm
              key={`${meUser.id}-${meUser.bio.length}-${meUser.telegram}`}
              initial={meUser}
              onSaved={(user) => {
                setUser(user);
                queryClient.invalidateQueries({ queryKey: ['me'] });
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:col-span-2"
          >
            <div className="panel p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold">История начислений</h3>
              </div>

              <div className="mt-3 flex gap-2" role="tablist" aria-label="Фильтр истории">
                {(
                  [
                    { key: 'all', label: 'Все', icon: null },
                    { key: 'in', label: 'Начисления', icon: TrendingUp },
                    { key: 'out', label: 'Списания', icon: TrendingDown },
                  ] as { key: TxFilter; label: string; icon: React.ElementType | null }[]
                ).map((chip) => {
                  const active = txFilter === chip.key;
                  return (
                    <button
                      key={chip.key}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTxFilter(chip.key)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-white/10 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {chip.icon && <chip.icon className="h-3.5 w-3.5" />}
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 max-h-96 overflow-y-auto rounded-xl border border-white/5" data-lenis-prevent>
                {filteredTransactions.length === 0 ? (
                  <EmptyState
                    title="Записей пока нет"
                    description="Как только появятся начисления — они отобразятся здесь."
                  />
                ) : (
                  <div className="divide-y divide-white/5">
                    {filteredTransactions.map((tx) => (
                      <TransactionRow key={tx.id} tx={tx} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-6"
        >
          {meUser.telegram ? (
            <div className="panel flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <Send className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium">Telegram подключён</p>
                <p className="text-sm text-muted-foreground">
                  @{meUser.telegram.replace(/^@+/, '')} — уведомления о наградах будут приходить сюда
                </p>
              </div>
            </div>
          ) : (
            <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Send className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Подключите Telegram</p>
                  <p className="text-sm text-muted-foreground">
                    Бот {botName} пришлёт уведомление, как только вы получите награду или кэшбек
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  document.getElementById('telegram-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/50"
              >
                Указать в профиле
              </button>
            </div>
          )}
        </motion.div>
      </PageContainer>
    </div>
  );
}
