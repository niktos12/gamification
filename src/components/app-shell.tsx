'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import {
  BarChart3,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  Store,
  Users,
  Wallet,
} from 'lucide-react';
import { Avatar, CoinAmount } from '@/components/shared/ui-kit';
import { api } from '@/lib/api';
import { Link, matchRoute, navigate, RouterProvider, useRoute } from '@/lib/router';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

import LandingPage from '@/components/pages/landing';
import AuthPage from '@/components/pages/auth';
import CabinetPage from '@/components/pages/cabinet';
import RoomPage from '@/components/pages/room';
import TasksPage from '@/components/pages/tasks';
import ChallengesPage from '@/components/pages/challenges';
import WheelPage from '@/components/pages/wheel';
import LeaderboardsPage from '@/components/pages/leaderboards';
import SurveysPage from '@/components/pages/surveys';
import AuctionsPage from '@/components/pages/auctions';
import PomodoroPage from '@/components/pages/pomodoro';
import QuestPage from '@/components/pages/quest';
import EmployeesPage from '@/components/pages/employees';
import PublicProfilePage from '@/components/pages/public-profile';
import CatalogPage from '@/components/pages/catalog';
import CartPage from '@/components/pages/cart';
import AdminPage from '@/components/pages/admin';

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn('group inline-flex items-center gap-2.5', className)}>
      <span
        className="relative flex h-8 w-8 items-center justify-center rounded-[10px] border border-white/12 bg-white/[0.04] backdrop-blur-md"
        aria-hidden="true"
      >
        {/* Дот-матричный знак: три белых точки + одна красная «LED». */}
        <span className="grid grid-cols-2 gap-[3px]">
          <span className="h-[5px] w-[5px] rounded-full bg-white/90 transition-transform duration-300 group-hover:scale-125" />
          <span className="h-[5px] w-[5px] rounded-full bg-white/90 transition-transform duration-300 group-hover:scale-125" />
          <span className="h-[5px] w-[5px] rounded-full bg-white/90 transition-transform duration-300 group-hover:scale-125" />
          <span className="h-[5px] w-[5px] rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.9)] transition-shadow duration-300 group-hover:shadow-[0_0_14px_rgba(168,85,247,1)]" />
        </span>
      </span>
      <span className="font-dot text-[17px] font-black lowercase tracking-[0.12em] text-white/95">
        dotify<span className="text-[#a855f7]">®</span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation model                                                    */
/* ------------------------------------------------------------------ */

const NAV = [
  { href: '/', label: 'Главная', icon: LayoutDashboard },
  { href: '/room', label: 'Игровая комната', icon: Gamepad2 },
  { href: '/catalog', label: 'Каталог', icon: Store },
  { href: '/employees', label: 'Сотрудники', icon: Users },
];

const AUTH_ROUTES = [
  /^\/cabinet/,
  /^\/room/,
  /^\/employees/,
  /^\/catalog/,
  /^\/cart/,
  /^\/admin/,
];

/* SSR-safe scroll flag: window is only touched inside the effect. */
function useScrolled(threshold = 14) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export function Header() {
  const path = useRoute();
  const { token, user, clear } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(14);
  const { scrollYProgress } = useScroll();

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: api.auth.me,
    enabled: Boolean(token),
    refetchInterval: 30_000,
  });

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: api.cart.get,
    enabled: Boolean(token),
    refetchInterval: 45_000,
  });

  const meUser = meQuery.data?.user ?? user;
  const cartCount = (cartQuery.data?.items ?? []).reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (meQuery.data?.user) {
      useAuthStore.getState().setUser(meQuery.data.user);
    }
  }, [meQuery.data]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          ariaLabel="На главную"
          className="group shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
        >
          <LogoMark />
        </Link>

        {/* Центрированная типографическая навигация (desktop) */}
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          aria-label="Основная навигация"
        >
          {NAV.map((item) => {
            const active = item.href === '/' ? path === '/' : path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60',
                  active ? 'text-white' : 'text-neutral-400 hover:text-white'
                )}
              >
                <span className="whitespace-nowrap">{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.9)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {token && meUser && (
            <>
              <Link
                href="/cabinet"
                className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 sm:inline-flex"
              >
                <CoinAmount value={meUser.balance} iconClassName="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/cart"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
                ariaLabel="Корзина"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#a855f7] px-1 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.7)]">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {token && meUser ? (
            <DropdownMenuPortal
              trigger={
                <button
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 pr-3 transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
                  aria-label="Меню пользователя"
                >
                  <Avatar user={meUser} size={26} />
                  <span className="hidden max-w-28 truncate text-sm sm:block">
                    {meUser.firstName}
                  </span>
                </button>
              }
              items={[
                { label: 'Личный кабинет', href: '/cabinet', icon: Wallet },
                ...(meUser.role === 'admin'
                  ? [{ label: 'Админ-панель', href: '/admin', icon: BarChart3 }]
                  : []),
                { label: 'Выйти', action: clear, icon: LogOut },
              ]}
            />
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-black transition hover:scale-[1.03] hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
            >
              Войти
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.8)]"
                aria-hidden="true"
              />
            </button>
          )}

          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* 1px scroll-progress line у нижней кромки бара */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px w-full origin-left bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#a855f7]/30"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      {/* Mobile glass panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto absolute inset-x-0 top-16 origin-top overflow-hidden border-b border-white/10 bg-black/95 backdrop-blur-2xl lg:hidden"
            aria-label="Мобильная навигация"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
              {NAV.map((item, index) => {
                const active = item.href === '/' ? path === '/' : path.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60',
                      active
                        ? 'bg-white/[0.06] text-white'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    )}
                  >
                    <span className="font-mono text-[10px] text-white/40">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {active && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.9)]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* Minimal dropdown to avoid extra deps -------------------------------- */

