import { useState } from 'react';
import { TIPS, type TipCategory } from '../data/tips';
import { RESOURCES, RESOURCE_CATEGORIES } from '../data/resources';
import { TEACHING_INTRO, TEACHING_STAGES } from '../data/teachingGuide';
import { TipCard } from '../components/TipCard';
import { ResourceCard } from '../components/ResourceCard';
import { Accordion } from '../components/Accordion';

const TIP_CATEGORIES: TipCategory[] = ['날씨·설질', '아이와 함께', '장비', '안전', '재미'];

export function LearnPage() {
  const [tab, setTab] = useState<'teach' | 'tips' | 'resources'>('teach');
  const [tipCategory, setTipCategory] = useState<TipCategory | '전체'>('전체');

  const visibleTips = tipCategory === '전체' ? TIPS : TIPS.filter((t) => t.category === tipCategory);

  return (
    <div className="page">
      <h2 className="page-title">배움터 📚</h2>
      <div className="segment">
        <button className={tab === 'teach' ? 'active' : ''} onClick={() => setTab('teach')}>가르치기</button>
        <button className={tab === 'tips' ? 'active' : ''} onClick={() => setTab('tips')}>팁 모음</button>
        <button className={tab === 'resources' ? 'active' : ''} onClick={() => setTab('resources')}>자료실</button>
      </div>

      {tab === 'teach' && (
        <>
          <div className="card">
            <h3 className="card-title">{TEACHING_INTRO.title}</h3>
            <p className="teach-intro">{TEACHING_INTRO.body}</p>
            <p className="source-note">참고: {TEACHING_INTRO.source}</p>
          </div>
          {TEACHING_STAGES.map((stage) => (
            <Accordion key={stage.id} emoji={stage.emoji} title={stage.title}>
              <p className="stage-goal">🎯 목표: {stage.goal}</p>
              <div className="content-item">
                <h4>이렇게 해요</h4>
                <ul className="stage-list">
                  {stage.how.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
              {stage.games && (
                <div className="content-item">
                  <h4>게임처럼 익히기</h4>
                  <ul className="stage-list">
                    {stage.games.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="content-item">
                <h4>다음 단계로 가도 되는 신호</h4>
                <ul className="stage-list stage-ready">
                  {stage.ready.map((r, i) => (
                    <li key={i}>✅ {r}</li>
                  ))}
                </ul>
              </div>
              <div className="parent-tip">
                <strong>부모 팁</strong>
                <p>{stage.parentTip}</p>
              </div>
            </Accordion>
          ))}
        </>
      )}

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
