<template>
  <ion-modal
    :is-open="appStore.chatModalOpen"
    @didDismiss="closeChat"
    class="chat-modal-fullscreen"
  >
    <ion-page>
      <!-- Header Principal -->
      <ion-header class="chat-header ion-no-border">
        <ion-toolbar class="main-toolbar">
          <ion-buttons slot="start">
            <ion-button fill="clear" class="btn-close" @click="closeChat">
              <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
            </ion-button>
          </ion-buttons>

          <!-- Informações do Profissional (sempre visíveis e sem sobreposição) -->
          <div class="header-prof-info">
            <img
              :src="currentProfessional?.avatar || defaultAvatar"
              :alt="currentProfessional?.name || 'Profissional'"
              class="header-avatar"
            />
            <div class="header-text-block">
              <span class="header-name">
                {{ currentProfessional?.name || 'Profissional' }}
              </span>
              <span class="online-indicator">
                <span class="dot-green"></span> Online
              </span>
            </div>
          </div>

          <ion-buttons slot="end">
            <!-- Em telas maiores, botão compacto no header -->
            <ion-button
              v-if="appStore.role === 'CLIENT'"
              fill="solid"
              class="btn-finish-desktop"
              @click="finishService"
            >
              <ion-icon slot="start" :icon="checkmarkCircleOutline"></ion-icon>
              Concluir
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <!-- Faixa de Ação Exclusiva para Conclusão em Mobile (evita sobreposição no topo) -->
        <div v-if="appStore.role === 'CLIENT'" class="mobile-action-strip">
          <div class="strip-info">
            <span class="strip-label">Serviço em andamento</span>
            <span class="strip-sub">Clique quando o profissional finalizar</span>
          </div>
          <ion-button
            fill="solid"
            class="btn-finish-mobile"
            @click="finishService"
          >
            <ion-icon slot="start" :icon="checkmarkCircleOutline"></ion-icon>
            Confirmar Conclusão
          </ion-button>
        </div>

        <!-- Sub-barra com a "Prévia do Evento" -->
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
            <span class="preview-text highlight-pay">Pix / Dinheiro</span>
          </div>
        </div>
      </ion-header>

      <!-- Corpo do Chat -->
      <ion-content :fullscreen="true" class="chat-content ion-padding">
        <div class="chat-container">
          <div class="security-banner">
            <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
            <span>Negociação segura ativa. O pagamento combinado será feito diretamente ao profissional no local.</span>
          </div>

          <!-- Balões de Mensagem Mockados -->
          <div class="messages-list">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-wrapper"
              :class="msg.sender === 'CLIENT' ? 'msg-client' : (msg.sender === 'SYSTEM' ? 'msg-system' : 'msg-provider')"
            >
              <div v-if="msg.sender === 'SYSTEM'" class="system-bubble">
                <p>{{ msg.text }}</p>
                <span class="msg-time">{{ msg.time }}</span>
              </div>

              <div v-else class="message-bubble">
                <span class="sender-label">
                  {{ msg.sender === 'CLIENT' ? 'Você' : (currentProfessional?.name || 'Profissional') }}
                </span>
                <p class="msg-text">{{ msg.text }}</p>
                <span class="msg-time">{{ msg.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </ion-content>

      <!-- Footer / Barra de Envio de Mensagem -->
      <ion-footer class="chat-footer ion-no-border">
        <ion-toolbar class="footer-toolbar">
          <div class="input-bar-container">
            <ion-input
              v-model="inputMessage"
              placeholder="Digite sua mensagem..."
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

  <!-- Toast de Conclusão / Agradecimento -->
  <ion-toast
    :is-open="showToast"
    :message="toastMessage"
    color="success"
    :duration="3500"
    position="top"
    @didDismiss="showToast = false"
  ></ion-toast>
</template>

<script setup>
import { ref, computed } from 'vue';
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

const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

const currentProfessional = computed(() => {
  return appStore.activeRequest?.selectedOffer?.professional || appStore.professionals[0];
});

const eventDateTime = computed(() => {
  const req = appStore.activeRequest;
  if (!req) return 'Hoje, às 14:30';
  return `${req.date || 'Hoje'} às ${req.time || '14:30'}`;
});

const eventLocation = computed(() => {
  const req = appStore.activeRequest;
  if (!req?.location) return 'Av. Paulista, 1000';
  return req.location.length > 22 ? req.location.substring(0, 20) + '...' : req.location;
});

const inputMessage = ref('');
const showToast = ref(false);
const toastMessage = ref('');

// Mensagens Mockadas
const messages = ref([
  {
    id: 1,
    sender: 'SYSTEM',
    text: 'Contato e chat liberados! Alinhem os detalhes finais do serviço.',
    time: '14:31'
  },
  {
    id: 2,
    sender: 'PROVIDER',
    text: 'Olá! Acabei de receber a confirmação do seu pedido. Já estou organizando as ferramentas para ir ao local.',
    time: '14:32'
  },
  {
    id: 3,
    sender: 'CLIENT',
    text: 'Perfeito! É no apartamento 42, interfone funcionando normalmente.',
    time: '14:33'
  },
  {
    id: 4,
    sender: 'PROVIDER',
    text: 'Combinado! O pagamento faremos via Pix ou Dinheiro assim que eu finalizar tudo, certo?',
    time: '14:34'
  }
]);

function closeChat() {
  appStore.chatModalOpen = false;
}

function sendMessage() {
  if (!inputMessage.value.trim()) return;

  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  messages.value.push({
    id: Date.now(),
    sender: appStore.role || 'CLIENT',
    text: inputMessage.value.trim(),
    time
  });

  inputMessage.value = '';
}

function finishService() {
  toastMessage.value = 'Serviço finalizado com sucesso! Muito obrigado por utilizar o +serve.';
  showToast.value = true;

  if (appStore.activeRequest?.id) {
    appStore.completeRequest(appStore.activeRequest.id);
  } else {
    appStore.activeRequest = null;
    appStore.chatModalOpen = false;
  }
}
</script>

<style scoped>
.chat-modal-fullscreen {
  --background: #030407;
  font-family: 'Inter', sans-serif;
}

.chat-header {
  background: #030407;
  border-bottom: 1px solid #1c202b;
}

.main-toolbar {
  --background: #030407;
  --color: #ffffff;
  padding: 4px 6px;
  --min-height: 56px;
}

.btn-close {
  --color: #ffffff;
  font-size: 1.25rem;
  --padding-start: 4px;
  --padding-end: 4px;
}

.header-prof-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1558C9;
  flex-shrink: 0;
}

.header-text-block {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header-name {
  font-size: 0.95rem;
  font-weight: 700;
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
  color: #25d366;
}

.dot-green {
  width: 6px;
  height: 6px;
  background: #25d366;
  border-radius: 50%;
  box-shadow: 0 0 6px #25d366;
}

/* Botão desktop no canto do toolbar */
.btn-finish-desktop {
  --background: #D4FF24;
  --background-activated: #bbe020;
  --color: #030407;
  font-size: 0.8rem;
  font-weight: 800;
  --border-radius: 8px;
  margin: 0;
  height: 32px;
  display: none;
}

@media (min-width: 580px) {
  .btn-finish-desktop {
    display: inline-flex;
  }
}

/* Faixa de Ação Exclusiva para Mobile */
.mobile-action-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0d121c;
  border-top: 1px solid #1a2233;
  padding: 8px 12px;
  gap: 8px;
}

@media (min-width: 580px) {
  .mobile-action-strip {
    display: none; /* Em telas maiores já usa o botão direto no topo */
  }
}

.strip-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.strip-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
}

