/**
 * localStorage 어댑터 — 기본 백엔드(무설정).
 * 브라우저 안에만 저장되므로 기기 간 공유·정산은 불가. Supabase 어댑터로
 * 교체하면 서버 저장으로 넘어간다.
 */
import type { BackendAdapter, Booking, Review, Application, Snapshot } from './types';

const BK = 'ski-for-kids.bookings';
const RV = 'ski-for-kids.reviews';
const AP = 'ski-for-kids.applications';

/**
 * 테스트/데모용 오프라인 시뮬레이션 훅.
 * sessionStorage['ski-for-kids.simulateOffline']==='1' 이면 쓰기가 실패해
 * 아웃박스 재시도 경로(스키장 통신 두절 시나리오)를 검증할 수 있다.
 */
function simulateOffline(): boolean {
  try {
    return sessionStorage.getItem('ski-for-kids.simulateOffline') === '1';
  } catch {
    return false;
  }
}

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
function upsert<T extends { id: string }>(key: string, row: T) {
  const rows = read<T>(key);
  const i = rows.findIndex((r) => r.id === row.id);
  if (i >= 0) rows[i] = row;
  else rows.unshift(row);
  localStorage.setItem(key, JSON.stringify(rows));
}

export const localAdapter: BackendAdapter = {
  name: 'local',
  async loadAll(): Promise<Snapshot> {
    return {
      bookings: read<Booking>(BK),
      reviews: read<Review>(RV),
      applications: read<Application>(AP),
    };
  },
  async putBooking(b) {
    if (simulateOffline()) throw new Error('simulated offline');
    upsert(BK, b);
  },
  async putReview(r) {
    if (simulateOffline()) throw new Error('simulated offline');
    upsert(RV, r);
  },
  async putApplication(a) {
    if (simulateOffline()) throw new Error('simulated offline');
    upsert(AP, a);
  },
};
