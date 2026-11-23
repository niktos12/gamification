'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Check,
  ClipboardCheck,
  ClipboardList,
  Coins,
  Gavel,
  LayoutDashboard,
  MessageSquareText,
  Minus,
  MoreVertical,
  Pencil,
  Plus,
  Settings as SettingsIcon,
  ShieldAlert,
  ShoppingBag,
  Store,
  Trash2,
  Trophy,
  Users,
  Vote,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';

import { api } from '@/lib/api';
import { formatDate, formatDateTime, fullName } from '@/lib/format';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';
import type {
  Auction,
  Challenge,
  Product,
  SettingsMap,
  Survey,
  Task,
  User,
} from '@/lib/types';
import {
  Avatar,
  CoinAmount,
  EmptyState,
  LoadingBlock,
  PageHeader,
  SectionTitle,
  StatCard,
  StatusBadge,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

type SectionId =
  | 'overview'
  | 'employees'
  | 'tasks'
  | 'challenges'
  | 'catalog'
  | 'auctions'
  | 'surveys'
  | 'orders'
  | 'settings';

const SECTIONS: { id: SectionId; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Обзор', icon: LayoutDashboard },
  { id: 'employees', label: 'Сотрудники', icon: Users },
  { id: 'tasks', label: 'Задачи', icon: ClipboardList },
  { id: 'challenges', label: 'Челленджи', icon: Trophy },
  { id: 'catalog', label: 'Каталог', icon: Store },
  { id: 'auctions', label: 'Аукционы', icon: Gavel },
  { id: 'surveys', label: 'Опросники', icon: MessageSquareText },
  { id: 'orders', label: 'Заказы', icon: ShoppingBag },
  { id: 'settings', label: 'Настройки', icon: SettingsIcon },
];

const ORDER_STATUS: { value: string; label: string }[] = [
  { value: 'new', label: 'Новый' },
  { value: 'processing', label: 'В обработке' },
  { value: 'completed', label: 'Выполнен' },
  { value: 'cancelled', label: 'Отменён' },
];

/* ------------------------------------------------------------------ */
/* Shared building blocks                                              */
/* ------------------------------------------------------------------ */

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Ошибка сервера';
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground',
        className
      )}
    >
      {children}
    </span>
  );
}

function SectionShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="panel p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SectionTitle>{title}</SectionTitle>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  pending,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  pending?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={pending}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-red-300 hover:bg-red-400/10 hover:text-red-200"
      aria-label={label}
      onClick={onClick}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Overview                                                         */
/* ------------------------------------------------------------------ */

