/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase 프로젝트 URL. 설정 시 백엔드가 localStorage → Supabase로 전환 */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon 공개 키 */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** 토스페이먼츠 클라이언트 키 (Phase 2 결제). 없으면 모의 결제 */
  readonly VITE_TOSS_CLIENT_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
