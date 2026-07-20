import { GEAR_SECTIONS } from '../data/gearContent';
import { Accordion } from '../components/Accordion';
import { SkiLengthCalc } from '../components/SkiLengthCalc';
import { PoleCalc } from '../components/PoleCalc';
import { DinCalc } from '../components/DinCalc';
import { GearMemberSetting } from '../components/GearMemberSetting';

export function GearPage() {
  return (
    <div className="page">
      <h2 className="page-title">장비 가이드</h2>
      <p className="page-intro">
        비싼 장비보다 <strong>맞는 장비</strong>가 좋은 장비예요. 가족 구성원을 고르면 맞춤
        세팅을 바로 보여드리고, 아래 계산기로 직접 확인할 수도 있어요.
      </p>

      <GearMemberSetting />

      <h3 className="gear-subhead">직접 계산해보기</h3>

      <Accordion icon="ruler" title="스키 길이 계산기">
        <SkiLengthCalc />
      </Accordion>
      <Accordion icon="pole" title="폴 길이 계산기">
        <PoleCalc />
      </Accordion>
      <Accordion icon="din" title="딘(DIN) 참고값 계산기">
        <DinCalc />
      </Accordion>

      {GEAR_SECTIONS.map((section) => (
        <Accordion key={section.id} icon={section.icon} title={section.title}>
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
    </div>
  );
}
