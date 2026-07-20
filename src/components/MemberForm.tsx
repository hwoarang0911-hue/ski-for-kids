import { useState } from 'react';
import type { FamilyMember, Relation } from '../lib/account';
import { SKILL_LABELS, type SkillLevel } from '../lib/recommend';

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
  const [bootSoleMm, setBootSoleMm] = useState(initial?.bootSoleMm ? String(initial.bootSoleMm) : '');

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
    const sole = parseFloat(bootSoleMm);
    if (!Number.isNaN(sole) && sole >= 180 && sole <= 400) draft.bootSoleMm = sole;
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

      <div className="calc-row">
        <label htmlFor="mf-level">스키 실력</label>
        <select id="mf-level" value={level} onChange={(e) => setLevel(e.target.value as SkillLevel)}>
          {LEVELS.map((l) => (
            <option key={l} value={l}>{SKILL_LABELS[l]}</option>
          ))}
        </select>
      </div>

      <div className="form-2col">
        <div className="calc-row">
          <label htmlFor="mf-birth">출생연도(선택)</label>
          <input id="mf-birth" type="number" inputMode="numeric" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="2017" />
        </div>
        <div className="calc-row">
          <label htmlFor="mf-sole">부츠 밑창 mm(선택)</label>
          <input id="mf-sole" type="number" inputMode="decimal" value={bootSoleMm} onChange={(e) => setBootSoleMm(e.target.value)} placeholder="245" />
        </div>
      </div>
      <p className="form-hint">출생연도·부츠 밑창은 DIN 정확도를 높여줘요(선택 입력).</p>

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
