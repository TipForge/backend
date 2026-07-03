// API Request/Response types - contracts for SDK and frontend

// Auth types
export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  isCreator: boolean;
  verified: boolean;
  createdAt: string;
}

// Creator types
export interface CreatorProfileRequest {
  username: string;
  description?: string;
  isPublic?: boolean;
}

export interface CreatorProfileResponse {
  id: string;
  user: UserResponse;
  username: string;
  description: string | null;
  totalEarnings: number;
  pendingBalance: number;
  isPublic: boolean;
  socialProfiles: SocialProfileResponse[];
  createdAt: string;
}

// Social profile types
export interface SocialProfileRequest {
  platform: 'x' | 'instagram' | 'tiktok' | 'youtube' | 'github' | 'twitch';
  username: string;
  profileUrl?: string;
}

export interface SocialProfileResponse {
  id: string;
  platform: string;
  username: string;
  profileUrl: string | null;
  verified: boolean;
  verifiedAt: string | null;
}

// Wallet types
export interface WalletConnectionRequest {
  publicKey: string;
  name?: string;
}

export interface WalletResponse {
  id: string;
  publicKey: string;
  name: string | null;
  isDefault: boolean;
  verified: boolean;
  createdAt: string;
}

// Transaction types
export interface CreateTipRequest {
  creatorId: string;
  amount: number;
  message?: string;
}

export interface TransactionResponse {
  id: string;
  tipperId: string;
  creatorId: string;
  amount: number;
  currency: string;
  message: string | null;
  stellarTxHash: string | null;
  stellarStatus: string;
  createdAt: string;
  confirmedAt: string | null;
}

export interface TransactionHistoryResponse {
  transactions: TransactionResponse[];
  total: number;
  page: number;
  pageSize: number;
}

// Payout types
export interface PayoutRecordResponse {
  id: string;
  amount: number;
  status: string;
  stellarTxHash: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface CreatorEarningsResponse {
  totalEarnings: number;
  pendingBalance: number;
  lastPayout: PayoutRecordResponse | null;
  payoutHistory: PayoutRecordResponse[];
}

// Error response
export interface ErrorResponse {
  error: string;
  code: string;
  details?: Record<string, string>;
}

// Pagination
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export const DEFAULT_PAGE_SIZE = 20;
