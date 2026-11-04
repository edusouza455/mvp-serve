<template>
  <!-- BARRA DE NAVEGAÇÃO INFERIOR GLOBAL (4 ABAS PRINCIPAIS: INÍCIO, BUSCA, PEDIDOS, PERFIL) -->
  <nav class="global-bottom-nav" aria-label="Navegação Principal">
    <div class="bottom-nav-inner">
      <!-- 1. INÍCIO -->
      <button
        type="button"
        class="nav-tab-btn"
        :class="{ active: activeTab === 'home' }"
        @click="handleTabClick('home')"
      >
        <div class="icon-wrap">
          <ion-icon :icon="activeTab === 'home' ? home : homeOutline" class="tab-icon"></ion-icon>
        </div>
        <span class="tab-label">Início</span>
      </button>

      <!-- 2. BUSCA -->
      <button
        type="button"
        class="nav-tab-btn"
        :class="{ active: activeTab === 'search' }"
        @click="handleTabClick('search')"
      >
        <div class="icon-wrap">
          <ion-icon :icon="activeTab === 'search' ? search : searchOutline" class="tab-icon"></ion-icon>
        </div>
        <span class="tab-label">Busca</span>
      </button>

      <!-- 3. PEDIDOS -->
      <button
        type="button"
        class="nav-tab-btn"
        :class="{ active: activeTab === 'orders' }"
        @click="handleTabClick('orders')"
      >
        <div class="icon-wrap">
          <ion-icon :icon="activeTab === 'orders' ? receipt : receiptOutline" class="tab-icon"></ion-icon>
          <span v-if="ongoingOrdersCount > 0" class="tab-badge-count">{{ ongoingOrdersCount }}</span>
        </div>
        <span class="tab-label">Pedidos</span>
      </button>

      <!-- 4. PERFIL -->
      <button
        type="button"
        class="nav-tab-btn"
        :class="{ active: activeTab === 'profile' }"
        @click="handleTabClick('profile')"
      >
        <div class="icon-wrap">
          <ion-icon :icon="activeTab === 'profile' ? person : personOutline" class="tab-icon"></ion-icon>
          <span class="notification-dot" title="Conta e Modo Trabalhador"></span>
        </div>
        <span class="tab-label">Perfil</span>
      </button>
    </div>
  </nav>

  <!-- ================= MODAL GLOBAL 1: MEUS PEDIDOS ================= -->
  <ion-modal
    :is-open="store.ordersModalOpen"
    :breakpoints="[0, 0.8, 0.95]"
    :initial-breakpoint="0.8"
    @didDismiss="store.ordersModalOpen = false"
    class="global-sheet-modal"
  >
    <ion-content class="sheet-content ion-padding">
      <div class="sheet-header">
        <div>
          <h2 class="sheet-title">Meus Pedidos</h2>
          <p class="sheet-subtitle">Acompanhe contratações ativas, converse no chat ou avalie</p>
        </div>
        <button class="sheet-close-btn" @click="store.ordersModalOpen = false">✕</button>
      </div>

      <div v-if="store.ordersList.length === 0" class="empty-orders-box">
        <ion-icon :icon="receiptOutline" class="empty-orders-icon"></ion-icon>
        <h4>Nenhum pedido ativo</h4>
        <p>Escolha um profissional na aba Busca para fazer sua primeira solicitação.</p>
        <button class="go-search-btn" @click="goToSearchFromOrders">Buscar Profissionais</button>
      </div>

      <div v-else class="orders-stack">
        <div
          v-for="ord in store.ordersList"
          :key="ord.id"
          class="order-item-card"
        >
          <div class="order-top-row">
            <span class="order-cat-badge">{{ ord.categoria }}</span>
            <span
              class="order-status-pill"
              :class="ord.status === 'COMPLETED' ? 'done' : 'ongoing'"
            >
              {{ ord.statusLabel }}
            </span>
          </div>

          <h4 class="order-title">{{ ord.title }}</h4>

          <div class="order-meta-line">
            <span>📅 {{ ord.date }} • {{ ord.time }}</span>
            <strong class="order-price">R$ {{ ord.budget || ord.price || 180 }},00</strong>
          </div>

          <div class="order-pro-footer">
            <div class="order-pro-info">
              <img :src="ord.professional?.avatar" alt="Profissional" class="order-pro-avatar" />
              <div>
                <strong class="order-pro-name">{{ ord.professional?.name || ord.professional?.nome }}</strong>
                <span class="order-pro-rating">★ {{ ord.professional?.rating || ord.professional?.nota || '5,0' }}</span>
              </div>
            </div>

            <div class="order-actions">
              <button class="btn-order-chat" @click="openOrderChat(ord)">
                <ion-icon :icon="chatbubbleOutline"></ion-icon>
                <span>Chat</span>
              </button>

              <button
                v-if="ord.status === 'IN_PROGRESS'"
                class="btn-order-complete"
                @click="openOrderChat(ord)"
              >
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Concluir</span>
              </button>

              <button
                v-if="ord.status === 'IN_PROGRESS'"
                class="btn-order-cancel"
                @click="store.cancelOrder(ord.id)"
                title="Cancelar pedido"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-modal>

  <!-- ================= MODAL GLOBAL 2: MEU PERFIL & ALTERNAR MODO ================= -->
  <ion-modal
    :is-open="store.profileMenuModalOpen"
    :breakpoints="[0, 0.72, 0.9]"
    :initial-breakpoint="0.72"
    @didDismiss="store.profileMenuModalOpen = false"
    class="global-sheet-modal"
  >
    <ion-content class="sheet-content ion-padding">
      <div class="sheet-header">
        <div class="profile-user-header">
          <div class="profile-avatar-wrap">
            <img :src="store.workerProfile.avatar" alt="Usuário" class="profile-sheet-avatar" />
            <span class="profile-online-dot"></span>
          </div>
          <div>
            <span class="profile-mode-pill">
              {{ isProviderRoute ? 'MODO TRABALHADOR ATIVO' : 'MODO CLIENTE ATIVO' }}
            </span>
            <h2 class="sheet-title">{{ isProviderRoute ? store.workerProfile.name : 'Você (Cliente +SERVE)' }}</h2>
            <p class="sheet-subtitle">Boa Vista - RR • Conta Verificada</p>
          </div>
        </div>
        <button class="sheet-close-btn" @click="store.profileMenuModalOpen = false">✕</button>
      </div>

      <div class="profile-menu-list">
        <!-- Alternar entre Cliente e Trabalhador -->
        <div class="profile-menu-item highlight-switch" @click="toggleAppMode">
          <div class="menu-item-icon neon">
            <ion-icon :icon="swapHorizontalOutline"></ion-icon>
          </div>
          <div class="menu-item-text">
            <h4>{{ isProviderRoute ? 'Ir para Modo Cliente (Contratar)' : 'Ir para Modo Trabalhador (Prestador)' }}</h4>
            <p>{{ isProviderRoute ? 'Busque e contrate profissionais para seu evento ou casa.' : `Veja ${store.jobLeads.length} chamados disponíveis e receba pagamentos.` }}</p>
          </div>
          <ion-icon :icon="arrowForwardOutline" class="menu-arrow"></ion-icon>
        </div>

        <!-- Atalho para Carteira do Prestador (EXCLUSIVO DO MODO TRABALHADOR) -->
        <div v-if="isProviderRoute" class="profile-menu-item" @click="goToProviderWallet">
          <div class="menu-item-icon">
            <ion-icon :icon="walletOutline"></ion-icon>
          </div>
          <div class="menu-item-text">
            <h4>Carteira & Saque PIX</h4>
            <p>Saldo disponível do trabalhador: <strong>R$ {{ store.walletBalance }},00</strong></p>
          </div>
          <ion-icon :icon="arrowForwardOutline" class="menu-arrow"></ion-icon>
        </div>

        <!-- Atalho para Meus Pedidos (Modo Cliente) -->
        <div v-if="!isProviderRoute" class="profile-menu-item" @click="switchToOrdersFromProfile">
          <div class="menu-item-icon">
            <ion-icon :icon="receiptOutline"></ion-icon>
          </div>
          <div class="menu-item-text">
            <h4>Histórico de Pedidos ({{ store.ordersList.length }})</h4>
            <p>Acompanhe agendamentos e avaliações realizadas.</p>
          </div>
          <ion-icon :icon="arrowForwardOutline" class="menu-arrow"></ion-icon>
        </div>

        <!-- Suporte 24h -->
        <div class="profile-menu-item" @click="openSupportChatFromProfile">
          <div class="menu-item-icon">
            <ion-icon :icon="headsetOutline"></ion-icon>
          </div>
          <div class="menu-item-text">
            <h4>Central de Ajuda & Suporte 24h</h4>
            <p>Fale no chat com nossa equipe de atendimento.</p>
          </div>
          <ion-icon :icon="arrowForwardOutline" class="menu-arrow"></ion-icon>
        </div>

        <!-- Resetar Apresentação (Restaurar todos os estados iniciais do MVP) -->
        <div class="profile-menu-item reset-demo-item" @click="handleResetPresentation">
          <div class="menu-item-icon reset-icon">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </div>
          <div class="menu-item-text">
            <h4>Resetar Apresentação</h4>
            <p>Restaurar todos os pedidos, chamados e estados iniciais do app.</p>
          </div>
          <ion-icon :icon="arrowForwardOutline" class="menu-arrow"></ion-icon>
        </div>
      </div>
    </ion-content>
  </ion-modal>

  <!-- Toast global de confirmação do Reset -->
  <ion-toast
    :is-open="resetToastOpen"
    message="Apresentação restaurada! Todos os estados voltaram ao padrão inicial."
    :duration="2400"
    position="top"
    @didDismiss="resetToastOpen = false"
  ></ion-toast>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IonIcon, IonModal, IonContent, IonToast } from '@ionic/vue';
