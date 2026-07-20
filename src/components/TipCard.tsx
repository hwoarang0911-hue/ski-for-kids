import type { Tip } from '../data/tips';

export function TipCard({ tip }: { tip: Tip }) {
  return (
    <div className="tip-card">
      <span className="tip-category">{tip.category}</span>
      <p className="tip-text">{tip.text}</p>
    </div>
  );
}
