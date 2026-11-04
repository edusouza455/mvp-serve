<template>
  <ion-app>
    <ion-router-outlet />
    <BottomNav />
    <ChatModal />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import ChatModal from '@/components/ChatModal.vue';
import BottomNav from '@/components/BottomNav.vue';
</script>
