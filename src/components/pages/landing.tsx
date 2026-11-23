'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  Crown,
  Gavel,
  MessageSquareText,
  ShoppingBag,
  Sparkles,
  Store,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { api } from '@/lib/api';
import { navigate } from '@/lib/router';
import type { SettingsMap } from '@/lib/types';
import { useAuthStore } from '@/store/auth';
import { Coin } from '@/components/shared/ui-kit';
import { CountUp, CursorHalo, InteractiveCard, Magnetic } from '@/components/shared/interactive';
import DotSphere from '@/components/shared/dot-sphere';
import { DiamondMark, Marquee, PageContainer, PageDecor } from '@/components/shared/decor';
import { SmoothScroll } from '@/components/shared/smooth-scroll';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Defaults (used until public settings arrive / if request fails)     */
/* ------------------------------------------------------------------ */

const DEFAULTS = {
  siteName: 'Dotify',
  heroTitle: 'Игровая платформа для твоей команды',
  heroSubtitle:
    'Выполняй задания, зарабатывай баллы, открывай награды и поднимайся в рейтинге компании.',
  tickerText:
    'Задания — Челленджи — Колесо Фортуны — Лидерборды — Аукционы — Квизы — Каталог наград — Помодоро-таймер — Адаптационный квест',
};

const HERO_STATS = [
  { num: '08', label: 'игровых модулей' },
  { num: 'XP', label: 'система уровней' },
  { num: '24/7', label: 'аукционы и челленджи' },
];

const STEPS = [
  {
    n: '01',
    title: 'Выбери задание',
    text: 'Берите публичные задачи на бирже или получите личные от администратора.',
  },
  {
    n: '02',
    title: 'Получи бонусы',
    text: 'За каждую активность начисляется внутренняя валюта и бейджи.',
  },
  {
    n: '03',
    title: 'Обменяй на призы',
    text: 'Тратите бонусы в магазине, на мерч, впечатления и аукционы.',
  },
];

const MODULES = [
  { icon: ClipboardList, title: 'Биржа задач', text: 'Выполняйте задания и зарабатывайте бонусы', href: '/room/tasks' },
  { icon: Trophy, title: 'Челленджи', text: 'Какой отдел быстрее выполнит 5 активностей', href: '/room/challenges' },
  { icon: Sparkles, title: 'Колесо Фортуны', text: 'Испытайте удачу раз в неделю', href: '/room/wheel' },
  { icon: Crown, title: 'Лидерборды', text: 'Смотрите рейтинги всей компании', href: '/room/leaderboards' },
  { icon: MessageSquareText, title: 'Опросники', text: 'Зарабатывайте за прохождение опросов', href: '/room/surveys' },
  { icon: Timer, title: 'Помодоро', text: 'Работайте продуктивно без стресса', href: '/room/pomodoro' },
  { icon: Users, title: 'Сотрудники', text: 'Профили коллег и бейджи достижений', href: '/employees' },
  { icon: Gavel, title: 'Аукционы', text: 'Последнее слово за вами', href: '/room/auctions' },
];

const RULES = [
  {
    icon: ClipboardList,
    title: 'Задачи и челленджи',
    text: 'Выполненные задачи и челленджи приносят баллы на баланс мгновенно.',
  },
  {
    icon: Sparkles,
    title: 'Колесо фортуны',
    text: 'Бесплатный спин доступен раз в день — приз случайный, эмоции реальные.',
  },
  {
    icon: Gavel,
    title: 'Аукционы',
    text: 'Победитель определяется ставками — перебейте цену конкурентов.',
  },
  {
    icon: Crown,
    title: 'Лидерборды',
    text: 'Рейтинги обновляются в реальном времени, пьедестал ждёт лучших.',
  },
];

