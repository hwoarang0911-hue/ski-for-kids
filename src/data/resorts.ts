export interface Resort {
  id: string;
  name: string;
  country: '한국' | '일본';
  region: string;
  latitude: number;
  longitude: number;
  /** 슬로프 베이스 고도(m) — 날씨 조회 기준 고도 */
  baseElevation: number;
  topElevation: number;
}

export const RESORTS: Resort[] = [
  // 국내
  { id: 'yongpyong', name: '용평리조트', country: '한국', region: '강원 평창', latitude: 37.643, longitude: 128.68, baseElevation: 700, topElevation: 1458 },
  { id: 'high1', name: '하이원리조트', country: '한국', region: '강원 정선', latitude: 37.205, longitude: 128.837, baseElevation: 950, topElevation: 1345 },
  { id: 'phoenix', name: '휘닉스 평창', country: '한국', region: '강원 평창', latitude: 37.582, longitude: 128.323, baseElevation: 700, topElevation: 1050 },
  { id: 'vivaldi', name: '비발디파크', country: '한국', region: '강원 홍천', latitude: 37.646, longitude: 127.687, baseElevation: 180, topElevation: 650 },
  { id: 'konjiam', name: '곤지암리조트', country: '한국', region: '경기 광주', latitude: 37.336, longitude: 127.29, baseElevation: 120, topElevation: 500 },
  { id: 'wellihilli', name: '웰리힐리파크', country: '한국', region: '강원 횡성', latitude: 37.489, longitude: 128.245, baseElevation: 350, topElevation: 1000 },
  { id: 'muju', name: '무주덕유산리조트', country: '한국', region: '전북 무주', latitude: 35.89, longitude: 127.737, baseElevation: 750, topElevation: 1520 },
  { id: 'oakvalley', name: '오크밸리', country: '한국', region: '강원 원주', latitude: 37.402, longitude: 127.813, baseElevation: 250, topElevation: 550 },
  { id: 'elysian', name: '엘리시안 강촌', country: '한국', region: '강원 춘천', latitude: 37.821, longitude: 127.591, baseElevation: 100, topElevation: 480 },
  { id: 'edenvalley', name: '에덴밸리', country: '한국', region: '경남 양산', latitude: 35.427, longitude: 128.983, baseElevation: 450, topElevation: 800 },
  { id: 'alpensia', name: '알펜시아', country: '한국', region: '강원 평창', latitude: 37.658, longitude: 128.673, baseElevation: 700, topElevation: 950 },
  // 해외 (가족 여행 인기 일본 스키장)
  { id: 'niseko', name: '니세코 (그랜드 히라후)', country: '일본', region: '홋카이도', latitude: 42.848, longitude: 140.688, baseElevation: 260, topElevation: 1200 },
  { id: 'rusutsu', name: '루수츠', country: '일본', region: '홋카이도', latitude: 42.749, longitude: 140.9, baseElevation: 400, topElevation: 994 },
  { id: 'hakuba', name: '하쿠바 (핫포오네)', country: '일본', region: '나가노', latitude: 36.698, longitude: 137.831, baseElevation: 760, topElevation: 1830 },
  { id: 'shiga', name: '시가고원', country: '일본', region: '나가노', latitude: 36.744, longitude: 138.508, baseElevation: 1300, topElevation: 2307 },
  { id: 'zao', name: '자오 온천', country: '일본', region: '야마가타', latitude: 38.164, longitude: 140.4, baseElevation: 780, topElevation: 1660 },
];

export const DEFAULT_RESORT_ID = 'yongpyong';
