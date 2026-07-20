import { useState } from 'react';
import type { FamilyMember, Relation } from '../lib/account';
import { SKILL_LABELS, STYLE_LABELS, type SkillLevel, type SkierStyle } from '../lib/recommend';

const RELATIONS: Relation[] = ['본인', '배우자', '자녀', '부모', '기타'];
const LEVELS = Object.keys(SKILL_LABELS) as SkillLevel[];

export type MemberDraft = Omit<FamilyMember, 'id'>;

interface Props {
  initial?: FamilyMember;
  onSubmit: (draft: MemberDraft) => void;
  onCancel: () => void;
}

export function MemberForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [relation, setRelation] = useState<Relation>(initial?.relation ?? '자녀');
  const [gender, setGender] = useState<'남' | '여' | ''>(initial?.gender ?? '');
  const [birthYear, setBirthYear] = useState(initial?.birthYear ? String(initial.birthYear) : '');
  const [heightCm, setHeightCm] = useState(initial?.heightCm ? String(initial.heightCm) : '');
  const [weightKg, setWeightKg] = useState(initial?.weightKg ? String(initial.weightKg) : '');
  const [level, setLevel] = useState<SkillLevel>(initial?.level ?? 'first');
  const [style, setStyle] = useState<SkierStyle | ''>(initial?.style ?? '');

  const h = parseFloat(heightCm);
  const w = parseFloat(weightKg);
  const valid = name.trim() !== '' && !Number.isNaN(h) && h >= 80 && h <= 210 && !Number.isNaN(w) && w >= 10 && w <= 150;

  const submit = () => {
    if (!valid) return;
    const draft: MemberDraft = {
      name: name.trim(),
      relation,
      heightCm: h,
      weightKg: w,
      level,
    };
    if (gender) draft.gender = gender;
    const by = parseInt(birthYear, 10);
    if (!Number.isNaN(by) && by > 1900 && by <= new Date().getFullYear()) draft.birthYear = by;
    if (style !== '') draft.style = style;
    onSubmit(draft);
  };

  return (
    <div className="member-form">
      <div className="calc-row">
        <label htmlFor="mf-name">이름/애칭</label>
        <input id="mf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 첫째, 아빠" />
      </div>

      <div className="form-2col">
        <div className="calc-row">
          <label htmlFor="mf-rel">관계</label>
          <select id="mf-rel" value={relation} onChange={(e) => setRelation(e.target.value as Relation)}>
            {RELATIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="calc-row">
          <label htmlFor="mf-gender">성별(선택)</label>
          <select id="mf-gender" value={gender} onChange={(e) => setGender(e.target.value as '남' | '여' | '')}>
            <option value="">미입력</option>
            <option value="남">남</option>
            <option value="여">여</option>
          </select>
        </div>
      </div>

      <div className="form-2col">
        <div className="calc-row">
          <label htmlFor="mf-height">키 (cm)</label>
          <input id="mf-height" type="number" inputMode="decimal" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="120" />
        </div>
        <div className="calc-row">
          <label htmlFor="mf-weight">몸무게 (kg)</label>
          <input id="mf-weight" type="number" inputMode="decimal" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="25" />
        </div>
      </div>

      <div className="form-2col">
        <div className="calc-row">
          <label htmlFor="mf-level">스키 경험</label>
          <select id="mf-level" value={level} onChange={(e) => setLevel(e.target.value as SkillLevel)}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{SKILL_LABELS[l]}</option>
            ))}
          </select>
        </div>
        <div className="calc-row">
          <label htmlFor="mf-style">스키 스타일</label>
          <select id="mf-style" value={style} onChange={(e) => setStyle(e.target.value === '' ? '' : (Number(e.target.value) as SkierStyle))}>
            <option value="">실력에 맞춤(자동)</option>
            <option value={1}>{STYLE_LABELS[1]}</option>
            <option value={2}>{STYLE_LABELS[2]}</option>
            <option value={3}>{STYLE_LABELS[3]}</option>
          </select>
        </div>
      </div>

      <div className="calc-row">
        <label htmlFor="mf-birth">출생연도(선택)</label>
        <input id="mf-birth" type="number" inputMode="numeric" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="2017" />
      </div>
      <p className="form-hint">스키 스타일은 DIN(이탈값) 참고치에, 출생연도는 어린이·고령 보정에 쓰여요.</p>

      <div className="form-actions">
        <button className="btn-ghost" onClick={onCancel}>취소</button>
        <button className="btn-primary" onClick={submit} disabled={!valid}>저장</button>
      </div>
      {!valid && (name !== '' || heightCm !== '' || weightKg !== '') && (
        <p className="calc-hint">이름과 키(80~210cm)·몸무게(10~150kg)를 올바르게 입력해주세요.</p>
      )}
    </div>
  );
}