const QUICK_FEATURES = [
  { icon: Zap, title: 'Задания', text: 'Выполняй задачи и получай награды', href: '/room/tasks' },
  { icon: Trophy, title: 'Челленджи', text: 'Участвуй в соревнованиях и побеждай', href: '/room/challenges' },
  { icon: ShoppingBag, title: 'Магазин', text: 'Обменивай баллы на крутые призы', href: '/catalog' },
  { icon: Users, title: 'Рейтинг', text: 'Стань лучшим среди коллег', href: '/room/leaderboards' },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Заголовок секции: mono-индекс + красная точка + серебристый титул. */
function SectionHead({
  index,
  eyebrow,
  title,
}: {
  index: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <FadeUp>
      <div className="flex items-center gap-3">
        <span className="rec-dot !h-1.5 !w-1.5" aria-hidden="true" />
        <span className="eyebrow !text-[10px]">
          {index} — {eyebrow}
        </span>
      </div>
      <h2 className="title-gradient mt-4 max-w-3xl text-[clamp(1.55rem,3.2vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.02em] [overflow-wrap:anywhere]">
        {title}
      </h2>
    </FadeUp>
  );
}

/* ------------------------------------------------------------------ */
/* Hero — минимализм с «хаотичным» расположением элементов (Persona:   */
/* только позиции и наклоны, без цветовых стикеров и коллажа).         */
/* ------------------------------------------------------------------ */

function HeroSection({
  siteName,
  heroTitle,
  heroSubtitle,
  roomHref,
  catalogHref,
}: {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  roomHref: string;
  catalogHref: string;
}) {
  const words = heroTitle.trim().split(/\s+/);
  const line1 = words.slice(0, 1).join(' ');
  const line2 = words.slice(1, 2).join(' ');
  const line3 = words.slice(2).join(' ');
  const lastWord = line3.split(' ').pop() || '';

  return (
    <section className="relative pb-6 pt-10 sm:pt-14 lg:pt-20">
      <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
        {/* Left: свободная типографика со сдвигами строк */}
        <div className="min-w-0">
          <h1 className="font-unbounded text-[clamp(2.1rem,5vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] [overflow-wrap:anywhere]">
            <motion.span
              initial={{ opacity: 0, y: 44, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -1.1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 21, delay: 0.12 }}
              whileHover={{ rotate: 0, x: 6 }}
              className="title-gradient block cursor-default will-change-transform"
            >
              {line1}
            </motion.span>
            {line2 && (
              <motion.span
                initial={{ opacity: 0, y: 44, rotate: 1.6 }}
                animate={{ opacity: 1, y: 0, rotate: 0.9 }}
                transition={{ type: 'spring', stiffness: 260, damping: 21, delay: 0.2 }}
                whileHover={{ rotate: 0, x: -6 }}
                className="title-gradient block cursor-default pl-[4%] will-change-transform"
              >
                {line2}
              </motion.span>
            )}
            {line3 && (
              <motion.span
                initial={{ opacity: 0, y: 44, rotate: -1.4 }}
                animate={{ opacity: 1, y: 0, rotate: -0.5 }}
                transition={{ type: 'spring', stiffness: 260, damping: 21, delay: 0.28 }}
                whileHover={{ rotate: 0 }}
                className="block cursor-default pl-[2.5%] will-change-transform"
              >
                {line3.split(' ').slice(0, -1).join(' ')}{' '}
                {/* Последнее слово — в тонкой стеклянной плашке */}
                <span className="inline-block -rotate-1 rounded-2xl border border-white/14 bg-white/[0.06] px-[0.34em] pb-[0.1em] backdrop-blur-md transition-transform duration-300 hover:rotate-0">
                  {lastWord}
                </span>
              </motion.span>
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-8 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base"
          >
            {heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.2}>
              <motion.button
                type="button"
                onClick={() => navigate(roomHref)}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition-colors hover:bg-neutral-200"
              >
                Начать
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <motion.button
                type="button"
                onClick={() => navigate(catalogHref)}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-white/16 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/[0.07] hover:text-white"
              >
                Каталог наград
              </motion.button>
            </Magnetic>
          </motion.div>

          {/* Статистика — строчная, с лёгким «хаотичным» смещением */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-12 flex flex-wrap items-start gap-x-8 gap-y-5 sm:gap-x-10"
          >
            {HERO_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'border-l border-white/12 pl-5 sm:pl-6',
                  i === 1 && 'translate-y-2.5',
                  i === 2 && '-translate-y-1'
                )}
              >
                <span className="font-dot text-2xl font-black text-white sm:text-[1.7rem]">
                  {i === 0 ? <CountUp to={8} pad={2} /> : stat.num}
                </span>
                <span className="mt-1.5 block text-[10px] uppercase leading-snug tracking-[0.16em] text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: dot-сфера в «воздухе» — без рамок и колец */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative mx-auto w-full min-w-0 max-w-lg"
        >
          <div className="relative h-[400px] sm:h-[500px]">
            {/* Мягкое свечение за сферой */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 45%, transparent 68%)',
              }}
              aria-hidden="true"
            />
            {/* Фиолетовая «LED»-точка — единственный цветовой акцент зоны */}
            <motion.span
              aria-hidden="true"
              className="absolute right-[14%] top-[12%] h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.9)]"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              className="pointer-events-none absolute left-[10%] top-[18%] h-[3px] w-[3px] rounded-full bg-white/50"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute bottom-[16%] right-[8%] h-[2px] w-[2px] rounded-full bg-white/40"
              aria-hidden="true"
            />

            <DotSphere className="absolute inset-0" />

            {/* Единственный стеклянный чип — «+5 бонусов» */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 top-[10%] z-10 hidden -rotate-2 sm:block"
            >
              <div className="rounded-2xl border border-white/12 bg-[#0b0b0b]/80 px-4 py-2.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                <p className="flex items-center gap-2 text-sm font-bold text-white">
                  <Zap className="h-3.5 w-3.5 text-[#c084fc]" />
                  +5 бонусов
                </p>
                <p className="text-[11px] text-muted-foreground">за выполнение задания</p>
              </div>
            </motion.div>

            {/* Техническая подпись под сценой */}
            <div className="absolute inset-x-0 -bottom-2 z-10 flex justify-center">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-white/45">
                CORE: DOTSPHERE // NODES: 440
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SCROLL — тонкий центрированный индикатор (KIUTA-style) */}
      <div className="mt-14 flex flex-col items-center gap-3 sm:mt-16" aria-hidden="true">
        <span className="font-mono text-[9px] uppercase tracking-[0.34em] text-white/40">
          SCROLL
        </span>
        <span className="scroll-line" />
      </div>

      {/* siteName остаётся в подписи ради SEO/доступности */}
      <span className="sr-only">{siteName}</span>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const user = useAuthStore((s) => s.user);

  // Public endpoint: works logged-out, no auth redirect. Sensible defaults on failure.
  const settingsQuery = useQuery<{ settings: SettingsMap }>({
    queryKey: ['landing-settings'],
    queryFn: async () => {
      try {
        return await api.settings.get();
      } catch {
        return { settings: {} };
      }
    },
    staleTime: 5 * 60_000,
  });

  const s = settingsQuery.data?.settings ?? {};
  const siteName = s.siteName || DEFAULTS.siteName;
  const heroTitle = s.heroTitle || DEFAULTS.heroTitle;
  const heroSubtitle = s.heroSubtitle || DEFAULTS.heroSubtitle;
  const tickerItems = (s.tickerText || DEFAULTS.tickerText)
    .split(/\s*[—|]\s*/) // настройки используют и «—», и «|» как разделители
    .map((t) => t.trim())
    .filter(Boolean);

  const roomHref = user ? '/room' : '/auth';
  const catalogHref = user ? '/catalog' : '/auth';

  return (
    <div className="relative overflow-x-clip py-6 sm:py-10">
      <PageDecor variant="landing" />
      <SmoothScroll />
      <CursorHalo />

      <PageContainer>
        <HeroSection
          siteName={siteName}
          heroTitle={heroTitle}
          heroSubtitle={heroSubtitle}
          roomHref={roomHref}
          catalogHref={catalogHref}
        />

        {/* Quick feature strip — чистые плитки с мягким tilt ---------------- */}
        <FadeUp className="mt-16 sm:mt-20">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <InteractiveCard key={f.title} className="rounded-2xl" max={5}>
                  <button
                    type="button"
                    onClick={() => navigate(user ? f.href : '/auth')}
                    className="spot-target panel panel-hover group flex h-full w-full flex-col gap-2.5 p-5 text-left"
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-300 group-hover:border-white/30 group-hover:bg-white group-hover:text-black">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">
                        0{i + 1}
                      </span>
                    </span>
                    <span className="text-sm font-bold">{f.title}</span>
                    <span className="text-xs leading-snug text-muted-foreground">{f.text}</span>
                    <ArrowUpRight className="h-4 w-4 self-end text-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#c084fc]" />
                  </button>
                </InteractiveCard>
              );
            })}
          </div>
        </FadeUp>
      </PageContainer>

      {/* Marquee band — единственная «полоса контраста» (пауза при hover) -- */}
      <section
        className="marquee-hover mt-16 border-y border-white/10 bg-primary py-3.5 text-[#0a0a0a] sm:mt-20"
        aria-label="Бегущая строка"
      >
        <Marquee speed={38} className="font-semibold">
          {tickerItems.map((item, i) => (
            <span key={`${item}-${i}`} className="inline-flex items-center gap-8 text-sm tracking-wide">
              <span className="whitespace-nowrap">{item}</span>
              <DiamondMark className="h-3.5 w-3.5 shrink-0 opacity-70" />
            </span>
          ))}
        </Marquee>
      </section>

      <PageContainer>
        {/* 01 — Три шага --------------------------------------------------- */}
        <section className="mt-20 sm:mt-28">
          <SectionHead
            index="01"
            eyebrow="Как это работает"
            title="Три шага от задания до реального приза"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <FadeUp
                key={step.n}
                delay={i * 0.08}
                className={cn('h-full', i === 1 && 'md:translate-y-4')}
              >
                <InteractiveCard className="h-full rounded-2xl" max={5}>
                  <div className="spot-target panel panel-hover relative h-full p-6">
                    <span className="font-mono text-xs tracking-[0.3em] text-white/35">
                      {step.n}
                    </span>
                    <p className="mt-6 font-medium">{step.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </InteractiveCard>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* 02 — Модули: чистая сетка с микро-наклонами карточек ------------- */}
        <section className="mt-24 sm:mt-32">
          <SectionHead
            index="02"
            eyebrow="Игровая комната"
            title="Все игровые механики платформы в одном месте"
          />
          <div className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m, i) => {
              const Icon = m.icon;
              /* Persona-хаотичность: только микро-наклоны и смещения позиций.
                 Смещение чётных колонок — через margin, чтобы не конфликтовать
                 с transform от framer-motion. */
              const tilts = [-0.5, 0.55, -0.35, 0.5, 0.45, -0.5, 0.35, -0.45];
              return (
                <motion.div
                  key={m.href}
                  initial={{ opacity: 0, y: 26, rotate: tilts[i] * 2.4 }}
                  whileInView={{ opacity: 1, y: 0, rotate: tilts[i] }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20, delay: (i % 4) * 0.06 }}
                  whileHover={{ rotate: 0, y: -4 }}
                  className={cn('h-full will-change-transform', i % 2 === 1 && 'lg:mt-5')}
                  style={{ transformOrigin: 'center' }}
                >
                  <InteractiveCard className="h-full rounded-2xl" max={5}>
                    <button
                      type="button"
                      onClick={() => navigate(m.href)}
                      className="spot-target panel panel-hover group flex h-full w-full flex-col gap-3 p-5 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.2em] text-white/35">
                          /{String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium">{m.title}</p>
                        <ArrowUpRight className="h-4 w-4 shrink-0 -translate-x-1 translate-y-1 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#c084fc] group-hover:opacity-100" />
                      </div>
                      <p className="text-sm leading-snug text-muted-foreground">{m.text}</p>
                    </button>
                  </InteractiveCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 03 — Каталог наград: одна стеклянная лента ----------------------- */}
        <section className="mt-24 sm:mt-32">
          <SectionHead
            index="03"
            eyebrow="Награды и аукционы"
            title="Превращайте бонусы в реальные эмоции"
          />
          <FadeUp className="mt-10">
            <div
              className="rounded-3xl p-px"
              style={{
                background:
                  'linear-gradient(120deg, rgba(255,255,255,0.4), rgba(255,255,255,0.14), rgba(168,85,247,0.4))',
              }}
            >
              <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#070707]/90 px-6 py-12 backdrop-blur-xl sm:px-12">
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)',
                  }}
                  aria-hidden="true"
                />
                <div className="relative flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
                  <div className="max-w-xl">
                    <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                      Каталог наград
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      Обменяйте накопленные баллы на мерч, сертификаты и впечатления — или
                      поставьте их на аукционе против коллег.
                    </p>
                    <Magnetic strength={0.2} className="mt-7">
                      <motion.button
                        type="button"
                        onClick={() => navigate(catalogHref)}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-neutral-200"
                      >
                        <Store className="h-4 w-4" />
                        Открыть каталог
                      </motion.button>
                    </Magnetic>
                  </div>
                  <div className="relative hidden h-32 w-40 shrink-0 sm:block" aria-hidden="true">
                    <motion.span
                      animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute bottom-4 left-4 block"
                    >
                      <Coin className="h-16 w-16" />
                    </motion.span>
                    <motion.span
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                      className="absolute right-2 top-2 block opacity-80"
                    >
                      <Coin className="h-9 w-9" />
                    </motion.span>
                    <span className="rec-dot absolute bottom-2 right-10 !h-1.5 !w-1.5" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* 04 — Правила: вертикальный список с красными маркерами ----------- */}
        <section className="mt-24 sm:mt-32">
          <SectionHead
            index="04"
            eyebrow="Правила геймификации"
            title="Коротко о главных механиках"
          />
          <div className="relative mt-10">
            <div
              className="absolute bottom-4 left-[5px] top-4 w-px bg-white/10"
              aria-hidden="true"
            />
            <div className="relative">
              {RULES.map((rule, i) => {
                const Icon = rule.icon;
                return (
                  <FadeUp key={rule.title} delay={i * 0.05}>
                    <div className="group relative flex flex-col gap-3 pb-8 pl-8 sm:flex-row sm:items-center sm:gap-8 sm:pl-10">
                      <span
                        className="absolute left-0 top-[7px] h-[11px] w-[11px] rounded-full border border-[#a855f7]/60 bg-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.6)] transition-transform duration-300 group-hover:scale-125 sm:top-1/2 sm:-translate-y-1/2"
                        aria-hidden="true"
                      />
                      <span className="w-10 shrink-0 font-mono text-xs tracking-[0.24em] text-white/45 transition-colors group-hover:text-white">
                        0{i + 1}
                      </span>
                      <div className="flex shrink-0 items-center gap-3 transition-transform duration-300 group-hover:translate-x-1.5 sm:w-56">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors group-hover:bg-white group-hover:text-black">
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-medium">{rule.title}</p>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground sm:flex-1">
                        {rule.text}
                      </p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* Финальный CTA — чистый, центрированный --------------------------- */}
        <section className="mt-24 border-t border-white/[0.07] pb-8 pt-20 sm:mt-32 sm:pt-24">
          <FadeUp>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow flex items-center justify-center gap-2.5">
                <span className="rec-dot !h-1.5 !w-1.5" aria-hidden="true" />
                READY — PRESS START
              </p>
              <h3 className="title-gradient mt-6 text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[1.06] tracking-[-0.02em] [overflow-wrap:anywhere]">
                Готовы начать игру<span className="text-[#a855f7]">?</span>
              </h3>
              <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">
                Присоединяйтесь к {siteName} и получите первые баллы уже сегодня.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                {user ? (
                  <Magnetic strength={0.2}>
                    <motion.button
                      type="button"
                      onClick={() => navigate('/room')}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition-colors hover:bg-neutral-200"
                    >
                      Игровая комната
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Magnetic>
                ) : (
                  <>
                    <Magnetic strength={0.2}>
                      <motion.button
                        type="button"
                        onClick={() => navigate('/auth')}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition-colors hover:bg-neutral-200"
                      >
                        <Sparkles className="h-4 w-4" />
                        Создать аккаунт
                      </motion.button>
                    </Magnetic>
                    <Magnetic strength={0.2}>
                      <motion.button
                        type="button"
                        onClick={() => navigate('/auth')}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex cursor-pointer items-center rounded-full border border-white/16 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/[0.07] hover:text-white"
                      >
                        Войти
                      </motion.button>
                    </Magnetic>
                  </>
                )}
              </div>
            </div>
          </FadeUp>
        </section>
      </PageContainer>
    </div>
  );
}
