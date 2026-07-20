import type { HourPoint } from '../lib/weather';
import { METRIC_ICONS, weatherCodeIcon } from '../lib/icons';
import type { IconType } from 'react-icons';

function fmtVisibility(m: number): string {
  return m >= 10000 ? '10km+' : m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`;
}

export function WeatherCard({ now }: { now: HourPoint }) {
  const wc = weatherCodeIcon(now.weatherCode);
  const rows: { Icon: IconType; name: string; value: string }[] = [
    { Icon: METRIC_ICONS.temp, name: '기온', value: `${now.temp.toFixed(1)}°C` },
    { Icon: METRIC_ICONS.apparent, name: '체감', value: `${now.apparent.toFixed(1)}°C` },
    { Icon: wc.Icon, name: '하늘', value: wc.label },
    { Icon: METRIC_ICONS.wind, name: '바람', value: `${now.windSpeed.toFixed(0)}km/h` },
    { Icon: METRIC_ICONS.visibility, name: '시야', value: fmtVisibility(now.visibility) },
    {
      Icon: METRIC_ICONS.precipitation,
      name: '강수',
      value: now.snowfall >= 0.1 ? `눈 ${now.snowfall.toFixed(1)}cm/h` : now.precipitation >= 0.1 ? `${now.precipitation.toFixed(1)}mm/h` : '없음',
    },
    { Icon: METRIC_ICONS.snowDepth, name: '적설', value: now.snowDepth > 0 ? `${(now.snowDepth * 100).toFixed(0)}cm` : '-' },
    { Icon: METRIC_ICONS.cloud, name: '구름', value: `${now.cloudCover.toFixed(0)}%` },
  ];
  return (
    <div className="card weather-card">
      <div className="weather-grid">
        {rows.map((r) => (
          <div className="weather-cell" key={r.name}>
            <span className="weather-icon"><r.Icon size={20} aria-hidden /></span>
            <span className="weather-name">{r.name}</span>
            <span className="weather-value">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
