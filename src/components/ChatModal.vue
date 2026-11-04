<template>
  <ion-modal
    :is-open="appStore.chatModalOpen"
    @didDismiss="closeChat"
    class="chat-modal-fullscreen"
  >
    <ion-page>
      <!-- Header Principal Minimalista -->
      <ion-header class="chat-header ion-no-border">
        <ion-toolbar class="main-toolbar">
          <ion-buttons slot="start">
            <ion-button fill="clear" class="btn-close" @click="closeChat">
              <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
            </ion-button>
          </ion-buttons>

          <div class="header-prof-info">
            <img
              :src="currentProfessional.avatar"
              :alt="currentProfessional.name"
              class="header-avatar"
            />
            <div class="header-text-block">
              <span class="header-name">{{ currentProfessional.name }}</span>
              <span class="online-indicator">
                <span class="dot-green"></span> Online agora
              </span>
            </div>
          </div>

          <ion-buttons slot="end">
            <ion-button
              v-if=" !showRatingStep && appStore.activeRequest?.status !== 'COMPLETED'"
              fill="solid"
              class="btn-finish-header"
              @click="showRatingStep = true"
            >
              <ion-icon slot="start" :icon="checkmarkCircleOutline"></ion-icon>
              Concluir
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <!-- Sub-barra compacta com resumo do combinado -->
        <div class="event-preview-bar">
          <div class="preview-item">
            <ion-icon :icon="calendarOutline" class="preview-icon"></ion-icon>
            <span class="preview-text">{{ eventDateTime }}</span>
          </div>
          <div class="preview-divider"></div>
          <div class="preview-item">
            <ion-icon :icon="locationOutline" class="preview-icon"></ion-icon>
            <span class="preview-text">{{ eventLocation }}</span>
          </div>
          <div class="preview-divider"></div>
          <div class="preview-item">
            <ion-icon :icon="walletOutline" class="preview-icon neon-icon"></ion-icon>
            <span class="preview-text highlight-pay">R$ {{ eventBudget }}</span>
          </div>
        </div>
      </ion-header>

      <!-- Corpo do Chat ou Etapa de Avaliação Final -->
      <ion-content :fullscreen="true" class="chat-content ion-padding">
        <!-- ETAPA DE AVALIAÇÃO E CONCLUSÃO DO SERVIÇO -->
        <div v-if="showRatingStep" class="rating-finish-card">
          <div class="rating-icon-badge">
            <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
          </div>
          <h3 class="rating-title">Confirmar Conclusão do Serviço</h3>
          <p class="rating-sub">
            Como foi o atendimento de <strong>{{ currentProfessional.name }}</strong>?
          </p>

          <!-- Seletor de Estrelas (1 a 5) -->
          <div class="stars-selector">
            <button
              v-for="s in 5"
              :key="s"
              type="button"
              class="star-btn"
              :class="{ active: s <= ratingStars }"
              @click="ratingStars = s"
            >
              ★
            </button>
          </div>

          <!-- Elogios Rápidos de 1 Toque -->
          <div class="quick-praise-chips">
            <button
              v-for="tag in praiseTags"
              :key="tag"
              type="button"
              class="praise-chip"
              :class="{ active: reviewComment === tag }"
              @click="reviewComment = tag"
            >
              {{ tag }}
            </button>
          </div>

          <input
            type="text"
            v-model="reviewComment"
            placeholder="Deixe um comentário opcional..."
            class="rating-input"
          />

          <div class="rating-actions">
            <button class="btn-confirm-finish" @click="confirmFinishAndRate">
              FINALIZAR E LIBERAR PAGAMENTO
            </button>
            <button class="btn-back-chat" @click="showRatingStep = false">
              Voltar para a conversa
            </button>
          </div>
        </div>

        <!-- CONVERSA DO CHAT -->
        <div v-else class="chat-container">
          <div class="security-banner">
            <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
            <span>Pagamento protegido pela +SERVE. Libere após a conclusão.</span>
          </div>

          <div class="messages-list">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-wrapper"
              :class="msg.sender === 'CLIENT' ? 'msg-client' : (msg.sender === 'SYSTEM' ? 'msg-system' : 'msg-provider')"
            >
              <div v-if="msg.sender === 'SYSTEM'" class="system-bubble">
                <p>{{ msg.text }}</p>
              </div>

              <div v-else class="message-bubble">
                <span class="sender-label">
                  {{ msg.sender === 'CLIENT' ? 'Você' : currentProfessional.name }}
                </span>
                <p class="msg-text">{{ msg.text }}</p>
                <span class="msg-time">{{ msg.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </ion-content>

      <!-- Footer com Respostas Rápidas (Mobile-First) + Barra de Digitação -->
      <ion-footer v-if="!showRatingStep" class="chat-footer ion-no-border">
        <!-- Respostas de 1 toque para evitar digitação no celular -->
        <div class="quick-replies-bar">
          <button
            v-for="reply in quickReplies"
            :key="reply"
            type="button"
            class="quick-reply-pill"
            @click="sendQuickReply(reply)"
          >
            {{ reply }}
          </button>
        </div>

        <ion-toolbar class="footer-toolbar">
          <div class="input-bar-container">
            <ion-input
              v-model="inputMessage"
              placeholder="Mensagem..."
              class="chat-text-input"
              @keyup.enter="sendMessage"
            ></ion-input>

            <ion-button
              fill="solid"
              class="btn-send-msg"
              :disabled="!inputMessage.trim()"
              @click="sendMessage"
            >
              <ion-icon slot="icon-only" :icon="sendOutline"></ion-icon>
            </ion-button>
          </div>
        </ion-toolbar>
      </ion-footer>
    </ion-page>
  </ion-modal>

  <ion-toast
    :is-open="showToast"
    :message="toastMessage"
    color="success"
    :duration="2800"
    position="top"
    @didDismiss="showToast = false"
  ></ion-toast>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  IonModal,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
  IonInput,
  IonToast
} from '@ionic/vue';
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  calendarOutline,
  locationOutline,
  walletOutline,
  shieldCheckmarkOutline,
  sendOutline
} from 'ionicons/icons';
import { useAppStore } from '@/stores/useAppStore';

