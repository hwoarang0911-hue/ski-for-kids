import { useState } from 'react';
import { useAccount } from '../lib/account';
import { SKILL_SHORT } from '../lib/recommend';
import { MemberForm, type MemberDraft } from './MemberForm';
import { MemberRecommendation } from './MemberRecommendation';
import { LuPencil, LuUserPlus, LuUsers } from '../lib/icons';

type Mode = 'view' | 'edit' | 'add';

/**
 * 장비 탭 상단: 가족 구성원을 고르면 신체정보 기반 추천 세팅을 보여준다.
 * 여기서 수정/추가하면 가족 탭과 같은 데이터(useAccount)에 저장된다.
 */
export function GearMemberSetting() {
  const { members, addMember, updateMember } = useAccount();
  const [selectedId, setSelectedId] = useState<string | null>(members[0]?.id ?? null);
  const [mode, setMode] = useState<Mode>('view');

  const selected = members.find((m) => m.id === selectedId) ?? members[0] ?? null;

  const handleAdd = (draft: MemberDraft) => {
    const id = addMember(draft);
    setSelectedId(id);
    setMode('view');
  };
  const handleEdit = (draft: MemberDraft) => {
    if (selected) updateMember(selected.id, draft);
    setMode('view');
  };

  return (
    <div className="card gear-member">
      <h3 className="card-title"><LuUsers size={17} /> 가족 맞춤 장비 세팅</h3>

      {members.length === 0 && mode !== 'add' && (
        <div className="gear-member-empty">
          <LuUserPlus size={26} />
          <p>가족 구성원을 등록하면 키·몸무게·실력에 맞는 스키·폴·DIN 세팅을 바로 알려드려요.</p>
          <button className="btn-primary full" onClick={() => setMode('add')}>
            <LuUserPlus size={18} /> 구성원 등록하기
          </button>
        </div>
      )}

      {mode === 'add' && (
        <>
          <p className="section-intro">새 구성원의 정보를 입력하면 가족 탭에도 저장돼요.</p>
          <MemberForm onSubmit={handleAdd} onCancel={() => setMode('view')} />
        </>
      )}

      {members.length > 0 && mode === 'view' && selected && (
        <>
          <div className="calc-row">
            <label htmlFor="gear-member-pick">누구의 장비를 볼까요?</label>
            <select
              id="gear-member-pick"
              className="resort-select"
              value={selected.id}
              onChange={(e) => {
                if (e.target.value === '__add') setMode('add');
                else setSelectedId(e.target.value);
              }}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.relation} · {m.heightCm}cm · {SKILL_SHORT[m.level]})
                </option>
              ))}
              <option value="__add">＋ 새 구성원 추가…</option>
            </select>
          </div>

          <MemberRecommendation member={selected} />

          <button className="btn-ghost sm" onClick={() => setMode('edit')}>
            <LuPencil size={14} /> 이 구성원 정보 수정
          </button>
        </>
      )}

      {mode === 'edit' && selected && (
        <>
          <p className="section-intro">수정하면 가족 탭 데이터도 함께 바뀌어요.</p>
          <MemberForm initial={selected} onSubmit={handleEdit} onCancel={() => setMode('view')} />
        </>
      )}
    </div>
  );
}
