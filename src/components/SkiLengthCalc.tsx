import { useState } from 'react';
import { recommendSkiLength, SKILL_LABELS, type SkillLevel } from '../lib/recommend';

export function SkiLengthCalc() {
  const [height, setHeight] = useState('');
  const [level, setLevel] = useState<SkillLevel>('first');
  const h = parseFloat(height);
  const valid = !Number.isNaN(h) && h >= 80 && h <= 210;
  const result = valid ? recommendSkiLength(h, level) : null;

  return (
    <div className="calc">
      <div className="calc-row">
        <label htmlFor="ski-height">아이 키 (cm)</label>
        <input
          id="ski-height"
          type="number"
          inputMode="decimal"
          placeholder="예: 120"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <div className="calc-row">
        <label htmlFor="ski-level">스키 경험</label>
        <select id="ski-level" value={level} onChange={(e) => setLevel(e.target.value as SkillLevel)}>
          {(Object.keys(SKILL_LABELS) as SkillLevel[]).map((l) => (
            <option key={l} value={l}>{SKILL_LABELS[l]}</option>
          ))}
        </select>
      </div>
      {result && (
        <div className="calc-result">
          <strong>{Math.round(result.min)} ~ {Math.round(result.max)}cm</strong>
          <p>{result.note}</p>
        </div>
      )}
      {!valid && height !== '' && <p className="calc-hint">키를 80~210cm 사이로 입력해주세요.</p>}
    </div>
  );
}
