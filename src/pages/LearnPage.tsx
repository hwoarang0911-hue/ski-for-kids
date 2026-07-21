import { useState } from 'react';
import { TIPS, type TipCategory } from '../data/tips';
import { RESOURCES, RESOURCE_CATEGORIES } from '../data/resources';
import { TEACHING_INTRO, TEACHING_STAGES } from '../data/teachingGuide';
import { TECHNIQUE_SECTIONS } from '../data/technique';
import { TipCard } from '../components/TipCard';
import { ResourceCard } from '../components/ResourceCard';
import { Accordion } from '../components/Accordion';
import { Icon } from '../lib/icons';

const TIP_CATEGORIES: TipCategory[] = ['날씨·설질', '아이와 함께', '장비', '안전', '재미'];

export function LearnPage() {
  const [tab, setTab] = useState<'teach' | 'technique' | 'tips' | 'resources'>('teach');
  const [tipCategory, setTipCategory] = useState<TipCategory | '전체'>('전체');

  const visibleTips = tipCategory === '전체' ? TIPS : TIPS.filter((t) => t.category === tipCategory);

  return (
    <div className="page">
      <h2 className="page-title">배움터</h2>
      <div className="segment">
        <button className={tab === 'teach' ? 'active' : ''} onClick={() => setTab('teach')}>가르치기</button>
        <button className={tab === 'technique' ? 'active' : ''} onClick={() => setTab('technique')}>기술</button>
        <button className={tab === 'tips' ? 'active' : ''} onClick={() => setTab('tips')}>팁 모음</button>
        <button className={tab === 'resources' ? 'active' : ''} onClick={() => setTab('resources')}>자료실</button>
      </div>

      {tab === 'technique' && (
        <>
          <p className="page-intro">
            기술을 완벽하게 배우기보다, "왜 그렇게 하는지"를 이해하면 스키가 안전하고
            즐거워져요. 슬로프에서 길을 읽는 법은 안전 탭의 「슬로프 읽기」도 함께 보세요.
          </p>
          {TECHNIQUE_SECTIONS.map((section, i) => (
            <Accordion key={section.id} icon={section.icon} title={section.title} defaultOpen={i === 0}>
              {section.intro && <p className="section-intro">{section.intro}</p>}
              {section.items.map((item) => (
                <div className="content-item" key={item.heading}>
                  <h4>{item.heading}</h4>
                  <p>{item.body}</p>
                </div>
              ))}
              {section.source && <p className="source-note">참고: {section.source}</p>}
            </Accordion>
          ))}
        </>
      )}

      {tab === 'teach' && (
        <>
          <div className="card">
            <h3 className="card-title">{TEACHING_INTRO.title}</h3>
            <p className="teach-intro">{TEACHING_INTRO.body}</p>
            <p className="source-note">참고: {TEACHING_INTRO.source}</p>
          </div>
          {TEACHING_STAGES.map((stage) => (
            <Accordion key={stage.id} icon={stage.id} title={stage.title}>
              <p className="stage-goal"><Icon name="goal" /> 목표: {stage.goal}</p>
              <div className="content-item">
                <h4>이렇게 해요</h4>
                <ul className="stage-list">
                  {stage.how.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
              <div className="content-item">
                <h4>다음 단계로 가도 되는 신호</h4>
                <ul className="stage-list stage-ready">
                  {stage.ready.map((r, i) => (
                    <li key={i}><Icon name="ready" className="ready-ico" /> {r}</li>
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