function OverviewSection({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const statsQuery = useQuery({ queryKey: ['admin', 'stats'], queryFn: api.admin.stats });

  if (statsQuery.isLoading) return <LoadingBlock />;
  if (statsQuery.isError) {
    return <EmptyState title="Не удалось загрузить статистику" description={errMessage(statsQuery.error)} />;
  }

  const s = statsQuery.data;
  if (!s) return <EmptyState title="Статистика недоступна" />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-4 w-4" />} label="Сотрудники" value={s.usersCount} />
        <StatCard
          icon={<Coins className="h-4 w-4" />}
          label="Коинов в обороте"
          value={<CoinAmount value={s.coinsInCirculation} />}
        />
        <StatCard icon={<ClipboardList className="h-4 w-4" />} label="Задач открыто" value={s.tasksOpen} />
        <StatCard
          icon={<ClipboardCheck className="h-4 w-4" />}
          label="На проверке"
          value={s.tasksSubmitted}
          valueClassName="text-amber-300"
        />
        <StatCard icon={<Trophy className="h-4 w-4" />} label="Челленджей активно" value={s.activeChallenges} />
        <StatCard icon={<Gavel className="h-4 w-4" />} label="Аукционов" value={s.activeAuctions} />
        <StatCard icon={<MessageSquareText className="h-4 w-4" />} label="Опросов" value={s.activeSurveys} />
        <StatCard
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Новых заказов"
          value={s.ordersNew}
          valueClassName="text-amber-300"
        />
      </div>

      <div className="panel p-5">
        <SectionTitle>Быстрый доступ</SectionTitle>
        <p className="mt-1 text-sm text-muted-foreground">Переходите к разделам управления платформой.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SECTIONS.filter((item) => item.id !== 'overview').map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Employees                                                        */
/* ------------------------------------------------------------------ */

function EmployeesSection() {
  const qc = useQueryClient();
  const usersQuery = useQuery({ queryKey: ['admin', 'users'], queryFn: api.admin.users });

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    role: 'employee',
    isActive: true,
  });
  const [balanceUser, setBalanceUser] = useState<User | null>(null);
  const [balanceMode, setBalanceMode] = useState<'plus' | 'minus'>('plus');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceDesc, setBalanceDesc] = useState('');
  const [toDelete, setToDelete] = useState<User | null>(null);

  const users = usersQuery.data?.users ?? [];

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: Record<string, unknown> }) =>
      api.admin.updateUser(vars.id, vars.payload),
    onSuccess: () => {
      toast.success('Данные сотрудника обновлены');
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setEditUser(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const balanceMutation = useMutation({
    mutationFn: (vars: { id: number; payload: Record<string, unknown> }) =>
      api.admin.updateUser(vars.id, vars.payload),
    onSuccess: () => {
      toast.success('Баланс обновлён');
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      qc.invalidateQueries({ queryKey: ['me'] });
      setBalanceUser(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.admin.deleteUser(id),
    onSuccess: () => {
      toast.success('Сотрудник удалён');
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setToDelete(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function openEdit(u: User) {
    setEditUser(u);
    setEditForm({
      firstName: u.firstName,
      lastName: u.lastName,
      position: u.position,
      department: u.department,
      role: u.role,
      isActive: u.isActive,
    });
  }

  function openBalance(u: User) {
    setBalanceUser(u);
    setBalanceMode('plus');
    setBalanceAmount('');
    setBalanceDesc('');
  }

  function submitBalance() {
    if (!balanceUser) return;
    const amount = Number(balanceAmount);
    if (!Number.isFinite(amount) || amount === 0) {
      toast.error('Укажите сумму операции');
      return;
    }
    const signed = balanceMode === 'plus' ? Math.abs(amount) : -Math.abs(amount);
    balanceMutation.mutate({
      id: balanceUser.id,
      payload: { balanceAdjust: { amount: signed, description: balanceDesc } },
    });
  }

  const balancePreview =
    (balanceUser?.balance ?? 0) + (balanceMode === 'plus' ? 1 : -1) * (Number(balanceAmount) || 0);

  return (
    <>
      <SectionShell
        title="Сотрудники"
        description="Управление профилями, ролями и балансами пользователей."
      >
        {usersQuery.isLoading ? (
          <LoadingBlock />
        ) : usersQuery.isError ? (
          <EmptyState title="Не удалось загрузить список" description={errMessage(usersQuery.error)} />
        ) : users.length === 0 ? (
          <EmptyState title="Сотрудников пока нет" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Должность</TableHead>
                <TableHead>Баланс</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar user={u} size={36} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{fullName(u)}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                        Админ
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        Сотрудник
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.position || '—'}</TableCell>
                  <TableCell>
                    <CoinAmount value={u.balance} />
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 text-sm">
                      <span
                        className={cn('h-1.5 w-1.5 rounded-full', u.isActive ? 'bg-emerald-400' : 'bg-white/25')}
                      />
                      {u.isActive ? 'Активен' : 'Отключён'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Действия для ${fullName(u)}`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(u)}>
                          <Pencil className="h-4 w-4" />
                          Изменить
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openBalance(u)}>
                          <Wallet className="h-4 w-4" />
                          Начислить / Списать
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => setToDelete(u)}>
                          <Trash2 className="h-4 w-4" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionShell>

      {/* Edit dialog */}
      <Dialog
        open={editUser !== null}
        onOpenChange={(open) => {
          if (!open) setEditUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить сотрудника</DialogTitle>
            <DialogDescription>
              Профиль: {editUser ? fullName(editUser) : ''} ({editUser?.email ?? ''})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Имя">
              <Input
                value={editForm.firstName}
                onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
              />
            </Field>
            <Field label="Фамилия">
              <Input
                value={editForm.lastName}
                onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
              />
            </Field>
            <Field label="Должность">
              <Input
                value={editForm.position}
                onChange={(e) => setEditForm((f) => ({ ...f, position: e.target.value }))}
              />
            </Field>
            <Field label="Отдел">
              <Input
                value={editForm.department}
                onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}
              />
            </Field>
            <Field label="Роль">
              <Select
                value={editForm.role}
                onValueChange={(v) => setEditForm((f) => ({ ...f, role: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Сотрудник</SelectItem>
                  <SelectItem value="admin">Админ</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <Label htmlFor="employee-active">Активен</Label>
              <Switch
                id="employee-active"
                checked={editForm.isActive}
                onCheckedChange={(v) => setEditForm((f) => ({ ...f, isActive: v }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                if (!editUser) return;
                updateMutation.mutate({ id: editUser.id, payload: { ...editForm } });
              }}
              disabled={updateMutation.isPending}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Balance dialog */}
      <Dialog
        open={balanceUser !== null}
        onOpenChange={(open) => {
          if (!open) setBalanceUser(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Корректировка баланса</DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-2">
              <span>{balanceUser ? fullName(balanceUser) : ''}</span>
              <span>·</span>
              <span>Текущий баланс:</span>
              <CoinAmount value={balanceUser?.balance ?? 0} />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBalanceMode('plus')}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors',
                  balanceMode === 'plus'
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-white/10 text-muted-foreground hover:bg-white/5'
                )}
              >
                <Plus className="h-4 w-4" />
                Начислить
              </button>
              <button
                type="button"
                onClick={() => setBalanceMode('minus')}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors',
                  balanceMode === 'minus'
                    ? 'border-red-400/40 bg-red-400/10 text-red-300'
                    : 'border-white/10 text-muted-foreground hover:bg-white/5'
                )}
              >
                <Minus className="h-4 w-4" />
                Списать
              </button>
            </div>
            <Field label="Сумма">
              <Input
                type="number"
                min="1"
                placeholder="100"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
              />
            </Field>
            <Field label="Описание">
              <Input
                placeholder="Премия за проект"
                value={balanceDesc}
                onChange={(e) => setBalanceDesc(e.target.value)}
              />
            </Field>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-muted-foreground">
              Баланс после операции: <CoinAmount value={balancePreview} className="text-foreground" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBalanceUser(null)}>
              Отмена
            </Button>
            <Button onClick={submitBalance} disabled={balanceMutation.isPending}>
              Применить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title="Удалить сотрудника?"
        description={`«${toDelete ? fullName(toDelete) : ''}» и все связанные данные будут удалены безвозвратно.`}
        pending={deleteMutation.isPending}
        onConfirm={() => {
          if (toDelete) deleteMutation.mutate(toDelete.id);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Tasks                                                            */
/* ------------------------------------------------------------------ */

const EMPTY_TASK_FORM = {
  title: '',
  description: '',
  reward: '',
  category: '',
  difficulty: 'easy',
  scope: 'public',
  assignedToId: '',
  deadline: '',
};

function TasksSection() {
  const qc = useQueryClient();
  const tasksQuery = useQuery({ queryKey: ['admin', 'tasks'], queryFn: api.admin.tasks });
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_TASK_FORM);
  const [toDelete, setToDelete] = useState<Task | null>(null);

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: api.users.list,
    enabled: createOpen,
  });
  const users = usersQuery.data?.users ?? [];

  const tasks = tasksQuery.data?.tasks ?? [];
  const submitted = tasks.filter((t) => t.status === 'submitted');

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'tasks'] });
    qc.invalidateQueries({ queryKey: ['tasks'] });
  };

  const reviewMutation = useMutation({
    mutationFn: (vars: { id: number; approve: boolean }) => api.tasks.review(vars.id, vars.approve),
    onSuccess: (_data, vars) => {
      toast.success(vars.approve ? 'Задача одобрена, награда начислена' : 'Отчёт отклонён');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.tasks.create(payload),
    onSuccess: () => {
      toast.success('Задача создана');
      invalidate();
      setCreateOpen(false);
      setForm(EMPTY_TASK_FORM);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.tasks.delete(id),
    onSuccess: () => {
      toast.success('Задача удалена');
      invalidate();
      setToDelete(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function submitCreate() {
    if (!form.title.trim()) {
      toast.error('Укажите название задачи');
      return;
    }
    const reward = Number(form.reward);
    if (!Number.isFinite(reward) || reward <= 0) {
      toast.error('Укажите награду в коинах');
      return;
    }
    createMutation.mutate({
      title: form.title.trim(),
      description: form.description,
      reward,
      category: form.category.trim() || 'Общее',
      difficulty: form.difficulty,
      scope: form.scope,
      assignedToId: form.scope === 'personal' && form.assignedToId ? Number(form.assignedToId) : null,
      deadline: form.deadline || null,
    });
  }

  return (
    <>
      <div className="space-y-6">
        <SectionShell
          title="Очередь проверки"
          description="Отчёты сотрудников, ожидающие решения."
        >
          {submitted.length === 0 ? (
            <EmptyState
              icon={<Check className="h-5 w-5" />}
              title="Проверять нечего"
              description="Все отчёты обработаны."
            />
          ) : (
            <div className="space-y-3">
              {submitted.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{t.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Сдал: {t.claimedByName ?? '—'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CoinAmount value={t.reward} className="text-amber-300" />
                    <Button
                      size="sm"
                      onClick={() => reviewMutation.mutate({ id: t.id, approve: true })}
                      disabled={reviewMutation.isPending}
                    >
                      <Check className="h-4 w-4" />
                      Одобрить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-400/30 text-red-300 hover:bg-red-400/10 hover:text-red-200"
                      onClick={() => reviewMutation.mutate({ id: t.id, approve: false })}
                      disabled={reviewMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                      Отклонить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell
          title="Все задачи"
          description="Биржа задач: создание, назначение и удаление."
          action={
            <Button
              onClick={() => {
                setForm(EMPTY_TASK_FORM);
                setCreateOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Создать задачу
            </Button>
          }
        >
          {tasksQuery.isLoading ? (
            <LoadingBlock />
          ) : tasksQuery.isError ? (
            <EmptyState title="Не удалось загрузить задачи" description={errMessage(tasksQuery.error)} />
          ) : tasks.length === 0 ? (
            <EmptyState title="Задач пока нет" description="Создайте первую задачу для сотрудников." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Задача</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Награда</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Исполнитель</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="max-w-56 whitespace-normal font-medium">{t.title}</TableCell>
                    <TableCell className="text-muted-foreground">{t.category || '—'}</TableCell>
                    <TableCell>
                      <CoinAmount value={t.reward} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        className={
                          t.scope === 'personal' ? 'border-white/30 bg-white/10 text-white' : undefined
                        }
                      >
                        {t.scope === 'personal' ? 'Личная' : 'Общая'}
                        {t.scope === 'personal' && t.assignedToName ? ` · ${t.assignedToName}` : ''}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{t.claimedByName ?? '—'}</TableCell>
                    <TableCell className="text-right">
                      <DeleteButton
                        label={`Удалить задачу ${t.title}`}
                        onClick={() => setToDelete(t)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionShell>
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Создать задачу</DialogTitle>
            <DialogDescription>Новая задача появится в бирже задач.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Название">
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Подготовить отчёт"
              />
            </Field>
            <Field label="Описание">
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Что нужно сделать и в каком виде сдать результат"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Награда, коинов">
                <Input
                  type="number"
                  min="1"
                  value={form.reward}
                  onChange={(e) => setForm((f) => ({ ...f, reward: e.target.value }))}
                  placeholder="150"
                />
              </Field>
              <Field label="Категория">
                <Input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Работа"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Сложность">
                <Select
                  value={form.difficulty}
                  onValueChange={(v) => setForm((f) => ({ ...f, difficulty: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Легкая</SelectItem>
                    <SelectItem value="medium">Средняя</SelectItem>
                    <SelectItem value="hard">Сложная</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Тип задачи">
                <Select value={form.scope} onValueChange={(v) => setForm((f) => ({ ...f, scope: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Общая</SelectItem>
                    <SelectItem value="personal">Личная</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            {form.scope === 'personal' && (
              <Field label="Назначить сотруднику">
                <Select
                  value={form.assignedToId}
                  onValueChange={(v) => setForm((f) => ({ ...f, assignedToId: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите сотрудника" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {fullName(u)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
            <Field label="Дедлайн">
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Отмена
            </Button>
            <Button onClick={submitCreate} disabled={createMutation.isPending}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title="Удалить задачу?"
        description={`«${toDelete?.title ?? ''}» будет удалена безвозвратно.`}
        pending={deleteMutation.isPending}
        onConfirm={() => {
          if (toDelete) deleteMutation.mutate(toDelete.id);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Challenges                                                       */
/* ------------------------------------------------------------------ */

const EMPTY_CHALLENGE_FORM = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  prizeDescription: '',
  tasks: '',
};

function ChallengesSection() {
  const qc = useQueryClient();
  const challengesQuery = useQuery({ queryKey: ['challenges'], queryFn: api.challenges.list });
  const challenges = challengesQuery.data?.challenges ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_CHALLENGE_FORM);
  const [toDelete, setToDelete] = useState<Challenge | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['challenges'] });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: number; status: string }) =>
      api.challenges.update(vars.id, { status: vars.status }),
    onSuccess: (_data, vars) => {
      toast.success(vars.status === 'finished' ? 'Челлендж завершён' : 'Челлендж снова открыт');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.challenges.create(payload),
    onSuccess: () => {
      toast.success('Челлендж создан');
      invalidate();
      setCreateOpen(false);
      setForm(EMPTY_CHALLENGE_FORM);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.challenges.delete(id),
    onSuccess: () => {
      toast.success('Челлендж удалён');
      invalidate();
      setToDelete(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function submitCreate() {
    if (!form.title.trim()) {
      toast.error('Укажите название челленджа');
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error('Укажите даты проведения');
      return;
    }
    const tasks = form.tasks
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [rawTitle, rawReward] = line.split('|');
        return { title: (rawTitle ?? '').trim(), reward: Number((rawReward ?? '').trim()) };
      })
      .filter((t) => t.title.length > 0 && Number.isFinite(t.reward) && t.reward > 0);

    createMutation.mutate({
      title: form.title.trim(),
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      prizeDescription: form.prizeDescription,
      tasks,
    });
  }

  return (
    <>
      <SectionShell
        title="Челленджи"
        description="Корпоративные марафоны с наградами за выполненные задачи."
        action={
          <Button
            onClick={() => {
              setForm(EMPTY_CHALLENGE_FORM);
              setCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Создать челлендж
          </Button>
        }
      >
        {challengesQuery.isLoading ? (
          <LoadingBlock />
        ) : challengesQuery.isError ? (
          <EmptyState title="Не удалось загрузить челленджи" description={errMessage(challengesQuery.error)} />
        ) : challenges.length === 0 ? (
          <EmptyState title="Челленджей пока нет" description="Запустите первый марафон для команды." />
        ) : (
          <div className="space-y-3">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">{c.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(c.startDate)} — {formatDate(c.endDate)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Задач: {c.taskCount ?? 0} · Участников: {c.participantCount ?? 0}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={c.status} />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      statusMutation.mutate({ id: c.id, status: c.status === 'active' ? 'finished' : 'active' })
                    }
                    disabled={statusMutation.isPending}
                  >
                    {c.status === 'active' ? 'Завершить' : 'Переоткрыть'}
                  </Button>
                  <DeleteButton
                    label={`Удалить челлендж ${c.title}`}
                    onClick={() => setToDelete(c)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionShell>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Создать челлендж</DialogTitle>
            <DialogDescription>Задачи добавляйте по одной в строке: «Название | 100».</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Название">
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Марафон продуктивности"
              />
            </Field>
            <Field label="Описание">
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Чему посвящён челлендж"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Дата начала">
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </Field>
              <Field label="Дата окончания">
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </Field>
            </div>
            <Field label="Описание приза">
              <Textarea
                value={form.prizeDescription}
                onChange={(e) => setForm((f) => ({ ...f, prizeDescription: e.target.value }))}
                placeholder="Что получит победитель"
              />
            </Field>
            <Field label="Задачи челленджа">
              <Textarea
                value={form.tasks}
                onChange={(e) => setForm((f) => ({ ...f, tasks: e.target.value }))}
                placeholder={'Заполнить отчет | 100\nПровести встречу | 150'}
                rows={4}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Отмена
            </Button>
            <Button onClick={submitCreate} disabled={createMutation.isPending}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title="Удалить челлендж?"
        description={`«${toDelete?.title ?? ''}» и его задачи будут удалены безвозвратно.`}
        pending={deleteMutation.isPending}
        onConfirm={() => {
          if (toDelete) deleteMutation.mutate(toDelete.id);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Catalog                                                          */
/* ------------------------------------------------------------------ */

const EMPTY_PRODUCT_FORM = {
  title: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  imageUrl: '',
};

function CatalogSection() {
  const qc = useQueryClient();
  const productsQuery = useQuery({ queryKey: ['admin', 'products'], queryFn: () => api.products.list() });
  const products = productsQuery.data?.products ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT_FORM);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'products'] });
    qc.invalidateQueries({ queryKey: ['products'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.products.create(payload),
    onSuccess: () => {
      toast.success('Товар добавлен в каталог');
      invalidate();
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: Record<string, unknown> }) =>
      api.products.update(vars.id, vars.payload),
    onSuccess: () => {
      toast.success('Товар обновлён');
      invalidate();
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.products.delete(id),
    onSuccess: () => {
      toast.success('Товар удалён');
      invalidate();
      setToDelete(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_PRODUCT_FORM);
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      price: String(p.price),
      category: p.category,
      stock: String(p.stock),
      imageUrl: p.imageUrl,
    });
    setDialogOpen(true);
  }

  function submit() {
    if (!form.title.trim()) {
      toast.error('Укажите название товара');
      return;
    }
    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      toast.error('Укажите корректную цену');
      return;
    }
    const stock = Number(form.stock);
    if (!Number.isFinite(stock) || stock < 0) {
      toast.error('Укажите корректный остаток');
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description,
      price,
      category: form.category.trim() || 'Прочее',
      stock: Math.round(stock),
      imageUrl: form.imageUrl,
    };
    if (editing) updateMutation.mutate({ id: editing.id, payload });
    else createMutation.mutate(payload);
  }

  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <SectionShell
        title="Каталог"
        description="Товары, которые сотрудники покупают за коины."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Добавить товар
          </Button>
        }
      >
        {productsQuery.isLoading ? (
          <LoadingBlock />
        ) : productsQuery.isError ? (
          <EmptyState title="Не удалось загрузить каталог" description={errMessage(productsQuery.error)} />
        ) : products.length === 0 ? (
          <EmptyState title="Каталог пуст" description="Добавьте первый товар." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Товар</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Остаток</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-64 whitespace-normal">
                    <p className="font-medium">{p.title}</p>
                    {p.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.category || '—'}</TableCell>
                  <TableCell>
                    <CoinAmount value={p.price} />
                  </TableCell>
                  <TableCell>
                    <span className={cn('tabular-nums-tight', p.stock === 0 && 'text-red-300')}>
                      {p.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Изменить товар ${p.title}`}
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteButton label={`Удалить товар ${p.title}`} onClick={() => setToDelete(p)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionShell>

      {/* Create / edit dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Изменить товар' : 'Добавить товар'}</DialogTitle>
            <DialogDescription>
              {editing ? `Редактирование: ${editing.title}` : 'Товар появится в общем каталоге.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Название">
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Брендированная кружка"
              />
            </Field>
            <Field label="Описание">
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Краткое описание товара"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Цена, коинов">
                <Input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="500"
                />
              </Field>
              <Field label="Категория">
                <Input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Мерч"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Остаток на складе">
                <Input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  placeholder="10"
                />
              </Field>
              <Field label="Ссылка на изображение">
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </Field>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setEditing(null);
              }}
            >
              Отмена
            </Button>
            <Button onClick={submit} disabled={pending}>
              {editing ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title="Удалить товар?"
        description={`«${toDelete?.title ?? ''}» будет удалён из каталога безвозвратно.`}
        pending={deleteMutation.isPending}
        onConfirm={() => {
          if (toDelete) deleteMutation.mutate(toDelete.id);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Auctions                                                         */
/* ------------------------------------------------------------------ */

const EMPTY_AUCTION_FORM = {
  title: '',
  description: '',
  startPrice: '',
  endsAt: '',
  imageUrl: '',
};

function AuctionsSection() {
  const qc = useQueryClient();
  const auctionsQuery = useQuery({ queryKey: ['auctions'], queryFn: api.auctions.list });
  const auctions = auctionsQuery.data?.auctions ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_AUCTION_FORM);
  const [toDelete, setToDelete] = useState<Auction | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['auctions'] });

  const finishMutation = useMutation({
    mutationFn: (id: number) => api.auctions.update(id, { status: 'finished' }),
    onSuccess: () => {
      toast.success('Аукцион завершён');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.auctions.create(payload),
    onSuccess: () => {
      toast.success('Аукцион создан');
      invalidate();
      setCreateOpen(false);
      setForm(EMPTY_AUCTION_FORM);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.auctions.delete(id),
    onSuccess: () => {
      toast.success('Аукцион удалён');
      invalidate();
      setToDelete(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function submitCreate() {
    if (!form.title.trim()) {
      toast.error('Укажите название лота');
      return;
    }
    const startPrice = Number(form.startPrice);
    if (!Number.isFinite(startPrice) || startPrice <= 0) {
      toast.error('Укажите стартовую цену');
      return;
    }
    if (!form.endsAt) {
      toast.error('Укажите дату окончания');
      return;
    }
    createMutation.mutate({
      title: form.title.trim(),
      description: form.description,
      startPrice,
      endsAt: form.endsAt,
      imageUrl: form.imageUrl,
    });
  }

  return (
    <>
      <SectionShell
        title="Аукционы"
        description="Лоты, за которые сотрудники соревнуются коинами."
        action={
          <Button
            onClick={() => {
              setForm(EMPTY_AUCTION_FORM);
              setCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Создать аукцион
          </Button>
        }
      >
        {auctionsQuery.isLoading ? (
          <LoadingBlock />
        ) : auctionsQuery.isError ? (
          <EmptyState title="Не удалось загрузить аукционы" description={errMessage(auctionsQuery.error)} />
        ) : auctions.length === 0 ? (
          <EmptyState title="Аукционов пока нет" description="Выставьте первый лот на торги." />
        ) : (
          <div className="space-y-3">
            {auctions.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">{a.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Лидер: {a.highestBidderName ?? '—'} · до {formatDate(a.endsAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <CoinAmount value={a.currentPrice} className="font-semibold text-amber-300" />
                  <StatusBadge status={a.status} />
                  {a.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => finishMutation.mutate(a.id)}
                      disabled={finishMutation.isPending}
                    >
                      Завершить
                    </Button>
                  )}
                  <DeleteButton label={`Удалить аукцион ${a.title}`} onClick={() => setToDelete(a)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionShell>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Создать аукцион</DialogTitle>
            <DialogDescription>Лот появится в разделе аукционов.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Название лота">
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ужин с CEO"
              />
            </Field>
            <Field label="Описание">
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Что входит в лот"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Стартовая цена, коинов">
                <Input
                  type="number"
                  min="1"
                  value={form.startPrice}
                  onChange={(e) => setForm((f) => ({ ...f, startPrice: e.target.value }))}
                  placeholder="300"
                />
              </Field>
              <Field label="Дата окончания">
                <Input
                  type="date"
                  value={form.endsAt}
                  onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                />
              </Field>
            </div>
            <Field label="Ссылка на изображение">
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Отмена
            </Button>
            <Button onClick={submitCreate} disabled={createMutation.isPending}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title="Удалить аукцион?"
        description={`«${toDelete?.title ?? ''}» и все ставки будут удалены безвозвратно.`}
        pending={deleteMutation.isPending}
        onConfirm={() => {
          if (toDelete) deleteMutation.mutate(toDelete.id);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Surveys                                                          */
/* ------------------------------------------------------------------ */

const EMPTY_SURVEY_FORM = {
  title: '',
  question: '',
  options: '',
};

function SurveysSection() {
  const qc = useQueryClient();
  const surveysQuery = useQuery({ queryKey: ['surveys'], queryFn: api.surveys.list });
  const surveys = surveysQuery.data?.surveys ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_SURVEY_FORM);
  const [toDelete, setToDelete] = useState<Survey | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['surveys'] });

  const toggleMutation = useMutation({
    mutationFn: (vars: { id: number; isActive: boolean }) =>
      api.surveys.update(vars.id, { isActive: vars.isActive }),
    onSuccess: (_data, vars) => {
      toast.success(vars.isActive ? 'Опрос открыт' : 'Опрос завершён');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const createMutation = useMutation({
    mutationFn: (payload: { title: string; question?: string; options: string[] }) =>
      api.surveys.create(payload),
    onSuccess: () => {
      toast.success('Опрос создан');
      invalidate();
      setCreateOpen(false);
      setForm(EMPTY_SURVEY_FORM);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.surveys.delete(id),
    onSuccess: () => {
      toast.success('Опрос удалён');
      invalidate();
      setToDelete(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function submitCreate() {
    if (!form.title.trim()) {
      toast.error('Укажите название опроса');
      return;
    }
    const options = form.options
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (options.length < 2) {
      toast.error('Добавьте минимум два варианта ответа');
      return;
    }
    createMutation.mutate({
      title: form.title.trim(),
      question: form.question,
      options,
    });
  }

  return (
    <>
      <SectionShell
        title="Опросники"
        description="Голосования с наградой за участие."
        action={
          <Button
            onClick={() => {
              setForm(EMPTY_SURVEY_FORM);
              setCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Создать опрос
          </Button>
        }
      >
        {surveysQuery.isLoading ? (
          <LoadingBlock />
        ) : surveysQuery.isError ? (
          <EmptyState title="Не удалось загрузить опросы" description={errMessage(surveysQuery.error)} />
        ) : surveys.length === 0 ? (
          <EmptyState title="Опросов пока нет" description="Создайте первый опрос для команды." />
        ) : (
          <div className="space-y-3">
            {surveys.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">{s.title}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{s.question || '—'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>
                    <Vote className="h-3.5 w-3.5" />
                    {s.totalVotes}
                  </Chip>
                  <StatusBadge status={s.isActive ? 'active' : 'finished'} />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleMutation.mutate({ id: s.id, isActive: !s.isActive })}
                    disabled={toggleMutation.isPending}
                  >
                    {s.isActive ? 'Завершить' : 'Открыть'}
                  </Button>
                  <DeleteButton label={`Удалить опрос ${s.title}`} onClick={() => setToDelete(s)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionShell>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Создать опрос</DialogTitle>
            <DialogDescription>Каждый вариант ответа — с новой строки.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Название">
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Тимбилдинг 2025"
              />
            </Field>
            <Field label="Вопрос">
              <Textarea
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="Какой формат команды вам ближе?"
              />
            </Field>
            <Field label="Варианты ответов">
              <Textarea
                value={form.options}
                onChange={(e) => setForm((f) => ({ ...f, options: e.target.value }))}
                placeholder={'Выезд на природе\nКвест в городе'}
                rows={4}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Отмена
            </Button>
            <Button onClick={submitCreate} disabled={createMutation.isPending}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title="Удалить опрос?"
        description={`«${toDelete?.title ?? ''}» и все голоса будут удалены безвозвратно.`}
        pending={deleteMutation.isPending}
        onConfirm={() => {
          if (toDelete) deleteMutation.mutate(toDelete.id);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Orders                                                           */
/* ------------------------------------------------------------------ */

function OrdersSection() {
  const qc = useQueryClient();
  const ordersQuery = useQuery({ queryKey: ['admin', 'orders'], queryFn: api.admin.orders });
  const orders = ordersQuery.data?.orders ?? [];

  const statusMutation = useMutation({
    mutationFn: (vars: { id: number; status: string }) => api.orders.setStatus(vars.id, vars.status),
    onSuccess: () => {
      toast.success('Статус заказа обновлён');
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <SectionShell title="Заказы" description="Заявки сотрудников на товары за коины.">
      {ordersQuery.isLoading ? (
        <LoadingBlock />
      ) : ordersQuery.isError ? (
        <EmptyState title="Не удалось загрузить заказы" description={errMessage(ordersQuery.error)} />
      ) : orders.length === 0 ? (
        <EmptyState title="Заказов пока нет" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>Пользователь</TableHead>
              <TableHead>Состав</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Комментарий</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="text-muted-foreground">#{o.id}</TableCell>
                <TableCell className="font-medium">{o.userName ?? '—'}</TableCell>
                <TableCell className="max-w-56 whitespace-normal text-muted-foreground">
                  {(o.items ?? []).map((i) => `${i.title} ×${i.quantity}`).join(', ') || '—'}
                </TableCell>
                <TableCell>
                  <CoinAmount value={o.total} />
                </TableCell>
                <TableCell className="max-w-40 whitespace-normal text-muted-foreground">
                  {o.comment || '—'}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDateTime(o.createdAt)}</TableCell>
                <TableCell>
                  <Select
                    value={o.status}
                    onValueChange={(v) => statusMutation.mutate({ id: o.id, status: v })}
                  >
                    <SelectTrigger size="sm" className="w-40">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </SectionShell>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Settings                                                         */
/* ------------------------------------------------------------------ */

function SettingsForm({ initial }: { initial: SettingsMap }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    siteName: initial.siteName ?? '',
    siteTagline: initial.siteTagline ?? '',
    heroTitle: initial.heroTitle ?? '',
    heroSubtitle: initial.heroSubtitle ?? '',
    tickerText: initial.tickerText ?? '',
    supportEmail: initial.supportEmail ?? '',
    supportTelegram: initial.supportTelegram ?? '',
    cashbackPercent: initial.cashbackPercent ?? '',
  });

  const saveMutation = useMutation({
    mutationFn: (payload: SettingsMap) => api.settings.update(payload),
    onSuccess: () => {
      toast.success('Настройки сохранены');
      qc.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function save() {
    const payload: SettingsMap = {
      siteName: form.siteName,
      siteTagline: form.siteTagline,
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      tickerText: form.tickerText,
      supportEmail: form.supportEmail,
      supportTelegram: form.supportTelegram,
      cashbackPercent: String(Number(form.cashbackPercent) || 0),
    };
    saveMutation.mutate(payload);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название сайта">
          <Input
            value={form.siteName}
            onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))}
          />
        </Field>
        <Field label="Слоган">
          <Input
            value={form.siteTagline}
            onChange={(e) => setForm((f) => ({ ...f, siteTagline: e.target.value }))}
          />
        </Field>
      </div>
      <Field label="Заголовок главной">
        <Input
          value={form.heroTitle}
          onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
        />
      </Field>
      <Field label="Подзаголовок">
        <Input
          value={form.heroSubtitle}
          onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))}
        />
      </Field>
      <Field label="Бегущая строка">
        <Textarea
          value={form.tickerText}
          onChange={(e) => setForm((f) => ({ ...f, tickerText: e.target.value }))}
          placeholder="Текст бегущей строки на главной"
          rows={3}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email поддержки">
          <Input
            type="email"
            value={form.supportEmail}
            onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))}
          />
        </Field>
        <Field label="Telegram поддержки">
          <Input
            value={form.supportTelegram}
            onChange={(e) => setForm((f) => ({ ...f, supportTelegram: e.target.value }))}
            placeholder="@dotify_support"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Кэшбек, %">
          <Input
            type="number"
            min="0"
            max="100"
            value={form.cashbackPercent}
            onChange={(e) => setForm((f) => ({ ...f, cashbackPercent: e.target.value }))}
          />
        </Field>
        <p className="self-end text-sm text-muted-foreground">
          Процент коинов, возвращаемый сотруднику с каждой покупки.
        </p>
      </div>
      <div className="flex justify-end pt-2">
        <Button onClick={save} disabled={saveMutation.isPending}>
          Сохранить настройки
        </Button>
      </div>
    </div>
  );
}

function SettingsSection() {
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: api.settings.get });

  if (settingsQuery.isLoading) {
    return (
      <SectionShell title="Настройки платформы" description="Глобальные тексты и параметры продукта.">
        <LoadingBlock />
      </SectionShell>
    );
  }

  const s = settingsQuery.data?.settings;

  return (
    <SectionShell title="Настройки платформы" description="Глобальные тексты и параметры продукта.">
      {settingsQuery.isError || !s ? (
        <EmptyState title="Не удалось загрузить настройки" description={errMessage(settingsQuery.error)} />
      ) : (
        <SettingsForm key={settingsQuery.dataUpdatedAt} initial={s} />
      )}
    </SectionShell>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AdminPage(_props: { params?: Record<string, string> }) {
  const [section, setSection] = useState<SectionId>('overview');
  const user = useAuthStore((state) => state.user);

  // Defensive guard: the app shell blocks non-admins, but double-check here.
  if (user && user.role !== 'admin') {
    return (
      <div className="relative py-8 sm:py-12">
        <PageDecor variant="side" />
        <PageContainer className="max-w-7xl">
          <EmptyState
            icon={<ShieldAlert className="h-5 w-5" />}
            title="Доступ запрещён"
            description="Этот раздел доступен только администраторам платформы."
          />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="side" />
      <PageContainer className="max-w-7xl">
        <PageHeader
          title="Админ-панель"
          description="Личный кабинет администратора: полный доступ к расширенной функциональности управления платформой."
        />

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <nav
              className="panel sticky top-24 flex flex-col gap-1 p-2"
              aria-label="Разделы админ-панели"
            >
              <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Разделы
              </p>
              {SECTIONS.map((item) => {
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground',
                      active && 'border-primary/40 bg-white/8 text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Mobile section chips */}
          <div className="lg:hidden">
            <div
              className="-mx-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6"
              data-lenis-prevent
            >
              <div className="flex w-max gap-2">
                {SECTIONS.map((item) => {
                  const active = section === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSection(item.id)}
                      className={cn(
                        'inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors',
                        active
                          ? 'border-primary/40 bg-white/8 text-foreground'
                          : 'border-white/10 bg-white/5 text-muted-foreground'
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="min-w-0"
          >
            {section === 'overview' && <OverviewSection onNavigate={setSection} />}
            {section === 'employees' && <EmployeesSection />}
            {section === 'tasks' && <TasksSection />}
            {section === 'challenges' && <ChallengesSection />}
            {section === 'catalog' && <CatalogSection />}
            {section === 'auctions' && <AuctionsSection />}
            {section === 'surveys' && <SurveysSection />}
            {section === 'orders' && <OrdersSection />}
            {section === 'settings' && <SettingsSection />}
          </motion.div>
        </div>
      </PageContainer>
    </div>
  );
}
