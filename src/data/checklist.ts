/**
 * 준비 체크리스트. 체크 상태는 ChecklistPage에서 localStorage에 저장한다.
 * 항목 id는 저장 키로 쓰이므로 바꾸면 사용자의 체크 상태가 초기화된다.
 */
export interface ChecklistItem {
  id: string;
  text: string;
  /** 왜 필요한지 짧은 부연 (선택) */
  note?: string;
}

export interface ChecklistGroup {
  id: string;
  title: string;
  intro?: string;
  items: ChecklistItem[];
}

export const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    id: 'season',
    title: '시즌 시작 전 (11~12월)',
    intro: '첫 스키 가기 1~2주 전에 한 번만 해두면 시즌 내내 편해요.',
    items: [
      { id: 'season-gear', text: '스키·보드 꺼내서 상태 확인', note: '엣지 녹, 베이스 마름(하얗게 일어남), 바인딩 균열' },
      { id: 'season-din', text: '장비샵에 딘(DIN) 재조정 예약', note: '아이는 체중·부츠가 바뀌어 매 시즌 필수' },
      { id: 'season-wax', text: '왁싱 하기 (샵 또는 셀프)', note: '시즌 첫 왁싱은 샵 정비 추천' },
      { id: 'season-helmet', text: '헬멧 상태·사이즈 확인', note: '충격 이력 있으면 교체, 아이 머리 컸는지 핏 테스트' },
      { id: 'season-clothes', text: '아이 스키복·부츠 사이즈 확인', note: '작아졌으면 시즌 초 세일 때 미리 준비' },
      { id: 'season-insurance', text: '여행자·일상배상책임 보험 확인', note: '남과 부딪혔을 때 배상도 보장되는지' },
      { id: 'season-fitness', text: '가족 체력 만들기 시작', note: '스쿼트·자전거 등 하체 운동, 부상 예방의 기본' },
      { id: 'season-lesson', text: '어린이 강습·숙소 예약', note: '성수기·주말 강습은 일찍 마감돼요' },
    ],
  },
  {
    id: 'pack',
    title: '출발 전날 짐싸기',
    intro: '아이와 함께 체크하면 그것도 스키 교육이에요.',
    items: [
      { id: 'pack-innerwear', text: '기능성 내복 (면 금지!)', note: '면은 땀에 젖으면 몸을 차갑게 해요' },
      { id: 'pack-midlayer', text: '중간옷(플리스)과 스키복' },
      { id: 'pack-socks', text: '스키 양말 (한 켤레만 신기, 여벌 챙기기)' },
      { id: 'pack-gloves', text: '방수 장갑 + 여벌 장갑', note: '여벌 장갑이 하루를 살려요' },
      { id: 'pack-helmet-goggle', text: '헬멧·고글 (이너캡, 김서림 방지 천)' },
      { id: 'pack-neck', text: '넥워머·바라클라바', note: '목도리는 걸릴 위험이 있어 넥워머로' },
      { id: 'pack-hotpack', text: '핫팩 여러 개', note: '맨살에 직접 닿지 않게 사용' },
      { id: 'pack-sunscreen', text: '선크림·립밤', note: '설면 반사 자외선은 한여름 해변 수준' },
      { id: 'pack-snack', text: '주머니 간식·보온병', note: '초콜릿·에너지바, 따뜻한 물' },
      { id: 'pack-spare', text: '아이 여벌 옷·속옷 한 벌', note: '눈놀이하다 젖는 건 시간문제' },
      { id: 'pack-contact', text: '부모 연락처 카드 (아이 주머니용)', note: '미아 대비 — 안전 탭 참고' },
      { id: 'pack-charge', text: '휴대폰 충전·보조배터리', note: '추우면 배터리가 빨리 닳아요' },
    ],
  },
  {
    id: 'morning',
    title: '당일 아침',
    items: [
      { id: 'morning-weather', text: '홈 탭에서 오늘 스키 지수·설질 확인', note: '슬러시 예보면 오전 위주 일정으로' },
      { id: 'morning-breakfast', text: '아침 든든히 먹기', note: '배고픈 아이는 빨리 지치고 짜증 나요' },
      { id: 'morning-sunscreen', text: '집에서 선크림 미리 바르기' },
      { id: 'morning-toilet', text: '출발 전·도착 직후 화장실', note: '스키복 입고 벗기는 오래 걸려요' },
      { id: 'morning-promise', text: '아이와 안전 약속 재확인', note: '헤어지면 만날 곳, 패트롤에게 가기' },
      { id: 'morning-warmup', text: '타기 전 5분 준비운동', note: '무릎·발목 돌리기, 제자리 점프' },
    ],
  },
];

export const CHECKLIST_TOTAL = CHECKLIST_GROUPS.reduce((s, g) => s + g.items.length, 0);
