import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { GearPage } from './pages/GearPage';
import { SafetyPage } from './pages/SafetyPage';
import { LearnPage } from './pages/LearnPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { FamilyPage } from './pages/FamilyPage';
import { Icon } from './lib/icons';

type TabId = 'home' | 'gear' | 'safety' | 'check' | 'family' | 'learn';

const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'gear', label: '장비' },
  { id: 'safety', label: '안전' },
  { id: 'check', label: '준비' },
  { id: 'family', label: '가족' },
  { id: 'learn', label: '배움터' },
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
        {tab === 'check' && <ChecklistPage />}
        {tab === 'family' && <FamilyPage />}
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
            <span className="tab-emoji"><Icon name={t.id} size={22} /></span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
