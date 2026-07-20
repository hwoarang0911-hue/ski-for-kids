import { describeWeatherCode, type HourPoint } from '../lib/weather';

function fmtVisibility(m: number): string {
  return m >= 10000 ? '10km+' : m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`;
}

export function WeatherCard({ now }: { now: HourPoint }) {
  const wc = describeWeatherCode(now.weatherCode);
  const rows: { icon: string; name: string; value: string }[] = [
    { icon: '🌡️', name: '기온', value: `${now.temp.toFixed(1)}°C` },
    { icon: '🧣', name: '체감', value: `${now.apparent.toFixed(1)}°C` },
    { icon: wc.emoji, name: '하늘', value: wc.label },
    { icon: '💨', name: '바람', value: `${now.windSpeed.toFixed(0)}km/h` },
    { icon: '👀', name: '시야', value: fmtVisibility(now.visibility) },
    {
      icon: '☔',
      name: '강수',
      value: now.snowfall >= 0.1 ? `눈 ${now.snowfall.toFixed(1)}cm/h` : now.precipitation >= 0.1 ? `${now.precipitation.toFixed(1)}mm/h` : '없음',
    },
    { icon: '⛄', name: '적설', value: now.snowDepth > 0 ? `${(now.snowDepth * 100).toFixed(0)}cm` : '-' },
    { icon: '☁️', name: '구름', value: `${now.cloudCover.toFixed(0)}%` },
  ];
  return (
    <div className="card weather-card">
      <div className="weather-grid">
        {rows.map((r) => (
          <div className="weather-cell" key={r.name}>
            <span className="weather-icon" aria-hidden>{r.icon}</span>
            <span className="weather-name">{r.name}</span>
            <span className="weather-value">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
