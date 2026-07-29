import { useState } from 'react';
import {
  LuBell,
  LuCalendarCheck,
  LuCircleCheck,
  LuClock,
  LuStar,
  LuBadgeCheck,
  LuCircleX,
  LuX,
} from 'react-icons/lu';
import {
  useNotifications,
  useUnreadCount,
  markAllRead,
  type NotiKind,
} from '../lib/notifications';

const KIND_ICON: Record<NotiKind, JSX.Element> = {
  booking: <LuCalendarCheck />,
  confirmed: <LuCircleCheck />,
  reminder: <LuClock />,
  review: <LuStar />,
  approved: <LuBadgeCheck />,
  rejected: <LuCircleX />,
};

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return '방금';
  if (s < 3600) return `${Math.floor(s / 60)}분 전`;
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`;
  return `${Math.floor(s / 86400)}일 전`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const items = useNotifications();
  const unread = useUnreadCount();

  const toggle = () => {
    setOpen((v) => {
      if (!v) markAllRead();
      return !v;
    });
  };

  return (
    <>
      <button
        className="header-bell"
        onClick={toggle}
        aria-label={`알림${unread ? ` ${unread}개 안 읽음` : ''}`}
      >
        <LuBell size={20} />
        {unread > 0 && <span className="bell-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="noti-modal" role="dialog" aria-modal="true" aria-label="알림">
          <div className="noti-dim" onClick={() => setOpen(false)} />
          <div className="noti-sheet">
            <div className="noti-head">
              <h3>알림</h3>
              <button className="noti-close" onClick={() => setOpen(false)} aria-label="닫기"><LuX /></button>
            </div>
            {items.length === 0 ? (
              <div className="noti-empty">
                <LuBell size={28} />
                <p>아직 알림이 없어요. 강사 예약을 하면 진행 상황을 여기서 알려드려요.</p>
              </div>
            ) : (
              <ul className="noti-list">
                {items.map((n) => (
                  <li className={`noti-item k-${n.kind}`} key={n.id}>
                    <span className="noti-ic">{KIND_ICON[n.kind]}</span>
                    <span className="noti-tx">
                      <b>{n.title}</b>
                      <span className="noti-body">{n.body}</span>
                      <span className="noti-time">{timeAgo(n.createdAt)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
