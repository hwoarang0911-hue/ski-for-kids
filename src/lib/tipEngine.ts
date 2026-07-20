import { TIPS, type Tip, type TipTag } from '../data/tips';
import type { HourPoint } from './weather';
import type { SnowInfo } from './snowCondition';

/** 현재 조건에 해당하는 태그 집합을 만든다 */
export function activeTags(now: HourPoint | null, snow: SnowInfo | null, date = new Date()): TipTag[] {
  const tags: TipTag[] = ['general'];
  const day = date.getDay();
  if (day === 0 || day === 6) tags.push('weekend');
  if (!now || !snow) return tags;

  if (snow.kind === 'slush') tags.push('slush');
  if (snow.kind === 'wet') tags.push('wet');
  if (snow.kind === 'powder') tags.push('powder');
  if (snow.kind === 'icy') tags.push('icy');

  if (now.temp <= -15) tags.push('verycold', 'cold');
  else if (now.temp <= -8) tags.push('cold');
  if (now.rain >= 0.2) tags.push('rain');
  if (now.windSpeed >= 25) tags.push('wind');
  if (now.snowfall >= 0.1) tags.push('snowing');
  if (now.visibility < 3000) tags.push('lowvis');
  if (now.cloudCover <= 30 && now.rain === 0 && now.snowfall === 0) tags.push('sunny');
  return tags;
}

/** 날짜 기반 시드 난수 — 같은 날에는 같은 팁이 나오게 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 오늘의 팁 선정: 조건 매칭 팁 우선 1개 + 일반 팁 1개.
 * 날짜+스키장 시드로 매일/스키장마다 달라진다.
 */
export function pickTodaysTips(tags: TipTag[], seedExtra = '', count = 2): Tip[] {
  const today = new Date();
  const seedStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-${seedExtra}`;
  let seed = 0;
  for (const ch of seedStr) seed = (seed * 31 + ch.charCodeAt(0)) % 233280;

  const conditionTags: TipTag[] = tags.filter((t) => t !== 'general');
  const matched = TIPS.filter((tip) => tip.tags.some((t) => conditionTags.includes(t)));
  const general = TIPS.filter((tip) => tip.tags.includes('general'));

  const picked: Tip[] = [];
  for (const tip of seededShuffle(matched, seed)) {
    if (picked.length >= Math.min(count - 1, matched.length)) break;
    picked.push(tip);
  }
  for (const tip of seededShuffle(general, seed + 7)) {
    if (picked.length >= count) break;
    if (!picked.some((p) => p.id === tip.id)) picked.push(tip);
  }
  return picked;
}
