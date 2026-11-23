'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, ListChecks, Plus, Trophy, Users } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { useAuthStore } from '@/store/auth';
import type { Challenge } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Avatar,
  CoinAmount,
  EmptyState,
  LoadingBlock,
  PageHeader,
  SectionTitle,
  StatusBadge,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';

function progressPercent(done: number, total?: number): number {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

export default function ChallengesPage(props: { params?: Record<string, string> }) {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const listQ = useQuery({ queryKey: ['challenges'], queryFn: api.challenges.list });
  const [explicitId, setExplicitId] = useState<number | null>(null);

  const challenges = listQ.data?.challenges ?? [];
  // Derived auto-selection: first active challenge until the user picks one.
  const fallbackChallenge = challenges.find((c) => c.status === 'active') ?? challenges[0];
  const selectedId = explicitId ?? fallbackChallenge?.id ?? null;

  const detailQ = useQuery({
    queryKey: ['challenge', selectedId],
    queryFn: () => api.challenges.get(selectedId as number),
    enabled: selectedId !== null,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prizeDescription, setPrizeDescription] = useState('');
  const [tasksText, setTasksText] = useState('');

  const joinMutation = useMutation({
    mutationFn: (id: number) => api.challenges.join(id),
    onSuccess: () => {
      toast.success('Вы присоединились к соревнованию');
      qc.invalidateQueries({ queryKey: ['challenge', selectedId] });
      qc.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const completeMutation = useMutation({
    mutationFn: (payload: { challengeId: number; taskId: number }) =>
      api.challenges.completeTask(payload.challengeId, payload.taskId),
    onSuccess: (res) => {
      toast.success(`Задание выполнено: +${res.earned} коинов`);
      qc.invalidateQueries({ queryKey: ['challenge', selectedId] });
      qc.invalidateQueries({ queryKey: ['challenges'] });
      qc.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.challenges.create(payload),
    onSuccess: () => {
      toast.success('Челлендж создан');
      qc.invalidateQueries({ queryKey: ['challenges'] });
      setCreateOpen(false);
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setPrizeDescription('');
      setTasksText('');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const active = challenges.filter((c) => c.status === 'active');
  const finished = challenges.filter((c) => c.status !== 'active');
  const detail = detailQ.data;

  const parseTasks = () =>
    tasksText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, reward] = line.split('|').map((s) => s.trim());
        return { title: name ?? '', reward: Number(reward) || 0 };
      })
      .filter((t) => t.title);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      startDate,
      endDate,
      prizeDescription,
      tasks: parseTasks(),
    });
  };

  const renderChallengeCard = (c: Challenge, muted: boolean) => {
    const isSelected = selectedId === c.id;
    return (
      <button
        key={c.id}
        type="button"
        onClick={() => setExplicitId(c.id)}
        className={`panel w-full cursor-pointer p-4 text-left transition-all duration-300 ${
          muted ? 'opacity-70 hover:opacity-100' : 'panel-hover'
        } ${isSelected ? 'border-primary/50 ring-1 ring-primary/30' : ''}`}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium leading-snug">{c.title}</p>
          {c.myProgress != null && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white">
              <CheckCircle2 className="h-3 w-3" />
              Участвую
            </span>
          )}
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {formatDate(c.startDate)} — {formatDate(c.endDate)}
        </p>
        {c.myProgress != null && c.taskCount ? (
          <p className="mt-2 text-xs font-medium text-primary">
            {c.myProgress}/{c.taskCount} заданий
          </p>
        ) : null}
      </button>
    );
  };

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="aurora" />
      <PageContainer>
        <PageHeader
          title="Челленджи"
          backHref="/room"
          description="Командные и индивидуальные соревнования. Призы — коины, бейджи и даже обеды с руководством."
          actions={
            user?.role === 'admin' ? (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Создать челлендж
              </Button>
            ) : undefined
          }
        />

        {listQ.isLoading ? (
          <LoadingBlock />
        ) : challenges.length === 0 ? (
          <EmptyState
            icon={<Trophy className="h-5 w-5" />}
            title="Челленджей пока нет"
            description="Загляните позже — скоро появятся новые соревнования"
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Left: list */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div>
                <SectionTitle className="mb-3">Текущие</SectionTitle>
                {active.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Нет активных соревнований</p>
                ) : (
                  <div
                    className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1 lg:max-h-none"
                    data-lenis-prevent
                  >
                    {active.map((c) => renderChallengeCard(c, false))}
                  </div>
                )}
              </div>
              {finished.length > 0 && (
                <div>
                  <SectionTitle className="mb-3">Завершённые</SectionTitle>
                  <div className="flex flex-col gap-3">
                    {finished.map((c) => renderChallengeCard(c, true))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: detail */}
            <div className="lg:col-span-3">
              {!selectedId ? (
                <EmptyState
                  icon={<Trophy className="h-5 w-5" />}
                  title="Выберите челлендж"
                  description="Выберите соревнование из списка слева, чтобы увидеть детали"
                />
              ) : detailQ.isLoading || !detail ? (
                <LoadingBlock />
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <motion.div
                    key={detail.challenge.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                    className="panel p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={detail.challenge.status} />
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(detail.challenge.startDate)} — {formatDate(detail.challenge.endDate)}
                      </span>
                      {typeof detail.challenge.participantCount === 'number' && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {detail.challenge.participantCount} участников
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 font-display text-xl font-bold leading-tight sm:text-2xl">
                      {detail.challenge.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {detail.challenge.description}
                    </p>
                  </motion.div>

                  {/* Prize block */}
                  {detail.challenge.prizeDescription && (
                    <div className="rounded-[20px] border border-amber-400/30 bg-amber-400/5 p-5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                          <Trophy className="h-4.5 w-4.5" />
                        </span>
                        <p className="font-display font-semibold text-amber-300">Награды</p>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-amber-100/80">
                        {detail.challenge.prizeDescription}
                      </p>
                    </div>
                  )}

                  {/* Participation */}
                  {!detail.joined ? (
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={joinMutation.isPending || detail.challenge.status !== 'active'}
                      onClick={() => joinMutation.mutate(detail.challenge.id)}
                    >
                      <Trophy className="h-4 w-4" />
                      Присоединиться к соревнованию
                    </Button>
                  ) : (
                    <div className="panel p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">Ваш прогресс</p>
                        <p className="text-sm text-muted-foreground">
                          {detail.myProgress ?? 0} из {detail.challenge.taskCount ?? detail.tasks.length}
                        </p>
                      </div>
                      <Progress
                        value={progressPercent(detail.myProgress ?? 0, detail.challenge.taskCount ?? detail.tasks.length)}
                        className="mt-3"
                      />
                    </div>
                  )}

                  {/* Tasks */}
                  <div className="panel p-5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                        <ListChecks className="h-4 w-4" />
                      </span>
                      <p className="font-medium">Задания для выполнения</p>
                    </div>
                    {detail.tasks.length === 0 ? (
                      <p className="mt-4 text-sm text-muted-foreground">Задания ещё не добавлены</p>
                    ) : (
                      <div className="mt-4 flex flex-col gap-2">
                        {detail.tasks.map((t) => (
                          <div
                            key={t.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
                          >
                            <p className="min-w-0 flex-1 truncate text-sm font-medium">{t.title}</p>
                            <div className="flex shrink-0 items-center gap-3">
                              <CoinAmount value={t.reward} className="text-amber-300" />
                              <Button
                                size="sm"
                                disabled={
                                  !detail.joined ||
                                  completeMutation.isPending ||
                                  detail.challenge.status !== 'active'
                                }
                                onClick={() =>
                                  completeMutation.mutate({
                                    challengeId: detail.challenge.id,
                                    taskId: t.id,
                                  })
                                }
                              >
                                Выполнить
                              </Button>
                            </div>
                          </div>
                        ))}
                        {!detail.joined && (
                          <p className="text-xs text-muted-foreground">
                            Присоединитесь к соревнованию, чтобы выполнять задания
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Participants */}
                  <div className="panel p-5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-neutral-200">
                        <Users className="h-4 w-4" />
                      </span>
                      <p className="font-medium">Участники</p>
                    </div>
                    {detail.participants.length === 0 ? (
                      <p className="mt-4 text-sm text-muted-foreground">Пока никто не присоединился</p>
                    ) : (
                      <div
                        className="mt-4 flex max-h-72 flex-col gap-2 overflow-y-auto pr-1"
                        data-lenis-prevent
                      >
                        {[...detail.participants]
                          .sort((a, b) => b.progress - a.progress)
                          .map((p, idx) => (
                            <div
                              key={p.userId}
                              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
                            >
                              <span className="w-5 shrink-0 text-center text-sm font-semibold text-muted-foreground">
                                {idx + 1}
                              </span>
                              <Avatar
                                user={{ firstName: p.firstName, lastName: p.lastName, id: p.userId }}
                                size={34}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                  {p.firstName} {p.lastName}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">{p.position}</p>
                              </div>
                              <div className="w-24 shrink-0 sm:w-32">
                                <Progress
                                  value={progressPercent(p.progress, detail.challenge.taskCount ?? detail.tasks.length)}
                                  className="h-1.5"
                                />
                                <p className="mt-1 text-right text-xs text-muted-foreground">{p.progress}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </PageContainer>

      {/* Admin create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Создать челлендж</DialogTitle>
            <DialogDescription>
              Определите сроки, награды и список заданий для участников.
            </DialogDescription>
          </DialogHeader>

          <form className="flex flex-col gap-4" onSubmit={handleCreate}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="challenge-title">Название</Label>
              <Input
                id="challenge-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Марафон продаж"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="challenge-description">Описание</Label>
              <Textarea
                id="challenge-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Условия и правила соревнования"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="challenge-start">Дата начала</Label>
                <Input
                  id="challenge-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="challenge-end">Дата окончания</Label>
                <Input
                  id="challenge-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="challenge-prize">Награды</Label>
              <Textarea
                id="challenge-prize"
                value={prizeDescription}
                onChange={(e) => setPrizeDescription(e.target.value)}
                placeholder="Призовой фонд: коины, бейджи, обед с руководством"
                rows={2}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="challenge-tasks">Задания</Label>
              <Textarea
                id="challenge-tasks"
                value={tasksText}
                onChange={(e) => setTasksText(e.target.value)}
                placeholder={'Название задания | 100\nВторая задача | 150'}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Каждое задание с новой строки в формате «Название | награда»
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || parseTasks().length === 0}
              >
                Создать челлендж
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
