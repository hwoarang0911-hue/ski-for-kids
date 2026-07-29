import { useSyncExternalStore } from 'react';

/**
 * 인앱 알림. 예약·확정·리마인더·후기·입점심사 등 이벤트를 쌓아
 * 헤더 종 아이콘에 표시한다.
 * 정적 데모라 서버 푸시는 없다 — 실서비스에선 서버/웹푸시가 이 이벤트를
 * 생성하고, pushNotification()을 서버 이벤트 수신부로 바꾸면 된다.
 */

export type NotiKind = 'booking' | 'confirmed' | 'reminder' | 'review' | 'approved' | 'rejected';

export interface Noti {
  id: string;
  kind: NotiKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
}

const KEY = 'ski-for-kids.notifications';

function load(): Noti[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Noti[]) : [];
  } catch {
    return [];
  }
}

let items: Noti[] = load();
const listeners = new Set<() => void>();
function emit() {
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function pushNotification(kind: NotiKind, title: string, body: string): Noti {
  const n: Noti = { id: uid(), kind, title, body, read: false, createdAt: Date.now() };
  items = [n, ...items].slice(0, 50);
  emit();
  return n;
}

/** 같은 종류·제목의 알림이 이미 있으면 중복 생성하지 않는다(리마인더용). */
export function pushOnce(kind: NotiKind, title: string, body: string) {
  if (items.some((n) => n.kind === kind && n.title === title)) return;
  pushNotification(kind, title, body);
}

export function markAllRead() {
  if (items.every((n) => n.read)) return;
  items = items.map((n) => ({ ...n, read: true }));
  emit();
}

export function useNotifications(): Noti[] {
  return useSyncExternalStore(subscribe, () => items, () => items);
}
export function useUnreadCount(): number {
  const all = useSyncExternalStore(subscribe, () => items, () => items);
  return all.filter((n) => !n.read).length;
}
