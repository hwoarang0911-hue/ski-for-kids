/**
 * localStorage 어댑터 — 기본 백엔드(무설정).
 * 브라우저 안에만 저장되므로 기기 간 공유·정산은 불가. Supabase 어댑터로
 * 교체하면 서버 저장으로 넘어간다.
 */
import type { BackendAdapter, Booking, Review, Application, Snapshot } from './types';

const BK = 'ski-for-kids.bookings';
const RV = 'ski-for-kids.reviews';
const AP = 'ski-for-kids.applications';

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
    upsert(BK, b);
  },
  async putReview(r) {
    upsert(RV, r);
  },
  async putApplication(a) {
    upsert(AP, a);
  },
};
