import { useState } from 'react';
import { TIPS, type TipCategory } from '../data/tips';
import { RESOURCES, RESOURCE_CATEGORIES } from '../data/resources';
import { TipCard } from '../components/TipCard';
import { ResourceCard } from '../components/ResourceCard';

const TIP_CATEGORIES: TipCategory[] = ['날씨·설질', '아이와 함께', '장비', '안전', '재미'];

export function LearnPage() {
  const [tab, setTab] = useState<'tips' | 'resources'>('tips');
  const [tipCategory, setTipCategory] = useState<TipCategory | '전체'>('전체');

  const visibleTips = tipCategory === '전체' ? TIPS : TIPS.filter((t) => t.category === tipCategory);

  return (
    <div className="page">
      <h2 className="page-title">배움터 📚</h2>
      <div className="segment">
        <button className={tab === 'tips' ? 'active' : ''} onClick={() => setTab('tips')}>팁 모음</button>
        <button className={tab === 'resources' ? 'active' : ''} onClick={() => setTab('resources')}>자료실</button>
      </div>

      {tab === 'tips' && (
        <>
          <div className="chip-row">
            {(['전체', ...TIP_CATEGORIES] as const).map((c) => (
              <button
                key={c}
                className={`chip${tipCategory === c ? ' active' : ''}`}
                onClick={() => setTipCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="tip-list">
            {visibleTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </>
      )}

      {tab === 'resources' && (
        <>
          <p className="page-intro">
            유튜브와 해외 가족 스키 커뮤니티에서 고른 자료예요. 영어 자료는 자동 번역
            자막·번역 기능과 함께 보면 어렵지 않아요.
          </p>
          {RESOURCE_CATEGORIES.map((category) => (
            <section key={category} className="resource-section">
              <h3 className="resource-category">{category}</h3>
              {RESOURCES.filter((r) => r.category === category).map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </section>
          ))}
        </>
      )}
    </div>
  );
}
