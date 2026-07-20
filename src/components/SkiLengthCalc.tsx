import { useState } from 'react';
import { refineSkiLength, SKILL_LABELS, type SkillLevel, type TurnStyle } from '../lib/recommend';

const TURN_LABELS: Record<TurnStyle, string> = {
  short: '숏턴·초보 슬로프 위주',
  all: '올라운드(기본)',
  long: '고속·롱턴·파우더 위주',
};

export function SkiLengthCalc() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [level, setLevel] = useState<SkillLevel>('first');
  const [turn, setTurn] = useState<TurnStyle>('all');

  const h = parseFloat(height);
  const w = parseFloat(weight);
  const validH = !Number.isNaN(h) && h >= 80 && h <= 210;
  const weightKg = !Number.isNaN(w) && w >= 10 && w <= 150 ? w : undefined;
  const r = validH ? refineSkiLength(h, weightKg, level, turn) : null;

  return (
    <div className="calc">
      <div className="form-2col">
        <div className="calc-row">
          <label htmlFor="sl-height">키 (cm)</label>
          <input id="sl-height" type="number" inputMode="decimal" placeholder="120" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div className="calc-row">
          <label htmlFor="sl-weight">몸무게 (kg, 선택)</label>
          <input id="sl-weight" type="number" inputMode="decimal" placeholder="24" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
      </div>
      <div className="calc-row">
        <label htmlFor="sl-level">스키 경험</label>
        <select id="sl-level" value={level} onChange={(e) => setLevel(e.target.value as SkillLevel)}>
          {(Object.keys(SKILL_LABELS) as SkillLevel[]).map((l) => (
            <option key={l} value={l}>{SKILL_LABELS[l]}</option>
          ))}
        </select>
      </div>
      <div className="calc-row">
        <label htmlFor="sl-turn">주로 타는 스타일</label>
        <select id="sl-turn" value={turn} onChange={(e) => setTurn(e.target.value as TurnStyle)}>
          {(Object.keys(TURN_LABELS) as TurnStyle[]).map((t) => (
            <option key={t} value={t}>{TURN_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {r && (
        <div className="calc-result">
          <strong>{r.recommended}cm</strong>
          <span className="calc-result-sub">추천 · 범위 {r.min}~{r.max}cm</span>
        </div>
      )}
      {r && r.factors.length > 0 && (
        <ul className="calc-factors">
          {r.factors.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
      {!validH && height !== '' && <p className="calc-hint">키를 80~210cm 사이로 입력해주세요.</p>}

      <div className="calc-explain">
        <h5>길이를 바꾸면 어떻게 달라지나요?</h5>
        <p><strong>더 길게</strong> — 고속에서 안정적이고 파우더에서 잘 뜨며 직진성이 좋아요. 대신 회전이 무겁고, 초보나 가벼운 아이에겐 다루기 버거워요.</p>
        <p><strong>더 짧게</strong> — 회전이 가볍고 방향 바꾸기가 쉬워 배우기 좋아요. 대신 고속에서 덜 안정적이고 잘 흔들려요.</p>
        <p className="calc-tip">헷갈리면 짧은 쪽을 고르세요. 특히 처음 배우는 아이는 짧을수록 성공 경험이 빨라요.</p>
      </div>
      <p className="calc-source">참고: PSIA 어린이 티칭 가이드 · evo·SkiCanada 스키 사이즈 가이드 (키·체중·실력·턴 성향을 종합, 스키를 세워 턱~머리 높이 기준)</p>
    </div>
  );
}
