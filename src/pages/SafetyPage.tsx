import { SAFETY_SECTIONS } from '../data/safetyContent';
import { Accordion } from '../components/Accordion';

export function SafetyPage() {
  return (
    <div className="page">
      <h2 className="page-title">안전 가이드 🛟</h2>
      <p className="page-intro">
        재미있는 스키의 비밀은 안전이에요. 아이와 함께 읽어보고 슬로프에 나가기 전
        하나씩 약속해보세요.
      </p>
      {SAFETY_SECTIONS.map((section, i) => (
        <Accordion key={section.id} emoji={section.emoji} title={section.title} defaultOpen={i === 0}>
          {section.intro && <p className="section-intro">{section.intro}</p>}
          {section.items.map((item) => (
            <div className="content-item" key={item.heading}>
              <h4>{item.heading}</h4>
              <p>{item.body}</p>
            </div>
          ))}
        </Accordion>
      ))}
    </div>
  );
}
