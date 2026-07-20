import type { Resort } from '../data/resorts';

/** Open-Meteo 응답을 앱에서 쓰기 좋은 형태로 정리한 것 */
export interface HourPoint {
  time: Date;
  temp: number;
  apparent: number;
  precipitation: number; // mm
  rain: number; // mm
  snowfall: number; // cm
  snowDepth: number; // m
  cloudCover: number; // %
  visibility: number; // m
  windSpeed: number; // km/h
  weatherCode: number;
}

export interface DayPoint {
  date: Date;
  tempMax: number;
  tempMin: number;
  snowfallSum: number; // cm
  precipitationSum: number; // mm
}

export interface ResortWeather {
  hours: HourPoint[];
  days: DayPoint[];
  /** hours 배열에서 현재 시각에 해당하는 인덱스 */
  nowIndex: number;
  fetchedAt: Date;
}

const API = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(resort: Resort): Promise<ResortWeather> {
  const params = new URLSearchParams({
    latitude: String(resort.latitude),
    longitude: String(resort.longitude),
    elevation: String(resort.baseElevation),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'precipitation',
      'rain',
      'snowfall',
      'snow_depth',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'weather_code',
    ].join(','),
    daily: ['temperature_2m_max', 'temperature_2m_min', 'snowfall_sum', 'precipitation_sum'].join(','),
    timezone: 'auto',
    past_days: '1',
    forecast_days: '2',
  });

  const res = await fetch(`${API}?${params}`);
  if (!res.ok) throw new Error(`날씨 정보를 가져오지 못했어요 (HTTP ${res.status})`);
  const json = await res.json();

  const h = json.hourly;
  const hours: HourPoint[] = h.time.map((t: string, i: number) => ({
    time: new Date(t),
    temp: h.temperature_2m[i],
    apparent: h.apparent_temperature[i],
    precipitation: h.precipitation[i] ?? 0,
    rain: h.rain[i] ?? 0,
    snowfall: h.snowfall[i] ?? 0,
    snowDepth: h.snow_depth[i] ?? 0,
    cloudCover: h.cloud_cover[i] ?? 0,
    visibility: h.visibility[i] ?? 20000,
    windSpeed: h.wind_speed_10m[i] ?? 0,
    weatherCode: h.weather_code[i] ?? 0,
  }));

  const d = json.daily;
  const days: DayPoint[] = d.time.map((t: string, i: number) => ({
    date: new Date(t),
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    snowfallSum: d.snowfall_sum[i] ?? 0,
    precipitationSum: d.precipitation_sum[i] ?? 0,
  }));

  const now = Date.now();
  let nowIndex = hours.findIndex((p) => p.time.getTime() > now) - 1;
  if (nowIndex < 0) nowIndex = nowIndex === -2 ? hours.length - 1 : 0;

  return { hours, days, nowIndex, fetchedAt: new Date() };
}

/** WMO weather code → 한국어 설명 + 이모지 */
export function describeWeatherCode(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: '맑음', emoji: '☀️' };
  if (code === 1) return { label: '대체로 맑음', emoji: '🌤️' };
  if (code === 2) return { label: '구름 조금', emoji: '⛅' };
  if (code === 3) return { label: '흐림', emoji: '☁️' };
  if (code === 45 || code === 48) return { label: '안개', emoji: '🌫️' };
  if (code >= 51 && code <= 57) return { label: '이슬비', emoji: '🌦️' };
  if (code >= 61 && code <= 67) return { label: '비', emoji: '🌧️' };
  if (code >= 71 && code <= 77) return { label: '눈', emoji: '🌨️' };
  if (code >= 80 && code <= 82) return { label: '소나기', emoji: '🌧️' };
  if (code === 85 || code === 86) return { label: '소낙눈', emoji: '🌨️' };
  if (code >= 95) return { label: '뇌우', emoji: '⛈️' };
  return { label: '흐림', emoji: '☁️' };
}
