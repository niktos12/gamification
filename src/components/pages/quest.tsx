'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Check, CheckCircle2, Lock, Trophy } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCoins, formatDate } from '@/lib/format';
import { navigate } from '@/lib/router';
import { cn } from '@/lib/utils';
import type { Quest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { CoinAmount, LoadingBlock, PageHeader } from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';

const PARTICLE_COLORS = ['#ffffff', '#a3a3a3', '#a855f7'];

type StepStatus = 'completed' | 'current' | 'locked';

export default function QuestPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['quests'],
    queryFn: api.quests.list,
  });
  const [celebrateOpen, setCelebrateOpen] = useState(false);

  const quests: Quest[] = [...(data?.quests ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
  const completedCount = data?.completedCount ?? 0;
  const total = data?.total ?? 0;
  const progressPercent = data?.progressPercent ?? 0;
  const allCompleted = total > 0 && completedCount >= total;
  const currentIndex = quests.findIndex((quest) => !quest.completed);
  const totalReward = quests.reduce((sum, quest) => sum + quest.reward, 0);

  const completeMutation = useMutation({
    mutationFn: (id: number) => api.quests.complete(id),
    onSuccess: (result) => {
      toast.success(`+${formatCoins(result.quest.reward)} коинов!`);
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      if (result.allCompleted) setCelebrateOpen(true);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const statusOf = (quest: Quest, index: number): StepStatus => {
    if (quest.completed) return 'completed';
    if (index === currentIndex) return 'current';
    return 'locked';
  };

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="mesh" />
      <PageContainer>
        <PageHeader
          title="Welcome к нам!"
          backHref="/room"
          description="Адаптационный квест нового сотрудника. Каждый шаг помогает погрузиться в компанию и сразу видно, что нужно сделать."
        />

        {isLoading ? (
          <LoadingBlock />
        ) : (
          <>
            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="panel p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  {completedCount} из {total} шагов
                </span>
                {allCompleted ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Квест завершён
                  </span>
                ) : (
                  <span className="font-display text-lg font-bold text-gradient">
                    {progressPercent}%
                  </span>
                )}
              </div>
              <Progress value={progressPercent} className="mt-3" />
            </motion.div>

            {/* Finished banner (когда квест уже завершён при загрузке) */}
            {allCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4"
              >
                <Trophy className="h-5 w-5 shrink-0 text-amber-400" />
                <p className="text-sm">
                  Все шаги пройдены — квест завершён. Добро пожаловать в команду!
                </p>
              </motion.div>
            )}

            {/* Steps */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="mt-6 max-w-3xl space-y-3"
            >
              {quests.map((quest, index) => {
                const status = statusOf(quest, index);
                const pending =
                  completeMutation.isPending &&
                  completeMutation.variables === quest.id;
                return (
                  <motion.div
                    key={quest.id}
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.35 },
                      },
                    }}
                    className={cn(
                      'panel flex items-start gap-4 p-4 sm:p-5',
                      status === 'locked' && 'opacity-50',
                      status === 'current' && 'ring-1 ring-primary/30'
                    )}
                  >
                    {/* Status circle */}
                    {status === 'completed' ? (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-5 w-5" />
                      </span>
                    ) : status === 'current' ? (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary text-sm font-semibold text-primary tabular-nums-tight">
                        {index + 1}
                      </span>
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </span>
                    )}

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'font-medium',
                          status === 'completed' && 'line-through decoration-white/30'
                        )}
                      >
                        {quest.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {quest.description}
                      </p>
                      <div className="mt-2">
                        <CoinAmount
                          value={quest.reward}
                          className="text-sm text-amber-300"
                          iconClassName="h-3.5 w-3.5"
                        />
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                      {status === 'completed' && (
                        <>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Выполнено
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(quest.completedAt)}
                          </span>
                        </>
                      )}
                      {status === 'current' && (
                        <Button
                          size="sm"
                          disabled={pending}
                          onClick={() => completeMutation.mutate(quest.id)}
                        >
                          {pending ? 'Отправляем...' : 'Задание выполнено'}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </PageContainer>

      {/* Celebration dialog */}
      <Dialog open={celebrateOpen} onOpenChange={setCelebrateOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="relative flex flex-col items-center gap-4 pt-2 text-center">
            {/* Trophy + particle burst */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              >
                <Trophy className="h-16 w-16 text-amber-400" />
              </motion.div>
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const dist = 80 + (i % 3) * 24;
                return (
                  <span
                    key={i}
                    className="pointer-events-none absolute left-1/2 top-1/2"
                  >
                    <motion.span
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
                      }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist,
                        opacity: 0,
                        scale: 0.3,
                      }}
                      transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
                    />
                  </span>
                );
              })}
            </div>

            <div>
              <DialogTitle className="font-display text-2xl font-bold">
                Поздравляем!
              </DialogTitle>
              <DialogDescription className="mt-2">
                Вы успешно завершили квест «Welcome к нам!»
              </DialogDescription>
            </div>

            <div className="w-full text-left">
              <p className="mb-2 text-sm font-medium">Твои достижения</p>
              <div
                className="max-h-60 space-y-2 overflow-y-auto pr-1"
                data-lenis-prevent
              >
                {quests.map((quest) => (
                  <div
                    key={quest.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 truncate">{quest.title}</span>
                    <CoinAmount
                      value={quest.reward}
                      className="shrink-0 text-amber-300"
                      iconClassName="h-3.5 w-3.5"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full items-center justify-between rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm">
              <span className="text-amber-200/90">Всего заработано</span>
              <CoinAmount
                value={totalReward}
                className="text-base font-bold text-amber-300"
                iconClassName="h-4 w-4"
              />
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setCelebrateOpen(false);
                navigate('/room');
              }}
            >
              В игровую комнату
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
