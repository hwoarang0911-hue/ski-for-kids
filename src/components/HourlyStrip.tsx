import { describeWeatherCode, type ResortWeather } from '../lib/weather';

/** 현재 시각부터 앞으로 12시간 예보를 가로 스크롤로 보여준다 */
export function HourlyStrip({ weather }: { weather: ResortWeather }) {
  const { hours, nowIndex } = weather;
  const slice = hours.slice(nowIndex, nowIndex + 13);
  return (
    <div className="card hourly-card">
      <h3 className="card-title">시간별 예보</h3>
      <div className="hourly-strip">
        {slice.map((p, i) => {
          const wc = describeWeatherCode(p.weatherCode);
          return (
            <div className={`hourly-item${i === 0 ? ' now' : ''}`} key={p.time.toISOString()}>
              <span className="hourly-time">{i === 0 ? '지금' : `${p.time.getHours()}시`}</span>
              <span className="hourly-emoji" aria-label={wc.label}>{wc.emoji}</span>
              <span className="hourly-temp">{Math.round(p.temp)}°</span>
              {p.snowfall >= 0.1 && <span className="hourly-snow">❄{p.snowfall.toFixed(1)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
