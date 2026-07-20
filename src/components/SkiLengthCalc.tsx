import { useState } from 'react';

type Level = 'first' | 'beginner' | 'intermediate';

/**
 * 어린이 스키 길이 추천.
 * 기준: 처음/초보는 턱 높이(키-20cm) 근처, 익숙해지면 코 높이(키-10cm)까지.
 */
function recommend(heightCm: number, level: Level): { min: number; max: number; note: string } {
  if (level === 'first') {
    return { min: heightCm - 25, max: heightCm - 18, note: '가슴~턱 높이. 짧을수록 돌리기 쉬워 처음 배우기 좋아요.' };
  }
  if (level === 'beginner') {
    return { min: heightCm - 20, max: heightCm - 13, note: '턱 높이 전후. A자(피자) 연습이 잘 되는 길이예요.' };
  }
  return { min: heightCm - 13, max: heightCm - 7, note: '턱~코 높이. 턴이 안정된 아이에게 맞아요.' };
}

export function SkiLengthCalc() {
  const [height, setHeight] = useState('');
  const [level, setLevel] = useState<Level>('first');
  const h = parseFloat(height);
  const valid = !Number.isNaN(h) && h >= 80 && h <= 200;
  const result = valid ? recommend(h, level) : null;

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
        <select id="ski-level" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
          <option value="first">아예 처음이에요</option>
          <option value="beginner">A자로 내려올 수 있어요</option>
          <option value="intermediate">양쪽 턴이 다 돼요</option>
        </select>
      </div>
      {result && (
        <div className="calc-result">
          <strong>{Math.round(result.min)} ~ {Math.round(result.max)}cm</strong>
          <p>{result.note}</p>
        </div>
      )}
      {!valid && height !== '' && <p className="calc-hint">키를 80~200cm 사이로 입력해주세요.</p>}
    </div>
  );
}
