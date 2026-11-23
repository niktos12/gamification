/** Formats a coin amount: 2756 -> "2 756". */
export function formatCoins(value: number | string | null | undefined): string {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return '0';
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(Math.round(num));
  return sign + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
}

/** 2023-02-03 -> "03.02.2023" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** ISO datetime -> "21.11.2026, 14:30" */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Seconds -> "25:00" */
export function formatTimer(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function initials(firstName: string, lastName: string): string {
  const a = (firstName || '').trim()[0] || '';
  const b = (lastName || '').trim()[0] || '';
  return (a + b).toUpperCase() || '?';
}

export function fullName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function difficultyLabel(d: string): string {
  if (d === 'easy') return 'Легкая';
  if (d === 'hard') return 'Сложная';
  return 'Средняя';
}

export const TRANSACTION_LABELS: Record<string, string> = {
  task_reward: 'Биржа задач',
  wheel: 'Колесо фортуны',
  challenge: 'Челленджи',
  quest: 'Квесты',
  survey: 'Опросы',
  purchase: 'Покупка',
  cashback: 'Кэшбек',
  auction: 'Аукцион',
  admin: 'Администрация',
};
