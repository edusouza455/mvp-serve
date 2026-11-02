<template>
  <ion-page>
    <!-- Header Mobile Minimalista do Prestador de Serviço -->
    <ion-header class="provider-header ion-no-border">
      <ion-toolbar class="header-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" class="back-btn"></ion-back-button>
        </ion-buttons>

        <div class="brand-block" @click="goToHome">
          <span class="neon-brand">+serve</span>
          <span class="slash-separator">/</span>
          <span class="role-title">Prestador</span>
        </div>

        <ion-buttons slot="end">
          <!-- Saldo no topo com atalho para a aba Carteira -->
          <div class="wallet-badge-minimal" @click="setTab('wallet')">
            <span class="badge-label">Saldo</span>
            <span class="badge-value">{{ formatCurrency(appStore.walletBalance) }}</span>
          </div>

          <ion-button fill="clear" size="small" class="icon-nav-btn" @click="handleToggleRole" title="Alternar Perfil">
            <ion-icon slot="icon-only" :icon="swapHorizontalOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Sub-Barra de Navegação: Oportunidades, Impulsos, Carteira, Perfil -->
      <div class="provider-subnav">
        <button
          class="subnav-btn"
          :class="{ active: currentTab === 'leads' }"
          @click="setTab('leads')"
        >
          <ion-icon :icon="flashOutline"></ion-icon>
          <span>Pedidos</span>
        </button>

        <button
          class="subnav-btn"
          :class="{ active: currentTab === 'boosts' }"
          @click="setTab('boosts')"
        >
          <ion-icon :icon="rocketOutline"></ion-icon>
          <span>Impulsos</span>
        </button>

        <button
          class="subnav-btn"
          :class="{ active: currentTab === 'wallet' }"
          @click="setTab('wallet')"
        >
          <ion-icon :icon="walletOutline"></ion-icon>
          <span>Carteira</span>
        </button>

        <button
          class="subnav-btn"
          :class="{ active: currentTab === 'profile' }"
          @click="setTab('profile')"
        >
          <ion-icon :icon="personCircleOutline"></ion-icon>
          <span>Perfil</span>
        </button>
      </div>
    </ion-header>

    <ion-content :fullscreen="true" class="provider-content ion-padding">
      <div class="content-container">

        <!-- ==================== ABA 1: PEDIDOS / OPORTUNIDADES ==================== -->
        <section v-if="currentTab === 'leads'" class="tab-section">
          <div class="section-title-row">
            <div>
              <h2 class="section-title">Oportunidades em Aberto</h2>
              <p class="section-subtitle">Serviços solicitados por clientes na sua região</p>
            </div>
            <span class="leads-counter">{{ openRequests.length }} disponíveis</span>
          </div>

          <!-- Empty State -->
          <div v-if="openRequests.length === 0" class="empty-box">
            <ion-icon :icon="searchOutline" class="empty-icon"></ion-icon>
            <h3>Nenhum pedido aberto no momento</h3>
            <p>Quando clientes da sua região publicarem pedidos, eles surgirão aqui.</p>
          </div>

          <!-- Lista de Pedidos -->
          <div v-else class="leads-list">
            <ion-card
              v-for="req in openRequests"
              :key="req.id"
              class="lead-card"
            >
              <ion-card-content class="lead-card-body">
                <div class="lead-top-row">
                  <span class="category-pill">{{ req.category }}</span>
                  <span class="anonymous-client">
                    <ion-icon :icon="shieldCheckmarkOutline"></ion-icon> Cliente Anônimo
                  </span>
                </div>

                <div class="lead-middle">
                  <div class="lead-location">
                    <ion-icon :icon="locationOutline"></ion-icon>
                    <span>{{ req.location || 'Local a combinar' }}</span>
                  </div>
                  <span class="lead-datetime">
                    <ion-icon :icon="calendarOutline"></ion-icon>
                    {{ req.date || 'Hoje' }} às {{ req.time || '14:30' }}
                  </span>
                </div>

                <div class="lead-budget-block">
                  <div class="budget-info">
                    <span class="budget-label">Orçamento Oferecido</span>
                    <span class="budget-amount">{{ formatCurrency(req.budget) }}</span>
                  </div>
                  <div class="tax-info">
                    Taxa de desbloqueio (5%):
                    <strong>{{ formatCurrency(req.budget * 0.05) }}</strong>
                  </div>
                </div>

                <p v-if="req.description" class="lead-desc">"{{ req.description }}"</p>

                <!-- Botões de Ação do Prestador -->
                <div class="lead-actions-row">
                  <ion-button
                    expand="block"
                    fill="outline"
                    class="btn-counter"
                    @click="openCounterModal(req)"
                  >
                    Fazer Contraproposta
                  </ion-button>

                  <ion-button
                    expand="block"
                    class="btn-accept-direct"
                    @click="handleDirectAccept(req)"
                  >
                    Aceitar e Abrir Chat
                  </ion-button>
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </section>

        <!-- ==================== ABA 2: IMPULSOS (GAMIFICADO / ESTRATÉGIA) ==================== -->
        <section v-if="currentTab === 'boosts'" class="tab-section">
          <div class="section-title-row">
            <div>
              <h2 class="section-title">Impulsionar Perfil</h2>
              <p class="section-subtitle">Multiplique suas solicitações ficando no topo das buscas</p>
            </div>
          </div>

          <div class="boost-cards-grid">
            <div
              v-for="plan in appStore.boostPlans"
              :key="plan.id"
              class="boost-card"
              :class="{ 'featured-plan': plan.isPopular }"
            >
              <div v-if="plan.isPopular" class="popular-ribbon">Recomendado</div>

              <div class="boost-header">
                <span class="plan-tag">{{ plan.tag }}</span>
                <h3 class="plan-name">{{ plan.name }}</h3>
                <div class="plan-price-block">
                  <span class="currency-sim">R$</span>
                  <span class="price-val">{{ plan.price.toFixed(2).replace('.', ',') }}</span>
                  <span class="plan-duration">/ {{ plan.duration }}</span>
                </div>
              </div>

              <div class="plan-perks">
                <div class="perk-item">
                  <ion-icon :icon="flashOutline" class="perk-icon"></ion-icon>
                  <span>Alcance estimado: <strong>{{ plan.multiplier }} maior</strong></span>
                </div>
                <div class="perk-item">
                  <ion-icon :icon="checkmarkCircleOutline" class="perk-icon"></ion-icon>
                  <span>{{ plan.desc }}</span>
                </div>
                <div class="perk-item">
                  <ion-icon :icon="trophyOutline" class="perk-icon"></ion-icon>
                  <span>Bônus de <strong>+150 XP</strong> no seu nível de Prestador</span>
                </div>
              </div>

              <ion-button
                expand="block"
                class="btn-buy-boost"
                :class="{ 'btn-boost-highlight': plan.isPopular }"
                @click="openCheckoutModal(plan)"
              >
                Contratar Impulso
              </ion-button>
            </div>
          </div>
        </section>

        <!-- ==================== ABA 3: CARTEIRA & GANHOS ==================== -->
        <section v-if="currentTab === 'wallet'" class="tab-section">
          <!-- Card de Saldo com Recarga Rápida -->
          <div class="wallet-main-card">
            <div class="wallet-top-header">
              <span class="wallet-kicker">Saldo Disponível na Carteira</span>
              <span class="wallet-currency-val">{{ formatCurrency(appStore.walletBalance) }}</span>
              <span class="wallet-subtext">Utilizado para cobrir a taxa de conexão de 5% sobre os contatos</span>
            </div>

            <div class="wallet-cta-row">
              <ion-button
                expand="block"
                class="btn-recharge-balance"
                @click="isRechargeModalOpen = true"
              >
                <ion-icon slot="start" :icon="addCircleOutline"></ion-icon>
                Adicionar Saldo
              </ion-button>
            </div>
          </div>

          <!-- Extrato e Histórico de Ganhos / Taxas -->
          <div class="history-block">
            <h3 class="history-title">Histórico de Transações & Ganhos</h3>

            <div class="transactions-list">
              <div
                v-for="tx in appStore.walletTransactions"
                :key="tx.id"
                class="tx-item"
              >
                <div class="tx-left">
                  <div
                    class="tx-icon-circle"
                    :class="{
                      'icon-earning': tx.type === 'EARNING',
                      'icon-debit': tx.type === 'DEBIT',
                      'icon-recharge': tx.type === 'RECHARGE'
                    }"
                  >
                    <ion-icon
                      :icon="tx.type === 'EARNING' ? cashOutline : (tx.type === 'DEBIT' ? removeCircleOutline : arrowUpCircleOutline)"
                    ></ion-icon>
                  </div>

                  <div class="tx-details">
                    <span class="tx-title">{{ tx.title }}</span>
                    <span class="tx-date">{{ tx.date }} • {{ tx.status }}</span>
                  </div>
                </div>

                <span
                  class="tx-amount"
                  :class="tx.amount > 0 ? 'amount-positive' : 'amount-negative'"
                >
                  {{ tx.amount > 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== ABA 4: PERFIL GAMIFICADO ==================== -->
        <section v-if="currentTab === 'profile'" class="tab-section">
          <!-- Card Gamificado de Nível / XP -->
          <div class="gamification-card">
            <div class="gamification-header">
              <div class="profile-avatar-wrap">
                <img :src="profileForm.avatar" :alt="profileForm.name" class="profile-big-avatar" />
                <span class="level-badge-float">Nv. {{ profileForm.level }}</span>
              </div>

              <div class="gamification-meta">
                <span class="level-name-tag">{{ profileForm.levelName }}</span>
                <h3 class="prestador-name">{{ profileForm.name }}</h3>
                <div class="rating-row">
                  <ion-icon :icon="star" class="star-icon"></ion-icon>
                  <span>{{ profileForm.rating }} / 5.0</span>
                  <span class="jobs-done">({{ profileForm.completedJobs }} serviços concluídos)</span>
                </div>
              </div>
            </div>

            <!-- Barra de Progresso de XP -->
            <div class="xp-progress-block">
              <div class="xp-labels">
                <span>Progresso para o Nível {{ profileForm.level + 1 }}</span>
                <strong>{{ profileForm.xp }} / {{ profileForm.nextLevelXp }} XP</strong>
              </div>
              <div class="xp-bar-bg">
                <div class="xp-bar-fill" :style="{ width: `${(profileForm.xp / profileForm.nextLevelXp) * 100}%` }"></div>
              </div>
            </div>

            <!-- Conquistas / Badges -->
            <div class="badges-row">
              <div
                v-for="badge in profileForm.badges"
                :key="badge.id"
                class="badge-pill"
                :title="badge.desc"
              >
                <ion-icon :icon="getBadgeIcon(badge.icon)"></ion-icon>
                <span>{{ badge.name }}</span>
              </div>
            </div>
          </div>

          <!-- Formulário para Atualizar Dados do Prestador -->
          <div class="edit-profile-card">
            <h3 class="edit-profile-title">Editar Dados Profissionais</h3>

            <div class="form-inputs">
              <ion-item class="input-item">
                <ion-label position="stacked">Nome Completo</ion-label>
                <ion-input v-model="profileForm.name"></ion-input>
              </ion-item>

              <ion-item class="input-item">
                <ion-label position="stacked">Título Profissional</ion-label>
                <ion-input v-model="profileForm.title" placeholder="Ex: Eletricista Residencial"></ion-input>
              </ion-item>

              <ion-item class="input-item">
                <ion-label position="stacked">Telefone / WhatsApp</ion-label>
                <ion-input v-model="profileForm.phone"></ion-input>
              </ion-item>

              <ion-item class="input-item">
                <ion-label position="stacked">Categoria Principal</ion-label>
                <ion-select v-model="profileForm.category">
                  <ion-select-option value="Eletricista">Eletricista</ion-select-option>
                  <ion-select-option value="Garçom">Garçom</ion-select-option>
                  <ion-select-option value="Diarista">Diarista</ion-select-option>
                  <ion-select-option value="Encanador">Encanador</ion-select-option>
                  <ion-select-option value="Pintor">Pintor</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item class="input-item">
                <ion-label position="stacked">Biografia / Apresentação</ion-label>
                <ion-textarea v-model="profileForm.bio" :auto-grow="true"></ion-textarea>
              </ion-item>

              <ion-button expand="block" class="btn-save-profile" @click="handleSaveProfile">
                Salvar Alterações
              </ion-button>
            </div>
          </div>
        </section>

      </div>

      <!-- MODAL 1: CHECKOUT DO IMPULSO (PIX / DÉBITO MOCKADO) -->
      <ion-modal
        :is-open="isCheckoutModalOpen"
        :breakpoints="[0, 0.6, 0.85]"
        :initial-breakpoint="0.6"
        @didDismiss="isCheckoutModalOpen = false"
        class="custom-sheet"
      >
        <ion-content class="modal-sheet-content ion-padding">
          <div class="checkout-modal-inner">
            <h2 class="modal-sheet-title">Ativar {{ selectedBoostPlan?.name }}</h2>
            <p class="modal-sheet-sub">Selecione o método de pagamento para liberar o destaque:</p>

            <div class="plan-price-confirm">
              <span>Valor a pagar:</span>
              <strong class="neon-price">R$ {{ selectedBoostPlan?.price.toFixed(2).replace('.', ',') }}</strong>
            </div>

            <div class="payment-methods-grid">
              <button
                class="method-btn"
                :class="{ active: paymentMethod === 'PIX' }"
                @click="paymentMethod = 'PIX'"
              >
                <ion-icon :icon="qrCodeOutline"></ion-icon>
                <span>PIX Instantâneo</span>
              </button>

              <button
                class="method-btn"
                :class="{ active: paymentMethod === 'DEBITO' }"
                @click="paymentMethod = 'DEBITO'"
              >
                <ion-icon :icon="cardOutline"></ion-icon>
                <span>Cartão de Débito</span>
              </button>
            </div>

            <ion-button
              expand="block"
              class="btn-confirm-payment"
              @click="confirmBoostPayment"
            >
              Confirmar Pagamento Mockado
            </ion-button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- MODAL 2: RECARGA DE SALDO NA CARTEIRA -->
      <ion-modal
        :is-open="isRechargeModalOpen"
        :breakpoints="[0, 0.55, 0.8]"
        :initial-breakpoint="0.55"
        @didDismiss="isRechargeModalOpen = false"
        class="custom-sheet"
      >
        <ion-content class="modal-sheet-content ion-padding">
          <div class="checkout-modal-inner">
            <h2 class="modal-sheet-title">Recarregar Carteira</h2>
            <p class="modal-sheet-sub">Adicione créditos para desbloquear contatos de novos clientes:</p>

            <div class="quick-amounts-row">
              <button
                v-for="amt in [20, 50, 100]"
                :key="amt"
                class="amt-btn"
                :class="{ active: rechargeAmount === amt }"
                @click="rechargeAmount = amt"
              >
                + R$ {{ amt }}
              </button>
            </div>

            <ion-item class="input-item" style="margin-top: 8px;">
              <ion-label position="stacked">Outro Valor (R$)</ion-label>
              <ion-input type="number" v-model.number="rechargeAmount" placeholder="Ex: 35.00"></ion-input>
            </ion-item>

            <ion-button
              expand="block"
              class="btn-confirm-payment"
              :disabled="!rechargeAmount || rechargeAmount <= 0"
              @click="confirmRecharge"
            >
              Confirmar Recarga via PIX
            </ion-button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- MODAL 3: CONTRAPROPOSTA -->
      <ion-modal
        :is-open="isCounterModalOpen"
        :breakpoints="[0, 0.5, 0.75]"
        :initial-breakpoint="0.5"
        @didDismiss="isCounterModalOpen = false"
        class="custom-sheet"
      >
        <ion-content class="modal-sheet-content ion-padding">
          <div class="checkout-modal-inner">
            <h2 class="modal-sheet-title">Enviar Contraproposta</h2>
            <p class="modal-sheet-sub">
              Orçamento do cliente: <strong>{{ formatCurrency(selectedRequest?.budget) }}</strong>.
              Informe o valor que você deseja cobrar:
            </p>

            <ion-item class="input-item">
              <ion-label position="stacked">Seu Valor Proposto (R$)</ion-label>
              <ion-input type="number" v-model.number="counterBudget" placeholder="Ex: 140.00"></ion-input>
            </ion-item>

            <div v-if="counterBudget" class="counter-tax-preview">
              Taxa de 5% sobre sua contraproposta: <strong>{{ formatCurrency(counterBudget * 0.05) }}</strong>
            </div>

            <ion-button
              expand="block"
              class="btn-confirm-payment"
              :disabled="!counterBudget || counterBudget <= 0"
              @click="submitCounterOffer"
            >
              Enviar e Abrir Negociação
            </ion-button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- Toast Feedback -->
      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :color="toastColor"
        :duration="3000"
        position="bottom"
        @didDismiss="showToast = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToast
} from '@ionic/vue';
import {
  swapHorizontalOutline,
  flashOutline,
  rocketOutline,
  walletOutline,
  personCircleOutline,
  searchOutline,
  shieldCheckmarkOutline,
  locationOutline,
  calendarOutline,
  checkmarkCircleOutline,
  trophyOutline,
  addCircleOutline,
  cashOutline,
  removeCircleOutline,
  arrowUpCircleOutline,
  qrCodeOutline,
  cardOutline,
  star
} from 'ionicons/icons';
import { useAppStore } from '@/stores/useAppStore';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

const currentTab = ref('leads'); // 'leads' | 'boosts' | 'wallet' | 'profile'

onMounted(() => {
  if (route.query.tab) {
    currentTab.value = String(route.query.tab);
  }
});

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab) {
      currentTab.value = String(newTab);
    }
  }
);

