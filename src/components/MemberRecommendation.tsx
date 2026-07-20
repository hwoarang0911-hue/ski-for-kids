import { useMemo } from 'react';
import type { FamilyMember } from '../lib/account';
import {
  recommendSkiLength,
  recommendPoleLength,
  recommendDin,
  estimateSoleMm,
  styleFromLevel,
  STYLE_LABELS,
} from '../lib/recommend';
import { Icon } from '../lib/icons';

/** 구성원 신체정보 → 추천 세팅. member가 바뀌면 자동으로 다시 계산된다. */
export function MemberRecommendation({ member }: { member: FamilyMember }) {
  const rec = useMemo(() => {
    const ski = recommendSkiLength(member.heightCm, member.level);
    const pole = recommendPoleLength(member.heightCm);
    const style = member.style ?? styleFromLevel(member.level);
    const age = member.birthYear ? new Date().getFullYear() - member.birthYear : undefined;
    const youngOrOld = age !== undefined ? age < 10 || age >= 50 : member.heightCm < 140;
    const sole = estimateSoleMm(member.heightCm);
    const din = recommendDin(member.weightKg, member.heightCm, sole, style, youngOrOld);
    return { ski, pole, din, style };
  }, [member]);

  const poleText = member.level === 'first' ? '없이 시작 권장' : `약 ${rec.pole}cm`;

  return (
    <div className="rec-box">
      {/* 값만 모아서 위에 */}
      <div className="rec-rows">
        <div className="rec-row">
          <span className="rec-key"><Icon name="ruler" /> 스키 길이</span>
          <span className="rec-val">{Math.round(rec.ski.min)}~{Math.round(rec.ski.max)}cm</span>
        </div>
        <div className="rec-row">
          <span className="rec-key"><Icon name="pole" /> 폴 길이</span>
          <span className="rec-val">{poleText}</span>
        </div>
        <div className="rec-row">
          <span className="rec-key"><Icon name="din" /> DIN 참고값</span>
          <span className="rec-val">{rec.din !== null ? rec.din.toFixed(2) : '샵 상담'}</span>
        </div>
      </div>

      {/* 부가 설명은 아래에 한번에 모아서 */}
      <div className="rec-notes">
        <p><strong>스키 길이</strong> — {rec.ski.note}</p>
        {member.level === 'first' && (
          <p><strong>폴</strong> — 처음 배울 땐 폴 없이 시작하는 게 A자 연습에 좋아요.</p>
        )}
        <p><strong>DIN</strong> — 스타일 「{STYLE_LABELS[rec.style]}」 기준, 부츠 밑창 길이는 키로 자동 추정한 참고값이에요. 실제 조정은 반드시 장비샵에서 받으세요.</p>
      </div>
    </div>
  );
}