import {
  home,
  homeOutline,
  search,
  searchOutline,
  receipt,
  receiptOutline,
  person,
  personOutline,
  checkmarkCircle,
  chatbubbleOutline,
  swapHorizontalOutline,
  walletOutline,
  headsetOutline,
  refreshOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import { useAppStore } from '@/stores/useAppStore';

const router = useRouter();
const route = useRoute();
const store = useAppStore();

const resetToastOpen = ref(false);

const isProviderRoute = computed(() => route.path.startsWith('/provider'));

const ongoingOrdersCount = computed(() => {
  return store.ordersList.filter(o => o.status === 'IN_PROGRESS').length;
});

const activeTab = computed(() => {
  if (store.ordersModalOpen) return 'orders';
  if (store.profileMenuModalOpen) return 'profile';
  if (route.path.startsWith('/client')) return 'search';
  if (route.path.startsWith('/provider')) return 'profile';
  return 'home';
});

function closeAllGlobalModals() {
  store.ordersModalOpen = false;
  store.profileMenuModalOpen = false;
}

function handleTabClick(tab) {
  if (tab === 'home') {
    closeAllGlobalModals();
    router.push('/home');
    return;
  }

  if (tab === 'search') {
    closeAllGlobalModals();
    if (!route.path.startsWith('/client')) {
      router.push('/client/dashboard');
    } else {
      const formEl = document.getElementById('form-event-card');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  if (tab === 'orders') {
    store.profileMenuModalOpen = false;
    store.ordersModalOpen = !store.ordersModalOpen;
    return;
  }

  if (tab === 'profile') {
    store.ordersModalOpen = false;
    store.profileMenuModalOpen = !store.profileMenuModalOpen;
  }
}

function goToSearchFromOrders() {
  store.ordersModalOpen = false;
  router.push('/client/dashboard');
}

function openOrderChat(ord) {
  store.ordersModalOpen = false;
  store.openChatWithPro(ord.professional, ord);
}

function toggleAppMode() {
  store.profileMenuModalOpen = false;
  if (isProviderRoute.value) {
    router.push('/client/dashboard');
  } else {
    router.push('/provider/dashboard');
  }
}

function goToProviderWallet() {
  store.profileMenuModalOpen = false;
  router.push('/provider/dashboard');
}

function switchToOrdersFromProfile() {
  store.profileMenuModalOpen = false;
  store.ordersModalOpen = true;
}

function openSupportChatFromProfile() {
  store.profileMenuModalOpen = false;
  store.openChatWithPro({
    id: 999,
    nome: 'Suporte +SERVE 24h',
    name: 'Suporte +SERVE 24h',
    categoria: 'Central de Atendimento',
    avatar: 'https://i.pravatar.cc/150?img=47',
    nota: '5,0'
  });
}

function handleResetPresentation() {
  store.resetPresentation();
  resetToastOpen.value = true;
}
</script>

<style scoped>
/* ================= BARRA INFERIOR FIXA (4 ABAS PRINCIPAIS) ================= */
.global-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(7, 10, 16, 0.96);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.55);
}

.bottom-nav-inner {
  max-width: 520px;
  margin: 0 auto;
  height: 62px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
}

.nav-tab-btn {
  background: transparent;
  border: none;
  outline: none;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #8b95a5;
  cursor: pointer;
  transition: color 0.18s ease, transform 0.15s ease;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

.nav-tab-btn:active {
  transform: scale(0.93);
}

.nav-tab-btn.active {
  color: #ffffff;
}

.nav-tab-btn.active .tab-icon {
  color: #D4FF24;
  filter: drop-shadow(0 0 6px rgba(212, 255, 36, 0.35));
}

.icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 26px;
}

.tab-icon {
  font-size: 23px;
  transition: color 0.18s ease;
}

.tab-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1px;
  line-height: 1;
}

