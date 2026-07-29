/**
 * 강습 만남 장소(스키장 내 집합 지점).
 * 부모·강사가 실제로 만나는 곳을 명확히 해야 첫 강습이 어긋나지 않는다.
 * 스키장별로 초보·가족이 찾기 쉬운 지점을 우선 제시한다.
 */
import { RESORTS } from './resorts';

const SPOTS: Record<string, string[]> = {
  yongpyong: ['레드 광장 렌탈하우스 앞', '옐로우 리프트 하단', '드래곤플라자 1층 로비'],
  high1: ['마운틴 베이스 렌탈샵 앞', '밸리 곤돌라 승강장 앞', '마운틴콘도 스키하우스'],
  phoenix: ['스노우파크 렌탈샵 앞', '챔피언 리프트 하단', '스노우빌리지 광장'],
  muju: ['설천봉 하단 렌탈샵 앞', '만선 리프트 승강장 앞', '스키하우스 1층'],
  konjiam: ['베이스 렌탈샵 앞', '초급 슬로프 리프트 하단'],
  jisan: ['베이스 렌탈샵 앞', '초급 슬로프 하단'],
};
const DEFAULT_SPOTS = ['베이스 렌탈샵 앞', '초급 리프트 하단'];

export function meetingSpots(resortId: string): string[] {
  return SPOTS[resortId] ?? DEFAULT_SPOTS;
}
export function defaultMeeting(resortId: string): string {
  return meetingSpots(resortId)[0];
}

/** 외부 지도 앱으로 여는 링크(스키장 좌표 + 지점명 검색). */
export function resortMapUrl(resortId: string, label?: string): string {
  const r = RESORTS.find((x) => x.id === resortId);
  const q = label ? `${r?.name ?? ''} ${label}` : (r?.name ?? '');
  if (r) return `https://www.google.com/maps/search/?api=1&query=${r.latitude},${r.longitude}(${encodeURIComponent(q)})`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