function setTab(tab) {
  currentTab.value = tab;
  router.replace({ path: '/provider', query: { tab } });
}

// Modais
const isCheckoutModalOpen = ref(false);
const isRechargeModalOpen = ref(false);
const isCounterModalOpen = ref(false);

const selectedBoostPlan = ref(null);
const selectedRequest = ref(null);
const paymentMethod = ref('PIX');
const rechargeAmount = ref(50);
const counterBudget = ref(null);

const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('success');

// Cópia reativa para o formulário de perfil
const profileForm = reactive({ ...appStore.providerProfile });

// Pedidos abertos (com status 'PENDING' ou 'OPEN')
const openRequests = computed(() => {
  return appStore.requests.filter((r) => r.status === 'PENDING' || r.status === 'OPEN');
});

// Formatação BRL
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function formatCurrency(val) {
  return currencyFormatter.format(Number(val) || 0);
}

function goToHome() {
  router.push('/');
}

function handleToggleRole() {
  appStore.toggleRole();
  router.push('/client/dashboard');
}

function getBadgeIcon(iconName) {
  if (iconName === 'star') return star;
  if (iconName === 'flash') return flashOutline;
  return shieldCheckmarkOutline;
}

// Aceite direto
function handleDirectAccept(req) {
  const fee = Number(req.budget) * 0.05;
  if (appStore.walletBalance < fee) {
    toastMessage.value = `Saldo insuficiente (R$ ${appStore.walletBalance.toFixed(2)}) para cobrir a taxa de R$ ${fee.toFixed(2)}. Recarregue sua carteira!`;
    toastColor.value = 'danger';
    showToast.value = true;
    currentTab.value = 'wallet';
    return;
  }

  appStore.walletBalance -= fee;
  appStore.walletTransactions.unshift({
    id: `fee-${Date.now()}`,
    type: 'DEBIT',
    title: `Taxa de desbloqueio: ${req.category}`,
    amount: -fee,
    date: 'Agora mesmo',
    status: 'Debitado'
  });

  req.status = 'IN_PROGRESS';
  appStore.activeRequest = req;
  appStore.chatModalOpen = true;

  toastMessage.value = 'Contato desbloqueado e chat liberado!';
  toastColor.value = 'success';
  showToast.value = true;
}

