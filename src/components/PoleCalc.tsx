import { useState } from 'react';
import { refinePoleLength, type PoleDiscipline } from '../lib/recommend';

const DISC_LABELS: Record<PoleDiscipline, string> = {
  all: '일반(기본)',
  short: '모굴·숏턴 위주',
  long: '레이싱·롱턴 위주',
};

export function PoleCalc() {
  const [height, setHeight] = useState('');
  const [disc, setDisc] = useState<PoleDiscipline>('all');
  const h = parseFloat(height);
  const valid = !Number.isNaN(h) && h >= 80 && h <= 210;
  const rec = valid ? refinePoleLength(h, disc) : 0;

  return (
    <div className="calc">
      <div className="calc-row">
        <label htmlFor="pl-height">키 (cm)</label>
        <input id="pl-height" type="number" inputMode="decimal" placeholder="120" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>
      <div className="calc-row">
        <label htmlFor="pl-disc">종목 성향</label>
        <select id="pl-disc" value={disc} onChange={(e) => setDisc(e.target.value as PoleDiscipline)}>
          {(Object.keys(DISC_LABELS) as PoleDiscipline[]).map((d) => (
            <option key={d} value={d}>{DISC_LABELS[d]}</option>
          ))}
        </select>
      </div>

      {valid && (
        <div className="calc-result">
          <strong>약 {rec}cm</strong>
          <span className="calc-result-sub">추천 폴 길이</span>
        </div>
      )}
      {!valid && height !== '' && <p className="calc-hint">키를 80~210cm 사이로 입력해주세요.</p>}

      <div className="calc-explain">
        <h5>정확히 맞는지 확인하는 법</h5>
        <p>폴을 <strong>거꾸로</strong> 뒤집어 바스켓 바로 아래를 잡고 팁을 천장으로 세워요. 이때 <strong>팔꿈치가 직각(90°)</strong>이고 팔뚝이 바닥과 평행하면 딱 맞아요. 폴이 없으면 부츠를 신고 팔꿈치를 90°로 든 뒤 손에서 바닥까지 재고 약 5cm를 더하면 됩니다.</p>
        <h5>길이를 바꾸면?</h5>
        <p><strong>더 길게</strong> — 깊은 눈이나 롱턴에 유리해요. 대신 폴 플랜트 타이밍이 늦고 어깨가 들려 자세가 흐트러져요.</p>
        <p><strong>더 짧게</strong> — 모굴·숏턴에서 빠르게 폴을 찍기 좋아요. 너무 짧으면 상체가 앞으로 숙여지니 주의하세요.</p>
        <p className="calc-tip">처음 배우는 아이는 폴 없이 시작하는 게 A자 연습에 방해가 없어 좋아요. 평행 턴을 배울 때 쥐여주세요.</p>
      </div>
      <p className="calc-source">참고: evo·Scott 폴 사이즈 가이드 (거꾸로 잡고 팔꿈치 90° 방식)</p>
    </div>
  );
}