function DropdownMenuPortal({
  trigger,
  items,
}: {
  trigger: React.ReactNode;
  items: { label: string; href?: string; action?: () => void; icon: React.ElementType }[];
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [open]);
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-2xl border border-white/10 bg-popover/95 shadow-2xl backdrop-blur-xl"
          >
            {items.map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-left text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                onClick={() => {
                  setOpen(false);
                  if (item.href) navigate(item.href);
                  else item.action?.();
                }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-black/60">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 py-7 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-4">
            <LogoMark />
            <span className="hidden sm:block">Играй. Выполняй. Получай награды.</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="Навигация в подвале">
            <Link href="/room" className="transition-colors hover:text-white">Игровая комната</Link>
            <Link href="/catalog" className="transition-colors hover:text-white">Каталог</Link>
            <Link href="/cabinet" className="transition-colors hover:text-white">Кабинет</Link>
          </nav>
          <span>© 2025 Dotify. Внутренняя платформа компании.</span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] py-3.5 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
          <span className="hidden sm:block">DOTIFY OS — v2.5</span>
          <span className="inline-flex items-center gap-2">
            <span className="rec-dot" aria-hidden="true" />
            ALL SYSTEMS OPERATIONAL
          </span>
          <span className="hidden md:block">55.75°N / 37.61°E</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Splash (prevents hydration mismatch with persisted auth store)       */
/* ------------------------------------------------------------------ */

export function Splash() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-5">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <LogoMark />
        </motion.div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={cn('h-1.5 w-1.5 rounded-full', i === 2 ? 'bg-[#a855f7]' : 'bg-white')}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Router switch                                                       */
/* ------------------------------------------------------------------ */

export function RouteSwitch() {
  const path = useRoute();
  const { token, user } = useAuthStore();

  const needsAuth = useMemo(
    () => AUTH_ROUTES.some((re) => re.test(path.split('?')[0])),
    [path]
  );

  useEffect(() => {
    if (token && path === '/auth') {
      navigate('/room');
    }
  }, [token, path]);

  if (needsAuth && !token) {
    return (
      <div className="relative mx-auto w-full max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-xl font-semibold">Требуется вход</p>
        <p className="mt-2 text-sm text-muted-foreground">Войдите, чтобы продолжить.</p>
        <button
          onClick={() => navigate('/auth')}
          className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Войти
        </button>
      </div>
    );
  }

  if (path.startsWith('/admin') && user && user.role !== 'admin') {
    return (
      <div className="relative mx-auto w-full max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-xl font-semibold">Доступ только для администраторов</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Этот раздел доступен сотрудникам с ролью «Администратор».
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium"
        >
          На главную
        </button>
      </div>
    );
  }

  let content: React.ReactNode = null;
  let params: Record<string, string> | null;

  if (matchRoute('/', path)) content = <LandingPage />;
  else if (matchRoute('/auth', path)) content = <AuthPage />;
  else if (matchRoute('/cabinet', path)) content = <CabinetPage />;
  else if (matchRoute('/room', path)) content = <RoomPage />;
  else if (matchRoute('/room/tasks', path)) content = <TasksPage />;
  else if (matchRoute('/room/challenges', path)) content = <ChallengesPage />;
  else if (matchRoute('/room/wheel', path)) content = <WheelPage />;
  else if (matchRoute('/room/leaderboards', path)) content = <LeaderboardsPage />;
  else if (matchRoute('/room/surveys', path)) content = <SurveysPage />;
  else if (matchRoute('/room/auctions', path)) content = <AuctionsPage />;
  else if (matchRoute('/room/pomodoro', path)) content = <PomodoroPage />;
  else if (matchRoute('/room/quest', path)) content = <QuestPage />;
  else if (matchRoute('/employees', path)) content = <EmployeesPage />;
  else if ((params = matchRoute('/employees/:id', path))) content = <PublicProfilePage params={params} />;
  else if (matchRoute('/catalog', path)) content = <CatalogPage />;
  else if (matchRoute('/cart', path)) content = <CartPage />;
  else if (matchRoute('/admin', path)) content = <AdminPage />;
  else {
    content = (
      <div className="relative mx-auto w-full max-w-6xl px-4 py-28 text-center sm:px-6">
        <p className="font-dot text-7xl font-bold text-white/90">
          404<span className="text-[#a855f7]">.</span>
        </p>
        <p className="mt-4 text-muted-foreground">Страница не найдена</p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          На главную
        </button>
      </div>
    );
  }

  const bare = matchRoute('/auth', path) !== null;

  if (bare) {
    return <div key={path}>{content}</div>;
  }

  return (
    <div key={path} className="flex flex-1 flex-col">
      <main className="relative flex-1">{content}</main>
    </div>
  );
}

const emptySubscribe = () => () => {};

export function AppShell() {
  // Hydration-safe gate: false on the server, true on the client.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <RouterProvider>
      {!mounted ? (
        <Splash />
      ) : (
        <div className="flex min-h-screen flex-col">
          <Header />
          <RouteSwitch />
          <Footer />
        </div>
      )}
    </RouterProvider>
  );
}

export default AppShell;
