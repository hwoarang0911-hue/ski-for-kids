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
  useBookings,
  useReviews,
  addBooking,
  updateBooking,
  addReview,
  type Booking,
} from '../lib/lessonStore';
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
  LuClock,
} from 'react-icons/lu';

const FORMATS: LessonFormat[] = ['1:1', '소그룹', '그룹', '가족'];
const won = (n: number) => `${(n / 10000).toLocaleString()}만원`;
const todayStr = () => new Date().toISOString().slice(0, 10);

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

function ddayLabel(date: string): string {
  const d = new Date(date + 'T00:00:00');
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - t.getTime()) / 86400000);
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-DAY';
  return `${-diff}일 전`;
}
function durLabel(min: number) {
  return min >= 240 ? '반나절' : min >= 60 ? `${min / 60}시간` : `${min}분`;
}
function minPrice(i: Instructor) {
  return Math.min(...i.products.map((p) => p.priceKRW));
}
function shortestDur(i: Instructor) {
  const m = Math.min(...i.products.map((p) => p.durationMin));
  return m >= 60 ? `${m / 60}시간` : `${m}분`;
}

function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inst-stars">
      <LuStar /> {rating.toFixed(1)}
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
  const [tab, setTab] = useState<'find' | 'mine'>('find');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resortId, setResortId] = useState<string>('all');
  const [format, setFormat] = useState<LessonFormat | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(true);

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

  const openInstructor = (id: string) => {
    setTab('find');
    setSelectedId(id);
  };

  const selected = INSTRUCTORS.find((i) => i.id === selectedId) ?? null;
  if (selected)
    return (
      <InstructorDetail
        instructor={selected}
        members={members}
        onBack={() => setSelectedId(null)}
        onBooked={() => { setSelectedId(null); setTab('mine'); }}
      />
    );

  return (
    <div className="page">
      <h2 className="page-title">강사 연결</h2>
      <div className="segment">
        <button className={tab === 'find' ? 'active' : ''} onClick={() => setTab('find')}>강사 찾기</button>
        <button className={tab === 'mine' ? 'active' : ''} onClick={() => setTab('mine')}>내 강습</button>
      </div>

      {tab === 'mine' ? (
        <MyLessons onRebook={openInstructor} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

function InstructorDetail({
  instructor: i,
  members,
  onBack,
  onBooked,
}: {
  instructor: Instructor;
  members: ReturnType<typeof useAccount>['members'];
  onBack: () => void;
  onBooked: () => void;
}) {
  const [booking, setBooking] = useState<LessonProduct | null>(null);
  const userReviews = useReviews(i.id);
  const reviews = [
    ...userReviews.map((r) => ({ author: r.author, rating: r.rating, text: r.text })),
    ...i.seedReviews,
  ];

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

      <h3 className="card-title" style={{ marginTop: 14 }}>후기 <span className="card-subtitle">{i.rating.toFixed(1)} · {i.reviewCount}개</span></h3>
      <div className="inst-reviews">
        {reviews.slice(0, 5).map((r, idx) => (
          <div className="inst-review" key={idx}>
            <div className="rv-top">
              <b>{r.author}</b>
              <span className="inst-stars sm">{Array.from({ length: r.rating }).map((_, k) => <LuStar key={k} />)}</span>
            </div>
            <p>{r.text}</p>
          </div>
        ))}
      </div>

      <p className="data-note">예약·결제는 예시(목업)예요.</p>

      {booking && (
        <BookingSheet
          instructor={i}
          product={booking}
          members={members}
          onClose={() => setBooking(null)}
          onBooked={() => { setBooking(null); onBooked(); }}
        />
      )}
    </div>
  );
}

function BookingSheet({
  instructor: i,
  product: p,
  members,
  onClose,
  onBooked,
}: {
  instructor: Instructor;
  product: LessonProduct;
  members: ReturnType<typeof useAccount>['members'];
  onClose: () => void;
  onBooked: () => void;
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

  const submit = () => {
    addBooking({
      instructorId: i.id,
      instructorName: i.name,
      instructorHue: i.hue,
      resortId: i.resortId,
      productId: p.id,
      productTitle: `${p.title} · ${durLabel(p.durationMin)}`,
      date,
      time,
      memberNames: picked.map((id) => members.find((m) => m.id === id)?.name ?? '아이'),
      priceTotal: total,
    });
    setDone(true);
  };

  return (
    <div className="inst-modal" role="dialog" aria-modal="true">
      <div className="inst-dim" onClick={onClose} />
      <div className="inst-sheet">
        <div className="inst-grip" />
        {done ? (
          <div className="inst-done">
            <span className="inst-done-ic"><LuCheck /></span>
            <h3>예약 요청을 보냈어요</h3>
            <p>{i.name}에게 요청이 전달됐어요. <strong>강사 수락 후 확정</strong>되며, 「내 강습」에서 확인할 수 있어요.</p>
            <div className="inst-done-sum">{p.title} · {dates.find((d) => d.key === date)?.label} {time}</div>
            <button className="btn-primary full" onClick={onBooked}>내 강습에서 보기</button>
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
            <button className="btn-primary full" onClick={submit}>예약 요청 보내기</button>
          </>
        )}
      </div>
    </div>
  );
}

function MyLessons({ onRebook }: { onRebook: (instructorId: string) => void }) {
  const bookings = useBookings();
  const [seg, setSeg] = useState<'upcoming' | 'past'>('upcoming');
  const [reviewFor, setReviewFor] = useState<Booking | null>(null);
  const t = todayStr();

  const upcoming = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed' && b.date >= t);
  const past = bookings.filter((b) => b.status === 'cancelled' || b.status === 'completed' || b.date < t);
  const shown = seg === 'upcoming' ? upcoming : past;

  return (
    <>
      <div className="chip-row" style={{ marginTop: 4 }}>
        <button className={`chip${seg === 'upcoming' ? ' active' : ''}`} onClick={() => setSeg('upcoming')}>예정 {upcoming.length}</button>
        <button className={`chip${seg === 'past' ? ' active' : ''}`} onClick={() => setSeg('past')}>지난 강습 {past.length}</button>
      </div>

      {shown.length === 0 && (
        <div className="card empty-card">
          <LuCalendarDays size={28} />
          <p>{seg === 'upcoming' ? '예정된 강습이 없어요. 강사 찾기에서 예약해보세요.' : '지난 강습이 없어요.'}</p>
        </div>
      )}

      {shown.map((b) => (
        <div className="lcard" key={b.id}>
          {b.status === 'cancelled' ? (
            <span className="lflag cancel">취소됨</span>
          ) : b.status === 'completed' ? (
            <span className="lflag done"><LuCheck /> 완료{b.reviewed ? ' · 후기 작성함' : ''}</span>
          ) : (
            <span className="lday">{ddayLabel(b.date)} · {b.status === 'confirmed' ? '확정' : '수락 대기'}</span>
          )}
          <div className="lt">{b.productTitle} — {b.instructorName}</div>
          <div className="lm">
            <div><span className="ic"><LuCalendarDays /></span> {b.date.slice(5).replace('-', '/')} · {b.time}</div>
            <div><span className="ic"><LuMapPin /></span> {RESORT_LABEL(b.resortId)}리조트</div>
            {b.memberNames.length > 0 && <div><span className="ic"><LuUser /></span> {b.memberNames.join(', ')}</div>}
            <div><span className="ic"><LuClock /></span> {b.priceTotal.toLocaleString()}원</div>
          </div>
          <div className="lacts">
            {seg === 'upcoming' ? (
              <>
                <button className="lbtn gho" onClick={() => updateBooking(b.id, { status: 'cancelled' })}>취소</button>
                <button className="lbtn pri" onClick={() => setReviewFor(b)}>다녀왔어요</button>
              </>
            ) : (
              <>
                <button className="lbtn gho" onClick={() => onRebook(b.instructorId)}>다시 예약</button>
                {b.status === 'completed' && !b.reviewed && (
                  <button className="lbtn pri" onClick={() => setReviewFor(b)}><LuStar /> 후기 남기기</button>
                )}
              </>
            )}
          </div>
        </div>
      ))}

      {reviewFor && (
        <ReviewModal
          booking={reviewFor}
          onClose={() => setReviewFor(null)}
          onDone={() => setReviewFor(null)}
        />
      )}
    </>
  );
}

function ReviewModal({ booking: b, onClose, onDone }: { booking: Booking; onClose: () => void; onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const submit = () => {
    addReview({ instructorId: b.instructorId, author: '나', rating, text: text.trim() || '좋았어요!' });
    updateBooking(b.id, { status: 'completed', reviewed: true });
    onDone();
  };

  return (
    <div className="inst-modal" role="dialog" aria-modal="true">
      <div className="inst-dim" onClick={onClose} />
      <div className="inst-sheet">
        <div className="inst-grip" />
        <h3>{b.instructorName} 후기</h3>
        <div className="inst-flabel">별점</div>
        <div className="rv-pick">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} className={`rv-star${n <= rating ? ' on' : ''}`} onClick={() => setRating(n)} aria-label={`${n}점`}>
              <LuStar />
            </button>
          ))}
        </div>
        <div className="inst-flabel">한 줄 후기</div>
        <textarea className="rv-text" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="아이가 어땠는지 남겨주세요 (선택)" />
        <button className="btn-primary full" onClick={submit}>후기 등록</button>
      </div>
    </div>
  );
}
