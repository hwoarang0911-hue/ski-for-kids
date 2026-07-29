/**
 * 백엔드 선택 지점.
 * 환경변수(VITE_SUPABASE_URL·ANON_KEY)가 있으면 Supabase, 없으면 localStorage.
 * 앱 코드는 여기서 나온 `backend`만 쓰고 구현을 모른다 = 백엔드 교체 지점.
 */
import type { BackendAdapter } from './types';
import { localAdapter } from './local';
import { supabaseAdapter, supabaseConfigured } from './supabase';

export const backend: BackendAdapter = supabaseConfigured ? supabaseAdapter : localAdapter;

export type {
  Booking,
  Review,
  Application,
  Snapshot,
  BookingStatus,
  PaymentStatus,
  ApplicationStatus,
  BackendAdapter,
} from './types';
