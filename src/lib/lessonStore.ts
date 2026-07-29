import { useSyncExternalStore } from 'react';
import { backend } from './backend';
import type { Booking, Review, Application } from './backend';
import { pushNotification } from './notifications';

function mdLabel(date: string) {
  return date.slice(5).replace('-', '/');
}

/**
 * 예약·후기·입점신청의 인메모리 뷰모델 + React 훅.
 * 저장(persistence)은 backend 어댑터에 위임한다(localStorage 또는 Supabase).
 * 컴포넌트는 이 훅/함수만 쓰고 저장 방식은 모른다.
 *
 * 쓰기는 낙관적(optimistic): 메모리를 먼저 갱신·emit 한 뒤 백엔드에 비동기 반영.
 * 초기에는 backend.loadAll()로 하이드레이션한다.
 */

export type { Booking, Review, Application, BookingStatus, PaymentStatus } from './backend';

let bookings: Booking[] = [];
let reviews: Review[] = [];
let applications: Application[] = [];

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

// ── 하이드레이션 ────────────────────────────────────────────
let hydrated = false;
export async function hydrate() {
  if (hydrated) return;
  hydrated = true;
  try {
    const snap = await backend.loadAll();
    bookings = snap.bookings;
    reviews = snap.reviews;
    applications = snap.applications;
    emit();
  } catch (e) {
    console.error('[lessonStore] hydrate 실패:', e);
  }
}
// 모듈 로드 시 즉시 시작
void hydrate();

// ── bookings ────────────────────────────────────────────────
export function addBooking(draft: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
  const b: Booking = { ...draft, id: uid(), status: 'requested', payStatus: draft.payStatus ?? 'none', createdAt: Date.now() };
  bookings = [b, ...bookings];
  emit();
  void backend.putBooking(b).catch((e) => console.error('[lessonStore] putBooking:', e));

  pushNotification('booking', '예약 요청을 보냈어요', `${b.instructorName}님에게 ${mdLabel(b.date)} ${b.time} 강습 요청이 전달됐어요. 수락을 기다리는 중이에요.`);

  // 데모: 로컬 백엔드에선 강사 수락을 시뮬레이션한다.
  // (실서비스에선 강사 앱/서버가 confirm 하고 그 이벤트로 알림이 온다)
  if (backend.name === 'local') {
    setTimeout(() => {
      const cur = bookings.find((x) => x.id === b.id);
      if (!cur || cur.status !== 'requested') return;
      updateBooking(b.id, { status: 'confirmed' });
      pushNotification('confirmed', '예약이 확정됐어요 🎉', `${b.instructorName}님이 ${mdLabel(b.date)} ${b.time} 강습을 수락했어요. 「내 강습」에서 확인하세요.`);
    }, 4000);
  }
  return b;
}
export function updateBooking(id: string, patch: Partial<Booking>) {
  let next: Booking | undefined;
  bookings = bookings.map((b) => (b.id === id ? (next = { ...b, ...patch }) : b));
  emit();
  if (next) void backend.putBooking(next).catch((e) => console.error('[lessonStore] putBooking:', e));
}
export function useBookings(): Booking[] {
  return useSyncExternalStore(subscribe, () => bookings, () => bookings);
}

// ── reviews ─────────────────────────────────────────────────
export function addReview(draft: Omit<Review, 'id' | 'createdAt'>): Review {
  const r: Review = { ...draft, id: uid(), createdAt: Date.now() };
  reviews = [r, ...reviews];
  emit();
  void backend.putReview(r).catch((e) => console.error('[lessonStore] putReview:', e));
  return r;
}
export function useReviews(instructorId?: string): Review[] {
  const all = useSyncExternalStore(subscribe, () => reviews, () => reviews);
  return instructorId ? all.filter((r) => r.instructorId === instructorId) : all;
}

// ── applications (강사 입점 신청) ─────────────────────────────
export function addApplication(draft: Omit<Application, 'id' | 'status' | 'createdAt'>): Application {
  const a: Application = { ...draft, id: uid(), status: 'review', createdAt: Date.now() };
  applications = [a, ...applications];
  emit();
  void backend.putApplication(a).catch((e) => console.error('[lessonStore] putApplication:', e));
  return a;
}
export function updateApplication(id: string, status: Application['status']) {
  let next: Application | undefined;
  applications = applications.map((a) => (a.id === id ? (next = { ...a, status }) : a));
  emit();
  if (next) {
    void backend.putApplication(next).catch((e) => console.error('[lessonStore] putApplication:', e));
    if (status === 'approved')
      pushNotification('approved', '입점이 승인됐어요 🎉', `${next.name}님, 자격 검증이 완료돼 강사로 노출됩니다. 강습 상품을 등록해보세요.`);
    else if (status === 'rejected')
      pushNotification('rejected', '입점 심사 결과 안내', `${next.name}님, 제출 서류 확인이 어려워 이번 심사는 반려됐어요. 자격증을 다시 확인해 신청해주세요.`);
  }
}
export function useApplications(): Application[] {
  return useSyncExternalStore(subscribe, () => applications, () => applications);
}
