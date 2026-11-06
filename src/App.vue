<template>
  <div class="mobile-app- outer-stage">
    <ion-app class="mobile-app-viewport">
      <ion-router-outlet />
      <BottomNav />
      <ChatModal />
    </ion-app>
  </div>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import ChatModal from '@/components/ChatModal.vue';
import BottomNav from '@/components/BottomNav.vue';
</script>

<style>
/* Fundo externo escuro quando visualizado em telas maiores (simula o frame nativo de aplicativo mobile) */
html,
body {
  background-color: #010204 !important;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* Em celulares ocupa 100% da tela; em telas maiores centraliza como um aplicativo mobile (430px) */
@media (min-width: 500px) {
  ion-app.mobile-app-viewport {
    max-width: 430px !important;
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
