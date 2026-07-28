import { useMemo, useState } from 'react';
import {
  INSTRUCTORS,
  RESORT_LABEL,
  type Instructor,
  type LessonProduct,
  type LessonFormat,
} from '../data/instructors';
import { RESORTS } from '../data/resorts';
import { useAccount } from '../lib/account';
import { SKILL_SHORT } from '../lib/recommend';
import {
  LuStar,
  LuBadgeCheck,
  LuHeartPulse,
  LuMapPin,
  LuChevronLeft,
  LuCheck,
  LuUser,
  LuAward,
  LuCalendarDays,
} from 'react-icons/lu';

const FORMATS: LessonFormat[] = ['1:1', '소그룹', '그룹', '가족'];
const won = (n: number) => `${(n / 10000).toLocaleString()}만원`;

/** 다가오는 주말(토·일) N일 생성 */
function upcomingWeekends(n: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const d = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) {
      out.push({ key: d.toISOString().slice(0, 10), label: `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]})` });
    }
  }
  return out;
}
const TIMES = ['오전 10:00', '오후 1:00', '야간 6:00'];

function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inst-stars">
      <LuStar className="fill" /> {rating.toFixed(1)}
      {count !== undefined && <span className="c"> ({count})</span>}
    </span>
  );
}

function Badges({ i }: { i: Instructor }) {
  return (
    <div className="inst-badges">
      <span className="ibg"><LuBadgeCheck /> KSIA {i.cert}</span>
      {i.kidsSpecialist && <span className="ibg kid">어린이 전문</span>}
      {i.firstAid && <span className="ibg aid"><LuHeartPulse /> 응급처치</span>}
    </div>
  );
}

