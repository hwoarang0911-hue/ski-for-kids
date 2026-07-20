import { useEffect, useMemo, useState } from 'react';
import { RESORTS, DEFAULT_RESORT_ID } from '../data/resorts';
import { fetchWeather, type ResortWeather } from '../lib/weather';
import { estimateSnowCondition } from '../lib/snowCondition';
import { computeSkiIndex } from '../lib/skiIndex';
import { activeTags, pickTodaysTips } from '../lib/tipEngine';
import { ScoreDial } from '../components/ScoreDial';
import { WeatherCard } from '../components/WeatherCard';
import { HourlyStrip } from '../components/HourlyStrip';
import { TipCard } from '../components/TipCard';

const STORAGE_KEY = 'ski-for-kids.resort';

export function HomePage() {
  const [resortId, setResortId] = useState(() => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_RESORT_ID);
  const [weather, setWeather] = useState<ResortWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resort = RESORTS.find((r) => r.id === resortId) ?? RESORTS[0];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchWeather(resort)
      .then((w) => {
        if (!cancelled) setWeather(w);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : '날씨 정보를 가져오지 못했어요.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resortId]); // eslint-disable-line react-hooks/exhaustive-deps

  const derived = useMemo(() => {
    if (!weather) return null;
    const now = weather.hours[weather.nowIndex];
    if (!now) return null;
    const snow = estimateSnowCondition(weather);
    const index = computeSkiIndex(now, snow);
    const tips = pickTodaysTips(activeTags(now, snow), resort.id);
    return { now, snow, index, tips };
  }, [weather, resort.id]);

  const selectResort = (id: string) => {
    setResortId(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  return (
    <div className="page">
      <label className="resort-select-label" htmlFor="resort-select">스키장 선택</label>
      <select
        id="resort-select"
        className="resort-select"
        value={resort.id}
        onChange={(e) => selectResort(e.target.value)}
      >
        <optgroup label="국내">
          {RESORTS.filter((r) => r.country === '한국').map((r) => (
            <option key={r.id} value={r.id}>{r.name} · {r.region}</option>
          ))}
        </optgroup>
        <optgroup label="일본">
          {RESORTS.filter((r) => r.country === '일본').map((r) => (
            <option key={r.id} value={r.id}>{r.name} · {r.region}</option>
          ))}
        </optgroup>
      </select>

      {loading && (
        <div className="card center-card">
          <p className="loading-emoji">⛷️</p>
          <p>{resort.name} 날씨를 확인하고 있어요…</p>
        </div>
      )}

      {error && !loading && (
        <div className="card center-card">
          <p className="loading-emoji">😢</p>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => selectResort(resort.id)}>다시 시도</button>
        </div>
      )}

      {derived && !loading && !error && (
        <>
          <div className="card index-card">
            <h2 className="card-title">오늘의 스키 지수 <span className="card-subtitle">{resort.name} 기준</span></h2>
            <ScoreDial result={derived.index} />
            <p className="kids-summary">{derived.index.kidsSummary}</p>
            <div className="snow-badge-row">
              <span className={`snow-badge snow-${derived.snow.kind}`}>
                {derived.snow.emoji} 설질: {derived.snow.label}
              </span>
            </div>
            <p className="snow-desc">{derived.snow.description}</p>
            {derived.index.factors.length > 0 && (
              <details className="factor-details">
                <summary>지수 계산 근거 보기</summary>
                <ul>
                  {derived.index.factors.map((f) => (
                    <li key={f.name}>
                      <span className={f.impact < 0 ? 'factor-minus' : 'factor-plus'}>
                        {f.impact > 0 ? '+' : ''}{f.impact}
                      </span>{' '}
                      {f.note}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>

          <WeatherCard now={derived.now} />
          <HourlyStrip weather={weather!} />

          <div className="card">
            <h3 className="card-title">오늘의 팁 💡</h3>
            {derived.tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>

          <p className="data-note">
            날씨 데이터: Open-Meteo · 슬로프 베이스 고도({resort.baseElevation}m) 기준 ·{' '}
            {derived.now.time.getHours()}시 예보값
          </p>
        </>
      )}
    </div>
  );
}
