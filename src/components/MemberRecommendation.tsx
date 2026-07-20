import { useMemo } from 'react';
import type { FamilyMember } from '../lib/account';
import {
  recommendSkiLength,
  recommendPoleLength,
  recommendDin,
  styleFromLevel,
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
    const din =
      member.bootSoleMm && member.bootSoleMm >= 180
        ? recommendDin(member.weightKg, member.heightCm, member.bootSoleMm, style, youngOrOld)
        : null;
    return { ski, pole, din, needSole: !member.bootSoleMm };
  }, [member]);

  return (
    <div className="rec-box">
      <div className="rec-row">
        <span className="rec-key"><Icon name="ruler" /> 스키 길이</span>
        <span className="rec-val">{Math.round(rec.ski.min)}~{Math.round(rec.ski.max)}cm</span>
      </div>
      <p className="rec-note">{rec.ski.note}</p>

      <div className="rec-row">
        <span className="rec-key"><Icon name="pole" /> 폴 길이</span>
        <span className="rec-val">
          {member.level === 'first' ? '없이 시작 권장' : `약 ${rec.pole}cm`}
        </span>
      </div>

      <div className="rec-row">
        <span className="rec-key"><Icon name="din" /> DIN 참고값</span>
        <span className="rec-val">
          {rec.din !== null ? rec.din.toFixed(2) : rec.needSole ? '부츠 밑창 길이 입력 필요' : '표 범위 밖'}
        </span>
      </div>
      <p className="rec-disclaimer">
        DIN은 참고용이에요. 실제 조정은 반드시 장비샵에서 받으세요.
      </p>
    </div>
  );
}