.nav-tab-btn.active .tab-label {
  font-weight: 800;
  color: #ffffff;
}

/* Contador em Pedidos */
.tab-badge-count {
  position: absolute;
  top: -3px;
  right: -7px;
  background: #D4FF24;
  color: #050800;
  font-size: 9.5px;
  font-weight: 900;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #070a10;
}

/* Ponto de notificação no Perfil */
.notification-dot {
  position: absolute;
  top: -2px;
  right: -4px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #070a10;
}

.notification-dot::after {
  content: '';
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #ffffff;
  margin: 2px auto;
}

/* ================= ESTILOS DOS MODAIS GLOBAIS ================= */
.sheet-content {
  --background: #0b0e14;
  --color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.sheet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.sheet-title {
  font-size: 19px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.sheet-subtitle {
  font-size: 12.5px;
  color: #9ca3af;
  margin: 3px 0 0;
}

.sheet-close-btn {
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: #9ca3af;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 15px;
  cursor: pointer;
  flex-shrink: 0;
}

/* Pedidos Modal */
.empty-orders-box {
  text-align: center;
  padding: 32px 16px;
}

.empty-orders-icon {
  font-size: 40px;
  color: #D4FF24;
}

.go-search-btn {
  margin-top: 12px;
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.orders-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 24px;
}

.order-item-card {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
}

.order-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.order-cat-badge {
  font-size: 10.5px;
  font-weight: 800;
  color: #D4FF24;
  text-transform: uppercase;
}

.order-status-pill {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
}

.order-status-pill.ongoing {
  background: rgba(212, 255, 36, 0.14);
  color: #D4FF24;
}

.order-status-pill.done {
  background: rgba(34, 197, 94, 0.16);
  color: #4ade80;
}

.order-title {
  font-size: 14.5px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #ffffff;
}

.order-meta-line {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 12px;
}

.order-price {
  color: #D4FF24;
}

.order-pro-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
}

.order-pro-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-pro-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
}

