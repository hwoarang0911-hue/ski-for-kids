import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { SkillLevel, SkierStyle } from './recommend';

export type Relation = '본인' | '배우자' | '자녀' | '부모' | '기타';

export interface FamilyMember {
  id: string;
  name: string;
  relation: Relation;
  gender?: '남' | '여';
  birthYear?: number;
  heightCm: number;
  weightKg: number;
  level: SkillLevel;
  /** 스키어 스타일 수동 지정(선택). 없으면 실력에서 유추 */
  style?: SkierStyle;
}

interface AccountState {
  /** null이면 게스트 */
  name: string | null;
  members: FamilyMember[];
}

interface AccountContextValue extends AccountState {
  isGuest: boolean;
  setName: (name: string | null) => void;
  addMember: (m: Omit<FamilyMember, 'id'>) => string;
  updateMember: (id: string, patch: Partial<Omit<FamilyMember, 'id'>>) => void;
  removeMember: (id: string) => void;
}

const STORAGE_KEY = 'ski-for-kids.account';

function load(): AccountState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { name: null, members: [] };
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed.name === 'string' ? parsed.name : null,
      members: Array.isArray(parsed.members) ? parsed.members : [],
    };
  } catch {
    return { name: null, members: [] };
  }
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccountState>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: AccountContextValue = {
    ...state,
    isGuest: state.name === null,
    setName: (name) => setState((s) => ({ ...s, name: name && name.trim() ? name.trim() : null })),
    addMember: (m) => {
      const id = uid();
      setState((s) => ({ ...s, members: [...s.members, { ...m, id }] }));
      return id;
    },
    updateMember: (id, patch) =>
      setState((s) => ({
        ...s,
        members: s.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      })),
    removeMember: (id) => setState((s) => ({ ...s, members: s.members.filter((m) => m.id !== id) })),
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
