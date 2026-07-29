import { useSyncExternalStore } from 'react';

/**
 * 예약 건별 1:1 채팅(예약자 ↔ 강사). 당근처럼 약속 장소를 조율한다.
 * - 일반 텍스트
 * - 약속 제안(proposal): 장소·시간을 제안 → 상대가 수락하면 확정
 * - 시스템 메시지(약속 확정/거절 안내)
 * 데모라 localStorage에 보관. 실서비스에선 서버(실시간)로 교체한다.
 */

export type ChatSender = 'booker' | 'instructor';
export type ChatKind = 'text' | 'proposal' | 'system';
export type ProposalStatus = 'pending' | 'accepted' | 'declined';

export interface ChatMsg {
  id: string;
  bookingId: string;
  sender: ChatSender;
  kind: ChatKind;
  text?: string;
  place?: string;
  time?: string;
  status?: ProposalStatus;
  createdAt: number;
}

const KEY = 'ski-for-kids.chat';
const READ_KEY = 'ski-for-kids.chatReads';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

let messages: ChatMsg[] = load<ChatMsg[]>(KEY, []);
let reads: Record<string, number> = load<Record<string, number>>(READ_KEY, {});

const listeners = new Set<() => void>();
function emit() {
  localStorage.setItem(KEY, JSON.stringify(messages));
  localStorage.setItem(READ_KEY, JSON.stringify(reads));
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function add(msg: Omit<ChatMsg, 'id' | 'createdAt'>): ChatMsg {
  const m: ChatMsg = { ...msg, id: uid(), createdAt: Date.now() };
  messages = [...messages, m];
  emit();
  return m;
}

export function sendText(bookingId: string, sender: ChatSender, text: string) {
  const t = text.trim();
  if (!t) return;
  add({ bookingId, sender, kind: 'text', text: t });
}

export function sendProposal(bookingId: string, sender: ChatSender, place: string, time?: string) {
  add({ bookingId, sender, kind: 'proposal', place, time, status: 'pending' });
}

export function acceptProposal(id: string) {
  const m = messages.find((x) => x.id === id);
  if (!m || m.kind !== 'proposal') return;
  messages = messages.map((x) => (x.id === id ? { ...x, status: 'accepted' } : x));
  add({ bookingId: m.bookingId, sender: m.sender === 'booker' ? 'instructor' : 'booker', kind: 'system', text: `약속이 확정됐어요 · ${m.place}${m.time ? ` · ${m.time}` : ''}` });
}

export function declineProposal(id: string) {
  const m = messages.find((x) => x.id === id);
  if (!m || m.kind !== 'proposal') return;
  messages = messages.map((x) => (x.id === id ? { ...x, status: 'declined' } : x));
  add({ bookingId: m.bookingId, sender: m.sender === 'booker' ? 'instructor' : 'booker', kind: 'system', text: '약속 제안을 거절했어요. 다시 조율해요.' });
}

export function markRead(bookingId: string, role: ChatSender) {
  reads[`${bookingId}:${role}`] = Date.now();
  emit();
}

export function useThread(bookingId: string): ChatMsg[] {
  const all = useSyncExternalStore(subscribe, () => messages, () => messages);
  return all.filter((m) => m.bookingId === bookingId).sort((a, b) => a.createdAt - b.createdAt);
}

/** 상대가 보낸, 내가 마지막으로 읽은 이후의 메시지 수 */
export function useUnread(bookingId: string, role: ChatSender): number {
  const all = useSyncExternalStore(subscribe, () => messages, () => messages);
  const readAll = useSyncExternalStore(subscribe, () => reads, () => reads);
  const since = readAll[`${bookingId}:${role}`] ?? 0;
  return all.filter((m) => m.bookingId === bookingId && m.sender !== role && m.kind !== 'system' && m.createdAt > since).length;
}