.order-pro-name {
  display: block;
  font-size: 12.5px;
  color: #ffffff;
}

.order-pro-rating {
  font-size: 11px;
  color: #facc15;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-order-chat {
  background: rgba(212, 255, 36, 0.12);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.btn-order-complete {
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11.5px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.btn-order-cancel {
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  font-size: 12px;
  cursor: pointer;
}

/* Perfil Sheet */
.profile-user-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-avatar-wrap {
  position: relative;
}

.profile-sheet-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.profile-online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #0b0e14;
}

.profile-mode-pill {
  display: inline-block;
  font-size: 9.5px;
  font-weight: 800;
  color: #D4FF24;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.profile-menu-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 24px;
}

.profile-menu-item {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.profile-menu-item.highlight-switch {
  border-color: rgba(212, 255, 36, 0.4);
  background: rgba(212, 255, 36, 0.06);
}

.menu-item-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.menu-item-icon.neon {
  background: rgba(212, 255, 36, 0.16);
  color: #D4FF24;
}

.menu-item-icon.reset-icon {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.profile-menu-item.reset-demo-item {
  border-color: rgba(245, 158, 11, 0.28);
}

.menu-item-text {
  flex: 1;
}

.menu-item-text h4 {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2px;
}

.menu-item-text p {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.menu-arrow {
  color: #9ca3af;
  font-size: 18px;
}
</style>
