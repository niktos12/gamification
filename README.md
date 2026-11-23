# Dotify Gamification — Frontend

Витрина корпоративной платформы геймификации **Dotify** на **Next.js 16 (App Router) + TypeScript**.
Дизайн «Vercel x Nothing x Glassmorphism»: чистый чёрный холст, hairline-границы, стеклянные панели с backdrop-blur, дот-матричные номера секций и бегущая строка, моно-микрокопирайт и единственный цветовой акцент — Nothing-red `#d71921`. Шрифты Inter + Manrope + Doto (дот-матрица) + JetBrains Mono.

## Стек

- **Next.js 16 / React 19** (App Router, единственный маршрут `/`, внутренняя hash-навигация)
- **Tailwind CSS 4** + shadcn/ui (New York)
- **Drizzle-совместимый REST-клиент** для Express-бэкенда (`src/lib/api.ts`)
- **TanStack Query** — серверное состояние
- **Zustand** (persist) — авторизация
- **Framer Motion** — анимации
- **three.js** — лёгкая процедурная 3D-модель в герое «Dot Core» (стеклянное ядро в оболочке из точек с красными LED, точечные орбиты): без внешних файлов модели, lazy-чанк, пауза рендера вне вьюпорта
- **Lenis** — плавный скролл лендинга
- **Sonner** — тосты, **lucide-react** — иконки

## Быстрый старт

### 1. Установка

```bash
cd frontend   # корень этого архива
bun install   # или: npm install
```

### 2. Подключение бэкенда

Создайте `.env.local` в корне проекта:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Бэкенд (см. README архива `backend`) должен быть запущен на этом порту.

### 3. Запуск

```bash
bun dev    # или: npm run dev
```

Откройте http://localhost:3000

## Демо-доступы

| Роль | Email | Пароль |
|------|-------|--------|
| Сотрудник | `demo@dotify.local` | `demo123` |
| Администратор | `admin@dotify.local` | `admin123` |

На странице входа есть кнопки быстрого входа под обеими ролями.

## Разделы приложения

| Хэш-маршрут | Раздел |
|-------------|--------|
| `#/` | Лендинг: hero, модули, правила, бегущая строка |
| `#/auth` | Вход / Регистрация |
| `#/cabinet` | Личный кабинет: баланс, история, профиль, Telegram |
| `#/room` | Игровая комната — хаб всех механик |
| `#/room/tasks` | Биржа задач (публичные + личные) |
| `#/room/challenges` | Челленджи с наградами и прогрессом |
| `#/room/wheel` | Колесо фортуны (раз в день) |
| `#/room/leaderboards` | Лидерборды (бонусы/баланс/задачи/фокус) |
| `#/room/surveys` | Опросники (+25 коинов за голос) |
| `#/room/auctions` | Аукционы за коины |
| `#/room/pomodoro` | Помодоро-таймер 25/5 со статистикой |
| `#/room/quest` | Адаптационный квест «Welcome к нам!» |
| `#/employees` | Список сотрудников |
| `#/employees/:id` | Публичная страница достижений |
| `#/catalog` | Каталог призов |
| `#/cart` | Корзина и оформление заказа (+кэшбек) |
| `#/admin` | Админ-панель (только роль admin) |

## Админ-панель

Разделы: Обзор (метрики), Сотрудники (роли, балансы, блокировки), Задачи (создание + очередь проверки),
Челленджи, Каталог (CRUD товаров), Аукционы, Опросники, Заказы (статусы), Настройки
(название, тексты главной, бегущая строка, процент кэшбека, контакты).

## Структура

```
src/
├── app/                  # layout (шрифты, тема), page.tsx, globals.css
├── components/
│   ├── app-shell.tsx     # header/nav/footer + hash-роутер + guard'ы
│   ├── providers.tsx     # QueryClient + Toaster
│   ├── pages/            # 17 страниц-компонентов
│   ├── shared/
│   │   ├── ui-kit.tsx    # Coin, CoinAmount, Avatar, PageHeader, StatCard...
│   │   ├── decor.tsx     # фоновые декоры (mesh/grid/aurora/...), Marquee
│   │   └── smooth-scroll.tsx
│   └── ui/               # shadcn/ui
├── lib/                  # api.ts, types.ts, router.tsx, format.ts
└── store/                # auth.ts (zustand persist)
```

## Деплой на Vercel

1. Импортируйте репозиторий в Vercel (Next.js определяется автоматически).
2. Environment Variable: `NEXT_PUBLIC_API_URL=https://<адрес-вашего-бэкенда>`.
3. База данных — проект Vercel Neon: строку подключения укажите в бэкенде (`.env → DATABASE_URL`).

## Примечания

- Изображения товаров/аукционов лежат в `public/img/` (заглушки стиля dark-studio).
- Валюта платформы — «коины», отображаются кастомным компонентом `CoinAmount`.
- Все суммы и даты форматируются в `src/lib/format.ts` (ru-RU).