const appStore = useAppStore();

const defaultAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';

const showRatingStep = ref(false);
const ratingStars = ref(5);
const reviewComment = ref('Excelente profissional, super pontual!');
const praiseTags = [
  'Excelente profissional, super pontual!',
  'Serviço impecável e rápido!',
  'Muito educado e cuidadoso!'
];

const quickReplies = [
  'Combinado! 👍',
  'Pode vir no horário agendado',
  'Já estou no local 📍',
  'Pagamento via PIX pronto'
];

watch(() => appStore.chatModalOpen, (isOpen) => {
  if (isOpen) {
    showRatingStep.value = false;
    ratingStars.value = 5;
  }
});

const currentProfessional = computed(() => {
  const pro = appStore.activeRequest?.selectedOffer?.professional ||
    appStore.activeRequest?.professional ||
    appStore.highlightedProfessionals[0];
  return {
    name: pro?.name || pro?.nome || 'Profissional +SERVE',
    avatar: pro?.avatar || defaultAvatar
  };
});

const eventDateTime = computed(() => {
  const req = appStore.activeRequest;
  if (!req) return 'Hoje, 18:00';
  return `${req.date || 'Hoje'} • ${req.time || '18:00'}`;
});

const eventLocation = computed(() => {
  const req = appStore.activeRequest;
  if (!req?.location) return 'Boa Vista - RR';
  return req.location.length > 20 ? req.location.substring(0, 18) + '...' : req.location;
});

const eventBudget = computed(() => {
  return appStore.activeRequest?.budget || appStore.eventForm.valorOferecido || 200;
});

const inputMessage = ref('');
const showToast = ref(false);
const toastMessage = ref('');

const messages = ref([
  {
    id: 1,
    sender: 'SYSTEM',
    text: 'Conexão confirmada! Alinhem os detalhes finais por aqui.',
    time: 'Agora'
  },
  {
    id: 2,
    sender: 'PROVIDER',
    text: 'Olá! Recebi sua solicitação na +SERVE e já confirmei minha disponibilidade para o horário.',
    time: 'Agora'
  }
]);

function closeChat() {
  showRatingStep.value = false;
  appStore.chatModalOpen = false;
}

function appendMessage(text, sender = 'CLIENT') {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  messages.value.push({
    id: Date.now() + Math.random(),
    sender,
    text,
    time
  });
}

function sendMessage() {
  if (!inputMessage.value.trim()) return;
  appendMessage(inputMessage.value.trim(), appStore.role || 'CLIENT');
  inputMessage.value = '';
}

function sendQuickReply(replyText) {
  appendMessage(replyText, appStore.role || 'CLIENT');
}

function confirmFinishAndRate() {
  toastMessage.value = `Serviço concluído e avaliado com ${ratingStars.value}★!`;
  showToast.value = true;
  appStore.completeRequest(appStore.activeRequest?.id, ratingStars.value, reviewComment.value);
  showRatingStep.value = false;
}
</script>

<style scoped>
.chat-modal-fullscreen {
  --background: #030407;
  font-family: 'Inter', sans-serif;
}

.chat-header {
  background: #030407;
  border-bottom: 1px solid #171c26;
}

.main-toolbar {
  --background: #030407;
  --color: #ffffff;
  padding: 4px 8px;
  --min-height: 58px;
}

.btn-close {
  --color: #ffffff;
  font-size: 1.25rem;
}

.header-prof-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.header-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
  flex-shrink: 0;
}