.strip-sub {
  font-size: 0.68rem;
  color: #8e8e90;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-finish-mobile {
  --background: #D4FF24;
  --background-activated: #bbe020;
  --color: #030407;
  font-size: 0.78rem;
  font-weight: 800;
  --border-radius: 8px;
  margin: 0;
  height: 34px;
  flex-shrink: 0;
}

/* Sub-barra: Prévia do Evento */
.event-preview-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #0b0d14;
  border-top: 1px solid #151822;
  padding: 6px 8px;
  overflow-x: auto;
  gap: 6px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  font-size: 0.72rem;
}

.preview-icon {
  color: #5d93f7;
  font-size: 0.9rem;
}

.neon-icon {
  color: #D4FF24;
}

.preview-text {
  color: #cdcdce;
  font-weight: 500;
}

.highlight-pay {
  color: #D4FF24;
  font-weight: 700;
}

.preview-divider {
  width: 1px;
  height: 14px;
  background: #1c202b;
}

/* Chat Content */
.chat-content {
  --background: #030407;
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 680px;
  margin: 0 auto;
  min-height: 100%;
}

.security-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(21, 88, 201, 0.12);
  border: 1px solid rgba(21, 88, 201, 0.35);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.75rem;
  color: #8bb3f8;
  line-height: 1.35;
}

.security-banner ion-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* Balões de Mensagens */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.msg-system {
  justify-content: center;
}

.system-bubble {
  background: #0e121a;
  border: 1px solid #1c202b;
  border-radius: 8px;
  padding: 6px 12px;
  text-align: center;
  max-width: 90%;
}

.system-bubble p {
  color: #8e8e90;
  font-size: 0.75rem;
  margin: 0;
}

.msg-client {
  justify-content: flex-end;
}

.msg-client .message-bubble {
  background: #1558C9;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.msg-provider {
  justify-content: flex-start;
}

.msg-provider .message-bubble {
  background: #11141e;
  border: 1px solid #1c202b;
  color: #ffffff;
  border-bottom-left-radius: 4px;
}

.message-bubble {
  max-width: 82%;
  padding: 8px 12px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.sender-label {
  font-size: 0.68rem;
  font-weight: 700;
  opacity: 0.8;
}

.msg-text {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.4;
}

.msg-time {
  font-size: 0.65rem;
  opacity: 0.65;
  align-self: flex-end;
}

/* Footer / Input Bar */
.chat-footer {
  background: #030407;
  border-top: 1px solid #1c202b;
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
  --background: #0b0d14;
  --color: #ffffff;
  --placeholder-color: #68686a;
  border: 1px solid #1c202b;
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 0.85rem;
}

.btn-send-msg {
  --background: #D4FF24;
  --background-activated: #bbe020;
  --color: #030407;
  --border-radius: 10px;
  height: 38px;
  margin: 0;
}

.btn-send-msg[disabled] {
  opacity: 0.4;
}
</style>
