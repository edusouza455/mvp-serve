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
            <div class="avatar-with-dot">
              <img
                :src="currentProfessional.avatar"
                :alt="currentProfessional.name"
                class="header-avatar"
              />
              <span class="online-dot-mini"></span>
            </div>
            <div class="header-text-block">
              <h3 class="header-name">{{ currentProfessional.name }}</h3>
              <p class="header-sub-meta">
                <span>{{ eventCategory }}</span>
                <span class="meta-separator">•</span>
                <span>{{ eventDateTime }}</span>
              </p>
            </div>
          </div>

          <ion-buttons slot="end">
            <!-- Pílula de Valor em Destaque -->
            <div class="header-payout-pill">
              <span class="payout-micro-label">VALOR</span>
              <strong class="payout-value-num">R$ {{ eventBudget }}</strong>
            </div>

            <!-- Botão de Conclusão do Contratante (quando serviço feito) -->
            <button
              v-if="!showRatingStep && appStore.activeRequest?.status !== 'COMPLETED' && isClient && bothAccepted"
              type="button"
              class="btn-finish-mini"
              @click="showRatingStep = true"
            >
              <ion-icon :icon="checkmarkCircle"></ion-icon>
              <span>Concluir</span>
            </button>
          </ion-buttons>
        </ion-toolbar>

        <!-- STATUS DE CANCELADO / RECUSADO -->
        <div v-if="appStore.activeRequest?.status === 'CANCELLED' || appStore.activeRequest?.status === 'REJECTED'" class="chat-status-alert-strip">
          <ion-icon :icon="closeCircleOutline" class="alert-icon-red"></ion-icon>
          <div class="alert-text-wrap">
            <strong>{{ appStore.activeRequest.status === 'CANCELLED' ? 'Pedido Cancelado' : 'Proposta Recusada' }}</strong>
            <p>{{ appStore.activeRequest.cancelReason || 'Esta negociação foi encerrada.' }}</p>
          </div>
        </div>

        <!-- BARRA SLIM DE NEGOCIAÇÃO / ACORDO -->
        <div v-else-if="appStore.activeRequest?.status !== 'COMPLETED'" class="chat-deal-strip">
          <!-- CASO 1: AMBOS ACEITARAM (ACORDO CONFIRMADO) -->
          <div v-if="bothAccepted" class="deal-strip-confirmed">
            <div class="deal-confirmed-badge">
              <ion-icon :icon="checkmarkCircle" class="check-neon-icon"></ion-icon>
              <div class="confirmed-copy">
                <strong>Acordo Confirmado • R$ {{ eventBudget }}</strong>
                <span>Pagamento direto (PIX/dinheiro) no local</span>
              </div>
            </div>
            <button v-if="isProvider" type="button" class="btn-micro-reajustar" @click="openChatCounterOffer">
              Reajustar
            </button>
          </div>

          <!-- CASO 2: PRESTADOR PENDENTE DE ACEITE OU CONTRAPROPOSTA -->
          <div v-else-if="isProvider" class="deal-strip-flow">
            <div class="deal-flow-top">
              <div class="deal-tag-box">
                <span class="pulse-indicator"></span>
                <strong>Proposta: R$ {{ eventBudget }}</strong>
              </div>
              <span class="deal-flow-state">
                {{ appStore.activeRequest?.clientAccepted ? '✓ Contratante aceitou' : 'Aguardando cliente' }}
              </span>
            </div>

            <div class="deal-flow-buttons">
              <button
                type="button"
                class="btn-flow-accept"
                :class="{ active: appStore.activeRequest?.providerAccepted }"
                @click="handleProviderAcceptDeal"
              >
                <ion-icon :icon="appStore.activeRequest?.providerAccepted ? checkmarkCircle : checkmarkOutline"></ion-icon>
                <span>{{ appStore.activeRequest?.providerAccepted ? 'Você Aceitou' : 'Aceitar' }}</span>
              </button>

              <button
                type="button"
                class="btn-flow-counter"
                @click="openChatCounterOffer"
                title="Fazer contraproposta de valor"
              >
                <ion-icon :icon="cashOutline"></ion-icon>
                <span>Contraproposta</span>
              </button>

              <button
                type="button"
                class="btn-flow-reject"
                @click="showRejectModal = true"
                title="Negar / Recusar esta proposta"
              >
                <ion-icon :icon="closeOutline"></ion-icon>
                <span>Negar</span>
              </button>
            </div>
          </div>

          <!-- CASO 3: CLIENTE PENDENTE DE ACEITE -->
          <div v-else class="deal-strip-flow">
            <div class="deal-flow-top">
              <div class="deal-tag-box">
                <span class="pulse-indicator"></span>
                <strong>Proposta: R$ {{ eventBudget }}</strong>
              </div>
              <span class="deal-flow-state">
                {{ appStore.activeRequest?.providerAccepted ? '✓ Prestador aceitou o serviço' : 'Aguardando prestador' }}
              </span>
            </div>

            <div class="deal-flow-buttons client">
              <button
                type="button"
                class="btn-flow-accept"
                :class="{ active: appStore.activeRequest?.clientAccepted }"
                @click="handleClientAcceptDeal"
              >
                <ion-icon :icon="appStore.activeRequest?.clientAccepted ? checkmarkCircle : checkmarkOutline"></ion-icon>
                <span>{{ appStore.activeRequest?.clientAccepted ? 'Você Aceitou' : 'Aceitar Proposta' }}</span>
              </button>

              <button
                type="button"
                class="btn-flow-cancel"
                @click="showCancelModal = true"
                title="Cancelar pedido"
              >
                <ion-icon :icon="closeOutline"></ion-icon>
                <span>Cancelar</span>
              </button>
            </div>
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
          <h3 class="rating-title">Confirmar que o Serviço foi Feito</h3>
          <p class="rating-sub">
            O pagamento foi realizado diretamente ao prestador? Avalie o atendimento de <strong>{{ currentProfessional.name }}</strong>:
          </p>

          <div class="direct-pay-confirm-badge">
            <ion-icon :icon="walletOutline" class="neon-icon"></ion-icon>
            <span>Pagamento direto efetuado (PIX/Dinheiro) • Taxa da plataforma debitada do Saldo do prestador</span>
          </div>

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
              CONFIRMAR SERVIÇO FEITO & AVALIAR
            </button>
            <button class="btn-back-chat" @click="showRatingStep = false">
              Voltar para a conversa
            </button>
          </div>
        </div>

        <!-- CONVERSA DO CHAT -->
        <div v-else class="chat-container">
          <!-- DICA DE PAGAMENTO DIRETO DISCRETA E DISPENSÁVEL -->
          <div v-if="showDirectPayTip" class="chat-micro-tip">
            <ion-icon :icon="shieldCheckmarkOutline" class="tip-shield"></ion-icon>
            <span class="tip-text">
              <strong>Acerto direto:</strong> combinem PIX ou dinheiro. Taxa debitada do Saldo ao finalizar.
            </span>
            <button type="button" class="btn-tip-dismiss" @click="showDirectPayTip = false">✕</button>
          </div>

          <!-- BANNER INTERATIVO DE CONTRAPROPOSTA PENDENTE -->
          <div
            v-if="appStore.activeRequest?.counterOffer && appStore.activeRequest?.counterOffer?.status === 'PENDING'"
            class="chat-counter-offer-banner"
          >
            <div class="counter-banner-top">
              <span class="counter-kicker">⚡ CONTRAPROPOSTA DO PRESTADOR</span>
              <strong class="counter-amount-highlight">R$ {{ appStore.activeRequest.counterOffer.amount }},00</strong>
            </div>
            <p v-if="appStore.activeRequest.counterOffer.note" class="counter-banner-note">
              "{{ appStore.activeRequest.counterOffer.note }}"
            </p>

            <div v-if="isClient" class="counter-decision-actions">
              <button type="button" class="btn-accept-counter" @click="handleAcceptCounterOffer">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Aceitar por R$ {{ appStore.activeRequest.counterOffer.amount }}</span>
              </button>
              <button type="button" class="btn-decline-counter" @click="handleDeclineCounterOffer">
                <ion-icon :icon="closeOutline"></ion-icon>
                <span>Recusar</span>
              </button>
            </div>
            <div v-else class="counter-pending-info">
              <span>Aguardando o contratante responder à sua contraproposta de R$ {{ appStore.activeRequest.counterOffer.amount }}.</span>
            </div>
          </div>

          <!-- Card de Ação Rápida para o Contratante confirmar quando terminar -->
          <div v-if="isClient && appStore.activeRequest?.status !== 'COMPLETED' && appStore.activeRequest?.status !== 'CANCELLED' && appStore.activeRequest?.status !== 'REJECTED'" class="client-finish-prompt-box">
            <div class="prompt-text-block">
              <strong>O serviço já foi finalizado?</strong>
              <p>Confirme para registrar no histórico e liberar a avaliação do prestador.</p>
            </div>
            <button type="button" class="btn-client-done-action" @click="showRatingStep = true">
              <ion-icon :icon="checkmarkCircle"></ion-icon>
              <span>Confirmar Serviço Feito</span>
            </button>
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

  <!-- ================= MODAL NO CHAT: FAZER CONTRAPROPOSTA (PRESTADOR) ================= -->
  <ion-modal
    :is-open="showChatCounterModal"
    :breakpoints="[0, 0.65, 0.85]"
    :initial-breakpoint="0.65"
    @didDismiss="showChatCounterModal = false"
    class="custom-chat-dialog-modal"
  >
    <ion-content class="dialog-sheet-inner ion-padding">
      <div class="dialog-header-row">
        <div>
          <span class="dialog-kicker">NEGOCIAÇÃO NO CHAT</span>
          <h3 class="dialog-title">Enviar Contraproposta</h3>
          <p class="dialog-sub">Valor atual da proposta: R$ {{ eventBudget }},00</p>
        </div>
        <button type="button" class="btn-dialog-close" @click="showChatCounterModal = false">✕</button>
      </div>

      <div class="counter-form-body">
        <label class="field-label-mini">Sugestões rápidas de valor</label>
        <div class="quick-vals-row">
          <button
            v-for="amt in [(Number(eventBudget) || 100) + 20, (Number(eventBudget) || 100) + 40, (Number(eventBudget) || 100) + 60]"
            :key="amt"
            type="button"
            class="quick-val-pill"
            :class="{ active: chatCounterAmount === amt }"
            @click="chatCounterAmount = amt"
          >
            R$ {{ amt }}
          </button>
        </div>

        <label class="field-label-mini">Ou digite o novo valor (R$)</label>
        <div class="custom-val-input-wrap">
          <span class="currency-tag">R$</span>
          <input
            type="number"
            v-model.number="chatCounterAmount"
            placeholder="0"
            class="val-input-field"
          />
          <span class="cents-tag">,00</span>
        </div>

        <label class="field-label-mini">Mensagem ou justificativa (opcional)</label>
        <input
          type="text"
          v-model="chatCounterNote"
          placeholder="Ex: Levo materiais próprios / Horário adicional"
          class="dialog-text-input"
        />

        <button type="button" class="btn-confirm-action" @click="submitChatCounterOffer">
          <ion-icon :icon="cashOutline"></ion-icon>
          <span>Enviar Contraproposta de R$ {{ chatCounterAmount }}</span>
        </button>
      </div>
    </ion-content>
  </ion-modal>

  <!-- ================= MODAL NO CHAT: CANCELAR PEDIDO (CLIENTE) ================= -->
  <ion-modal
    :is-open="showCancelModal"
    :breakpoints="[0, 0.55, 0.75]"
    :initial-breakpoint="0.55"
    @didDismiss="showCancelModal = false"
    class="custom-chat-dialog-modal"
  >
    <ion-content class="dialog-sheet-inner ion-padding">
      <div class="dialog-header-row">
        <div>
          <span class="dialog-kicker red">CANCELAMENTO</span>
          <h3 class="dialog-title">Cancelar Pedido</h3>
          <p class="dialog-sub">Essa ação encerrará esta conversa e a solicitação.</p>
        </div>
        <button type="button" class="btn-dialog-close" @click="showCancelModal = false">✕</button>
      </div>

      <div class="cancel-form-body">
        <label class="field-label-mini">Qual o motivo do cancelamento?</label>
        <div class="reason-pills-column">
          <button
            v-for="r in ['Mudança de planos ou data', 'Encontrei outro profissional', 'Orçamento incompatível', 'Outro motivo']"
            :key="r"
            type="button"
            class="reason-pill"
            :class="{ active: cancelReason === r }"
            @click="cancelReason = r"
          >
            <span class="reason-radio-dot" :class="{ on: cancelReason === r }"></span>
            <span>{{ r }}</span>
          </button>
        </div>

        <button type="button" class="btn-danger-action" @click="confirmCancelOrder">
          <ion-icon :icon="closeOutline"></ion-icon>
          <span>Confirmar Cancelamento</span>
        </button>
      </div>
    </ion-content>
  </ion-modal>

  <!-- ================= MODAL NO CHAT: NEGAR / RECUSAR PROPOSTA (PRESTADOR) ================= -->
  <ion-modal
    :is-open="showRejectModal"
    :breakpoints="[0, 0.55, 0.75]"
    :initial-breakpoint="0.55"
    @didDismiss="showRejectModal = false"
    class="custom-chat-dialog-modal"
  >
    <ion-content class="dialog-sheet-inner ion-padding">
      <div class="dialog-header-row">
        <div>
          <span class="dialog-kicker red">RECUSAR PROPOSTA</span>
          <h3 class="dialog-title">Negar Proposta</h3>
          <p class="dialog-sub">Informe o motivo para mantermos as preferências da sua agenda alinhadas.</p>
        </div>
        <button type="button" class="btn-dialog-close" @click="showRejectModal = false">✕</button>
      </div>

      <div class="cancel-form-body">
        <label class="field-label-mini">Motivo da recusa:</label>
        <div class="reason-pills-column">
          <button
            v-for="r in ['Agenda indisponível para esta data', 'Distância / Local fora da área', 'Valor incompatível com o escopo', 'Outro compromisso no horário']"
            :key="r"
            type="button"
            class="reason-pill"
            :class="{ active: rejectReason === r }"
            @click="rejectReason = r"
          >
            <span class="reason-radio-dot" :class="{ on: rejectReason === r }"></span>
            <span>{{ r }}</span>
          </button>
        </div>

        <button type="button" class="btn-danger-action" @click="confirmRejectJob">
          <ion-icon :icon="closeOutline"></ion-icon>
          <span>Confirmar Recusa da Proposta</span>
        </button>
      </div>
    </ion-content>
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
  checkmarkCircle,
  checkmarkOutline,
  calendarOutline,
  locationOutline,
  walletOutline,
  shieldCheckmarkOutline,
  sendOutline,
  closeOutline,
  closeCircleOutline,
  cashOutline,
  warningOutline
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

