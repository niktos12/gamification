import { useAuthStore } from '@/store/auth';
import type {
  AdminStats,
  Auction,
  AuctionDetail,
  AuthResponse,
  CartState,
  Challenge,
  ChallengeDetail,
  CheckoutResult,
  Leaderboard,
  LeaderboardEntry,
  Order,
  PomodoroStats,
  Product,
  PublicProfile,
  QuestCompleteResult,
  QuestsState,
  SettingsMap,
  SpinResult,
  Survey,
  Task,
  Transaction,
  User,
  WheelInfo,
} from '@/lib/types';

/**
 * API client.
 *
 * - In production the frontend talks to the Express backend via
 *   NEXT_PUBLIC_API_URL (e.g. http://localhost:3001).
 * - In the sandbox preview there is no configurable origin, so requests are
 *   routed through the local gateway with the ?XTransformPort=3001 marker.
 */
const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

function buildUrl(path: string): string {
  if (API_URL) return `${API_URL}${path}`;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}XTransformPort=3001`;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

type InvalidateTarget = 'me' | 'cart';

function onUnauthorized() {
  useAuthStore.getState().clear();
  if (typeof window !== 'undefined') {
    window.location.hash = '#/auth';
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { invalidate?: InvalidateTarget[] } = {}
): Promise<T> {
  const { invalidate, ...init } = options;
  const token = useAuthStore.getState().token;

  const res = await fetch(buildUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    let message = 'Ошибка сервера';
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      /* keep default message */
    }
    if (res.status === 401) {
      onUnauthorized();
      throw new ApiError(401, 'Требуется авторизация');
    }
    throw new ApiError(res.status, message);
  }

  if (invalidate?.length) {
    // Lazy import avoidance: dispatch a global event so the QueryProvider can
    // invalidate wallet/cart related queries without a direct dependency.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('dotify:invalidate', { detail: invalidate })
      );
    }
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (payload: { email: string; password: string; firstName: string; lastName?: string }) =>
      request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
        invalidate: ['me'],
      }),
    me: () => request<{ user: User }>('/api/auth/me'),
    updateMe: (payload: Partial<User>) =>
      request<{ user: User }>('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify(payload),
        invalidate: ['me'],
      }),
  },

  users: {
    list: () => request<{ users: User[] }>('/api/users'),
    get: (id: number) => request<PublicProfile>(`/api/users/${id}`),
  },

  tasks: {
    list: () => request<{ tasks: Task[] }>('/api/tasks'),
    create: (payload: Record<string, unknown>) =>
      request<{ task: Task }>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    claim: (id: number) =>
      request<{ task: Task }>(`/api/tasks/${id}/claim`, {
        method: 'POST',
        invalidate: ['me'],
      }),
    submit: (id: number) =>
      request<{ task: Task }>(`/api/tasks/${id}/submit`, { method: 'POST' }),
    review: (id: number, approve: boolean) =>
      request<{ task: Task }>(`/api/tasks/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ approve }),
        invalidate: ['me'],
      }),
    delete: (id: number) =>
      request<{ ok: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' }),
  },

  challenges: {
    list: () => request<{ challenges: Challenge[] }>('/api/challenges'),
    get: (id: number) => request<ChallengeDetail>(`/api/challenges/${id}`),
    join: (id: number) =>
      request<{ joined: boolean }>(`/api/challenges/${id}/join`, { method: 'POST' }),
    completeTask: (challengeId: number, taskId: number) =>
      request<{ progress: number; earned: number; balance: number }>(
        `/api/challenges/${challengeId}/tasks/${taskId}/complete`,
        { method: 'POST', invalidate: ['me'] }
      ),
    create: (payload: Record<string, unknown>) =>
      request<{ challenge: Challenge }>('/api/challenges', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: number, payload: Record<string, unknown>) =>
      request<{ challenge: Challenge }>(`/api/challenges/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    delete: (id: number) =>
      request<{ ok: boolean }>(`/api/challenges/${id}`, { method: 'DELETE' }),
  },

  wheel: {
    info: () => request<WheelInfo>('/api/wheel'),
    spin: () =>
      request<SpinResult>('/api/wheel/spin', {
        method: 'POST',
        invalidate: ['me'],
      }),
  },

  leaderboards: {
    list: () => request<{ boards: Leaderboard[] }>('/api/leaderboards'),
    get: (slug: string) =>
      request<{ board: Leaderboard; entries: LeaderboardEntry[] }>(
        `/api/leaderboards/${slug}`
      ),
  },

  surveys: {
    list: () => request<{ surveys: Survey[] }>('/api/surveys'),
    vote: (id: number, optionId: number) =>
      request<{ ok: boolean; balance: number }>(`/api/surveys/${id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ optionId }),
        invalidate: ['me'],
      }),
    create: (payload: { title: string; question?: string; options: string[] }) =>
      request<{ survey: Survey }>('/api/surveys', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: number, payload: Record<string, unknown>) =>
      request<{ survey: Survey }>(`/api/surveys/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    delete: (id: number) =>
      request<{ ok: boolean }>(`/api/surveys/${id}`, { method: 'DELETE' }),
  },

  auctions: {
    list: () => request<{ auctions: Auction[] }>('/api/auctions'),
    get: (id: number) => request<AuctionDetail>(`/api/auctions/${id}`),
    bid: (id: number, amount: number) =>
      request<{ auction: Auction }>(`/api/auctions/${id}/bid`, {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
    create: (payload: Record<string, unknown>) =>
      request<{ auction: Auction }>('/api/auctions', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: number, payload: Record<string, unknown>) =>
      request<{ auction: Auction }>(`/api/auctions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    delete: (id: number) =>
      request<{ ok: boolean }>(`/api/auctions/${id}`, { method: 'DELETE' }),
  },

  pomodoro: {
    stats: () => request<PomodoroStats>('/api/pomodoro/stats'),
    addSession: (minutes: number, type: 'focus' | 'break' = 'focus') =>
      request<{ ok: boolean }>('/api/pomodoro/sessions', {
        method: 'POST',
        body: JSON.stringify({ minutes, type }),
      }),
  },

  quests: {
    list: () => request<QuestsState>('/api/quests'),
    complete: (id: number) =>
      request<QuestCompleteResult>(`/api/quests/${id}/complete`, {
        method: 'POST',
        invalidate: ['me'],
      }),
  },

  products: {
    list: (params?: { category?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.search) q.set('search', params.search);
      const suffix = q.toString() ? `?${q.toString()}` : '';
      return request<{ products: Product[]; categories: string[] }>(
        `/api/products${suffix}`
      );
    },
    get: (id: number) => request<{ product: Product }>(`/api/products/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<{ product: Product }>('/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: number, payload: Record<string, unknown>) =>
      request<{ product: Product }>(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    delete: (id: number) =>
      request<{ ok: boolean }>(`/api/products/${id}`, { method: 'DELETE' }),
  },

  cart: {
    get: () => request<CartState>('/api/cart'),
    add: (productId: number, quantity = 1) =>
      request<CartState>('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
        invalidate: ['cart'],
      }),
    update: (itemId: number, quantity: number) =>
      request<CartState>(`/api/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
        invalidate: ['cart'],
      }),
    remove: (itemId: number) =>
      request<CartState>(`/api/cart/${itemId}`, {
        method: 'DELETE',
        invalidate: ['cart'],
      }),
  },

  orders: {
    my: () => request<{ orders: Order[] }>('/api/orders'),
    checkout: (comment?: string) =>
      request<CheckoutResult>('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({ comment: comment || '' }),
        invalidate: ['me', 'cart'],
      }),
    setStatus: (id: number, status: string) =>
      request<{ order: Order }>(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  },

  transactions: {
    my: () => request<{ transactions: Transaction[] }>('/api/transactions/my'),
  },

  settings: {
    get: () => request<{ settings: SettingsMap }>('/api/settings'),
    update: (settings: SettingsMap) =>
      request<{ settings: SettingsMap }>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings }),
      }),
  },

  admin: {
    stats: () => request<AdminStats>('/api/admin/stats'),
    users: () => request<{ users: User[] }>('/api/admin/users'),
    updateUser: (id: number, payload: Record<string, unknown>) =>
      request<{ user: User }>(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        invalidate: ['me'],
      }),
    deleteUser: (id: number) =>
      request<{ ok: boolean }>(`/api/admin/users/${id}`, { method: 'DELETE' }),
    orders: () => request<{ orders: Order[] }>('/api/admin/orders'),
    tasks: () => request<{ tasks: Task[] }>('/api/admin/tasks'),
  },
};
