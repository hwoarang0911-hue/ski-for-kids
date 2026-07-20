/**
 * 신체 정보 → 장비 추천 순수 함수 모음.
 * 장비 탭 계산기(SkiLengthCalc/PoleCalc/DinCalc)와 가족 구성원 추천 카드가 함께 쓴다.
 */

export type SkillLevel = 'first' | 'beginner' | 'intermediate' | 'advanced';

export const SKILL_LABELS: Record<SkillLevel, string> = {
  first: '처음이에요',
  beginner: '초급 (A자로 내려와요)',
  intermediate: '중급 (양쪽 턴이 돼요)',
  advanced: '상급 (평행 턴이 돼요)',
};

export const SKILL_SHORT: Record<SkillLevel, string> = {
  first: '처음',
  beginner: '초급',
  intermediate: '중급',
  advanced: '상급',
};

// ── 스키 길이 ────────────────────────────────────────────────
export interface SkiLengthResult {
  min: number;
  max: number;
  note: string;
}

/** 어린이·초보 기준: 처음/초보는 턱 높이 근처, 익숙해질수록 코~머리 높이 */
export function recommendSkiLength(heightCm: number, level: SkillLevel): SkiLengthResult {
  switch (level) {
    case 'first':
      return { min: heightCm - 25, max: heightCm - 18, note: '가슴~턱 높이. 짧을수록 돌리기 쉬워 처음 배우기 좋아요.' };
    case 'beginner':
      return { min: heightCm - 20, max: heightCm - 13, note: '턱 높이 전후. A자(피자) 연습이 잘 되는 길이예요.' };
    case 'intermediate':
      return { min: heightCm - 13, max: heightCm - 7, note: '턱~코 높이. 턴이 안정된 사람에게 맞아요.' };
    case 'advanced':
      return { min: heightCm - 10, max: heightCm - 2, note: '코~눈 높이. 평행 턴과 속도를 즐기는 사람에게 맞아요.' };
  }
}

// ── 폴 길이 ──────────────────────────────────────────────────
/** 키 × 0.69를 5cm 단위로 반올림. 팔꿈치 90도와 거의 같다. */
export function recommendPoleLength(heightCm: number): number {
  return Math.round((heightCm * 0.69) / 5) * 5;
}

// ── DIN (ISO 11088 간이표) ──────────────────────────────────
export type SkierStyle = 1 | 2 | 3;

const WEIGHT_CODES: { max: number; code: number }[] = [
  { max: 13, code: 0 },
  { max: 17, code: 1 },
  { max: 21, code: 2 },
  { max: 25, code: 3 },
  { max: 30, code: 4 },
  { max: 35, code: 5 },
  { max: 41, code: 6 },
  { max: 48, code: 7 },
  { max: 57, code: 8 },
  { max: 66, code: 9 },
  { max: 78, code: 10 },
  { max: 94, code: 11 },
  { max: Infinity, code: 12 },
];

const HEIGHT_CODES: { max: number; code: number }[] = [
  { max: 148, code: 7 },
  { max: 157, code: 8 },
  { max: 166, code: 9 },
  { max: 178, code: 10 },
  { max: 194, code: 11 },
  { max: Infinity, code: 12 },
];

const SOLE_BREAKS = [230, 250, 270, 290, 310, 330];
const DIN_TABLE: (number | null)[][] = [
  [0.75, 0.75, 0.75, null, null, null, null],
  [1.0, 0.75, 0.75, 0.75, null, null, null],
  [1.5, 1.25, 1.25, 1.0, null, null, null],
  [2.0, 1.75, 1.5, 1.5, 1.25, null, null],
  [2.5, 2.25, 2.0, 1.75, 1.5, 1.5, null],
  [3.0, 2.75, 2.5, 2.25, 2.0, 1.75, 1.75],
  [null, 3.5, 3.0, 2.75, 2.5, 2.25, 2.0],
  [null, null, 3.5, 3.0, 3.0, 2.75, 2.5],
  [null, null, 4.5, 4.0, 3.5, 3.5, 3.0],
  [null, null, 5.5, 5.0, 4.5, 4.0, 3.5],
  [null, null, 6.5, 6.0, 5.5, 5.0, 4.5],
  [null, null, 7.5, 7.0, 6.5, 6.0, 5.5],
  [null, null, null, 8.5, 8.0, 7.0, 6.5],
];

function soleColumn(soleMm: number): number {
  const idx = SOLE_BREAKS.findIndex((b) => soleMm <= b);
  return idx === -1 ? SOLE_BREAKS.length : idx;
}

/**
 * DIN 참고값. 실제 조정은 반드시 장비샵에서.
 * @param youngOrOld 만 10세 미만 또는 50세 이상이면 true (한 단계 감소)
 */
export function recommendDin(
  weightKg: number,
  heightCm: number,
  soleMm: number,
  style: SkierStyle,
  youngOrOld: boolean,
): number | null {
  let code = WEIGHT_CODES.find((w) => weightKg <= w.max)!.code;
  if (heightCm > 148) {
    const hCode = HEIGHT_CODES.find((h) => heightCm <= h.max)!.code;
    if (hCode < code) code = hCode;
  }
  if (style === 2) code += 1;
  if (style === 3) code += 2;
  if (youngOrOld) code -= 1;
  code = Math.max(0, Math.min(DIN_TABLE.length - 1, code));
  return DIN_TABLE[code][soleColumn(soleMm)];
}

/** 실력 레벨 → DIN 스키어 타입(공격성) 기본 매핑 */
export function styleFromLevel(level: SkillLevel): SkierStyle {
  if (level === 'advanced') return 3;
  if (level === 'intermediate') return 2;
  return 1;
}