.header-text-block {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header-name {
  font-size: 0.92rem;
  font-weight: 800;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.online-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: #22c55e;
}

.dot-green {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
}

.btn-finish-header {
  --background: #D4FF24;
  --color: #030407;
  font-size: 0.78rem;
  font-weight: 800;
  --border-radius: 8px;
  height: 34px;
  margin: 0;
}

.event-preview-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #070a10;
  border-top: 1px solid #141822;
  padding: 7px 10px;
  gap: 6px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.74rem;
  color: #cbd5e1;
  white-space: nowrap;
}

.preview-icon {
  color: #8f9cae;
  font-size: 0.9rem;
}

.neon-icon {
  color: #D4FF24;
}

.highlight-pay {
  color: #D4FF24;
  font-weight: 800;
}

.preview-divider {
  width: 1px;
  height: 12px;
  background: #1c2433;
}

.chat-content {
  --background: #030407;
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 680px;
  margin: 0 auto;
}

.security-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(212, 255, 36, 0.08);
  border: 1px solid rgba(212, 255, 36, 0.25);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 0.75rem;
  color: #cbd5e1;
}

.security-banner ion-icon {
  color: #D4FF24;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.msg-system {
  justify-content: center;
}

.system-bubble {
  background: #0b0e14;
  border: 1px solid #171c26;
  border-radius: 999px;
  padding: 5px 14px;
  text-align: center;
}

.system-bubble p {
  color: #8f9cae;
  font-size: 0.72rem;
  margin: 0;
}

.msg-client {
  justify-content: flex-end;
}

.msg-client .message-bubble {
  background: #D4FF24;
  color: #030407;
  border-bottom-right-radius: 4px;
}

.msg-provider {
  justify-content: flex-start;
}

.msg-provider .message-bubble {
  background: #0b0e14;
  border: 1px solid #1a2233;
  color: #ffffff;
  border-bottom-left-radius: 4px;
}

.message-bubble {
  max-width: 82%;
  padding: 10px 14px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.sender-label {
  font-size: 0.68rem;
  font-weight: 800;
  opacity: 0.75;
}

.msg-text {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.4;
  font-weight: 500;
}

.msg-time {
  font-size: 0.65rem;
  opacity: 0.65;
  align-self: flex-end;
}

/* Etapa de Avaliação */
.rating-finish-card {
  max-width: 460px;
  margin: 16px auto;
  background: #070a10;
  border: 1px solid #1a2233;
  border-radius: 18px;
  padding: 24px 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.rating-icon-badge {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(212, 255, 36, 0.12);
  color: #D4FF24;
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.rating-sub {
  font-size: 0.88rem;
  color: #8f9cae;
  margin: 0;
}

.stars-selector {
  display: flex;
  gap: 10px;
  margin: 4px 0;
}

.star-btn {
  background: transparent;
  border: none;
  font-size: 2.2rem;
  color: #242c3d;
  cursor: pointer;
  transition: transform 0.15s, color 0.15s;
}

.star-btn.active {
  color: #fbbf24;
  transform: scale(1.08);
}

.quick-praise-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.praise-chip {
  background: #0b0e14;
  border: 1px solid #1a2233;
  color: #a0aec0;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
}

.praise-chip.active {
  background: rgba(212, 255, 36, 0.12);
  border-color: #D4FF24;
  color: #D4FF24;
}

.rating-input {
  width: 100%;
  background: #0b0e14;
  border: 1px solid #1a2233;
  border-radius: 10px;
  padding: 12px;
  color: #ffffff;
  font-size: 0.88rem;
  outline: none;
}

.rating-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 6px;
}

.btn-confirm-finish {
  width: 100%;
  height: 48px;
  background: #D4FF24;
  color: #030407;
  border: none;
  border-radius: 12px;
  font-weight: 900;
  font-size: 0.88rem;
  cursor: pointer;
}

.btn-back-chat {
  background: transparent;
  border: none;
  color: #8f9cae;
  font-size: 0.82rem;
  padding: 8px;
  cursor: pointer;
}

/* Footer & Quick Replies */
.chat-footer {
  background: #030407;
  border-top: 1px solid #141822;
}

.quick-replies-bar {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 8px 10px 2px;
  scrollbar-width: none;
}

.quick-replies-bar::-webkit-scrollbar {
  display: none;
}

.quick-reply-pill {
  background: #0b0e14;
  border: 1px solid #1c2433;
  color: #cbd5e1;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.quick-reply-pill:active {
  border-color: #D4FF24;
  color: #D4FF24;
}

.footer-toolbar {
  --background: #030407;
  padding: 6px 8px;
}

.input-bar-container {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
}

.chat-text-input {
  --background: #0b0e14;
  --color: #ffffff;
  --placeholder-color: #68686a;
  border: 1px solid #1a2233;
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 0.88rem;
}

.btn-send-msg {
  --background: #D4FF24;
  --color: #030407;
  --border-radius: 10px;
  height: 40px;
  margin: 0;
}
</style>
