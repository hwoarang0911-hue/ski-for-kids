# 키즈스키 — 네이티브 앱 빌드 가이드 (iOS/Android)

현재 웹(React+Vite) 코드를 **Capacitor**로 감싸 iOS·Android 네이티브 앱으로
빌드합니다. 웹 코드는 그대로 재사용되고, 네이티브 껍데기(WebView) + 네이티브
기능(상태바·스플래시·백버튼)이 붙습니다.

## 구조

```
dist/            ← Vite 빌드 결과(웹). cap sync가 네이티브로 복사
android/         ← Android 네이티브 프로젝트 (Android Studio로 열기)
ios/             ← iOS 네이티브 프로젝트 (Xcode로 열기, macOS 필요)
assets/icon.png  ← 앱 아이콘 원본(1024px 권장) — 아이콘/스플래시 생성 소스
capacitor.config.ts ← 앱 ID·이름·플러그인 설정
```

- **appId**: `com.kizski.app` · **appName**: `키즈스키`

## 사전 준비

- **공통**: Node 18+, `npm install`
- **Android**: Android Studio (Android SDK, JDK 17)
- **iOS**: macOS + Xcode + CocoaPods (`sudo gem install cocoapods`)

## 빌드·실행

```bash
# 웹 빌드 + 네이티브에 동기화
npm run app:sync

# Android Studio 열기 (여기서 에뮬레이터/실기기 실행·APK·AAB 빌드)
npm run app:android

# iOS Xcode 열기 (macOS에서만, 시뮬레이터/실기기 실행)
npm run app:ios
```

코드를 수정한 뒤에는 항상 `npm run app:sync`(= `build` + `cap sync`)로 최신
웹 자산을 네이티브에 반영합니다.

## 아이콘·스플래시 교체

`assets/icon.png`(정사각 1024px)를 교체하고 실행:

```bash
npx @capacitor/assets generate \
  --iconBackgroundColor '#eef4ff' --iconBackgroundColorDark '#0e1b33' \
  --splashBackgroundColor '#eef4ff' --splashBackgroundColorDark '#0e1b33'
npx cap sync
```

## 네이티브 통합 (이미 반영됨)

- `src/lib/native.ts`: 상태바 스타일, 스플래시 숨김, 안드로이드 하드웨어
  백버튼(히스토리 back / 최상위에서 종료).
- 서비스워커(PWA 캐시)는 **웹에서만** 등록. 네이티브는 Capacitor가 자산을
  번들하므로 불필요.

## 출시 전 체크리스트

- [ ] **백엔드**: `.env.local`에 `VITE_SUPABASE_URL`·`VITE_SUPABASE_ANON_KEY`
      설정(로컬 저장 → 서버 저장 전환). `src/lib/backend/schema.sql` 실행.
- [ ] **결제**: `VITE_TOSS_CLIENT_KEY` + 서버 승인 엔드포인트(스토어 인앱결제는
      RevenueCat 권장). 앱스토어 정책상 디지털 상품은 인앱결제 필요 여부 확인.
- [ ] **앱 서명**: Android 키스토어, iOS 인증서·프로비저닝.
- [ ] **권한·개인정보 처리방침**(아동 데이터), 스토어 등록 정보(스크린샷·설명).
- [ ] **딥링크/외부 링크**(지도·전화)는 실기기에서 동작 확인.

## 참고

- Capacitor 6. `npx cap doctor`로 환경 점검.
- iOS는 반드시 macOS에서 `pod install` 후 Xcode 빌드가 됩니다(리눅스/윈도우 불가).
