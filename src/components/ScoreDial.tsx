import type { SkiIndexResult } from '../lib/skiIndex';

const GRADE_COLORS: Record<SkiIndexResult['grade'], string> = {
  best: '#1fa564',
  good: '#5cb85c',
  fair: '#e8a13a',
  caution: '#e8722a',
  bad: '#d9455f',
};

/** 반원 게이지로 스키 지수를 표시 */
export function ScoreDial({ result }: { result: SkiIndexResult }) {
  const { score, label, emoji, grade } = result;
  const color = GRADE_COLORS[grade];
  const r = 80;
  const circumference = Math.PI * r; // 반원 길이
  const filled = (score / 100) * circumference;

  return (
    <div className="score-dial" role="img" aria-label={`스키 지수 ${score}점, ${label}`}>
      <svg viewBox="0 0 200 115" width="100%">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--dial-track)" strokeWidth="16" strokeLinecap="round" />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
        <text x="100" y="72" textAnchor="middle" className="dial-score" fill={color}>{score}</text>
        <text x="100" y="98" textAnchor="middle" className="dial-label">{emoji} {label}</text>
      </svg>
    </div>
  );
}
