import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kizski.app',
  appName: '키즈스키',
  webDir: 'dist',
  backgroundColor: '#eef4ff',
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: '#eef4ff',
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT', // 밝은 배경 → 어두운 아이콘
      backgroundColor: '#eef4ff',
    },
  },
};

export default config;
