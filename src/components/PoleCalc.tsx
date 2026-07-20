import { useState } from 'react';

/**
 * 폴 길이 추천: 키 × 0.68~0.70 (5cm 단위 반올림).
 * 팔꿈치가 90도가 되는 길이와 거의 같다.
 */
export function PoleCalc() {
  const [height, setHeight] = useState('');
  const h = parseFloat(height);
  const valid = !Number.isNaN(h) && h >= 80 && h <= 210;
  const exact = valid ? h * 0.69 : 0;
  const rounded = Math.round(exact / 5) * 5;

  return (
    <div className="calc">
      <div className="calc-row">
        <label htmlFor="pole-height">키 (cm)</label>
        <input
          id="pole-height"
          type="number"
          inputMode="decimal"
          placeholder="예: 120"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      {valid && (
        <div className="calc-result">
          <strong>약 {rounded}cm</strong>
          <p>
            폴을 뒤집어 바스켓 아래를 쥐었을 때 팔꿈치가 90도면 딱 맞아요.
            처음 배우는 아이는 폴 없이 시작하는 게 더 좋아요.
          </p>
        </div>
      )}
      {!valid && height !== '' && <p className="calc-hint">키를 80~210cm 사이로 입력해주세요.</p>}
    </div>
  );
}
