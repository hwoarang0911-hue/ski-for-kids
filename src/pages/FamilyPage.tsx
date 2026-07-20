import { useState } from 'react';
import { useAccount, type FamilyMember } from '../lib/account';
import { SKILL_SHORT } from '../lib/recommend';
import { MemberForm, type MemberDraft } from '../components/MemberForm';
import { MemberRecommendation } from '../components/MemberRecommendation';
import { Icon, LuPencil, LuTrash2, LuPlus, LuUser, LuUserPlus } from '../lib/icons';

export function FamilyPage() {
  const { name, isGuest, setName, members, addMember, updateMember, removeMember } = useAccount();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const promptName = () => {
    const input = window.prompt('가족 이름(또는 계정 이름)을 정해주세요', name ?? '');
    if (input !== null) setName(input);
  };

  const handleAdd = (draft: MemberDraft) => {
    const id = addMember(draft);
    setAdding(false);
    setExpandedId(id);
  };

  const handleEdit = (id: string, draft: MemberDraft) => {
    updateMember(id, draft);
    setEditingId(null);
  };

  const confirmRemove = (m: FamilyMember) => {
    if (window.confirm(`'${m.name}' 구성원을 삭제할까요?`)) removeMember(m.id);
  };

  return (
    <div className="page">
      <h2 className="page-title">가족</h2>

      {/* 계정 상태 */}
      <div className="card account-card">
        <div className="account-head">
          <span className="account-avatar"><LuUser size={22} /></span>
          <div className="account-meta">
            {isGuest ? (
              <>
                <strong>게스트</strong>
                <span>정보는 이 기기에만 저장돼요</span>
              </>
            ) : (
              <>
                <strong>{name} 가족</strong>
                <span>구성원 {members.length}명 · 이 기기에 저장됨</span>
              </>
            )}
          </div>
          <button className="btn-ghost sm" onClick={promptName}>
            {isGuest ? '이름 설정' : '이름 변경'}
          </button>
        </div>
      </div>

      {/* 구성원 목록 */}
      {members.length === 0 && !adding && (
        <div className="card empty-card">
          <LuUserPlus size={30} />
          <p>가족 구성원을 추가하면 키·몸무게·실력에 맞는 추천 세팅을 바로 알려드려요.</p>
        </div>
      )}

      {members.map((m) =>
        editingId === m.id ? (
          <div className="card" key={m.id}>
            <h3 className="card-title">구성원 수정</h3>
            <MemberForm initial={m} onSubmit={(d) => handleEdit(m.id, d)} onCancel={() => setEditingId(null)} />
          </div>
        ) : (
          <div className="card member-card" key={m.id}>
            <button className="member-head" onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
              <span className="member-avatar"><Icon name="user" size={20} /></span>
              <span className="member-info">
                <strong>{m.name}</strong>
                <span className="member-sub">
                  {m.relation} · {m.heightCm}cm · {m.weightKg}kg · {SKILL_SHORT[m.level]}
                </span>
              </span>
              <span className="member-chevron">{expandedId === m.id ? '▾' : '▸'}</span>
            </button>
            {expandedId === m.id && (
              <>
                <MemberRecommendation member={m} />
                <div className="member-actions">
                  <button className="btn-ghost sm" onClick={() => { setEditingId(m.id); setExpandedId(null); }}>
                    <LuPencil size={14} /> 수정
                  </button>
                  <button className="btn-ghost sm danger" onClick={() => confirmRemove(m)}>
                    <LuTrash2 size={14} /> 삭제
                  </button>
                </div>
              </>
            )}
          </div>
        ),
      )}

      {/* 추가 폼 / 버튼 */}
      {adding ? (
        <div className="card">
          <h3 className="card-title">구성원 추가</h3>
          <MemberForm onSubmit={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      ) : (
        <button className="btn-primary full" onClick={() => setAdding(true)}>
          <LuPlus size={18} /> 가족 구성원 추가
        </button>
      )}

      <p className="data-note">
        로그인·다기기 동기화는 아직 없어요. 지금은 이 기기(브라우저)에만 안전하게 저장됩니다.
      </p>
    </div>
  );
}
