/**
 * 백엔드 데이터 모델. localStorage 어댑터와 Supabase 어댑터가 공유한다.
 * (예약·후기·강사 입점 신청)
 */

export type BookingStatus = 'requested' | 'confirmed' | 'cancelled' | 'completed';

/** 결제 상태 — Phase 2 결제 연동에서 사용 */
export type PaymentStatus = 'none' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorHue: string;
  instructorPhone?: string;
  resortId: string;
  productId: string;
  productTitle: string;
  date: string; // YYYY-MM-DD
  time: string;
  /** 강습 인원 수(가족 프로필과 무관하게 상황에 맞춰 지정) */
  headcount: number;
  /** (구버전 호환) 예전 예약의 구성원 이름 */
  memberNames?: string[];
  priceTotal: number;
  status: BookingStatus;
  reviewed?: boolean;
  /** 결제 상태·식별자 (Phase 2) */
  payStatus?: PaymentStatus;
  payId?: string;
  /** 강습 만남 장소(스키장 내 집합 지점). 강사가 확정 시 조정 가능 */
  meetingPoint?: string;
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

export type ApplicationStatus = 'review' | 'approved' | 'rejected';

/** 강사 입점 신청(공급측). 자격 검증 후 노출 대상이 된다. */
export interface Application {
  id: string;
  name: string;
  phone: string;
  resortId: string;
  cert: string;
  kidsSpecialist: boolean;
  disciplines: string[];
  formats: string[];
  experienceYears: number;
  intro: string;
  certFileName: string;
  status: ApplicationStatus;
  createdAt: number;
}

export interface Snapshot {
  bookings: Booking[];
  reviews: Review[];
  applications: Application[];
}

/**
 * 저장소 어댑터 계약. 이 인터페이스만 구현하면 백엔드를 교체할 수 있다.
 * - loadAll(): 초기 하이드레이션
 * - putBooking/Review/Application(): 단건 upsert (id 기준 생성·수정 겸용)
 */
export interface BackendAdapter {
  /** 로그·디버그용 어댑터 이름 */
  readonly name: string;
  loadAll(): Promise<Snapshot>;
  putBooking(b: Booking): Promise<void>;
  putReview(r: Review): Promise<void>;
  putApplication(a: Application): Promise<void>;
}
