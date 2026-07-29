import { useSyncExternalStore } from 'react';
import { backend } from './backend';
import type { Booking, Review, Application, Snapshot } from './backend';
import { pushNotification, pushOnce } from './notifications';
import { defaultMeeting } from '../data/meeting';

function mdLabel(date: string) {
  return date.slice(5).replace('-', '/');
}
function daysUntil(date: string): number {
  const d = new Date(date + 'T00:00:00');
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

/**
 * 예약·후기·입점신청의 인메모리 뷰모델 + React 훅.
 * 저장은 backend 어댑터에 위임(localStorage 또는 Supabase). 컴포넌트는 이 훅/
 * 함수만 쓰고 저장 방식은 모른다.
 *
 * 스키장은 통신이 자주 끊긴다. 그래서:
 *  - 쓰기는 낙관적(메모리 먼저) + 아웃박스 큐에 넣어 실패 시 자동 재시도.
 *    (예약이 "전송됨"으로 보였다가 사라지는 일이 없도록 localStorage에 큐 보존)
 *  - 로드 실패 시 마지막 스냅샷 캐시로 오프라인 열람.
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

// ── 오프라인 아웃박스 (실패한 쓰기 재시도) ──────────────────
type OutKind = 'booking' | 'review' | 'application';
interface OutItem {
  qid: string;
  kind: OutKind;
  entity: Booking | Review | Application;
}
const OUTBOX_KEY = 'ski-for-kids.outbox';
const CACHE_KEY = 'ski-for-kids.cache';

function loadOutbox(): OutItem[] {
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
  } catch {
    return [];
  }
}
let outbox: OutItem[] = loadOutbox();
let flushing = false;

function saveOutbox() {
  localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox));
  emit();
}

async function putOne(it: OutItem): Promise<void> {
  if (it.kind === 'booking') return backend.putBooking(it.entity as Booking);
  if (it.kind === 'review') return backend.putReview(it.entity as Review);
  return backend.putApplication(it.entity as Application);
}

async function flush() {
  if (flushing || outbox.length === 0) return;
  flushing = true;
  try {
    const remaining: OutItem[] = [];
    for (const it of outbox) {
      try {
        await putOne(it);
      } catch {
        remaining.push(it); // 실패 → 다음 기회에 재시도
      }
    }
    outbox = remaining;
    saveOutbox();
  } finally {
    flushing = false;
  }
}

/** 최신 엔티티를 큐에 넣는다. 같은 id의 이전 쓰기는 대체(최신 상태만 전송). */
function enqueue(kind: OutKind, entity: { id: string }) {
  outbox = outbox.filter((o) => !(o.kind === kind && (o.entity as { id: string }).id === entity.id));
  outbox.push({ qid: uid(), kind, entity: entity as OutItem['entity'] });
  saveOutbox();
  void flush();
}

/** 재시도 트리거: 주기적 + 온라인 복귀 시 */
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => void flush());
  setInterval(() => void flush(), 15000);
}

export function usePendingWrites(): number {
  return useSyncExternalStore(subscribe, () => outbox.length, () => outbox.length);
}
export function useOnline(): boolean {
  return useSyncExternalStore(
    (l) => {
      window.addEventListener('online', l);
      window.addEventListener('offline', l);
      return () => {
        window.removeEventListener('online', l);
        window.removeEventListener('offline', l);
      };
    },
    () => (typeof navigator !== 'undefined' ? navigator.onLine : true),
    () => true,
  );
}

// ── 하이드레이션 (+ 오프라인 캐시 폴백) ─────────────────────
function cacheSnapshot() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ bookings, reviews, applications }));
  } catch {
    /* 용량 초과 등은 무시 */
  }
}
function loadCache(): Snapshot | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Snapshot) : null;
  } catch {
    return null;
  }
}

let hydrated = false;
export async function hydrate() {
  if (hydrated) return;
  hydrated = true;
  try {
    const snap = await backend.loadAll();
    bookings = snap.bookings;
    reviews = snap.reviews;
    applications = snap.applications;
    cacheSnapshot();
    emit();
  } catch (e) {
    console.error('[lessonStore] hydrate 실패 — 캐시로 폴백:', e);
    const cached = loadCache();
    if (cached) {
      bookings = cached.bookings;
      reviews = cached.reviews;
      applications = cached.applications;
      emit();
    }
  }
  void flush(); // 쌓여있던 오프라인 쓰기 전송 시도
  checkReminders();
}
void hydrate();

// ── bookings ────────────────────────────────────────────────
export function addBooking(draft: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
  const b: Booking = {
    ...draft,
    id: uid(),
    status: 'requested',
    payStatus: draft.payStatus ?? 'none',
    meetingPoint: draft.meetingPoint ?? defaultMeeting(draft.resortId),
    createdAt: Date.now(),
  };
  bookings = [b, ...bookings];
  cacheSnapshot();
  emit();
  enqueue('booking', b);
  pushNotification('booking', '예약 요청을 보냈어요', `${b.instructorName}님에게 ${mdLabel(b.date)} ${b.time} 강습 요청이 전달됐어요. 수락을 기다리는 중이에요.`);
  return b;
}
export function updateBooking(id: string, patch: Partial<Booking>) {
  let next: Booking | undefined;
  bookings = bookings.map((b) => (b.id === id ? (next = { ...b, ...patch }) : b));
  cacheSnapshot();
  emit();
  if (next) enqueue('booking', next);
}

