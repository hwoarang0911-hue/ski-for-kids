import { useSyncExternalStore } from 'react';

/**
 * 예약·후기 데이터 접근 계층.
 * 지금은 localStorage에 저장하지만, 이 파일이 유일한 데이터 소스라서
 * 나중에 여기만 서버(API/Supabase 등)로 교체하면 상용 백엔드로 넘어간다.
 * (컴포넌트는 이 훅들만 쓰고 저장 방식을 모른다 = 백엔드 교체 지점)
 */

export type BookingStatus = 'requested' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorHue: string;
  resortId: string;
  productId: string;
  productTitle: string;
  date: string; // YYYY-MM-DD
  time: string;
  memberNames: string[];
  priceTotal: number;
  status: BookingStatus;
  reviewed?: boolean;
  createdAt: number;
}

export interface Review {
  id: string;
  instructorId: string;
  author: string;
  rating: number;
  text: string;
  createdAt: number;
}

const BK = 'ski-for-kids.bookings';
const RV = 'ski-for-kids.reviews';

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

let bookings: Booking[] = load<Booking>(BK);
let reviews: Review[] = load<Review>(RV);

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── bookings ────────────────────────────────────────────────
export function addBooking(draft: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
  const b: Booking = { ...draft, id: uid(), status: 'requested', createdAt: Date.now() };
  bookings = [b, ...bookings];
  localStorage.setItem(BK, JSON.stringify(bookings));
  emit();
  return b;
}
export function updateBooking(id: string, patch: Partial<Booking>) {
  bookings = bookings.map((b) => (b.id === id ? { ...b, ...patch } : b));
  localStorage.setItem(BK, JSON.stringify(bookings));
  emit();
}
export function useBookings(): Booking[] {
  return useSyncExternalStore(subscribe, () => bookings, () => bookings);
}

// ── reviews ─────────────────────────────────────────────────
export function addReview(draft: Omit<Review, 'id' | 'createdAt'>): Review {
  const r: Review = { ...draft, id: uid(), createdAt: Date.now() };
  reviews = [r, ...reviews];
  localStorage.setItem(RV, JSON.stringify(reviews));
  emit();
  return r;
}
export function useReviews(instructorId?: string): Review[] {
  const all = useSyncExternalStore(subscribe, () => reviews, () => reviews);
  return instructorId ? all.filter((r) => r.instructorId === instructorId) : all;
}
