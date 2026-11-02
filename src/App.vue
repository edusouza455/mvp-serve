<template>
  <ion-app>
    <ion-router-outlet />
    <ChatModal />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import ChatModal from '@/components/ChatModal.vue';
</script>
