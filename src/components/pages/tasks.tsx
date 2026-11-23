'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ClipboardList, Info, Plus, Search } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { difficultyLabel, formatDate, fullName } from '@/lib/format';
import { useAuthStore } from '@/store/auth';
import type { Task } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CoinAmount,
  EmptyState,
  LoadingBlock,
  PageHeader,
  StatusBadge,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';

function difficultyChipCls(d: string): string {
  if (d === 'easy') return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300';
  if (d === 'hard') return 'border-red-400/30 bg-red-400/10 text-red-300';
  return 'border-amber-400/30 bg-amber-400/10 text-amber-300';
}

export default function TasksPage(props: { params?: Record<string, string> }) {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const tasksQ = useQuery({ queryKey: ['tasks'], queryFn: api.tasks.list });
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Admin create form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('100');
  const [category, setCategory] = useState('Общие');
  const [difficulty, setDifficulty] = useState('easy');
  const [scope, setScope] = useState('public');
  const [assignedToId, setAssignedToId] = useState('');
  const [deadline, setDeadline] = useState('');

  const usersQ = useQuery({
    queryKey: ['users'],
    queryFn: api.users.list,
    enabled: createOpen,
  });

  const invalidateTasks = () => {
    qc.invalidateQueries({ queryKey: ['tasks'] });
    qc.invalidateQueries({ queryKey: ['me'] });
  };

  const claimMutation = useMutation({
    mutationFn: (id: number) => api.tasks.claim(id),
    onSuccess: () => {
      toast.success('Задача взята в работу');
      invalidateTasks();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const submitMutation = useMutation({
    mutationFn: (id: number) => api.tasks.submit(id),
    onSuccess: () => {
      toast.success('Задача отправлена на проверку');
      invalidateTasks();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.tasks.create(payload),
    onSuccess: () => {
      toast.success('Задача создана');
      qc.invalidateQueries({ queryKey: ['tasks'] });
      setCreateOpen(false);
      setTitle('');
      setDescription('');
      setReward('100');
      setCategory('Общие');
      setDifficulty('easy');
      setScope('public');
      setAssignedToId('');
      setDeadline('');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const isAdmin = user?.role === 'admin';
  const tasks = tasksQ.data?.tasks ?? [];

  const filtered = tasks.filter((t) => {
    if (tab === 'public' && t.scope !== 'public') return false;
    if (tab === 'mine' && t.claimedById !== user?.id) return false;
    if (tab === 'personal') {
      if (t.scope !== 'personal') return false;
      if (!isAdmin && t.assignedToId !== user?.id) return false;
    }
    const q = search.trim().toLowerCase();
    if (q) {
      const haystack = `${t.title} ${t.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const canClaim = (t: Task) =>
    t.status === 'open' &&
    t.claimedById !== user?.id &&
    (t.scope === 'public' || t.assignedToId === user?.id);

  const footer = (t: Task): ReactNode => {
    const isMine = t.claimedById === user?.id;
    if (canClaim(t)) {
      return (
        <Button
          className="w-full"
          disabled={claimMutation.isPending}
          onClick={() => claimMutation.mutate(t.id)}
        >
          Взять задачу
        </Button>
      );
    }
    if (t.status === 'in_progress' && isMine) {
      return (
        <Button
          variant="secondary"
          className="w-full"
          disabled={submitMutation.isPending}
          onClick={() => submitMutation.mutate(t.id)}
        >
          Отправить на проверку
        </Button>
      );
    }
    if (t.status === 'in_progress') {
      return (
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status="in_progress" />
          <span className="truncate text-xs text-muted-foreground">
            Занята: {t.claimedByName ?? '—'}
          </span>
        </div>
      );
    }
    if (t.status === 'submitted') {
      return (
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status="submitted" />
          <span className="text-xs text-muted-foreground">Ожидает проверки</span>
        </div>
      );
    }
    if (t.status === 'completed') {
      return (
        <div className="flex items-center">
          <StatusBadge status="completed" />
        </div>
      );
    }
    return (
      <div className="flex items-center">
        <StatusBadge status={t.status} />
      </div>
    );
  };

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      reward: Number(reward) || 0,
      category,
      difficulty,
      scope,
      assignedToId: scope === 'personal' && assignedToId ? Number(assignedToId) : null,
      deadline,
    });
  };

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="grid" />
      <PageContainer>
        <PageHeader
          title="Биржа задач"
          backHref="/room"
          description="Публичные задачи видны всем, личные — назначаются конкретному сотруднику. Выполняйте и получайте коины."
          actions={
            isAdmin ? (
              <Button
                onClick={() => {
                  setCreateOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Создать задачу
              </Button>
            ) : undefined
          }
        />

        {/* Info strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="panel flex items-start gap-3 p-4"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
            <Info className="h-4 w-4" />
          </span>
          <p className="text-sm text-muted-foreground">
            Берите задачи, выполняйте и отправляйте на проверку — коины начисляются после одобрения
            администратором.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={tab} onValueChange={setTab} className="w-full sm:w-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">Все задачи</TabsTrigger>
              <TabsTrigger value="public">Общие</TabsTrigger>
              <TabsTrigger value="mine">Мои</TabsTrigger>
              <TabsTrigger value="personal">Личные</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск задач..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Tasks grid */}
        <div className="mt-6">
          {tasksQ.isLoading ? (
            <LoadingBlock />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="h-5 w-5" />}
              title="Задач не найдено"
              description="Попробуйте изменить фильтры или поисковый запрос"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3), ease: [0.2, 0.8, 0.2, 1] }}
                  className="panel panel-hover flex cursor-pointer flex-col p-5"
                  onClick={() => setSelected(t)}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {t.category}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyChipCls(t.difficulty)}`}
                    >
                      {difficultyLabel(t.difficulty)}
                    </span>
                    {t.scope === 'personal' && (
                      <span className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white">
                        Личная
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-medium leading-snug">{t.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{t.description}</p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <CoinAmount value={t.reward} className="text-lg text-amber-300" iconClassName="h-5 w-5" />
                    {t.deadline && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        до {formatDate(t.deadline)}
                      </span>
                    )}
                  </div>

                  <div
                    className="mt-4 border-t border-white/5 pt-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {footer(t)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PageContainer>

      {/* Task detail dialog */}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selected.title}</DialogTitle>
                <DialogDescription>Подробная информация о задаче</DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground">
                  {selected.category}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyChipCls(selected.difficulty)}`}
                >
                  {difficultyLabel(selected.difficulty)}
                </span>
                {selected.scope === 'personal' && (
                  <span className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white">
                    Личная
                  </span>
                )}
                <StatusBadge status={selected.status} />
              </div>

              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {selected.description}
              </p>

              <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Награда</span>
                  <CoinAmount value={selected.reward} className="text-amber-300" />
                </div>
                {selected.deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Дедлайн</span>
                    <span>до {formatDate(selected.deadline)}</span>
                  </div>
                )}
                {selected.assignedToName && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Назначена</span>
                    <span>{selected.assignedToName}</span>
                  </div>
                )}
                {selected.claimedByName && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Исполнитель</span>
                    <span>{selected.claimedByName}</span>
                  </div>
                )}
              </div>

              {canClaim(selected) && (
                <DialogFooter>
                  <Button
                    className="w-full"
                    disabled={claimMutation.isPending}
                    onClick={() => {
                      claimMutation.mutate(selected.id);
                      setSelected(null);
                    }}
                  >
                    Взять задачу
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Создать задачу</DialogTitle>
            <DialogDescription>
              Задача появится в бирже. Личные задачи видны только назначенному сотруднику.
            </DialogDescription>
          </DialogHeader>

          <form className="flex flex-col gap-4" onSubmit={handleCreate}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-title">Название</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Подготовить отчёт по продажам"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-description">Описание</Label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Что нужно сделать и как принимается результат"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-reward">Награда (коины)</Label>
                <Input
                  id="task-reward"
                  type="number"
                  min={0}
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-category">Категория</Label>
                <Input
                  id="task-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Общие"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Сложность</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Сложность" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Легкая</SelectItem>
                    <SelectItem value="medium">Средняя</SelectItem>
                    <SelectItem value="hard">Сложная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Тип</Label>
                <Select
                  value={scope}
                  onValueChange={(v) => {
                    setScope(v);
                    if (v !== 'personal') setAssignedToId('');
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Тип задачи" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Общая</SelectItem>
                    <SelectItem value="personal">Личная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {scope === 'personal' && (
              <div className="flex flex-col gap-1.5">
                <Label>Назначить сотруднику</Label>
                <Select value={assignedToId} onValueChange={setAssignedToId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите сотрудника" />
                  </SelectTrigger>
                  <SelectContent>
                    {(usersQ.data?.users ?? []).map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {fullName(u)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-deadline">Дедлайн (необязательно)</Label>
              <Input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || (scope === 'personal' && !assignedToId)}
              >
                Создать задачу
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
