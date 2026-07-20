import type { HourPoint } from './weather';
import type { SnowInfo } from './snowCondition';

export type Grade = 'best' | 'good' | 'fair' | 'caution' | 'bad';

export interface IndexFactor {
  name: string;
  /** 점수 변화량. 음수 = 감점, 양수 = 가점 */
  impact: number;
  note: string;
}

export interface SkiIndexResult {
  score: number; // 0~100
  grade: Grade;
  label: string;
  /** 아이에게 읽어줄 한 줄 요약 */
  kidsSummary: string;
  factors: IndexFactor[];
}

const GRADE_LABEL: Record<Grade, string> = {
  best: '최고',
  good: '좋음',
  fair: '보통',
  caution: '주의',
  bad: '나쁨',
};

function gradeOf(score: number): Grade {
  if (score >= 85) return 'best';
  if (score >= 65) return 'good';
  if (score >= 50) return 'fair';
  if (score >= 35) return 'caution';
  return 'bad';
}

function kidsSummaryOf(grade: Grade, snow: SnowInfo, factors: IndexFactor[]): string {
  const worst = [...factors].sort((a, b) => a.impact - b.impact)[0];
  switch (grade) {
    case 'best':
      return snow.kind === 'powder'
        ? '와! 새 눈이 소복소복, 오늘 눈이 최고예요!'
        : '오늘은 스키 타기 딱 좋은 날이에요!';
    case 'good':
      return '오늘 스키 타러 가요! 기분 좋은 하루가 될 거예요.';
    case 'fair':
      return worst && worst.impact <= -8
        ? `탈 만한 날이에요. 다만 ${worst.name} 때문에 조금만 조심해요.`
        : '무난하게 탈 수 있는 날이에요.';
    case 'caution':
      return worst
        ? `오늘은 ${worst.name} 때문에 심술궂은 날이에요. 짧게 타고 자주 쉬어요.`
        : '오늘은 컨디션이 좋지 않아요. 무리하지 말아요.';
    case 'bad':
      return '오늘은 눈이 쉬고 싶대요. 실내 놀이로 바꾸는 게 어때요?';
  }
}

/** 현재 시점 기상 + 설질로 0~100 스키 지수를 계산한다 */
export function computeSkiIndex(now: HourPoint, snow: SnowInfo): SkiIndexResult {
  const factors: IndexFactor[] = [];
  const add = (name: string, impact: number, note: string) => {
    if (impact !== 0) factors.push({ name, impact, note });
  };

  // 기온 (이상적: -10 ~ -1°C)
  const t = now.temp;
  if (t >= 3) add('기온', -18, `기온 ${t.toFixed(0)}°C — 눈이 녹는 온도예요`);
  else if (t >= 1) add('기온', -8, `기온 ${t.toFixed(0)}°C — 슬러시가 생기기 쉬워요`);
  else if (t >= -1) add('기온', -3, '영상 근처 — 눈이 살짝 무거워질 수 있어요');
  else if (t < -20) add('기온', -30, `혹한 ${t.toFixed(0)}°C — 야외 활동 자체가 위험해요`);
  else if (t < -15) add('기온', -18, `강추위 ${t.toFixed(0)}°C — 자주 실내에서 녹여야 해요`);
  else if (t < -10) add('기온', -5, `추위 ${t.toFixed(0)}°C — 보온을 든든히 하세요`);

  // 체감온도 (아이 기준 보수적으로)
  if (now.apparent <= -25) add('체감온도', -20, `체감 ${now.apparent.toFixed(0)}°C — 아이에게는 동상 위험 수준이에요`);
  else if (now.apparent <= -20) add('체감온도', -8, `체감 ${now.apparent.toFixed(0)}°C — 바람 때문에 훨씬 추워요`);

  // 강수 (비는 스키의 적)
  if (now.rain >= 1) add('비', -35, '비가 와요 — 옷이 젖으면 저체온 위험이 커요');
  else if (now.rain >= 0.2) add('비', -25, '비가 조금씩 와요 — 오늘은 무리하지 마세요');

  // 눈 (적당한 눈은 가점, 폭설은 감점)
  if (now.snowfall >= 2) add('폭설', -12, '눈이 많이 와요 — 시야와 이동에 주의하세요');
  else if (now.snowfall >= 0.1 && now.rain < 0.2 && now.visibility >= 2000)
    add('신설', +5, '눈이 내려요 — 설질이 좋아지는 중!');

  // 바람 (km/h)
  const wind = now.windSpeed;
  if (wind >= 40) add('강풍', -30, `바람 ${wind.toFixed(0)}km/h — 리프트가 멈출 수 있어요`);
  else if (wind >= 25) add('바람', -15, `바람 ${wind.toFixed(0)}km/h — 리프트에서 많이 추워요`);
  else if (wind >= 15) add('바람', -5, `바람 ${wind.toFixed(0)}km/h — 약간 쌀쌀해요`);

  // 시야
  const vis = now.visibility;
  if (vis < 1000) add('시야', -30, '앞이 잘 안 보여요 — 화이트아웃 주의');
  else if (vis < 2000) add('시야', -15, '시야가 짧아요 — 천천히, 간격을 두고 타세요');
  else if (vis < 5000) add('시야', -8, '시야가 조금 뿌예요');
  else if (now.cloudCover >= 90 && now.snowfall < 0.1) add('흐림', -3, '구름이 많아 눈 표면 굴곡이 잘 안 보여요');

  // 설질
  const snowImpact: Record<SnowInfo['kind'], number> = {
    powder: +5,
    groomed: 0,
    wet: -5,
    slush: -18,
    icy: -20,
  };
  add('설질', snowImpact[snow.kind], `${snow.label} — ${snow.description}`);

  const score = Math.max(0, Math.min(100, 100 + factors.reduce((s, f) => s + f.impact, 0)));
  const grade = gradeOf(score);

  return {
    score,
    grade,
    label: GRADE_LABEL[grade],
    kidsSummary: kidsSummaryOf(grade, snow, factors),
    factors: factors.sort((a, b) => a.impact - b.impact),
  };
}
