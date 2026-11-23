'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { Link } from '@/lib/router';
import { fullName } from '@/lib/format';
import type { User } from '@/lib/types';
import {
  Avatar,
  CoinAmount,
  EmptyState,
  LoadingBlock,
  PageHeader,
} from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';
import { Input } from '@/components/ui/input';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function employeesLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} сотрудник`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} сотрудника`;
  return `${n} сотрудников`;
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

function EmployeeCard({ user }: { user: User }) {
  return (
    <Link
      href={`/employees/${user.id}`}
      className="panel panel-hover block p-5"
      ariaLabel={`Профиль сотрудника ${fullName(user)}`}
    >
      <div className="flex items-center gap-3">
        <Avatar user={user} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{fullName(user)}</p>
          <p className="truncate text-sm text-muted-foreground">{user.position}</p>
        </div>
      </div>
      <span className="mt-3 inline-block max-w-full truncate rounded-full border border-white/10 px-2.5 py-1 text-xs text-muted-foreground">
        {user.department}
      </span>
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-xs text-muted-foreground" title="Суммарно заработано коинов">
          всего заработано
        </span>
        <CoinAmount value={user.totalEarned} className="text-sm text-amber-300" iconClassName="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function EmployeesPage(props: { params?: Record<string, string> }) {
  const [search, setSearch] = useState('');

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: api.users.list,
  });

  const users: User[] = usersQuery.data?.users ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const haystack = `${u.firstName} ${u.lastName} ${u.position} ${u.department}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [users, search]);

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="mesh" />
      <PageContainer>
        <PageHeader
          title="Сотрудники компании"
          description="У каждого есть ссылка на его публичную страницу. Найдите коллегу и посмотрите его достижения."
        />

        <div className="relative mb-6 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Найти сотрудника..."
            className="pl-9"
            aria-label="Поиск сотрудника"
          />
        </div>

        {usersQuery.isLoading ? (
          <LoadingBlock />
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Users className="h-5 w-5" />}
            title="Сотрудники не найдены"
            description="Пока в компании нет активных сотрудников."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="h-5 w-5" />}
            title="Ничего не найдено"
            description={`По запросу «${search.trim()}» нет совпадений. Попробуйте изменить запрос.`}
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">{employeesLabel(filtered.length)}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((u) => (
                <EmployeeCard key={u.id} user={u} />
              ))}
            </div>
          </>
        )}

      </PageContainer>
    </div>
  );
}
