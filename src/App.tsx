import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { GearPage } from './pages/GearPage';
import { SafetyPage } from './pages/SafetyPage';
import { LearnPage } from './pages/LearnPage';

type TabId = 'home' | 'gear' | 'safety' | 'learn';

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'home', label: '홈', emoji: '⛷️' },
  { id: 'gear', label: '장비', emoji: '🎿' },
  { id: 'safety', label: '안전', emoji: '🛟' },
  { id: 'learn', label: '배움터', emoji: '📚' },
];

export default function App() {
  const [tab, setTab] = useState<TabId>('home');

  return (
    <div className="app">
      <header className="app-header">
        <h1>키즈스키 <span className="app-tagline">가족 스키 가이드</span></h1>
      </header>

      <main className="app-main">
        {tab === 'home' && <HomePage />}
        {tab === 'gear' && <GearPage />}
        {tab === 'safety' && <SafetyPage />}
        {tab === 'learn' && <LearnPage />}
      </main>

      <nav className="tab-bar" aria-label="주요 메뉴">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            <span className="tab-emoji" aria-hidden>{t.emoji}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
