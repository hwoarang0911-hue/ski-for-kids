/**
 * Supabase 어댑터 — 라이브 백엔드.
 * @supabase/supabase-js 의존성 없이 PostgREST REST API를 fetch로 직접 호출한다.
 * 활성 조건: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 두 환경변수가 있을 때.
 * 스키마는 backend/schema.sql 참고. (컬럼은 snake_case ↔ 앱은 camelCase 매핑)
 */
import type { BackendAdapter, Booking, Review, Application, Snapshot } from './types';

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(URL && KEY);

function headers(extra: Record<string, string> = {}) {
  return {
    apikey: KEY!,
    Authorization: `Bearer ${KEY!}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function selectAll<T>(table: string): Promise<T[]> {
  const res = await fetch(`${URL}/rest/v1/${table}?select=*&order=created_at.desc`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`supabase select ${table} ${res.status}`);
  return (await res.json()) as T[];
}

async function upsert(table: string, row: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`supabase upsert ${table} ${res.status}`);
}

// ── 매핑 (camelCase ↔ snake_case) ────────────────────────────
const bookingRow = (b: Booking) => ({
  id: b.id,
  instructor_id: b.instructorId,
  instructor_name: b.instructorName,
  instructor_hue: b.instructorHue,
  instructor_phone: b.instructorPhone ?? null,
  resort_id: b.resortId,
  product_id: b.productId,
  product_title: b.productTitle,
  date: b.date,
  time: b.time,
  member_names: b.memberNames,
  price_total: b.priceTotal,
  status: b.status,
  reviewed: b.reviewed ?? false,
  pay_status: b.payStatus ?? 'none',
  pay_id: b.payId ?? null,
  meeting_point: b.meetingPoint ?? null,
  created_at: new Date(b.createdAt).toISOString(),
});
const toBooking = (r: any): Booking => ({
  id: r.id,
  instructorId: r.instructor_id,
  instructorName: r.instructor_name,
  instructorHue: r.instructor_hue,
  instructorPhone: r.instructor_phone ?? undefined,
  resortId: r.resort_id,
  productId: r.product_id,
  productTitle: r.product_title,
  date: r.date,
  time: r.time,
  memberNames: r.member_names ?? [],
  priceTotal: r.price_total,
  status: r.status,
  reviewed: r.reviewed,
  payStatus: r.pay_status,
  payId: r.pay_id ?? undefined,
  meetingPoint: r.meeting_point ?? undefined,
  createdAt: new Date(r.created_at).getTime(),
});

const reviewRow = (r: Review) => ({
  id: r.id,
  instructor_id: r.instructorId,
  author: r.author,
  rating: r.rating,
  text: r.text,
  created_at: new Date(r.createdAt).toISOString(),
});
const toReview = (r: any): Review => ({
  id: r.id,
  instructorId: r.instructor_id,
  author: r.author,
  rating: r.rating,
  text: r.text,
  createdAt: new Date(r.created_at).getTime(),
});

const applicationRow = (a: Application) => ({
  id: a.id,
  name: a.name,
  phone: a.phone,
  resort_id: a.resortId,
  cert: a.cert,
  kids_specialist: a.kidsSpecialist,
  disciplines: a.disciplines,
  formats: a.formats,
  experience_years: a.experienceYears,
  intro: a.intro,
  cert_file_name: a.certFileName,
  status: a.status,
  created_at: new Date(a.createdAt).toISOString(),
});
const toApplication = (r: any): Application => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  resortId: r.resort_id,
  cert: r.cert,
  kidsSpecialist: r.kids_specialist,
  disciplines: r.disciplines ?? [],
  formats: r.formats ?? [],
  experienceYears: r.experience_years,
  intro: r.intro,
  certFileName: r.cert_file_name,
  status: r.status,
  createdAt: new Date(r.created_at).getTime(),
});

export const supabaseAdapter: BackendAdapter = {
  name: 'supabase',
  async loadAll(): Promise<Snapshot> {
    const [bookings, reviews, applications] = await Promise.all([
      selectAll<any>('bookings').then((rs) => rs.map(toBooking)),
      selectAll<any>('reviews').then((rs) => rs.map(toReview)),
      selectAll<any>('applications').then((rs) => rs.map(toApplication)),
    ]);
    return { bookings, reviews, applications };
  },
  async putBooking(b) {
    await upsert('bookings', bookingRow(b));
  },
  async putReview(r) {
    await upsert('reviews', reviewRow(r));
  },
  async putApplication(a) {
    await upsert('applications', applicationRow(a));
  },
};
