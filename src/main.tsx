import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { registerSW } from 'virtual:pwa-register';
import { Capacitor } from '@capacitor/core';
import { AccountProvider } from './lib/account';
import { initNative } from './lib/native';

// 네이티브 앱에선 Capacitor가 자산을 번들하므로 서비스워커 캐시가 불필요.
// (웹/PWA에서만 등록)
if (!Capacitor.isNativePlatform()) {
  registerSW({ immediate: true });
}
void initNative();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AccountProvider>
      <App />
    </AccountProvider>
  </React.StrictMode>,
);
