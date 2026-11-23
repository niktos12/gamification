'use client';

import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  Sparkles,
  Store,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { LogoMark } from '@/components/app-shell';
import { PageContainer, PageDecor } from '@/components/shared/decor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { navigate } from '@/lib/router';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Perks shown on the branding side                                    */
/* ------------------------------------------------------------------ */

const PERKS = [
  { icon: Zap, text: 'Коины за каждую выполненную задачу' },
  { icon: Sparkles, text: 'Ежедневное колесо фортуны с призами' },
  { icon: Store, text: 'Каталог мерча, сертификатов и впечатлений' },
  { icon: Users, text: 'Челленджи, рейтинги и аукционы с коллегами' },
];

const FLOATING_DOTS = [
  { className: 'left-10 top-20 h-2 w-2 bg-white/50', duration: 7, delay: 0 },
  { className: 'right-14 top-28 h-1.5 w-1.5 bg-white/35', duration: 9, delay: 1 },
  { className: 'left-1/3 bottom-20 h-2 w-2 bg-[#a855f7]/70', duration: 8, delay: 0.5 },
  { className: 'right-1/4 bottom-32 h-1.5 w-1.5 bg-white/30', duration: 10, delay: 1.5 },
];

const DEMO_CREDS = {
  employee: { email: 'demo@dotify.local', password: 'demo123' },
  admin: { email: 'admin@dotify.local', password: 'admin123' },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AuthPage(props: { params?: Record<string, string> }) {
  const setAuth = useAuthStore((s) => s.setAuth);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: (vars: { email: string; password: string }) => api.auth.login(vars.email, vars.password),
    onSuccess: (res) => {
      setAuth(res.token, res.user);
      toast.success('С возвращением!');
      navigate('/room');
    },
    onError: (err: Error) => toast.error(err.message || 'Не удалось войти'),
  });

  const registerMutation = useMutation({
    mutationFn: (vars: { email: string; password: string; firstName: string; lastName?: string }) =>
      api.auth.register(vars),
    onSuccess: (res) => {
      setAuth(res.token, res.user);
      toast.success('Аккаунт создан! Добро пожаловать');
      navigate('/room/quest');
    },
    onError: (err: Error) => toast.error(err.message || 'Не удалось зарегистрироваться'),
  });

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      toast.error('Заполните email и пароль');
      return;
    }
    loginMutation.mutate({ email: loginEmail.trim(), password: loginPassword });
  }

  function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    if (!regFirstName.trim()) {
      toast.error('Укажите имя');
      return;
    }
    if (!regEmail.trim()) {
      toast.error('Укажите email');
      return;
    }
    if (regPassword.length < 6) {
      toast.error('Пароль должен быть не короче 6 символов');
      return;
    }
    registerMutation.mutate({
      firstName: regFirstName.trim(),
      lastName: regLastName.trim() || undefined,
      email: regEmail.trim(),
      password: regPassword,
    });
  }

  const pending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="relative flex min-h-screen items-center justify-center py-8 sm:py-12">
      <PageDecor variant="spotlight" />
      <PageContainer>
        <div className="mx-auto w-full max-w-4xl">
          <div className="grid items-stretch gap-5 lg:grid-cols-[1.05fr_1fr]">
            {/* Branding side (desktop) ---------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              className="panel relative hidden flex-col overflow-hidden p-8 lg:flex xl:p-10"
            >
              {FLOATING_DOTS.map((dot, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className={cn('absolute rounded-full', dot.className)}
                  animate={{ y: [0, -14, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: dot.duration, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}

              <LogoMark className="text-2xl [&_span:last-child]:text-3xl" />

              <h2 className="mt-10 font-display text-3xl font-bold leading-tight">
                Добро пожаловать в <span className="text-gradient">Dotify</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Корпоративная платформа геймификации. Войдите, чтобы копить коины, участвовать в
                активностях и получать призы.
              </p>

              <ul className="mt-8 flex flex-col gap-3">
                {PERKS.map((perk) => {
                  const Icon = perk.icon;
                  return (
                    <li key={perk.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      {perk.text}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto flex items-center gap-2 pt-8 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7]" />
                Внутренний контур компании. Регистрация по рабочей почте.
              </div>
            </motion.div>

            {/* Form side ------------------------------------------------ */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="panel p-6 sm:p-7"
            >
              <div className="mb-5 lg:hidden">
                <LogoMark />
                <p className="mt-4 font-display text-xl font-bold">Вход в платформу</p>
              </div>

              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Вход</TabsTrigger>
                  <TabsTrigger value="register">Регистрация</TabsTrigger>
                </TabsList>

                {/* Login ---------------------------------------------- */}
                <TabsContent value="login" className="mt-5">
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        required
                        placeholder="you@company.ru"
                        autoComplete="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="login-password">Пароль</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Введите пароль"
                          autoComplete="current-password"
                          className="pr-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending}>
                      {loginMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogIn className="h-4 w-4" />
                      )}
                      {loginMutation.isPending ? 'Входим...' : 'Войти'}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register ------------------------------------------- */}
                <TabsContent value="register" className="mt-5">
                  <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="reg-first">Имя</Label>
                        <Input
                          id="reg-first"
                          required
                          placeholder="Иван"
                          autoComplete="given-name"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="reg-last">Фамилия</Label>
                        <Input
                          id="reg-last"
                          placeholder="Петров (необязательно)"
                          autoComplete="family-name"
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        required
                        placeholder="you@company.ru"
                        autoComplete="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="reg-password">Пароль</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        required
                        minLength={6}
                        placeholder="Минимум 6 символов"
                        autoComplete="new-password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Пароль должен содержать минимум 6 символов</p>
                    </div>
                    <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending}>
                      {registerMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      {registerMutation.isPending ? 'Создаём аккаунт...' : 'Создать аккаунт'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Demo credentials ------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="panel mt-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            <div className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p>
                Демо-доступы: Сотрудник —{' '}
                <span className="text-foreground">demo@dotify.local / demo123</span>, Администратор —{' '}
                <span className="text-foreground">admin@dotify.local / admin123</span>
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => loginMutation.mutate(DEMO_CREDS.employee)}
              >
                Войти как сотрудник
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => loginMutation.mutate(DEMO_CREDS.admin)}
              >
                Войти как админ
              </Button>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </div>
  );
}
