/**
 * 강사 연결(매칭) 데이터.
 * 조사 기준: KSIA(대한스키지도자연맹) 자격 4단계(레벨1~3·데몬)+티칭,
 * 형태 1:1·소그룹·그룹·가족, 종목 입문·인터스키·레이싱·모글·보드.
 * MVP는 정적 더미 데이터. 실제 서비스는 서버·검증·결제 연동 필요.
 */
import { RESORTS } from './resorts';

export type CertLevel = '티칭' | '레벨1' | '레벨2' | '레벨3' | '데몬';
export type Discipline = '입문·기초' | '인터스키' | '레이싱' | '모글·프리' | '스노보드';
export type LessonFormat = '1:1' | '소그룹' | '그룹' | '가족';

export interface LessonProduct {
  id: string;
  title: string;
  format: LessonFormat;
  discipline: Discipline;
  /** 소그룹/그룹 최대 인원 */
  groupMax?: number;
  durationMin: number;
  priceKRW: number;
  /** 소그룹은 1인당 가격 여부 */
  perPerson?: boolean;
  includesLift?: boolean;
  includesGear?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  /** 강사 대표 색(아바타 그라디언트용) */
  hue: string;
  /** 확정 후 연락처(전화) */
  phone: string;
  resortId: string;
  cert: CertLevel;
  /** 자격 검증 완료 여부 */
  verified: boolean;
  kidsSpecialist: boolean;
  firstAid: boolean;
  experienceYears: number;
  lessonCount: number;
  rating: number;
  reviewCount: number;
  disciplines: Discipline[];
  formats: LessonFormat[];
  /** 가능 시간대 요약 */
  availability: string;
  /** 빠른 예약 훅(리스트 배지) */
  availHint: string;
  intro: string;
  awards: string[];
  products: LessonProduct[];
  /** 기본 노출 후기(시드). 사용자 후기는 lessonStore에서 추가된다. */
  seedReviews: { author: string; rating: number; text: string }[];
}

function resortName(id: string): string {
  return RESORTS.find((r) => r.id === id)?.name ?? id;
}

const APPROVED_HUES = ['#3f7bff', '#1fa564', '#e0821e', '#8a5bff', '#5b6bff'];

/** 입점 신청(승인 대상)의 최소 필드 */
export interface ApprovableApplication {
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
}

/** 형태별 기본 강습 상품(가격 가이드) — 승인 강사의 초기 상품 */
function defaultProducts(formats: LessonFormat[], disc: Discipline): LessonProduct[] {
  const out: LessonProduct[] = [];
  if (formats.includes('1:1'))
    out.push({ id: 'p1', title: '1:1 강습', format: '1:1', discipline: disc, durationMin: 120, priceKRW: 120000, includesLift: false });
  if (formats.includes('소그룹'))
    out.push({ id: 'p2', title: '소그룹 (2~3)', format: '소그룹', discipline: disc, groupMax: 3, durationMin: 120, priceKRW: 70000, perPerson: true });
  if (formats.includes('그룹'))
    out.push({ id: 'p3', title: '그룹 강습', format: '그룹', discipline: disc, groupMax: 5, durationMin: 120, priceKRW: 50000, perPerson: true });
  if (formats.includes('가족'))
    out.push({ id: 'p4', title: '가족 반나절', format: '가족', discipline: disc, groupMax: 4, durationMin: 240, priceKRW: 350000 });
  if (out.length === 0)
    out.push({ id: 'p1', title: '1:1 강습', format: '1:1', discipline: disc, durationMin: 120, priceKRW: 120000, includesLift: false });
  return out;
}

/**
 * 승인된 입점 신청 → 강사 목록에 노출할 Instructor로 변환.
 * 신규라 평점·후기는 0, "신규 강사" 훅으로 표시한다.
 */