export function InstructorsPage() {
  const { members } = useAccount();
  const [resortId, setResortId] = useState<string>('all');
  const [format, setFormat] = useState<LessonFormat | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = useMemo(
    () =>
      INSTRUCTORS.filter(
        (i) =>
          (resortId === 'all' || i.resortId === resortId) &&
          (format === 'all' || i.formats.includes(format)) &&
          (!verifiedOnly || i.verified),
      ),
    [resortId, format, verifiedOnly],
  );

  const selected = INSTRUCTORS.find((i) => i.id === selectedId) ?? null;
  if (selected) return <InstructorDetail instructor={selected} members={members} onBack={() => setSelectedId(null)} />;

  return (
    <div className="page">
      <h2 className="page-title">강사 찾기</h2>
      <p className="page-intro">검증된 어린이·가족 전문 강사를 스키장·형태·예산으로 찾아 바로 예약해요.</p>

      <div className="calc-row">
        <label htmlFor="inst-resort">스키장</label>
        <select id="inst-resort" className="resort-select" value={resortId} onChange={(e) => setResortId(e.target.value)}>
          <option value="all">전체 스키장</option>
          {RESORTS.filter((r) => INSTRUCTORS.some((i) => i.resortId === r.id)).map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="chip-row">
        <button className={`chip${format === 'all' ? ' active' : ''}`} onClick={() => setFormat('all')}>전체</button>
        {FORMATS.map((f) => (
          <button key={f} className={`chip${format === f ? ' active' : ''}`} onClick={() => setFormat(f)}>{f}</button>
        ))}
      </div>

      <div className="inst-sortline">
        <span>추천순 · 강사 <strong>{list.length}</strong>명</span>
        <label className="inst-toggle">
          <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
          검증 강사만
        </label>
      </div>

      {list.length === 0 && <p className="calc-hint">조건에 맞는 강사가 없어요. 필터를 바꿔보세요.</p>}

      {list.map((i) => (
        <button key={i.id} className="inst-card" onClick={() => setSelectedId(i.id)}>
          <div className="inst-top">
            <span className="inst-ph" style={{ background: `linear-gradient(150deg, ${i.hue}, #9ec1ff)` }}>
              <LuUser />
              {i.verified && <span className="vf"><LuCheck /></span>}
            </span>
            <span className="inst-name">
              <span className="nm">{i.name}</span>
              <span className="meta">{RESORT_LABEL(i.resortId)} · 경력 {i.experienceYears}년</span>
              <Stars rating={i.rating} count={i.reviewCount} />
            </span>
          </div>
          <Badges i={i} />
          <div className="inst-tags">{i.disciplines.join(' · ')} · {i.formats.join('·')}</div>
          <div className="inst-bot">
            <span className="inst-price"><strong>{won(minPrice(i))}</strong><small> ~ / {shortestDur(i)}</small></span>
            <span className="inst-avail">{i.availHint}</span>
          </div>
        </button>
      ))}

      <p className="data-note">강습·결제는 예시(목업)예요. 실제 서비스에는 강사 검증·결제·취소 정책이 연동됩니다.</p>
    </div>
  );
}

function minPrice(i: Instructor) {
  return Math.min(...i.products.map((p) => p.priceKRW));
}
function shortestDur(i: Instructor) {
  const m = Math.min(...i.products.map((p) => p.durationMin));
  return m >= 60 ? `${m / 60}시간` : `${m}분`;
}
function durLabel(min: number) {
  return min >= 240 ? '반나절' : min >= 60 ? `${min / 60}시간` : `${min}분`;
}

function InstructorDetail({
  instructor: i,
  members,
  onBack,
}: {
  instructor: Instructor;
  members: ReturnType<typeof useAccount>['members'];
  onBack: () => void;
}) {
  const [booking, setBooking] = useState<LessonProduct | null>(null);

  return (
    <div className="page">
      <div className="inst-dhead">
        <button className="inst-back" onClick={onBack} aria-label="뒤로"><LuChevronLeft /></button>
        <h2>{i.name}</h2>
      </div>

      <div className="inst-prof">
        <span className="inst-ph big" style={{ background: `linear-gradient(150deg, ${i.hue}, #9ec1ff)` }}>
          <LuUser />
          {i.verified && <span className="vf"><LuCheck /></span>}
        </span>
        <div>
          <div className="inst-name"><span className="nm">{i.name}</span></div>
          <div className="meta">{RESORT_LABEL(i.resortId)} · 경력 {i.experienceYears}년 · 강습 {i.lessonCount}회</div>
          <Stars rating={i.rating} count={i.reviewCount} />
        </div>
      </div>

      <Badges i={i} />
      <p className="inst-intro">{i.intro}</p>

      {i.awards.length > 0 && (
        <div className="inst-awards">
          {i.awards.map((a) => (
            <span key={a} className="inst-award"><LuAward /> {a}</span>
          ))}
        </div>
      )}

      <h3 className="card-title" style={{ marginTop: 6 }}>강습 메뉴</h3>
      <div className="inst-prod">
        {i.products.map((p) => (
          <button key={p.id} className="inst-prow" onClick={() => setBooking(p)}>
            <span className="pt">
              <b>{p.title} · {durLabel(p.durationMin)}</b>
              <span>{p.discipline}{p.groupMax ? ` · 최대 ${p.groupMax}명` : ''}{p.includesGear ? ' · 장비 포함' : p.includesLift === false ? ' · 리프트권 별도' : ''}</span>
            </span>
            <span className="pp">
              <b>{won(p.priceKRW)}</b>
              <span>{p.perPerson ? '/ 인' : ''}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="inst-meta">
        <span className="inst-mchip"><LuMapPin /> {RESORT_LABEL(i.resortId)}리조트</span>
        <span className="inst-mchip"><LuCalendarDays /> {i.availability}</span>
      </div>

      <p className="data-note">예약·결제는 예시(목업)예요.</p>

      {booking && <BookingSheet instructor={i} product={booking} members={members} onClose={() => setBooking(null)} />}
    </div>
  );
}

function BookingSheet({
  instructor: i,
  product: p,
  members,
  onClose,
}: {
  instructor: Instructor;
  product: LessonProduct;
  members: ReturnType<typeof useAccount>['members'];
  onClose: () => void;
}) {
  const dates = useMemo(() => upcomingWeekends(3), []);
  const [date, setDate] = useState(dates[0]?.key ?? '');
  const [time, setTime] = useState(TIMES[0]);
  const [picked, setPicked] = useState<string[]>(members[0] ? [members[0].id] : []);
  const [done, setDone] = useState(false);

  const toggleMember = (id: string) =>
    setPicked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const count = Math.max(1, picked.length);
  const total = p.perPerson ? p.priceKRW * count : p.priceKRW;

  return (
    <div className="inst-modal" role="dialog" aria-modal="true">
      <div className="inst-dim" onClick={onClose} />
      <div className="inst-sheet">
        <div className="inst-grip" />
        {done ? (
          <div className="inst-done">
            <span className="inst-done-ic"><LuCheck /></span>
            <h3>예약 요청을 보냈어요</h3>
            <p>{i.name}에게 요청이 전달됐어요. <strong>강사 수락 후 확정</strong>되며, 알림으로 알려드려요.</p>
            <div className="inst-done-sum">
              {p.title} · {dates.find((d) => d.key === date)?.label} {time}
            </div>
            <button className="btn-primary full" onClick={onClose}>확인</button>
          </div>
        ) : (
          <>
            <h3>예약하기</h3>
            <div className="inst-selprod"><span>{p.title} · {durLabel(p.durationMin)}</span><b>{won(p.priceKRW)}{p.perPerson ? '/인' : ''}</b></div>

            <div className="inst-flabel">날짜</div>
            <div className="inst-dchips">
              {dates.map((d) => (
                <button key={d.key} className={`inst-dc${date === d.key ? ' on' : ''}`} onClick={() => setDate(d.key)}>{d.label}</button>
              ))}
            </div>

            <div className="inst-flabel">시간</div>
            <div className="inst-dchips">
              {TIMES.map((t) => (
                <button key={t} className={`inst-dc${time === t ? ' on' : ''}`} onClick={() => setTime(t)}>{t}</button>
              ))}
            </div>

            <div className="inst-flabel">강습 받을 아이</div>
            {members.length === 0 ? (
              <p className="inst-nomem">가족 탭에서 아이를 등록하면 여기에 자동으로 채워져요.</p>
            ) : (
              <div className="inst-memrow">
                {members.map((m) => (
                  <button key={m.id} className={`inst-mem${picked.includes(m.id) ? ' on' : ''}`} onClick={() => toggleMember(m.id)}>
                    {picked.includes(m.id) && <span className="cb"><LuCheck /></span>}
                    <span className="mt"><b>{m.name}</b><span>{m.heightCm}㎝ · {SKILL_SHORT[m.level]}</span></span>
                  </button>
                ))}
              </div>
            )}

            <div className="inst-total">
              <span>합계 <span className="mut">{p.includesLift === false ? '(리프트권 별도)' : ''}</span></span>
              <b>{total.toLocaleString()}원</b>
            </div>
            <p className="inst-cancel">강습 3일 전까지 무료 취소 · 예약 확정은 강사 수락 후</p>
            <button className="btn-primary full" onClick={() => setDone(true)}>예약 요청 보내기</button>
          </>
        )}
      </div>
    </div>
  );
}
