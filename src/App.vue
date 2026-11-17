<template>
  <div class="mobile-app-outer-stage">
    <ion-app class="mobile-app-viewport">
      <ion-router-outlet />
      <BottomNav />
      <ChatModal />
    </ion-app>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet, useBackButton } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';
import { useAppStore } from '@/stores/useAppStore';
import ChatModal from '@/components/ChatModal.vue';
import BottomNav from '@/components/BottomNav.vue';

const router = useRouter();
const store = useAppStore();

// Inicialização nativa de StatusBar e SplashScreen quando rodando no APK Android
onMounted(async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setBackgroundColor({ color: '#030407' });
      await StatusBar.setStyle({ style: Style.Dark });
      await SplashScreen.hide();
    } catch {
      // Ignora em navegadores web
    }
  }
});

// Tratamento nativo do botão físico de "Voltar" no Android (APK)
useBackButton(10, () => {
  if (store.chatModalOpen) {
    store.chatModalOpen = false;
    return;
  }
  if (store.ordersModalOpen) {
    store.ordersModalOpen = false;
    return;
  }
  if (store.profileMenuModalOpen) {
    store.profileMenuModalOpen = false;
    return;
  }
  if (store.boostModalOpen) {
    store.boostModalOpen = false;
    return;
  }
  if (router.currentRoute.value.path !== '/home') {
    router.push('/home');
  } else if (Capacitor.isNativePlatform()) {
    CapApp.exitApp();
  }
});
</script>

<style>
/* Fundo externo escuro e suporte nativo a Safe Area para APK Android/iOS */
html,
body {
  background-color: #030407 !important;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* Safe area para câmera frontal (notch) e barra de gestos inferior no APK */
ion-header {
  padding-top: env(safe-area-inset-top, 0px);
  background: #030407;
}

/* Em celulares e tablets ocupa 100% da tela; em monitores desktop centraliza o frame mobile (440px) */
@media (min-width: 769px) {
  html,
  body {
    background-color: #010204 !important;
  }

  ion-app.mobile-app-viewport {
    max-width: 440px !important;
    margin: 0 auto !important;
    left: 0 !important;
    right: 0 !important;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 65px rgba(0, 0, 0, 0.9);
    overflow: hidden;
  }
}
</style>
