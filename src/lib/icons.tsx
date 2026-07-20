import type { IconType } from 'react-icons';
import {
  LuHouse,
  LuShield,
  LuClipboardCheck,
  LuGraduationCap,
  LuUsers,
  LuWind,
  LuEye,
  LuCloud,
  LuCloudRain,
  LuCloudDrizzle,
  LuCloudFog,
  LuCloudLightning,
  LuCloudSun,
  LuSun,
  LuSnowflake,
  LuDroplet,
  LuDroplets,
  LuThermometer,
  LuThermometerSnowflake,
  LuLaugh,
  LuSmile,
  LuMeh,
  LuFrown,
  LuAngry,
  LuRuler,
  LuLink,
  LuWrench,
  LuRecycle,
  LuHardHat,
  LuMountainSnow,
  LuTriangleAlert,
  LuHandshake,
  LuActivity,
  LuBandage,
  LuLifeBuoy,
  LuCalendarDays,
  LuBackpack,
  LuSunrise,
  LuLightbulb,
  LuBookOpen,
  LuHouse as LuHome,
  LuMapPin,
  LuExternalLink,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuUser,
  LuUserPlus,
  LuChevronRight,
  LuChevronDown,
  LuX,
  LuCircleCheck,
  LuFlag,
  LuGamepad2,
  LuSprout,
  LuFootprints,
  LuPizza,
  LuRotateCw,
  LuCableCar,
  LuRoute,
  LuOctagon,
  LuPersonStanding,
  LuArrowDownUp,
  LuChevronsDown,
  LuMoveUpRight,
  LuSkull,
} from 'react-icons/lu';
import { GiSkis } from 'react-icons/gi';
import { FaPersonSkiing } from 'react-icons/fa6';

/**
 * 앱 전역 아이콘 레지스트리.
 * 데이터 파일은 이모지 대신 여기의 문자열 키(icon)를 들고, 렌더링 시 iconMap으로 해석한다.
 * 이렇게 하면 데이터 파일이 JSX-free로 유지된다.
 */
export const iconMap: Record<string, IconType> = {
  // 탭
  home: LuHouse,
  gear: GiSkis,
  safety: LuShield,
  check: LuClipboardCheck,
  learn: LuGraduationCap,
  family: LuUsers,

  // 장비 가이드 섹션
  flex: FaPersonSkiing,
  boots: LuFootprints,
  helmet: LuHardHat,
  din: LuLink,
  maintenance: LuWrench,
  used: LuRecycle,
  ruler: LuRuler,
  pole: GiSkis,

  // 안전 섹션
  lift: LuCableCar,
  fis: LuHandshake,
  warmup: LuActivity,
  weather: LuThermometer,
  injury: LuBandage,
  park: LuMountainSnow,
  terrain: LuRoute,
  emergency: LuLifeBuoy,

  // 배움터 기술 개념
  stance: LuPersonStanding,
  fall: LuArrowDownUp,
  turnPurpose: LuRotateCw,
  sideslip: LuChevronsDown,
  traverse: LuMoveUpRight,
  hockeystop: LuOctagon,
  carving: FaPersonSkiing,

  // 체크리스트 그룹
  season: LuCalendarDays,
  pack: LuBackpack,
  morning: LuSunrise,

  // 가르치기 로드맵 단계
  stage0: LuHome,
  stage1: LuFootprints,
  stage2: LuMountainSnow,
  stage3: LuPizza,
  stage4: LuRotateCw,
  stage5: LuCableCar,
  stage6: FaPersonSkiing,

  // 범용
  tip: LuLightbulb,
  resortFamily: LuUsers,
  goal: LuFlag,
  game: LuGamepad2,
  ready: LuCircleCheck,
  sprout: LuSprout,
  book: LuBookOpen,
  mapPin: LuMapPin,
  externalLink: LuExternalLink,
  plus: LuPlus,
  userPlus: LuUserPlus,
  pencil: LuPencil,
  trash: LuTrash2,
  user: LuUser,
  warn: LuTriangleAlert,
};

export function resolveIcon(key: string): IconType {
  return iconMap[key] ?? LuCircleCheck;
}

/** 데이터 icon 키를 받아 렌더링하는 헬퍼 컴포넌트 */
export function Icon({ name, className, size }: { name: string; className?: string; size?: number }) {
  const Cmp = resolveIcon(name);
  return <Cmp className={className} size={size} aria-hidden />;
}

// 자주 직접 쓰는 아이콘 재노출
export {
  LuChevronRight,
  LuChevronDown,
  LuX,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuUser,
  LuUserPlus,
  LuUsers,
  LuExternalLink,
  LuLightbulb,
  LuFlag,
  LuGamepad2,
  LuCircleCheck,
  LuMapPin,
  LuWind,
  LuEye,
  LuCloud,
  LuSnowflake,
  LuTriangleAlert,
  GiSkis,
};

// 등급 얼굴 아이콘 (스키 지수)
export const GRADE_ICONS: Record<string, IconType> = {
  best: LuLaugh,
  good: LuSmile,
  fair: LuMeh,
  caution: LuFrown,
  bad: LuAngry,
};

// 설질 아이콘
export const SNOW_ICONS: Record<string, IconType> = {
  powder: LuSnowflake,
  groomed: FaPersonSkiing,
  wet: LuDroplet,
  slush: LuDroplets,
  icy: LuThermometerSnowflake,
};

// 날씨 카드 지표 아이콘
export const METRIC_ICONS = {
  temp: LuThermometer,
  apparent: LuThermometerSnowflake,
  wind: LuWind,
  visibility: LuEye,
  precipitation: LuCloudRain,
  snowDepth: LuSnowflake,
  cloud: LuCloud,
} as const;

/** WMO weather code → 아이콘 + 한국어 라벨 */
export function weatherCodeIcon(code: number): { label: string; Icon: IconType } {
  if (code === 0) return { label: '맑음', Icon: LuSun };
  if (code === 1) return { label: '대체로 맑음', Icon: LuCloudSun };
  if (code === 2) return { label: '구름 조금', Icon: LuCloudSun };
  if (code === 3) return { label: '흐림', Icon: LuCloud };
  if (code === 45 || code === 48) return { label: '안개', Icon: LuCloudFog };
  if (code >= 51 && code <= 57) return { label: '이슬비', Icon: LuCloudDrizzle };
  if (code >= 61 && code <= 67) return { label: '비', Icon: LuCloudRain };
  if (code >= 71 && code <= 77) return { label: '눈', Icon: LuSnowflake };
  if (code >= 80 && code <= 82) return { label: '소나기', Icon: LuCloudRain };
  if (code === 85 || code === 86) return { label: '소낙눈', Icon: LuSnowflake };
  if (code >= 95) return { label: '뇌우', Icon: LuCloudLightning };
  return { label: '흐림', Icon: LuCloud };
}

// 미사용 방지용 (skull은 향후 확장 대비 유지)
void LuSkull;
