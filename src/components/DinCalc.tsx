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
        <label htmlFor="din-type">스키어 타입 (스타일)</label>
        <select id="din-type" value={type} onChange={(e) => setType(Number(e.target.value) as SkierStyle)}>
          <option value={1}>타입 I — {STYLE_LABELS[1]} (초보·신중)</option>
          <option value={2}>타입 II — {STYLE_LABELS[2]} (일반 레저)</option>
          <option value={3}>타입 III — {STYLE_LABELS[3]} (상급·공격적)</option>
        </select>
      </div>
      <div className="calc-row calc-check">
        <label>
          <input type="checkbox" checked={ageFlag} onChange={(e) => setAgeFlag(e.target.checked)} />
          만 10세 미만이거나 50세 이상이에요 (한 단계 낮춤)
        </label>
      </div>
      {valid && (
        <div className="calc-result">
          {din !== null ? (
            <>
              <strong>참고 DIN {din.toFixed(2)}</strong>
              <span className="calc-result-sub">바인딩 앞·뒤 창의 눈금을 이 값에 맞춰요</span>
            </>
          ) : (
            <p>입력 조합이 표 범위를 벗어나요. 장비샵에서 직접 상담받으세요.</p>
          )}
        </div>
      )}

      <div className="calc-explain">
        <h5>스키어 타입이 뭔가요?</h5>
        <p><strong>타입 I</strong> 신중하게 완만한 슬로프를 천천히 — 안전 우선(초보·어린이 권장). <strong>타입 II</strong> 다양한 슬로프를 보통 속도로. <strong>타입 III</strong> 빠르고 공격적으로 급사면까지. 타입이 높을수록 DIN이 올라가요.</p>
        <h5>DIN을 바꾸면 어떻게 되나요?</h5>
        <p><strong>높이면</strong> — 강한 충격에도 잘 안 풀려 고속·공격적 스킹 중 원치 않는 이탈(오작동)을 막아요. 대신 넘어질 때 안 풀리면 무릎(ACL)·정강이 부상 위험이 커져요.</p>
        <p><strong>낮추면</strong> — 비틀림에 쉽게 풀려 부상 위험이 줄어요. 대신 타는 중에 스키가 원치 않게 벗겨져 넘어질 수 있어요.</p>
        <p className="calc-tip">레저 스키 부상의 상당수는 "넘어졌는데 안 풀려서" 생겨요. 그래서 초보·어린이는 타입 I(낮은 쪽)이 안전해요. 임의로 높이지 마세요.</p>
      </div>
      <p className="calc-disclaimer">
        이 값은 ISO 11088 표 기준 참고용이에요(부츠 밑창 길이는 키로 추정). 실제 조정은 반드시
        공인 기사가 검교정된 장비로 해야 하고, 아이는 시즌마다 체중·부츠가 바뀌므로 매 시즌 재점검이 필요해요.
      </p>
      <p className="calc-source">참고: ISO 11088 바인딩 이탈값 표준 · ANSI/미국스키장 안전 자료</p>
    </div>
  );
}
