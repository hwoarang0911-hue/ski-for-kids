import type { ResortWeather } from './weather';

export type SnowConditionKind = 'powder' | 'groomed' | 'wet' | 'slush' | 'icy';

export interface SnowInfo {
  kind: SnowConditionKind;
  label: string;
  description: string;
}

const INFO: Record<SnowConditionKind, Omit<SnowInfo, 'kind'>> = {
  powder: {
    label: '파우더·신설',
    description: '새 눈이 쌓여 푹신해요. 넘어져도 아프지 않아 아이가 도전하기 좋은 날!',
  },
  groomed: {
    label: '정설(그루밍)',
    description: '잘 다져진 기본 설질이에요. 개장 직후가 가장 매끈해요.',
  },
  wet: {
    label: '습설',
    description: '눈에 물기가 있어 약간 무거워요. 스키가 평소보다 느리게 나가요.',
  },
  slush: {
    label: '슬러시',
    description: '눈이 녹아 질척해요. 다리에 힘이 많이 들어가니 오전 위주로 타고 일찍 쉬세요.',
  },
  icy: {
    label: '아이스·강설면',
    description: '녹았다 얼어 단단하고 미끄러워요. 아이는 초급 슬로프와 정설 직후 시간대가 안전해요.',
  },
};

function make(kind: SnowConditionKind): SnowInfo {
  return { kind, ...INFO[kind] };
}

/**
 * 시간별 예보로 현재 설질을 추정한다.
 * - 최근 12시간 신적설 + 영하 → 파우더
 * - 현재 2°C 이상(또는 낮 최고 3°C 이상에 영상) → 슬러시
 * - 0~2°C → 습설
 * - 전날 영상으로 녹은 뒤 현재 영하 재결빙 → 아이스
 * - 그 외 → 정설
 */
export function estimateSnowCondition(w: ResortWeather): SnowInfo {
  const { hours, nowIndex, days } = w;
  const now = hours[nowIndex];
  if (!now) return make('groomed');

  const from = Math.max(0, nowIndex - 12);
  const recentSnowfall = hours.slice(from, nowIndex + 1).reduce((s, p) => s + p.snowfall, 0);

  // days[0]는 past_days: 1 요청 기준 "어제"
  const yesterday = days[0];
  const today = days[1] ?? days[0];

  if (now.temp >= 2 || (now.temp >= 0 && today.tempMax >= 3)) return make('slush');
  if (now.temp >= 0) return make('wet');
  if (recentSnowfall >= 1) return make('powder');
  if (yesterday && yesterday.tempMax >= 1.5) return make('icy'); // 어제 녹고 오늘 영하: 재결빙
  return make('groomed');
}
