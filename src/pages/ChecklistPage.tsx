import { useEffect, useState } from 'react';
import { CHECKLIST_GROUPS, CHECKLIST_TOTAL } from '../data/checklist';
import { Accordion } from '../components/Accordion';

const STORAGE_KEY = 'ski-for-kids.checklist';

function loadChecked(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecked);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const resetGroup = (groupId: string) => {
    const group = CHECKLIST_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    setChecked((c) => {
      const next = { ...c };
      for (const item of group.items) delete next[item.id];
      return next;
    });
  };

  const doneTotal = Object.values(checked).filter(Boolean).length;

  return (
    <div className="page">
      <h2 className="page-title">준비 체크리스트 ✅</h2>
      <p className="page-intro">
        체크한 내용은 이 기기에 저장돼요. 새 시즌·새 여행을 시작할 땐 각 목록의
        초기화 버튼을 누르세요.
      </p>

      <div className="card progress-card">
        <div className="progress-label">
          전체 진행 <strong>{doneTotal} / {CHECKLIST_TOTAL}</strong>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${CHECKLIST_TOTAL === 0 ? 0 : (doneTotal / CHECKLIST_TOTAL) * 100}%` }}
          />
        </div>
      </div>

      {CHECKLIST_GROUPS.map((group) => {
        const done = group.items.filter((i) => checked[i.id]).length;
        return (
          <Accordion
            key={group.id}
            emoji={group.emoji}
            title={`${group.title} (${done}/${group.items.length})`}
            defaultOpen={group.id === 'pack'}
          >
            {group.intro && <p className="section-intro">{group.intro}</p>}
            <ul className="check-list">
              {group.items.map((item) => (
                <li key={item.id}>
                  <label className={`check-row${checked[item.id] ? ' done' : ''}`}>
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                    />
                    <span className="check-text">
                      {item.text}
                      {item.note && <small>{item.note}</small>}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <button className="reset-btn" onClick={() => resetGroup(group.id)}>
              이 목록 초기화
            </button>
          </Accordion>
        );
      })}
    </div>
  );
}
