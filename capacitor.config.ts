import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.serve.app',
  appName: '+SERVE',
  webDir: 'dist',
  bundledWebRuntime: false,
  backgroundColor: '#030407',
  android: {
    backgroundColor: '#030407',
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#030407',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#030407',
      overlaysWebView: false
    }
  }
};

export default config;
