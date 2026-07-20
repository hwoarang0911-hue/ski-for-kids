import { useState } from 'react';
import { recommendDin, estimateSoleMm, STYLE_LABELS, type SkierStyle } from '../lib/recommend';

/**
 * ISO 11088 간이 버전 DIN 참고값 계산기.
 * 부츠 밑창 길이는 키로 자동 추정한다. 계산 로직은 lib/recommend.ts를 공유한다.
 */
export function DinCalc() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [type, setType] = useState<SkierStyle>(1);
  const [ageFlag, setAgeFlag] = useState(true);

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const valid = !Number.isNaN(w) && w >= 10 && w <= 150 && !Number.isNaN(h) && h >= 80 && h <= 210;
  const din = valid ? recommendDin(w, h, estimateSoleMm(h), type, ageFlag) : null;

  return (
    <div className="calc">
      <div className="calc-row">
        <label htmlFor="din-weight">체중 (kg)</label>
        <input id="din-weight" type="number" inputMode="decimal" placeholder="예: 25" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>
      <div className="calc-row">
        <label htmlFor="din-height">키 (cm)</label>
        <input id="din-height" type="number" inputMode="decimal" placeholder="예: 120" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>
      <div className="calc-row">
        <label htmlFor="din-type">스키 스타일</label>
        <select id="din-type" value={type} onChange={(e) => setType(Number(e.target.value) as SkierStyle)}>
          <option value={1}>{STYLE_LABELS[1]}</option>
          <option value={2}>{STYLE_LABELS[2]}</option>
          <option value={3}>{STYLE_LABELS[3]}</option>
        </select>
      </div>
      <div className="calc-row calc-check">
        <label>
          <input type="checkbox" checked={ageFlag} onChange={(e) => setAgeFlag(e.target.checked)} />
          만 10세 미만이거나 50세 이상이에요
        </label>
      </div>
      {valid && (
        <div className="calc-result">
          {din !== null ? (
            <>
              <strong>참고 DIN: {din.toFixed(2)}</strong>
              <p>바인딩 앞·뒤 창에 이 숫자가 오도록 샵에서 조정받으세요.</p>
            </>
          ) : (
            <p>입력 조합이 표 범위를 벗어나요. 장비샵에서 직접 상담받으세요.</p>
          )}
        </div>
      )}
      <p className="calc-disclaimer">
        이 값은 ISO 11088 간이표 기준 참고용이에요(부츠 밑창 길이는 키로 추정). 실제 조정은
        반드시 전문 장비샵에서 받으세요. 아이는 시즌마다 체중·부츠가 바뀌므로 매 시즌 재점검이 필요해요.
      </p>
    </div>
  );
}
