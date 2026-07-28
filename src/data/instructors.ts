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
}

function resortName(id: string): string {
  return RESORTS.find((r) => r.id === id)?.name.split(' ')[0] ?? id;
}

export const INSTRUCTORS: Instructor[] = [
  {
    id: 'kim-dohyun',
    name: '김도현 코치',
    hue: '#3f7bff',
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
  },
  {
    id: 'lee-seoyeon',
    name: '이서연 데몬',
    hue: '#5b6bff',
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
  },
  {
    id: 'park-junho',
    name: '박준호 코치',
    hue: '#1fa564',
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
  },
  {
    id: 'choi-eunji',
    name: '최은지 코치',
    hue: '#e0821e',
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
  },
  {
    id: 'jung-minsu',
    name: '정민수 코치',
    hue: '#8a5bff',
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
  },
];

export const RESORT_LABEL = resortName;
