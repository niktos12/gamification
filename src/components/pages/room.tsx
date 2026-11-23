'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Crown,
  Gavel,
  MessageSquareText,
  Rocket,
  Sparkles,
  Timer,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { navigate } from '@/lib/router';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CoinAmount, PageHeader } from '@/components/shared/ui-kit';
import { PageContainer, PageDecor } from '@/components/shared/decor';

type TileColor = 'iris' | 'amber' | 'lilac' | 'violet';

const TILE_COLORS: Record<TileColor, string> = {
  iris: 'bg-white/10 text-white',
  amber: 'bg-[#a855f7]/15 text-[#c084fc]',
  lilac: 'bg-white/8 text-neutral-300',
  violet: 'bg-white/10 text-neutral-200',
};

interface Tile {
  title: string;
  icon: LucideIcon;
  color: TileColor;
  description: string;
  href: string;
}

const TILES: Tile[] = [
  { title: 'Биржа задач', icon: ClipboardList, color: 'iris', description: 'Выполняйте задачи и зарабатывайте бонусы', href: '/room/tasks' },
  { title: 'Челленджи', icon: Trophy, color: 'amber', description: 'Участствуйте в соревнованиях', href: '/room/challenges' },
  { title: 'Колесо фортуны', icon: Sparkles, color: 'lilac', description: 'Крутите игру', href: '/room/wheel' },
  { title: 'Лидерборды', icon: Crown, color: 'violet', description: 'Следите за рейтингом', href: '/room/leaderboards' },
  { title: 'Опросники', icon: MessageSquareText, color: 'iris', description: 'Зарабатывайте за опросы', href: '/room/surveys' },
  { title: 'Аукционы', icon: Gavel, color: 'amber', description: 'Побеждайте в торгах', href: '/room/auctions' },
  { title: 'Помодоро Таймер', icon: Timer, color: 'lilac', description: 'Работайте с фокусом', href: '/room/pomodoro' },
  { title: 'Сотрудники', icon: Users, color: 'violet', description: 'Список сотрудников компании', href: '/employees' },
];

export default function RoomPage(props: { params?: Record<string, string> }) {
  const { user, setUser } = useAuthStore();

  const questsQ = useQuery({ queryKey: ['quests'], queryFn: api.quests.list });
  const meQ = useQuery({ queryKey: ['me'], queryFn: api.auth.me });

  useEffect(() => {
    if (meQ.data?.user) setUser(meQ.data.user);
  }, [meQ.data, setUser]);

  const quests = questsQ.data;
  const questDone = Boolean(quests && quests.progressPercent >= 100);

  return (
    <div className="relative py-8 sm:py-12">
      <PageDecor variant="landing" />
      <PageContainer>
        <PageHeader
          title={`Привет, ${user?.firstName ?? 'друг'}!`}
          description="Главный навигационный хаб геймификации. Здесь собраны все игровые механики платформы."
          actions={
            <>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <CoinAmount value={user?.balance ?? 0} className="text-amber-300" />
              </span>
              <Button variant="outline" onClick={() => navigate('/catalog')}>
                Каталог призов
              </Button>
            </>
          }
        />

        {/* Featured quest banner / completed chip */}
        {quests && !questDone && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="mb-8 rounded-[20px] bg-gradient-to-r from-white/50 via-white/10 to-[#a855f7]/50 p-[1px]"
          >
            <div className="rounded-[19px] bg-[#0b0b0e] p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Rocket className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Адаптационный квест «Welcome к нам!»</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {quests.completedCount} из {quests.total} заданий выполнено
                  </p>
                </div>
                <Button onClick={() => navigate('/room/quest')} className="shrink-0">
                  Продолжить
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={quests.progressPercent} className="mt-4 h-2" />
            </div>
          </motion.div>
        )}

        {quests && questDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Адаптационный квест завершён
            </span>
          </motion.div>
        )}

        {/* Navigation tiles */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((tile, i) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.href}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                className="panel panel-hover group cursor-pointer p-5"
                onClick={() => navigate(tile.href)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') navigate(tile.href);
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${TILE_COLORS[tile.color]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </div>
                <p className="mt-4 font-medium">{tile.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tile.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="panel panel-hover group mt-6 flex cursor-pointer items-center justify-between gap-4 p-5"
          onClick={() => navigate('/catalog')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') navigate('/catalog');
          }}
        >
          <p className="text-sm text-muted-foreground sm:text-base">
            Каждая активность приносит коины — обменивайте их в каталоге
          </p>
          <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1.5" />
        </motion.div>
      </PageContainer>
    </div>
  );
}
