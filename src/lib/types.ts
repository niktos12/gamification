/* Shared API types — mirror of the Express backend responses. */

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'admin' | string;
  position: string;
  department: string;
  avatarUrl: string;
  bio: string;
  phone: string;
  birthDate: string;
  telegram: string;
  balance: number;
  totalEarned: number;
  hireDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface Transaction {
  id: number;
  userId: number;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | string;
  scope: 'public' | 'personal' | string;
  assignedToId: number | null;
  claimedById: number | null;
  status: 'open' | 'in_progress' | 'submitted' | 'completed' | 'cancelled' | string;
  deadline: string;
  createdById: number | null;
  createdAt: string;
  completedAt: string | null;
  assignedToName?: string;
  claimedByName?: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'finished' | string;
  startDate: string;
  endDate: string;
  prizeDescription: string;
  createdAt: string;
  taskCount?: number;
  participantCount?: number;
  myProgress?: number | null;
}

export interface ChallengeTask {
  id: number;
  challengeId: number;
  title: string;
  reward: number;
}

export interface ChallengeParticipant {
  userId: number;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  progress: number;
}

export interface ChallengeDetail {
  challenge: Challenge;
  tasks: ChallengeTask[];
  participants: ChallengeParticipant[];
  joined: boolean;
  myProgress: number | null;
}

export interface WheelPrize {
  id: number;
  label: string;
  amount: number;
  color: string;
  weight: number;
  sortOrder: number;
}

export interface WheelSpin {
  id: number;
  userId: number;
  prizeId: number | null;
  prizeLabel: string;
  amount: number;
  createdAt: string;
}

export interface WheelInfo {
  prizes: WheelPrize[];
  canSpin: boolean;
  lastSpin: WheelSpin | null;
  history: WheelSpin[];
}

export interface SpinResult {
  prize: { label: string; amount: number; color: string };
  balance: number;
}

export interface SurveyOption {
  id: number;
  text: string;
  votes: number;
}

export interface Survey {
  id: number;
  title: string;
  question: string;
  isActive: boolean;
  createdAt: string;
  options: SurveyOption[];
  totalVotes: number;
  myOptionId: number | null;
}

export interface AuctionBid {
  id: number;
  amount: number;
  userName: string;
  createdAt: string;
}

export interface Auction {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  startPrice: number;
  currentPrice: number;
  highestBidderId: number | null;
  highestBidderName?: string;
  status: 'active' | 'finished' | string;
  endsAt: string;
  createdAt: string;
}

export interface AuctionDetail extends Auction {
  bids: AuctionBid[];
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  comment: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled' | string;
  createdAt: string;
  userName?: string;
  items?: OrderItem[];
}

export interface CheckoutResult {
  order: Order;
  balance: number;
  cashback: number;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  reward: number;
  sortOrder: number;
  completed: boolean;
  completedAt: string | null;
}

export interface QuestsState {
  quests: Quest[];
  completedCount: number;
  total: number;
  progressPercent: number;
}

export interface QuestCompleteResult {
  quest: Quest;
  allCompleted: boolean;
  balance: number;
}

export interface Badge {
  id: number;
  code: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface UserBadge extends Badge {
  awardedAt: string;
}

export interface PublicProfile {
  user: User;
  badges: UserBadge[];
  activity: Transaction[];
  stats: { tasksCompleted: number; totalEarned: number };
}

export interface Leaderboard {
  slug: string;
  title: string;
  description: string;
  metric: string;
}

export interface LeaderboardEntry {
  userId: number;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  avatarUrl: string;
  value: number;
  rank?: number;
}

export interface PomodoroStats {
  todayFocusCount: number;
  todayFocusMinutes: number;
  todayBreaks: number;
  totalFocusMinutes: number;
  week: { date: string; minutes: number }[];
}

export interface AdminStats {
  usersCount: number;
  tasksOpen: number;
  tasksInProgress: number;
  tasksSubmitted: number;
  tasksCompleted: number;
  activeChallenges: number;
  activeAuctions: number;
  activeSurveys: number;
  ordersNew: number;
  coinsInCirculation: number;
  productsCount: number;
  cartItemsCount: number;
}

export type SettingsMap = Record<string, string>;

export interface AuthResponse {
  token: string;
  user: User;
}