const showDirectPayTip = ref(true);

const currentProfessional = computed(() => {
  const pro = appStore.activeRequest?.selectedOffer?.professional ||
    appStore.activeRequest?.professional ||
    appStore.highlightedProfessionals[0];
  return {
    name: pro?.name || pro?.nome || 'Profissional +SERVE',
    avatar: pro?.avatar || defaultAvatar
  };
});

const eventCategory = computed(() => {
  return appStore.activeRequest?.categoria || appStore.activeRequest?.category || 'Serviço';
});

const eventDateTime = computed(() => {
  const req = appStore.activeRequest;
  if (!req) return 'Hoje às 18:00';
  const d = req.date || 'Hoje';
  const t = req.time || '18:00';
  if (d.includes('-')) {
    const parts = d.split('-');
    if (parts.length === 3) {
      const day = parts[2];
      const mIdx = parseInt(parts[1], 10) - 1;
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const mName = months[mIdx] || parts[1];
      return `${day} ${mName}, ${t}`;
    }
  }
  return `${d}, ${t}`;
});

const bothAccepted = computed(() => {
  return !!(appStore.activeRequest?.providerAccepted && appStore.activeRequest?.clientAccepted);
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

const isProvider = computed(() => {
  return appStore.role === 'PROVIDER';
});

const isClient = computed(() => {
  return appStore.role !== 'PROVIDER';
});

// Modais e Estados de Cancelamento / Negociação no Chat
const showChatCounterModal = ref(false);
const chatCounterAmount = ref(0);
const chatCounterNote = ref('');

const showCancelModal = ref(false);
const cancelReason = ref('Mudança de planos ou data');

const showRejectModal = ref(false);
const rejectReason = ref('Agenda indisponível para esta data');

function openChatCounterOffer() {
  chatCounterAmount.value = (Number(eventBudget.value) || 100) + 20;
  chatCounterNote.value = '';
  showChatCounterModal.value = true;
}

function submitChatCounterOffer() {
  if (!appStore.activeRequest) return;
  const targetId = appStore.activeRequest.id || appStore.activeRequest.orderId;
  appStore.submitCounterOffer(targetId, chatCounterAmount.value, chatCounterNote.value);
  appendMessage(
    `⚡ Contraproposta enviada: R$ ${chatCounterAmount.value}${chatCounterNote.value ? ' • "' + chatCounterNote.value + '"' : ''}`,
    'PROVIDER'
  );
  showChatCounterModal.value = false;
  toastMessage.value = `Contraproposta de R$ ${chatCounterAmount.value} enviada!`;
  showToast.value = true;
}

function handleAcceptCounterOffer() {
  if (!appStore.activeRequest) return;
  const targetId = appStore.activeRequest.id || appStore.activeRequest.orderId;
  const counterVal = appStore.activeRequest.counterOffer?.amount || eventBudget.value;
  appStore.acceptCounterOffer(targetId);
  appendMessage(`✓ Contraproposta de R$ ${counterVal} aceita pelo contratante! Acordo confirmado.`, 'CLIENT');
  toastMessage.value = `Contraproposta de R$ ${counterVal} aceita!`;
  showToast.value = true;
}

function handleDeclineCounterOffer() {
  if (!appStore.activeRequest) return;
  const targetId = appStore.activeRequest.id || appStore.activeRequest.orderId;
  appStore.declineCounterOffer(targetId);
  appendMessage('Contraproposta recusada pelo contratante. O valor original permanece mantido.', 'CLIENT');
  toastMessage.value = 'Contraproposta recusada.';
  showToast.value = true;
}

function confirmCancelOrder() {
  if (!appStore.activeRequest) return;
  const targetId = appStore.activeRequest.id || appStore.activeRequest.orderId;
  appStore.cancelOrder(targetId, cancelReason.value);
  appendMessage(`❌ Pedido cancelado pelo contratante. Motivo: ${cancelReason.value}`, 'SYSTEM');
  showCancelModal.value = false;
  toastMessage.value = 'Pedido cancelado.';
  showToast.value = true;
}

function confirmRejectJob() {
  if (!appStore.activeRequest) return;
  const targetId = appStore.activeRequest.id || appStore.activeRequest.orderId;
  appStore.rejectJobLead(targetId, rejectReason.value);
  appendMessage(`🚫 Proposta recusada pelo prestador. Motivo: ${rejectReason.value}`, 'SYSTEM');
  showRejectModal.value = false;
  toastMessage.value = 'Proposta recusada.';
  showToast.value = true;
}

function handleProviderAcceptDeal() {
  if (appStore.activeRequest) {
    appStore.setProviderAccepted(appStore.activeRequest.id);
    appendMessage('✓ Aceitei o serviço! Podemos combinar o horário e a forma de pagamento (PIX ou dinheiro).', 'PROVIDER');
    toastMessage.value = 'Você aceitou o serviço! Agora combinem os detalhes pelo chat.';
    showToast.value = true;
  }
}

function handleClientAcceptDeal() {
  if (appStore.activeRequest) {
    appStore.setClientAccepted(appStore.activeRequest.id);
    appendMessage('✓ Aceitei a proposta! Vou realizar o pagamento combinado direto com você.', 'CLIENT');
    toastMessage.value = 'Proposta aceita!';
    showToast.value = true;
  }
}

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
  const reqBudget = Number(appStore.activeRequest?.budget || appStore.activeRequest?.price) || 150;
  const fee = Math.round(reqBudget * 0.10);
  toastMessage.value = `Serviço confirmado como feito! Taxa de R$ ${fee} debitada do Saldo do prestador.`;
  showToast.value = true;
  appendMessage(`✓ Serviço confirmado como realizado pelo contratante. Pagamento realizado diretamente e taxa de intermediação (R$ ${fee}) debitada do Saldo.`, 'SYSTEM');
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

/* ================= HEADER AVATAR & INFO ================= */
.header-prof-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.avatar-with-dot {
  position: relative;
  flex-shrink: 0;
}

.header-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
  display: block;
}

.online-dot-mini {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  background: #22c55e;
  border: 2px solid #030407;
  border-radius: 50%;
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
  margin: 0;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-sub-meta {
  font-size: 0.72rem;
  color: #9ca3af;
  margin: 2px 0 0;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-separator {
  color: #475569;
}

.header-payout-pill {
  background: #080c14;
  border: 1px solid rgba(212, 255, 36, 0.4);
  border-radius: 8px;
  padding: 3px 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.payout-micro-label {
  font-size: 7.5px;
  font-weight: 800;
  color: #9ca3af;
  letter-spacing: 0.4px;
}

.payout-value-num {
  font-size: 0.84rem;
  font-weight: 900;
  color: #D4FF24;
  line-height: 1.1;
}

.btn-finish-mini {
  background: #D4FF24;
  color: #030407;
  border: none;
  border-radius: 7px;
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 6px;
  cursor: pointer;
}

/* ================= BARRA DE ACORDO SLIM & ORGANIZADA ================= */
.chat-deal-strip {
  background: #080c14;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 12px;
}

.deal-strip-confirmed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.35);
  border-radius: 9px;
  padding: 6px 10px;
}

.deal-confirmed-badge {
  display: flex;
  align-items: center;
  gap: 7px;
}

.check-neon-icon {
  color: #22c55e;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.confirmed-copy strong {
  display: block;
  font-size: 0.78rem;
  color: #ffffff;
}

.confirmed-copy span {
  font-size: 0.7rem;
  color: #86efac;
}

.btn-micro-reajustar {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;
}

.deal-strip-flow {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.deal-flow-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.deal-tag-box {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: #D4FF24;
}

.pulse-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #D4FF24;
  box-shadow: 0 0 6px #D4FF24;
}

.deal-flow-state {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 600;
}

.deal-flow-buttons {
  display: grid;
  grid-template-columns: 1.3fr 1.3fr 0.8fr;
  gap: 6px;
}

.deal-flow-buttons.client {
  grid-template-columns: 1.5fr 1fr;
}

.btn-flow-accept {
  background: #D4FF24;
  color: #030407;
  border: none;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 0.76rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-flow-accept.active {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid #22c55e;
  color: #4ade80;
}

.btn-flow-counter {
  background: rgba(212, 255, 36, 0.08);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 0.75rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-flow-reject,
.btn-flow-cancel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  border-radius: 8px;
  padding: 7px 8px;
  font-size: 0.74rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-flow-reject:hover,
.btn-flow-cancel:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.35);
  color: #f87171;
}

/* Card Prompt de Serviço Feito para o Cliente */
.client-finish-prompt-box {
  background: linear-gradient(135deg, rgba(212, 255, 36, 0.12) 0%, rgba(11, 15, 24, 0.95) 100%);
  border: 1px solid rgba(212, 255, 36, 0.4);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.prompt-text-block strong {
  display: block;
  font-size: 0.8rem;
  color: #ffffff;
}

.prompt-text-block p {
  font-size: 0.72rem;
  color: #9ca3af;
  margin: 1px 0 0;
}

.btn-client-done-action {
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 9px;
  padding: 7px 11px;
  font-size: 0.76rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  cursor: pointer;
}

/* Dica de Pagamento Direto Discreta e Dispensável */
.chat-micro-tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: rgba(212, 255, 36, 0.05);
  border: 1px solid rgba(212, 255, 36, 0.16);
  border-radius: 8px;
  padding: 6px 10px;
  margin-bottom: 4px;
}

.tip-shield {
  color: #D4FF24;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.tip-text {
  font-size: 0.71rem;
  color: #cbd5e1;
  line-height: 1.25;
  flex: 1;
}

.tip-text strong {
  color: #D4FF24;
}

.btn-tip-dismiss {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.btn-tip-dismiss:hover {
  color: #ffffff;
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

/* ================= STATUS DE ALERTA (CANCELADO / RECUSADO) ================= */
.chat-status-alert-strip {
  background: rgba(239, 68, 68, 0.1);
  border-top: 1px solid rgba(239, 68, 68, 0.25);
  border-bottom: 1px solid rgba(239, 68, 68, 0.25);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-icon-red {
  color: #ef4444;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.alert-text-wrap strong {
  display: block;
  font-size: 0.8rem;
  color: #f87171;
}

.alert-text-wrap p {
  font-size: 0.72rem;
  color: #94a3b8;
  margin: 1px 0 0;
}

/* ================= BANNER DE CONTRAPROPOSTA PENDENTE NO CHAT ================= */
.chat-counter-offer-banner {
  background: linear-gradient(135deg, rgba(212, 255, 36, 0.14) 0%, rgba(11, 15, 24, 0.96) 100%);
  border: 1.5px solid #D4FF24;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(212, 255, 36, 0.12);
}

.counter-banner-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.counter-kicker {
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: #D4FF24;
}

.counter-amount-highlight {
  font-size: 1.15rem;
  font-weight: 900;
  color: #ffffff;
}

.counter-banner-note {
  font-size: 0.76rem;
  color: #cbd5e1;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 8px;
  border-radius: 7px;
  margin: 0;
  font-style: italic;
}

.counter-decision-actions {
  display: flex;
  gap: 8px;
  padding-top: 4px;
}

.btn-accept-counter {
  flex: 1;
  background: #D4FF24;
  color: #05070b;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.78rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
}

.btn-decline-counter {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #94a3b8;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.78rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.btn-decline-counter:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.counter-pending-info {
  font-size: 0.74rem;
  color: #94a3b8;
  font-style: italic;
}

/* ================= MODAIS DE DIÁLOGO NO CHAT ================= */
.custom-chat-dialog-modal {
  --background: #070a10;
  --border-radius: 18px 18px 0 0;
}

.dialog-sheet-inner {
  --background: #070a10;
  --color: #ffffff;
}

.dialog-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.dialog-kicker {
  font-size: 0.7rem;
  font-weight: 800;
  color: #D4FF24;
  letter-spacing: 0.4px;
}

.dialog-kicker.red {
  color: #f87171;
}

.dialog-title {
  font-size: 1.15rem;
  font-weight: 900;
  color: #ffffff;
  margin: 2px 0;
}

.dialog-sub {
  font-size: 0.76rem;
  color: #94a3b8;
  margin: 0;
}

.btn-dialog-close {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #94a3b8;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
}

.field-label-mini {
  display: block;
  font-size: 0.73rem;
  font-weight: 700;
  color: #94a3b8;
  margin: 8px 0 4px;
}

.quick-vals-row {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.quick-val-pill {
  flex: 1;
  background: #0b0f18;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border-radius: 8px;
  padding: 8px 6px;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
}

.quick-val-pill.active {
  background: rgba(212, 255, 36, 0.15);
  border-color: #D4FF24;
  color: #D4FF24;
}

.custom-val-input-wrap {
  display: flex;
  align-items: center;
  background: #0b0f18;
  border: 1px solid rgba(212, 255, 36, 0.35);
  border-radius: 9px;
  padding: 6px 10px;
  margin-bottom: 8px;
}

.currency-tag {
  font-size: 1rem;
  font-weight: 800;
  color: #D4FF24;
  margin-right: 6px;
}

.val-input-field {
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 800;
  outline: none;
}

.cents-tag {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 700;
}

.dialog-text-input {
  width: 100%;
  background: #0b0f18;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 0.82rem;
  margin-bottom: 12px;
  outline: none;
}

.btn-confirm-action {
  width: 100%;
  background: #D4FF24;
  color: #05070b;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.86rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.reason-pills-column {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.reason-pill {
  background: #0b0f18;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-align: left;
}

.reason-pill.active {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ffffff;
}

.reason-radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #475569;
  flex-shrink: 0;
}

.reason-radio-dot.on {
  background: #ef4444;
  box-shadow: 0 0 6px #ef4444;
}

.btn-danger-action {
  width: 100%;
  background: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.86rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}
</style>
