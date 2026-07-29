import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { GearPage } from './pages/GearPage';
import { SafetyPage } from './pages/SafetyPage';
import { LearnPage } from './pages/LearnPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { FamilyPage } from './pages/FamilyPage';
import { InstructorsPage } from './pages/InstructorsPage';
import { Icon, LuUser } from './lib/icons';
import { useAccount } from './lib/account';
import { NotificationBell } from './pages/NotificationsPanel';
import { usePendingWrites, useOnline } from './lib/lessonStore';
import { LuWifiOff, LuRefreshCw } from 'react-icons/lu';

type TabId = 'home' | 'gear' | 'safety' | 'check' | 'coach' | 'learn';

const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'gear', label: '장비' },
  { id: 'safety', label: '안전' },
  { id: 'check', label: '준비' },
  { id: 'coach', label: '강사' },
  { id: 'learn', label: '배움터' },
];

export default function App() {
  const [tab, setTab] = useState<TabId>('home');
  const [showFamily, setShowFamily] = useState(false);
  const { name } = useAccount();
  const online = useOnline();
  const pending = usePendingWrites();

  const goTab = (id: TabId) => {
    setTab(id);
    setShowFamily(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>키즈스키 <span className="app-tagline">가족 스키 가이드</span></h1>
        <div className="header-actions">
          <NotificationBell />
          <button
            className={`header-avatar${showFamily ? ' active' : ''}`}
            onClick={() => setShowFamily((v) => !v)}
            aria-label="내 가족 정보"
            aria-pressed={showFamily}
          >
            {name ? <span className="avatar-initial">{name.trim().charAt(0)}</span> : <LuUser size={20} />}
          </button>
        </div>
      </header>

      {(!online || pending > 0) && (
        <div className={`net-banner${online ? ' sync' : ''}`}>
          {online ? <LuRefreshCw size={15} /> : <LuWifiOff size={15} />}
          {online
            ? `연결됨 · 저장 대기 ${pending}건 전송 중…`
            : `오프라인 · 예약·후기는 연결되면 자동으로 전송돼요${pending > 0 ? ` (대기 ${pending}건)` : ''}`}
        </div>
      )}

      <main className="app-main">
        {showFamily ? (
          <FamilyPage />
        ) : (
          <>
            {tab === 'home' && <HomePage />}
            {tab === 'gear' && <GearPage />}
            {tab === 'safety' && <SafetyPage />}
            {tab === 'check' && <ChecklistPage />}
            {tab === 'coach' && <InstructorsPage />}
            {tab === 'learn' && <LearnPage />}
          </>
        )}
      </main>

      <nav className="tab-bar" aria-label="주요 메뉴">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn${!showFamily && tab === t.id ? ' active' : ''}`}
            onClick={() => goTab(t.id)}
            aria-current={!showFamily && tab === t.id ? 'page' : undefined}
          >
            <span className="tab-emoji"><Icon name={t.id} size={22} /></span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
