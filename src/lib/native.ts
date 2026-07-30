/**
 * 네이티브(Capacitor) 통합. 웹에서는 아무것도 하지 않는다.
 * - 상태바 스타일
 * - 스플래시 숨김
 * - 안드로이드 하드웨어 백버튼: 최상위에서 앱 종료, 아니면 히스토리 back
 */
import { Capacitor } from '@capacitor/core';

export async function initNative() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Light });
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#eef4ff' });
    }
  } catch {
    /* 상태바 플러그인 미탑재 환경 무시 */
  }

  try {
    const { App } = await import('@capacitor/app');
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else App.exitApp();
    });
  } catch {
    /* 무시 */
  }

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch {
    /* 무시 */
  }
}
