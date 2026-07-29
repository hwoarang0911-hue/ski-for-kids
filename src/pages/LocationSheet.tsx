import { LuX, LuMapPin, LuPhone, LuNavigation, LuClock, LuTicket } from 'react-icons/lu';
import { RESORTS } from '../data/resorts';
import { resortMapUrl } from '../data/meeting';
import type { Booking } from '../lib/lessonStore';
import { RESORT_LABEL } from '../data/instructors';

/**
 * 강사가 정해둔 만남 장소를 지도로 보여주고, 전화로 연락하게 한다.
 * (별도 채팅 없이) 지도는 스키장 좌표 기준 임베드, 길찾기·전화는 외부 앱 연동.
 */
export function LocationSheet({ booking: b, onClose }: { booking: Booking; onClose: () => void }) {
  const resort = RESORTS.find((r) => r.id === b.resortId);
  const spot = b.meetingPoint ?? '스키장 렌탈샵 앞';
  const embed = resort
    ? `https://maps.google.com/maps?q=${resort.latitude},${resort.longitude}&z=14&output=embed`
    : '';
  const confirmed = b.status === 'confirmed';

  return (
    <div className="inst-modal" role="dialog" aria-modal="true" aria-label="만남 장소">
      <div className="inst-dim" onClick={onClose} />
      <div className="loc-sheet">
        <div className="loc-head">
          <div>
            <b>만남 장소</b>
            <span className="chat-sub">{b.instructorName} · {b.date.slice(5).replace('-', '/')} {b.time}</span>
          </div>
          <button className="noti-close" onClick={onClose} aria-label="닫기"><LuX /></button>
        </div>

        <div className="loc-spot"><LuMapPin /> <b>{spot}</b></div>
        {!confirmed && <div className="loc-pending">강사 수락 후 장소가 최종 확정돼요. 아래는 예정 장소입니다.</div>}

        {embed ? (
          <iframe className="loc-map" title="만남 장소 지도" src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        ) : (
          <div className="loc-map loc-map-empty"><LuMapPin size={30} /><span>{RESORT_LABEL(b.resortId)}</span></div>
        )}

        <div className="loc-tips">
          <div><span className="ic"><LuClock /></span> 강습 <b>10분 전</b> 도착해주세요</div>
          <div><span className="ic"><LuTicket /></span> 리프트권·장비·헬멧을 미리 챙기세요</div>
        </div>

        <div className="loc-acts">
          {b.instructorPhone && confirmed ? (
            <a className="btn-primary full loc-call" href={`tel:${b.instructorPhone}`}>
              <LuPhone /> 강사에게 전화 ({b.instructorPhone})
            </a>
          ) : (
            <div className="loc-call-off"><LuPhone /> 강사 수락 후 연락처가 열려요</div>
          )}
          <a className="loc-nav" href={resortMapUrl(b.resortId, spot)} target="_blank" rel="noopener noreferrer">
            <LuNavigation /> 지도 앱으로 길찾기 ↗
          </a>
        </div>
      </div>
    </div>
  );
}