// Modal Contraproposta
function openCounterModal(req) {
  selectedRequest.value = req;
  counterBudget.value = Math.round(Number(req.budget) * 1.15);
  isCounterModalOpen.value = true;
}

function submitCounterOffer() {
  if (!counterBudget.value || !selectedRequest.value) return;

  const fee = Number(counterBudget.value) * 0.05;
  if (appStore.walletBalance < fee) {
    toastMessage.value = `Saldo insuficiente para a contraproposta. Recarregue sua carteira!`;
    toastColor.value = 'danger';
    showToast.value = true;
    isCounterModalOpen.value = false;
    currentTab.value = 'wallet';
    return;
  }

  appStore.walletBalance -= fee;
  appStore.walletTransactions.unshift({
    id: `fee-${Date.now()}`,
    type: 'DEBIT',
    title: `Taxa de contraproposta (${selectedRequest.value.category})`,
    amount: -fee,
    date: 'Agora mesmo',
    status: 'Debitado'
  });

  selectedRequest.value.budget = Number(counterBudget.value);
  selectedRequest.value.status = 'IN_PROGRESS';
  appStore.activeRequest = selectedRequest.value;
  isCounterModalOpen.value = false;
  appStore.chatModalOpen = true;

  toastMessage.value = 'Contraproposta enviada e chat liberado!';
  toastColor.value = 'success';
  showToast.value = true;
}

