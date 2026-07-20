import { useState } from 'react';

/**
 * ISO 11088 간이 버전 DIN 참고값 계산기.
 * 실제 조정은 반드시 장비샵에서 받아야 하며, 여기 값은 참고용이다.
 */

// 스키어 코드: 체중(kg) 기준
const WEIGHT_CODES: { max: number; code: number }[] = [
  { max: 13, code: 0 }, // A
  { max: 17, code: 1 }, // B
  { max: 21, code: 2 }, // C
  { max: 25, code: 3 }, // D
  { max: 30, code: 4 }, // E
  { max: 35, code: 5 }, // F
  { max: 41, code: 6 }, // G
  { max: 48, code: 7 }, // H
  { max: 57, code: 8 }, // I
  { max: 66, code: 9 }, // J
  { max: 78, code: 10 }, // K
  { max: 94, code: 11 }, // L
  { max: Infinity, code: 12 }, // M
];

// 키(cm) 기준 코드 (성인용 — 148cm 이하는 체중 코드만 사용)
const HEIGHT_CODES: { max: number; code: number }[] = [
  { max: 148, code: 7 },
  { max: 157, code: 8 },
  { max: 166, code: 9 },
  { max: 178, code: 10 },
  { max: 194, code: 11 },
  { max: Infinity, code: 12 },
];

// DIN 표: [코드][부츠솔 구간] — null은 표 범위 밖(샵 상담)
const SOLE_BREAKS = [230, 250, 270, 290, 310, 330]; // ≤230, ≤250, ≤270, ≤290, ≤310, ≤330, >330
const DIN_TABLE: (number | null)[][] = [
  [0.75, 0.75, 0.75, null, null, null, null], // A
  [1.0, 0.75, 0.75, 0.75, null, null, null], // B
  [1.5, 1.25, 1.25, 1.0, null, null, null], // C
  [2.0, 1.75, 1.5, 1.5, 1.25, null, null], // D
  [2.5, 2.25, 2.0, 1.75, 1.5, 1.5, null], // E
  [3.0, 2.75, 2.5, 2.25, 2.0, 1.75, 1.75], // F
  [null, 3.5, 3.0, 2.75, 2.5, 2.25, 2.0], // G
  [null, null, 3.5, 3.0, 3.0, 2.75, 2.5], // H
  [null, null, 4.5, 4.0, 3.5, 3.5, 3.0], // I
  [null, null, 5.5, 5.0, 4.5, 4.0, 3.5], // J
  [null, null, 6.5, 6.0, 5.5, 5.0, 4.5], // K
  [null, null, 7.5, 7.0, 6.5, 6.0, 5.5], // L
  [null, null, null, 8.5, 8.0, 7.0, 6.5], // M
];

type SkierType = 1 | 2 | 3;

function soleColumn(soleMm: number): number {
  const idx = SOLE_BREAKS.findIndex((b) => soleMm <= b);
  return idx === -1 ? SOLE_BREAKS.length : idx;
}

function computeDin(weightKg: number, heightCm: number, soleMm: number, type: SkierType, ageUnder10OrOver50: boolean): number | null {
  let code = WEIGHT_CODES.find((w) => weightKg <= w.max)!.code;
  // 키 코드와 비교해 더 낮은(안전한) 쪽 사용 — 키가 작으면 체중 코드 그대로
  if (heightCm > 148) {
    const hCode = HEIGHT_CODES.find((h) => heightCm <= h.max)!.code;
    if (hCode < code) code = hCode;
  }
  if (type === 2) code += 1;
  if (type === 3) code += 2;
  if (ageUnder10OrOver50) code -= 1;
  code = Math.max(0, Math.min(DIN_TABLE.length - 1, code));
  return DIN_TABLE[code][soleColumn(soleMm)];
}

export function DinCalc() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [sole, setSole] = useState('');
  const [type, setType] = useState<SkierType>(1);
  const [ageFlag, setAgeFlag] = useState(true);

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const s = parseFloat(sole);
  const valid = !Number.isNaN(w) && w >= 10 && w <= 150 && !Number.isNaN(h) && h >= 80 && h <= 210 && !Number.isNaN(s) && s >= 180 && s <= 400;
  const din = valid ? computeDin(w, h, s, type, ageFlag) : null;

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
        <label htmlFor="din-sole">부츠 밑창 길이 (mm)</label>
        <input id="din-sole" type="number" inputMode="decimal" placeholder="부츠 뒤꿈치에 새겨져 있어요. 예: 245" value={sole} onChange={(e) => setSole(e.target.value)} />
      </div>
      <div className="calc-row">
        <label htmlFor="din-type">스키 스타일</label>
        <select id="din-type" value={type} onChange={(e) => setType(Number(e.target.value) as SkierType)}>
          <option value={1}>천천히 조심조심 (타입1)</option>
          <option value={2}>보통 속도 (타입2)</option>
          <option value={3}>빠르고 공격적 (타입3)</option>
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
        ⚠️ 이 값은 ISO 11088 간이표 기준 참고용이에요. 실제 조정은 반드시 전문 장비샵에서
        받으세요. 아이는 시즌마다 체중·부츠가 바뀌므로 매 시즌 재점검이 필요해요.
      </p>
    </div>
  );
}
