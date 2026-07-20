import { GEAR_SECTIONS } from '../data/gearContent';
import { Accordion } from '../components/Accordion';
import { SkiLengthCalc } from '../components/SkiLengthCalc';
import { PoleCalc } from '../components/PoleCalc';
import { DinCalc } from '../components/DinCalc';

export function GearPage() {
  return (
    <div className="page">
      <h2 className="page-title">장비 가이드 🎿</h2>
      <p className="page-intro">
        비싼 장비보다 <strong>맞는 장비</strong>가 좋은 장비예요. 계산기로 참고값을 확인하고,
        최종 조정은 장비샵에서 받으세요.
      </p>

      <Accordion emoji="📏" title="스키 길이 계산기" defaultOpen>
        <SkiLengthCalc />
      </Accordion>
      <Accordion emoji="🥢" title="폴 길이 계산기">
        <PoleCalc />
      </Accordion>
      <Accordion emoji="🔢" title="딘(DIN) 참고값 계산기">
        <DinCalc />
      </Accordion>

      {GEAR_SECTIONS.map((section) => (
        <Accordion key={section.id} emoji={section.emoji} title={section.title}>
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
