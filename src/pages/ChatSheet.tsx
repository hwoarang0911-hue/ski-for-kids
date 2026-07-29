import { useEffect, useRef, useState } from 'react';
import { LuX, LuSend, LuMapPin, LuNavigation, LuCheck, LuCalendarClock } from 'react-icons/lu';
import {
  useThread,
  sendText,
  sendProposal,
  acceptProposal,
  declineProposal,
  markRead,
  type ChatSender,
  type ChatMsg,
} from '../lib/chat';
import { setMeetingFromChat, type Booking } from '../lib/lessonStore';
import { meetingSpots } from '../data/meeting';

const CHAT_TIMES = ['오전 10:00', '오후 1:00', '야간 6:00'];

function hhmm(ts: number) {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h < 12 ? '오전' : '오후'} ${((h + 11) % 12) + 1}:${m}`;
}

export function ChatSheet({ booking: b, role, onClose }: { booking: Booking; role: ChatSender; onClose: () => void }) {
  const thread = useThread(b.id);
  const [text, setText] = useState('');
  const [picking, setPicking] = useState(false);
  const [place, setPlace] = useState(b.meetingPoint ?? meetingSpots(b.resortId)[0]);
  const [time, setTime] = useState(b.time);
  const endRef = useRef<HTMLDivElement>(null);

  const peer = role === 'booker' ? b.instructorName : (b.memberNames.join(', ') || '예약자');

  useEffect(() => {
    markRead(b.id, role);
  }, [b.id, role, thread.length]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [thread.length, picking]);

  const send = () => {
    sendText(b.id, role, text);
    setText('');
  };
  const propose = () => {
    sendProposal(b.id, role, place, time);
    setPicking(false);
  };
  const accept = (m: ChatMsg) => {
    acceptProposal(m.id);
    if (m.place) setMeetingFromChat(b.id, m.place, m.time);
  };

  return (
    <div className="inst-modal" role="dialog" aria-modal="true" aria-label="채팅">
      <div className="inst-dim" onClick={onClose} />
      <div className="chat-sheet">
        <div className="chat-head">
          <div>
            <b>{peer}</b>
            <span className="chat-sub">{b.productTitle} · {b.date.slice(5).replace('-', '/')}</span>
          </div>
          <button className="noti-close" onClick={onClose} aria-label="닫기"><LuX /></button>
        </div>

        <div className="chat-body">
          <div className="chat-day">약속 장소·시간을 편하게 조율해보세요</div>
          {thread.map((m) =>
            m.kind === 'system' ? (
              <div className="chat-system" key={m.id}><LuCheck /> {m.text}</div>
            ) : m.kind === 'proposal' ? (
              <div className={`chat-row ${m.sender === role ? 'me' : 'you'}`} key={m.id}>
                <div className="chat-propose">
                  <div className="cp-title"><LuNavigation /> 약속 제안</div>
                  <div className="cp-place"><LuMapPin /> {m.place}</div>
                  {m.time && <div className="cp-time"><LuCalendarClock /> {m.time}</div>}
                  {m.status === 'pending' ? (
                    m.sender === role ? (
                      <div className="cp-wait">상대 수락 대기 중…</div>
                    ) : (
                      <div className="cp-acts">
                        <button className="lbtn gho" onClick={() => declineProposal(m.id)}>거절</button>
                        <button className="lbtn pri" onClick={() => accept(m)}>수락</button>
                      </div>
                    )
                  ) : (
                    <div className={`cp-status ${m.status}`}>{m.status === 'accepted' ? '✓ 약속 확정' : '거절됨'}</div>
                  )}
                </div>
                <span className="chat-time">{hhmm(m.createdAt)}</span>
              </div>
            ) : (
              <div className={`chat-row ${m.sender === role ? 'me' : 'you'}`} key={m.id}>
                <div className="chat-bubble">{m.text}</div>
                <span className="chat-time">{hhmm(m.createdAt)}</span>
              </div>
            ),
          )}
          <div ref={endRef} />
        </div>

        {picking && (
          <div className="chat-picker">
            <div className="inst-flabel">약속 장소</div>
            <select className="resort-select" value={place} onChange={(e) => setPlace(e.target.value)}>
              {meetingSpots(b.resortId).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="inst-flabel">시간</div>
            <div className="inst-dchips">
              {CHAT_TIMES.map((tt) => (
                <button key={tt} className={`inst-dc${time === tt ? ' on' : ''}`} onClick={() => setTime(tt)}>{tt}</button>
              ))}
            </div>
            <button className="btn-primary full" onClick={propose}>이 약속 보내기</button>
          </div>
        )}

        <div className="chat-input">
          <button className={`chat-place-btn${picking ? ' on' : ''}`} onClick={() => setPicking((v) => !v)} aria-label="약속 장소 제안">
            <LuMapPin />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="메시지 보내기"
          />
          <button className="chat-send" onClick={send} disabled={!text.trim()} aria-label="보내기"><LuSend /></button>
        </div>
      </div>
    </div>
  );
}