/** 강사가 예약을 수락 → 확정 + 예약자 알림 (만남 장소 조정 가능) */
export function acceptBooking(id: string, meetingPoint?: string) {
  const b = bookings.find((x) => x.id === id);
  if (!b) return;
  const spot = meetingPoint ?? b.meetingPoint;
  updateBooking(id, { status: 'confirmed', meetingPoint: spot });
  pushNotification('confirmed', '예약이 확정됐어요 🎉', `${b.instructorName}님이 ${mdLabel(b.date)} ${b.time} 강습을 수락했어요. 만남 장소: ${spot}. 「내 강습」에서 확인하세요.`);
}

/** 예약 취소(예약자/강사). 결제건은 환불 처리 + 알림 */
export function cancelBooking(id: string, actor: 'booker' | 'instructor') {
  const b = bookings.find((x) => x.id === id);
  if (!b || b.status === 'cancelled' || b.status === 'completed') return;
  const refunded = b.payStatus === 'paid';
  updateBooking(id, { status: 'cancelled', payStatus: refunded ? 'refunded' : b.payStatus });
  if (actor === 'instructor') {
    pushNotification('rejected', '강사 사정으로 취소됐어요', `${b.instructorName}님이 ${mdLabel(b.date)} 강습을 취소했어요.${refunded ? ' 결제 금액은 전액 환불돼요.' : ''}`);
  } else {
    pushNotification('rejected', '예약을 취소했어요', `${mdLabel(b.date)} ${b.instructorName} 강습을 취소했어요.${refunded ? ' 결제 금액은 3~5일 내 환불돼요.' : ''}`);
  }
}

/** 채팅에서 약속(장소/시간)이 확정됨 → 예약 반영 + 알림 */
export function setMeetingFromChat(bookingId: string, place: string, time?: string) {
  const b = bookings.find((x) => x.id === bookingId);
  if (!b) return;
  updateBooking(bookingId, { meetingPoint: place, ...(time ? { time } : {}) });
  pushNotification('confirmed', '약속 장소가 정해졌어요', `${mdLabel(b.date)} ${time ?? b.time} · ${place}에서 만나요.`);
}

/** 강사가 강습 완료 처리 → 후기 요청 알림 */
export function completeBooking(id: string) {
  const b = bookings.find((x) => x.id === id);
  if (!b || b.status === 'completed' || b.status === 'cancelled') return;
  updateBooking(id, { status: 'completed' });
  pushNotification('review', '강습은 어떠셨나요?', `${b.instructorName} 강습이 완료됐어요. 다른 가족을 위해 후기를 남겨주세요.`);
}

/**
 * 확정된 강습 중 오늘/내일 것을 리마인더 알림으로 안내(1회).
 * 하이드레이션 직후와 예약 상태 변경 시 호출.
 */
export function checkReminders() {
  for (const b of bookings) {
    if (b.status !== 'confirmed') continue;
    const diff = daysUntil(b.date);
    if (diff !== 0 && diff !== 1) continue;
    const when = diff === 0 ? '오늘' : '내일';
    pushOnce(
      'reminder',
      `${mdLabel(b.date)} 강습 리마인더`,
      `${when} ${b.time} ${b.instructorName} 강습이에요. 만남 장소: ${b.meetingPoint ?? '스키장 렌탈샵 앞'}. 리프트권·장비 챙기고 10분 전 도착하세요.`,
    );
  }
}

export function useBookings(): Booking[] {
  return useSyncExternalStore(subscribe, () => bookings, () => bookings);
}

// ── reviews ─────────────────────────────────────────────────
export function addReview(draft: Omit<Review, 'id' | 'createdAt'>): Review {
  const r: Review = { ...draft, id: uid(), createdAt: Date.now() };
  reviews = [r, ...reviews];
  cacheSnapshot();
  emit();
  enqueue('review', r);
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
  cacheSnapshot();
  emit();
  enqueue('application', a);
  return a;
}
export function updateApplication(id: string, status: Application['status']) {
  let next: Application | undefined;
  applications = applications.map((a) => (a.id === id ? (next = { ...a, status }) : a));
  cacheSnapshot();
  emit();
  if (next) {
    enqueue('application', next);
    if (status === 'approved')
      pushNotification('approved', '입점이 승인됐어요 🎉', `${next.name}님, 자격 검증이 완료돼 강사로 노출됩니다. 강습 상품을 등록해보세요.`);
    else if (status === 'rejected')
      pushNotification('rejected', '입점 심사 결과 안내', `${next.name}님, 제출 서류 확인이 어려워 이번 심사는 반려됐어요. 자격증을 다시 확인해 신청해주세요.`);
  }
}
export function useApplications(): Application[] {
  return useSyncExternalStore(subscribe, () => applications, () => applications);
}

/** 같은 강사·날짜·시간에 이미 유효한 예약이 있는지(중복 예약 방지) */
export function hasActiveBooking(instructorId: string, date: string, time: string): boolean {
  return bookings.some(
    (b) => b.instructorId === instructorId && b.date === date && b.time === time && b.status !== 'cancelled',
  );
}