export function applicationToInstructor(a: ApprovableApplication): Instructor {
  const disciplines = (a.disciplines.length ? a.disciplines : ['입문·기초']) as Discipline[];
  const formats = (a.formats.length ? a.formats : ['1:1']) as LessonFormat[];
  return {
    id: `app-${a.id}`,
    name: a.name,
    hue: APPROVED_HUES[Math.abs(hashCode(a.id)) % APPROVED_HUES.length],
    phone: a.phone,
    resortId: a.resortId,
    cert: a.cert as CertLevel,
    verified: true,
    kidsSpecialist: a.kidsSpecialist,
    firstAid: false,
    experienceYears: a.experienceYears,
    lessonCount: 0,
    rating: 0,
    reviewCount: 0,
    disciplines,
    formats,
    availability: '예약제',
    availHint: '신규 강사',
    intro: a.intro || '새로 합류한 강사입니다. 첫 강습을 예약해보세요.',
    awards: [`KSIA ${a.cert}`],
    products: defaultProducts(formats, disciplines[0]),
    seedReviews: [],
  };
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

export const INSTRUCTORS: Instructor[] = [
  {
    id: 'kim-dohyun',
    name: '김도현 코치',
    hue: '#3f7bff',
    phone: '010-2412-3801',
    resortId: 'yongpyong',
    cert: '레벨2',
    verified: true,
    kidsSpecialist: true,
    firstAid: true,
    experienceYears: 8,
    lessonCount: 320,
    rating: 4.9,
    reviewCount: 37,
    disciplines: ['입문·기초', '인터스키'],
    formats: ['1:1', '소그룹', '가족'],
    availability: '주말 오전·오후 · 평일 야간',
    availHint: '이번 주말 가능',
    intro: '겁 많은 아이도 웃으며 타게 하는 걸 목표로 해요. 첫 스키·A자 멈추기부터 인터스키 기본기까지, 아이 속도에 맞춰 진행합니다.',
    awards: ['前 시도대표', '어린이 강습 320회'],
    products: [
      { id: 'p1', title: '어린이 1:1', format: '1:1', discipline: '입문·기초', durationMin: 120, priceKRW: 120000, includesLift: false },
      { id: 'p2', title: '어린이 소그룹 (2~3)', format: '소그룹', discipline: '입문·기초', groupMax: 3, durationMin: 120, priceKRW: 70000, perPerson: true },
      { id: 'p3', title: '가족 그룹 · 반나절', format: '가족', discipline: '입문·기초', groupMax: 4, durationMin: 240, priceKRW: 350000, includesGear: true },
    ],
    seedReviews: [
      { author: '민준맘', rating: 5, text: '겁 많던 아이가 첫날 리프트까지 탔어요. 아이 다루는 게 남다르세요.' },
      { author: '아빠곰', rating: 5, text: '피자·프렌치프라이로 쉽게 알려주셔서 저도 배웠네요. 강추합니다.' },
    ],
  },
  {
    id: 'lee-seoyeon',
    name: '이서연 데몬',
    hue: '#5b6bff',
    phone: '010-5533-7712',
    resortId: 'high1',
    cert: '데몬',
    verified: true,
    kidsSpecialist: true,
    firstAid: false,
    experienceYears: 12,
    lessonCount: 540,
    rating: 5.0,
    reviewCount: 58,
    disciplines: ['인터스키', '레이싱'],
    formats: ['1:1', '가족'],
    availability: '평일 오전·오후',
    availHint: '평일 가능',
    intro: 'KSIA 데몬스트레이터. 기본기를 탄탄히 잡아 올바른 자세로 오래 즐기게 도와드려요. 어린이 인터스키 입문에 강합니다.',
    awards: ['KSIA 데몬스트레이터', '전국지도자대회 입상'],
    products: [
      { id: 'p1', title: '어린이 1:1 프리미엄', format: '1:1', discipline: '인터스키', durationMin: 120, priceKRW: 180000, includesLift: false },
      { id: 'p2', title: '가족 1:2', format: '가족', discipline: '입문·기초', groupMax: 2, durationMin: 120, priceKRW: 220000 },
    ],
    seedReviews: [
      { author: '스키맘', rating: 5, text: '데몬답게 자세 교정이 정확해요. 아이 기본기가 확 잡혔습니다.' },
    ],
  },
  {
    id: 'park-junho',
    name: '박준호 코치',
    hue: '#1fa564',
    phone: '010-3390-1185',
    resortId: 'yongpyong',
    cert: '레벨1',
    verified: true,
    kidsSpecialist: true,
    firstAid: true,
    experienceYears: 5,
    lessonCount: 180,
    rating: 4.8,
    reviewCount: 24,
    disciplines: ['입문·기초', '스노보드'],
    formats: ['1:1', '소그룹', '가족'],
    availability: '주말·공휴일 종일',
    availHint: '주말 가능',
    intro: '유아·초등 저학년 전문. 놀이처럼 접근해서 눈과 스키를 좋아하게 만드는 첫 강습을 잘합니다. 스노보드도 지도해요.',
    awards: ['유아 스키 지도 자격', '어린이 강습 180회'],
    products: [
      { id: 'p1', title: '유아 1:1 (첫 스키)', format: '1:1', discipline: '입문·기초', durationMin: 60, priceKRW: 70000, includesLift: false },
      { id: 'p2', title: '형제·친구 소그룹', format: '소그룹', discipline: '입문·기초', groupMax: 3, durationMin: 120, priceKRW: 60000, perPerson: true },
      { id: 'p3', title: '스노보드 1:1', format: '1:1', discipline: '스노보드', durationMin: 120, priceKRW: 110000 },
    ],
    seedReviews: [
      { author: '7살엄마', rating: 5, text: '유아 눈높이가 최고예요. 놀이처럼 해주셔서 아이가 또 가자고 해요.' },
    ],
  },
  {
    id: 'choi-eunji',
    name: '최은지 코치',
    hue: '#e0821e',
    phone: '010-8817-2043',
    resortId: 'phoenix',
    cert: '레벨2',
    verified: true,
    kidsSpecialist: false,
    firstAid: true,
    experienceYears: 9,
    lessonCount: 410,
    rating: 4.7,
    reviewCount: 41,
    disciplines: ['인터스키', '모글·프리'],
    formats: ['1:1', '그룹'],
    availability: '주말 오후 · 평일 오전',
    availHint: '예약 여유',
    intro: '중급 이상 스킬업과 모글 입문에 강해요. 초·중급 부모가 함께 배우기에도 좋습니다.',
    awards: ['KSIA 레벨2', '모글 지도 경력'],
    products: [
      { id: 'p1', title: '스킬업 1:1', format: '1:1', discipline: '인터스키', durationMin: 120, priceKRW: 130000 },
      { id: 'p2', title: '모글 입문 그룹', format: '그룹', discipline: '모글·프리', groupMax: 5, durationMin: 120, priceKRW: 50000, perPerson: true },
    ],
    seedReviews: [
      { author: '중급도전', rating: 5, text: '정체돼 있던 실력이 한 단계 올라갔어요. 설명이 명확합니다.' },
    ],
  },
  {
    id: 'jung-minsu',
    name: '정민수 코치',
    hue: '#8a5bff',
    phone: '010-6620-4498',
    resortId: 'muju',
    cert: '레벨3',
    verified: true,
    kidsSpecialist: true,
    firstAid: true,
    experienceYears: 14,
    lessonCount: 620,
    rating: 4.9,
    reviewCount: 66,
    disciplines: ['입문·기초', '인터스키', '레이싱'],
    formats: ['1:1', '소그룹', '가족'],
    availability: '주말 종일 · 평일 예약제',
    availHint: '이번 주말 가능',
    intro: '초보 첫 스키부터 주니어 레이싱 입문까지 폭넓게 지도합니다. 아이 성향을 보고 커리큘럼을 맞춰요.',
    awards: ['KSIA 레벨3', '주니어 레이싱 지도'],
    products: [
      { id: 'p1', title: '어린이 1:1', format: '1:1', discipline: '입문·기초', durationMin: 120, priceKRW: 140000 },
      { id: 'p2', title: '주니어 레이싱 입문', format: '소그룹', discipline: '레이싱', groupMax: 4, durationMin: 120, priceKRW: 90000, perPerson: true },
      { id: 'p3', title: '가족 반나절', format: '가족', discipline: '입문·기초', groupMax: 4, durationMin: 240, priceKRW: 360000, includesGear: true },
    ],
    seedReviews: [
      { author: '두아이맘', rating: 5, text: '형·동생 성향이 다른데 각각 맞춰주셨어요. 베테랑의 여유가 느껴져요.' },
      { author: '레이싱꿈나무', rating: 4, text: '아이가 레이싱에 흥미를 붙였어요. 다음 시즌도 예약하려고요.' },
    ],
  },
];

export const RESORT_LABEL = resortName;
