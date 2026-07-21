import type { CSSProperties } from 'react';
import { FaPersonSkiing } from 'react-icons/fa6';
import { LuSnowflake } from 'react-icons/lu';

/** 눈 내리는 배경 위에서 스키어가 좌우로 움직이는 로딩 애니메이션 */
export function LoadingSkier() {
  return (
    <div className="loading-skier" aria-hidden>
      <div className="loading-snowfall">
        {Array.from({ length: 8 }).map((_, i) => (
          <LuSnowflake key={i} className="loading-flake" style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
      <FaPersonSkiing className="loading-skier-icon" />
    </div>
  );
}