// Modal Checkout Impulsos
function openCheckoutModal(plan) {
  selectedBoostPlan.value = plan;
  isCheckoutModalOpen.value = true;
}

function confirmBoostPayment() {
  if (!selectedBoostPlan.value) return;

  appStore.buyBoost(selectedBoostPlan.value, paymentMethod.value);
  profileForm.xp = appStore.providerProfile.xp;

  isCheckoutModalOpen.value = false;
  toastMessage.value = `Impulso ${selectedBoostPlan.value.name} ativado via ${paymentMethod.value}! (+150 XP)`;
  toastColor.value = 'success';
  showToast.value = true;
}

// Recarga
function confirmRecharge() {
  if (!rechargeAmount.value || rechargeAmount.value <= 0) return;

  appStore.addWalletFunds(rechargeAmount.value, 'PIX');
  isRechargeModalOpen.value = false;
  toastMessage.value = `Recarga de ${formatCurrency(rechargeAmount.value)} efetuada com sucesso!`;
  toastColor.value = 'success';
  showToast.value = true;
}

// Salvar Perfil
function handleSaveProfile() {
  appStore.updateProviderProfile({ ...profileForm });
  toastMessage.value = 'Dados do perfil atualizados com sucesso!';
  toastColor.value = 'success';
  showToast.value = true;
}
</script>

