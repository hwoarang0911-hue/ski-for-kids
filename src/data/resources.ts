/**
 * 배움터 > 자료실: 유튜브·해외 커뮤니티의 가족/유아 스키 자료 큐레이션.
 * 링크는 2026-07 웹 검색 결과 기준. youtubeId가 있으면 썸네일 카드로 표시한다.
 */
export type ResourceCategory =
  | '아이에게 스키 가르치기'
  | '유아(3~6세) 스킹'
  | '가족 스키 여행 노하우'
  | '부모용 심화 자료';

export interface LearningResource {
  id: string;
  category: ResourceCategory;
  title: string;
  /** 한국어 요약 설명 */
  summary: string;
  language: '영어' | '한국어';
  type: '영상' | '채널' | '재생목록' | '글';
  url: string;
  youtubeId?: string;
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  '아이에게 스키 가르치기',
  '유아(3~6세) 스킹',
  '가족 스키 여행 노하우',
  '부모용 심화 자료',
];

export const RESOURCES: LearningResource[] = [
  // ── 아이에게 스키 가르치기 (영상) ──────────────────────────
  {
    id: 'yt-teach-children',
    category: '아이에게 스키 가르치기',
    title: 'Teach Children Skiing — Ep.1 장비와 시작하기',
    summary: '아이를 슬로프에 데리고 나가 재미있게 시작하는 법을 에피소드로 나눠 알려주는 시리즈. 1편은 장비 준비와 첫걸음.',
    language: '영어',
    type: '영상',
    url: 'https://www.youtube.com/watch?v=UVzKRIoitLc',
    youtubeId: 'UVzKRIoitLc',
  },
  {
    id: 'yt-mountain-dad',
    category: '아이에게 스키 가르치기',
    title: 'How to Teach Your Kids To Ski — 산골 스키 아빠의 3가지 팁',
    summary: '아이 셋을 스키장에서 키운 아빠가 알려주는 실전 팁 3가지. 짧고 핵심만 있어 처음 보기 좋아요.',
    language: '영어',
    type: '영상',
    url: 'https://www.youtube.com/watch?v=u3Jq5wF0SZI',
    youtubeId: 'u3Jq5wF0SZI',
  },
  {
    id: 'yt-first-time',
    category: '아이에게 스키 가르치기',
    title: 'Tips for Your Kids First Time Skiing — 우리가 배운 것들',
    summary: '아이 첫 스키에서 부모가 실제로 겪은 시행착오와 배운 점 공유. 첫 스키 전에 보면 실수를 줄일 수 있어요.',
    language: '영어',
    type: '영상',
    url: 'https://www.youtube.com/watch?v=Tn-13BhytbU',
    youtubeId: 'Tn-13BhytbU',
  },
  {
    id: 'yt-playlist-teaching',
    category: '아이에게 스키 가르치기',
    title: '재생목록: Teaching Kids to Ski',
    summary: '아이 스키 가르치기 영상만 모아둔 유튜브 재생목록. 단계별로 이어 보기 좋아요.',
    language: '영어',
    type: '재생목록',
    url: 'https://www.youtube.com/playlist?list=PLMJ9PNkmWiNWYdVS_K4vRrRwQM-rpT_TL',
  },
  {
    id: 'yt-skng',
    category: '아이에게 스키 가르치기',
    title: 'SKNG Ski School 채널',
    summary: '스키 강습·팁·장비 리뷰를 다루는 스키 스쿨 채널. 초보 부모가 기술 용어를 익히기에도 좋아요.',
    language: '영어',
    type: '채널',
    url: 'https://www.youtube.com/channel/UC2jvpwCE6Ybmizxid2qnRHg',
  },

  // ── 유아(3~6세) 스킹 ──────────────────────────────────────
  {
    id: 'art-outdoorsy-toddler',
    category: '유아(3~6세) 스킹',
    title: '토들러에게 스키 가르치기 완전 가이드 (Outdoorsy Families)',
    summary: '장비 추천, 리조트 고르기, 유아 강습에서 정말 중요한 것까지 담은 토들러 스키 종합 가이드.',
    language: '영어',
    type: '글',
    url: 'https://outdoorsyfamilies.com/teachyourtoddlertoski/',
  },
  {
    id: 'art-noreception-3days',
    category: '유아(3~6세) 스킹',
    title: '3일 만에 토들러 스키 가르치기 (No Reception Club)',
    summary: '짧은 가족 여행 일정 안에서 유아가 스키에 재미를 붙이게 하는 3일 커리큘럼 형식의 글.',
    language: '영어',
    type: '글',
    url: 'https://noreceptionclub.com/blogs/journal/how-to-teach-your-toddler-how-to-ski-in-3-days',
  },
  {
    id: 'art-best-age',
    category: '유아(3~6세) 스킹',
    title: '몇 살부터 스키를 가르칠까? (All Mountain Mamas)',
    summary: '스키 시작 적정 연령에 대한 현실적인 답. 나이보다 아이의 준비 신호를 보는 법을 알려줘요.',
    language: '영어',
    type: '글',
    url: 'https://allmountainmamas.skivermont.com/whats-the-best-age-to-teach-my-kids-to-ski/',
  },
  {
    id: 'art-mountain-mama',
    category: '유아(3~6세) 스킹',
    title: '아이에게 스키 가르치는 법 (Tales of a Mountain Mama)',
    summary: '아웃도어 육아 블로그의 유아·어린이 스키 티칭 가이드. 하네스·보조기구 사용에 대한 균형 잡힌 조언.',
    language: '영어',
    type: '글',
    url: 'https://talesofamountainmama.com/how-to-teach-kids-to-downhill-ski/',
  },

  // ── 가족 스키 여행 노하우 ─────────────────────────────────
  {
    id: 'art-17tips',
    category: '가족 스키 여행 노하우',
    title: 'Skiing With Kids — 17가지 꿀팁 (Big Adventures with Little Feet)',
    summary: '아이와 스키장 가는 날의 현실 팁 17가지. 짐 싸기부터 슬로프 위 멘탈 관리까지.',
    language: '영어',
    type: '글',
    url: 'https://bigadventureswithlittlefeet.com/skiing-with-kids/',
  },
  {
    id: 'art-atf-guide',
    category: '가족 스키 여행 노하우',
    title: '가족 스키 완전 가이드 (Adventure Travel Family)',
    summary: '15년째 아이들과 여행하는 가족의 스키 여행 종합 가이드. 일정 짜기, 비용 아끼기, 아이 컨디션 관리.',
    language: '영어',
    type: '글',
    url: 'https://adventuretravelfamily.com/everything-skiing-with-kids/',
  },
  {
    id: 'art-snowbrains-safety',
    category: '가족 스키 여행 노하우',
    title: '가족 스키: 안전하게 & 재미있게 (SnowBrains)',
    summary: '스키 전문 매체의 가족 스키 안전 수칙 정리. 이 앱 안전 탭과 함께 읽으면 좋아요.',
    language: '영어',
    type: '글',
    url: 'https://snowbrains.com/family-ski-tips-how-to-be-safe-and-have-fun/',
  },

  // ── 부모용 심화 자료 ──────────────────────────────────────
  {
    id: 'art-skiingkids-teach',
    category: '부모용 심화 자료',
    title: '내 아이 직접 가르치기: 핵심 기술 5가지 (Skiing Kids)',
    summary: '다섯 아이를 직접 가르친 전직 스키 강사의 블로그. 강습비를 아끼며 부모가 직접 가르칠 때 꼭 필요한 5가지 기술.',
    language: '영어',
    type: '글',
    url: 'https://skiingkid.com/teaching-your-own-kids-to-ski/',
  },
  {
    id: 'art-skiingkids-resources',
    category: '부모용 심화 자료',
    title: '스키 스쿨 부모 자료 모음 (Skiing Kids)',
    summary: 'PSIA(미국스키강사협회) 어린이 강습 필드 가이드 등 부모가 참고할 수 있는 공식 자료들을 소개.',
    language: '영어',
    type: '글',
    url: 'https://skiingkid.com/ski-school-parent-resources/',
  },
  {
    id: 'art-skimag-tools',
    category: '부모용 심화 자료',
    title: '아이 스키 가르치기 보조 도구들 (SKI Magazine)',
    summary: '엣지 웨지(스키 팁 연결 도구), 하네스 등 티칭 보조 도구의 장단점과 올바른 사용법.',
    language: '영어',
    type: '글',
    url: 'https://www.skimag.com/performance/instruction/3-tools-to-help-young-skiers/',
  },
  {
    id: 'art-newgen-101',
    category: '부모용 심화 자료',
    title: 'Teaching Kids to Ski 101 (New Generation Ski School)',
    summary: '유럽 스키 스쿨이 정리한 어린이 티칭 개론. 강사들이 아이를 가르치는 방식을 부모 눈높이로 설명.',
    language: '영어',
    type: '글',
    url: 'https://www.skinewgen.com/ski-blog/skiing-with-kids/teaching-kids-to-ski-101-for-trainees-and-parents/',
  },
];