<style scoped>
.provider-header {
  background: transparent;
}

.header-toolbar {
  --background: rgba(3, 4, 7, 0.95);
  --border-style: none;
  backdrop-filter: blur(10px);
  padding: 0 4px;
  border-bottom: 1px solid #161b28;
}

.back-btn {
  --color: #ffffff;
  margin-inline-start: -4px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.neon-brand {
  font-size: 1.4rem;
  font-weight: 800;
  color: #D4FF24;
}

.slash-separator {
  color: #68686a;
  font-size: 0.95rem;
}

.role-title {
  color: #5d93f7;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
}

.wallet-badge-minimal {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #0d121c;
  border: 1px solid #1c263c;
  padding: 4px 8px;
  border-radius: 999px;
  cursor: pointer;
  margin-right: 2px;
}

.badge-label {
  font-size: 0.65rem;
  color: #8e8e90;
  text-transform: uppercase;
}

.badge-value {
  font-size: 0.8rem;
  font-weight: 800;
  color: #D4FF24;
}

.icon-nav-btn {
  --color: #ffffff;
  --padding-start: 4px;
  --padding-end: 4px;
}

/* Subnav de Abas do Prestador */
.provider-subnav {
  display: flex;
  background: #090c13;
  border-bottom: 1px solid #161b28;
  padding: 4px 6px;
  gap: 4px;
  overflow-x: auto;
}

.subnav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: transparent;
  border: none;
  color: #8e8e90;
  padding: 8px 6px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.subnav-btn ion-icon {
  font-size: 0.95rem;
}

.subnav-btn.active {
  background: rgba(21, 88, 201, 0.25);
  color: #5d93f7;
  border: 1px solid rgba(21, 88, 201, 0.45);
}

.provider-content {
  --background: #030407;
  font-family: 'Inter', sans-serif;
  --padding-top: 12px;
  --padding-bottom: 24px;
  --padding-start: 12px;
  --padding-end: 12px;
}

.content-container {
  max-width: 760px;
  margin: 0 auto;
}

.tab-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.section-title {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 2px 0;
}

.section-subtitle {
  color: #8e8e90;
  font-size: 0.8rem;
  margin: 0;
}

.leads-counter {
  background: rgba(212, 255, 36, 0.15);
  color: #D4FF24;
  border: 1px solid rgba(212, 255, 36, 0.35);
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

/* Leads Cards */
.leads-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lead-card {
  background: #0b0d14;
  border: 1px solid #1c202b;
  border-radius: 14px;
  margin: 0;
}

.lead-card-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lead-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-pill {
  background: rgba(21, 88, 201, 0.2);
  color: #5d93f7;
  border: 1px solid rgba(21, 88, 201, 0.4);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.anonymous-client {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #25d366;
}

.lead-middle {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lead-location, .lead-datetime {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #cdcdce;
  font-size: 0.82rem;
}

.lead-location ion-icon, .lead-datetime ion-icon {
  color: #5d93f7;
  font-size: 0.95rem;
}

.lead-budget-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #111420;
  border: 1px solid #1b2133;
  padding: 8px 12px;
  border-radius: 10px;
}

.budget-info {
  display: flex;
  flex-direction: column;
}

.budget-label {
  font-size: 0.68rem;
  color: #8e8e90;
  text-transform: uppercase;
}

.budget-amount {
  font-size: 1.15rem;
  font-weight: 800;
  color: #D4FF24;
}

.tax-info {
  font-size: 0.72rem;
  color: #8e8e90;
  text-align: right;
}

.tax-info strong {
  color: #ffffff;
}

.lead-desc {
  font-size: 0.82rem;
  color: #a7a7a8;
  margin: 0;
  font-style: italic;
  line-height: 1.4;
}

.lead-actions-row {
  display: flex;
  gap: 8px;
  flex-direction: row;
}

@media (max-width: 440px) {
  .lead-actions-row {
    flex-direction: column;
  }
}

.btn-counter {
  --border-color: #1558C9;
  --color: #5d93f7;
  font-weight: 600;
  font-size: 0.8rem;
  height: 38px;
  flex: 1;
  margin: 0;
}

.btn-accept-direct {
  --background: #D4FF24;
  --background-activated: #bbe020;
  --color: #030407;
  font-weight: 800;
  font-size: 0.82rem;
  height: 38px;
  flex: 1.3;
  margin: 0;
}

/* ==================== BOOSTS / IMPULSOS ==================== */
.boost-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

@media (min-width: 768px) {
  .boost-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

.boost-card {
  position: relative;
  background: #0b0d14;
  border: 1px solid #1c202b;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.boost-card.featured-plan {
  border-color: #D4FF24;
  background: linear-gradient(180deg, #0f1422 0%, #0b0d14 100%);
  box-shadow: 0 0 20px rgba(212, 255, 36, 0.15);
}

.popular-ribbon {
  position: absolute;
  top: 10px;
  right: 12px;
  background: #D4FF24;
  color: #030407;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
  text-transform: uppercase;
}

.plan-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: #5d93f7;
}

.plan-name {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 800;
  margin: 2px 0 6px 0;
}

.plan-price-block {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency-sim {
  color: #D4FF24;
  font-size: 0.9rem;
  font-weight: 700;
}

.price-val {
  color: #D4FF24;
  font-size: 1.6rem;
  font-weight: 800;
}

.plan-duration {
  color: #8e8e90;
  font-size: 0.75rem;
}

.plan-perks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.perk-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.8rem;
  color: #cdcdce;
  line-height: 1.35;
}

.perk-icon {
  color: #5d93f7;
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.btn-buy-boost {
  --background: #1558C9;
  --color: #ffffff;
  font-weight: 700;
  font-size: 0.82rem;
  height: 40px;
  margin-top: 4px;
}

.btn-boost-highlight {
  --background: #D4FF24;
  --color: #030407;
  font-weight: 800;
}

/* ==================== CARTEIRA ==================== */
.wallet-main-card {
  background: linear-gradient(135deg, #0d121c 0%, #151e33 100%);
  border: 1px solid #1c263c;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wallet-top-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wallet-kicker {
  font-size: 0.75rem;
  color: #8e8e90;
  text-transform: uppercase;
  font-weight: 600;
}

.wallet-currency-val {
  font-size: 2.2rem;
  font-weight: 800;
  color: #D4FF24;
  letter-spacing: -0.5px;
}

.wallet-subtext {
  font-size: 0.78rem;
  color: #cdcdce;
}

.btn-recharge-balance {
  --background: #D4FF24;
  --color: #030407;
  font-weight: 800;
  height: 44px;
  margin: 0;
}

.history-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-title {
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tx-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0b0d14;
  border: 1px solid #1c202b;
  border-radius: 12px;
  padding: 10px 14px;
}

.tx-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tx-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.icon-earning {
  background: rgba(37, 211, 102, 0.15);
  color: #25d366;
}

.icon-debit {
  background: rgba(255, 73, 97, 0.15);
  color: #ff4961;
}

.icon-recharge {
  background: rgba(212, 255, 36, 0.15);
  color: #D4FF24;
}

.tx-details {
  display: flex;
  flex-direction: column;
}

.tx-title {
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.2;
}

.tx-date {
  color: #68686a;
  font-size: 0.7rem;
}

.tx-amount {
  font-size: 0.95rem;
  font-weight: 800;
}

.amount-positive {
  color: #25d366;
}

.amount-negative {
  color: #ff4961;
}

/* ==================== PERFIL GAMIFICADO ==================== */
.gamification-card {
  background: #0e121c;
  border: 1px solid #1c2436;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gamification-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-avatar-wrap {
  position: relative;
}

.profile-big-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.level-badge-float {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #1558C9;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid #0e121c;
}

.gamification-meta {
  display: flex;
  flex-direction: column;
}

.level-name-tag {
  color: #D4FF24;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.prestador-name {
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 800;
  margin: 2px 0 4px 0;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #D4FF24;
  font-weight: 700;
}

.jobs-done {
  color: #8e8e90;
  font-size: 0.75rem;
  font-weight: 400;
  margin-left: 2px;
}

.xp-progress-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.xp-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #cdcdce;
}

.xp-bar-bg {
  width: 100%;
  height: 8px;
  background: #182030;
  border-radius: 999px;
  overflow: hidden;
}

.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1558C9 0%, #D4FF24 100%);
  border-radius: 999px;
}

.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  color: #cdcdce;
}

.badge-pill ion-icon {
  color: #D4FF24;
}

/* Edit Profile Card */
.edit-profile-card {
  background: #0b0d14;
  border: 1px solid #1c202b;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-profile-title {
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-item {
  --background: #141722;
  --color: #ffffff;
  --border-color: #242c3d;
  border-radius: 8px;
}

.btn-save-profile {
  --background: #1558C9;
  --color: #ffffff;
  font-weight: 700;
  margin-top: 6px;
  height: 44px;
}

/* Empty Box */
.empty-box {
  background: #0b0d14;
  border: 1px solid #1c202b;
  border-radius: 14px;
  padding: 36px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-icon {
  font-size: 2rem;
  color: #5d93f7;
}

.empty-box h3 {
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
}

.empty-box p {
  color: #8e8e90;
  font-size: 0.8rem;
  margin: 0;
  max-width: 320px;
}

/* Modal Bottom Sheets */
.custom-sheet {
  --background: #0b0d14;
}

.modal-sheet-content {
  --background: #0b0d14;
  --color: #ffffff;
}

.checkout-modal-inner {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal-sheet-title {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
}

.modal-sheet-sub {
  color: #8e8e90;
  font-size: 0.82rem;
  margin: 0;
}

.plan-price-confirm {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #111420;
  border: 1px solid #1c263c;
  padding: 10px 14px;
  border-radius: 10px;
}

.neon-price {
  color: #D4FF24;
  font-size: 1.3rem;
  font-weight: 800;
}

.payment-methods-grid {
  display: flex;
  gap: 10px;
}

.method-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: #141722;
  border: 1px solid #242c3d;
  color: #cdcdce;
  padding: 14px 8px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.method-btn ion-icon {
  font-size: 1.5rem;
  color: #5d93f7;
}

.method-btn.active {
  border-color: #D4FF24;
  background: rgba(212, 255, 36, 0.1);
  color: #ffffff;
}

.method-btn.active ion-icon {
  color: #D4FF24;
}

.quick-amounts-row {
  display: flex;
  gap: 8px;
}

.amt-btn {
  flex: 1;
  background: #141722;
  border: 1px solid #242c3d;
  color: #ffffff;
  font-weight: 700;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
}

.amt-btn.active {
  background: #1558C9;
  border-color: #1558C9;
}

.btn-confirm-payment {
  --background: #D4FF24;
  --color: #030407;
  font-weight: 800;
  height: 46px;
  margin-top: 10px;
}

.btn-confirm-payment[disabled] {
  opacity: 0.4;
}

.counter-tax-preview {
  font-size: 0.8rem;
  color: #8e8e90;
}

.counter-tax-preview strong {
  color: #D4FF24;
}
</style>
