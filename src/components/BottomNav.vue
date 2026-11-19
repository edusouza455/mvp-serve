<template>
  <!-- BARRA DE NAVEGAÇÃO INFERIOR GLOBAL (ADAPTATIVA: CLIENTE vs PRESTADOR DE SERVIÇO) -->
  <nav class="global-bottom-nav" :class="{ 'provider-mode-nav': isProviderMode }" aria-label="Navegação Principal">
    <!-- MODO PRESTADOR DE SERVIÇO: MEUS SERVIÇOS (AGENDA + PROPOSTAS), IMPULSOS, CARTEIRA E PERFIL -->
    <div v-if="isProviderMode" class="bottom-nav-inner provider-nav-grid">
      <!-- 1. MEUS SERVIÇOS (SUA AGENDA + PROPOSTAS) -->
      <button
        type="button"
        class="nav-tab-btn"
        :class="{ active: activeTab === 'servicos' }"
        @click="handleProviderTab('servicos')"
      >
        <div class="icon-wrap">
          <ion-icon :icon="activeTab === 'servicos' ? briefcase : briefcaseOutline" class="tab-icon"></ion-icon>
          <span v-if="providerActiveCount > 0" class="tab-badge-count">{{ providerActiveCount }}</span>
        </div>
        <span class="tab-label">Meus Serviços</span>
      </button>

      <!-- 2. IMPULSOS (ABRE O MODAL DE IMPULSOS) -->
      <button
        type="button"
        class="nav-tab-btn"
        :class="{ active: activeTab === 'impulsos' }"
        @click="openProviderBoostModal"
      >
        <div class="icon-wrap">
          <ion-icon :icon="activeTab === 'impulsos' ? rocket : rocketOutline" class="tab-icon"></ion-icon>
        </div>
        <span class="tab-label">Impulsos</span>
      </button>

      <!-- 3. CARTEIRA (TELA MINIMALISTA DE SALDO + DEPÓSITO PIX/DÉBITO) -->
      <button
        type="button"
        class="nav-tab-btn"
        :class="{ active: activeTab === 'carteira' }"
        @click="handleProviderTab('carteira')"
      >
        <div class="icon-wrap">
          <ion-icon :icon="activeTab === 'carteira' ? wallet : walletOutline" class="tab-icon"></ion-icon>
        </div>
        <span class="tab-label">Carteira</span>
      </button>

      <!-- 4. PERFIL -->
      <button
        type="button"
        class="nav-tab-btn"
        :class="{ active: activeTab === 'perfil' }"
        @click="handleProviderTab('perfil')"
      >
        <div class="icon-wrap">
          <ion-icon :icon="activeTab === 'perfil' ? person : personOutline" class="tab-icon"></ion-icon>
          <span class="notification-dot" title="Perfil do Prestador de Serviço"></span>
        </div>
        <span class="tab-label">Perfil</span>
      </button>
    </div>

    <!-- MODO CLIENTE: INÍCIO, BUSCA, PEDIDOS E PERFIL -->
    <div v-else class="bottom-nav-inner">
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

      <!-- 3. SOLICITAÇÕES -->
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
        <span class="tab-label">Solicitações</span>
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
          <span class="notification-dot" title="Conta e Modo Prestador de Serviço"></span>
        </div>
        <span class="tab-label">Perfil</span>
      </button>
    </div>
  </nav>

  <!-- ================= MODAL GLOBAL 1: MINHAS SOLICITAÇÕES (ESTILO INDRIVE EXPANSÍVEL) ================= -->
  <ion-modal
    :is-open="store.ordersModalOpen"
    :breakpoints="[0, 0.85, 0.96]"
    :initial-breakpoint="0.85"
    @didDismiss="store.ordersModalOpen = false"
    class="global-sheet-modal"
  >
    <ion-content class="sheet-content ion-padding">
      <div class="sheet-header">
        <div>
          <h2 class="sheet-title">Minhas Solicitações</h2>
          <p class="sheet-subtitle">Toque em uma solicitação para ver as propostas e fechar acordo</p>
        </div>
        <button class="sheet-close-btn" @click="store.ordersModalOpen = false">✕</button>
      </div>

      <div v-if="store.ordersList.length === 0" class="empty-orders-box">
        <ion-icon :icon="receiptOutline" class="empty-orders-icon"></ion-icon>
        <h4>Nenhuma solicitação ativa</h4>
        <p>Crie uma solicitação na aba Busca para receber propostas de prestadores.</p>
        <button class="go-search-btn" @click="goToSearchFromOrders">Nova Solicitação</button>
      </div>

      <div v-else class="orders-stack">
        <div
          v-for="ord in store.ordersList"
          :key="ord.id"
          class="order-item-card indrive-req-card"
          :class="{ expanded: isOrderExpanded(ord.id) }"
        >
          <!-- CAIXA FECHADA / HEADER CLICÁVEL DA SOLICITAÇÃO -->
          <div class="req-clickable-header" @click="toggleOrderExpansion(ord.id)">
            <div class="order-top-row">
              <span class="order-cat-badge">{{ ord.categoria }}</span>

              <div class="req-top-right">
                <span
                  class="order-status-pill"
                  :class="{
                    done: ord.status === 'COMPLETED' || ord.acceptedProposalId,
                    cancelled: ord.status === 'CANCELLED' || ord.status === 'REJECTED',
                    ongoing: ord.status === 'IN_PROGRESS' && !ord.acceptedProposalId
                  }"
                >
                  {{ getOrderBadgeText(ord) }}
                </span>
                <span class="req-expand-arrow">{{ isOrderExpanded(ord.id) ? '▴' : '▾' }}</span>
              </div>
            </div>

            <h4 class="order-title">{{ ord.title }}</h4>

            <div class="order-meta-line compact-meta">
              <span>📅 {{ ord.date }} • {{ ord.time }}</span>
              <span class="client-offer-label">
                Sua oferta: <strong class="order-price">R$ {{ ord.offeredPrice || ord.budget || 180 }}</strong>
              </span>
            </div>
          </div>

          <!-- CONTEÚDO EXPANDIDO: 3 PROPOSTAS DISPUTANDO (FIEL AO INDRIVE) -->
          <div v-if="isOrderExpanded(ord.id)" class="req-expanded-body">
            <div class="proposals-sub-header">
              <span>
                {{
                  ord.acceptedProposalId
                    ? 'PRESTADOR ESCOLHIDO & OUTROS INTERESSADOS'
                    : `PROPOSTAS RECEBIDAS (${ord.proposals?.length || 1})`
                }}
              </span>
              <button
                v-if="ord.status === 'IN_PROGRESS'"
                type="button"
                class="cancel-req-text-btn"
                @click.stop="store.cancelOrder(ord.id)"
              >
                Cancelar solicitação
              </button>
            </div>

            <div class="indrive-proposals-list">
              <div
                v-for="prop in getOrderProposals(ord)"
                :key="prop.id"
                class="indrive-bid-card"
                :class="{
                  'client-choice-highlight': prop.isClientChoice,
                  'accepted-bid-highlight': ord.acceptedProposalId === prop.id
                }"
              >
                <!-- Flags de Topo da Proposta: Sua Escolha + Tipo da Oferta -->
                <div class="bid-top-flags">
                  <div class="bid-flags-left">
                    <span v-if="prop.isClientChoice" class="flag-client-choice">
                      ★ Sua escolha
                    </span>
                    <span
                      v-if="ord.acceptedProposalId === prop.id"
                      class="flag-accepted-deal"
                    >
                      ✓ Escolhido
                    </span>
                    <span
                      class="flag-bid-type"
                      :class="{ counter: prop.price > (ord.offeredPrice || ord.budget) }"
                    >
                      {{ prop.tag }}
                    </span>
                  </div>

                  <strong class="bid-price-big">R$ {{ prop.price }}</strong>
                </div>

                <!-- Dados do Prestador -->
                <div class="bid-pro-row">
                  <div class="order-pro-info">
                    <img :src="prop.pro?.avatar" alt="Prestador" class="order-pro-avatar" />
                    <div>
                      <strong class="order-pro-name">{{ prop.pro?.name || prop.pro?.nome }}</strong>
                      <span class="order-pro-rating">
                        ★ {{ prop.pro?.nota || prop.pro?.rating || '4,9' }}
                        <i class="bid-jobs-count">• {{ prop.pro?.servicos || 32 }} serv.</i>
                      </span>
                    </div>
                  </div>

                  <!-- Botões de Ação da Proposta -->
                  <div class="bid-actions-group">
                    <!-- Quando este prestador já foi aceito (ou solicitação concluída) -->
                    <template v-if="ord.acceptedProposalId === prop.id || ord.status === 'COMPLETED'">
                      <button type="button" class="btn-order-chat" @click.stop="openProposalChat(ord, prop)">
                        <ion-icon :icon="chatbubbleOutline"></ion-icon>
                        <span>Chat</span>
                      </button>

                      <button
                        v-if="ord.status === 'IN_PROGRESS'"
                        type="button"
                        class="btn-order-complete"
                        @click.stop="openProposalChat(ord, prop)"
                      >
                        <ion-icon :icon="checkmarkCircle"></ion-icon>
                        <span>Concluir</span>
                      </button>
                    </template>

                    <!-- Quando a proposta está em disputa (Aceitar / Recusar estilo inDrive) -->
                    <template v-else-if="ord.status === 'IN_PROGRESS'">
                      <button
                        type="button"
                        class="btn-bid-decline"
                        @click.stop="handleDeclineProposal(ord.id, prop.id)"
                        title="Recusar esta proposta"
                      >
                        Recusar
                      </button>
                      <button
                        type="button"
                        class="btn-bid-accept"
                        @click.stop="handleAcceptProposal(ord, prop)"
                      >
                        Aceitar
                      </button>
                    </template>
                  </div>
                </div>
              </div>
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
              {{ isProviderMode ? 'PRESTADOR DE SERVIÇO ATIVO' : 'MODO CLIENTE ATIVO' }}
            </span>
            <h2 class="sheet-title">{{ isProviderMode ? store.workerProfile.name : 'Você (Cliente +SERVE)' }}</h2>
            <p class="sheet-subtitle">Boa Vista - RR • Conta Verificada</p>
          </div>
        </div>
        <button class="sheet-close-btn" @click="store.profileMenuModalOpen = false">✕</button>
      </div>

      <div class="profile-menu-list">
        <!-- Alternar entre Cliente e Prestador de Serviço -->
        <div class="profile-menu-item highlight-switch" @click="toggleAppMode">
          <div class="menu-item-icon neon">
            <ion-icon :icon="swapHorizontalOutline"></ion-icon>
          </div>
          <div class="menu-item-text">
            <h4>{{ isProviderMode ? 'Ir para Modo Cliente (Contratar)' : 'Ir para Modo Prestador de Serviço' }}</h4>
            <p>{{ isProviderMode ? 'Busque e contrate profissionais para seu evento ou casa.' : `Ative impulsos, veja ${store.jobLeads.length} chamados e receba via PIX.` }}</p>
          </div>
          <ion-icon :icon="arrowForwardOutline" class="menu-arrow"></ion-icon>
        </div>

        <!-- Atalho para o Perfil Gamificado Completo (Dados, Métodos de Pagamento e XP) -->
        <div class="profile-menu-item" @click="goToFullGamifiedProfile">
          <div class="menu-item-icon">
            <ion-icon :icon="personOutline"></ion-icon>
          </div>
          <div class="menu-item-text">
            <h4>Perfil Completo & Gamificação (Nv. {{ store.workerProfile.level }})</h4>
            <p>Editar nome, telefone, métodos de pagamento, bio, cursos e certificados (+XP).</p>
          </div>
          <ion-icon :icon="arrowForwardOutline" class="menu-arrow"></ion-icon>
        </div>

        <!-- Atalho para Tela de Login e Cadastro -->
        <div class="profile-menu-item" @click="goToAuthScreen">
          <div class="menu-item-icon">
            <ion-icon :icon="briefcaseOutline"></ion-icon>
          </div>
          <div class="menu-item-text">
            <h4>Fluxo de Login & Cadastro</h4>
            <p>Acessar tela de login mockado (1 clique) e visualização de cadastro.</p>
          </div>
          <ion-icon :icon="arrowForwardOutline" class="menu-arrow"></ion-icon>
        </div>

        <!-- Atalho para Carteira do Prestador (EXCLUSIVO DO PRESTADOR DE SERVIÇO) -->
        <div v-if="isProviderMode" class="profile-menu-item" @click="goToProviderWallet">
          <div class="menu-item-icon">
            <ion-icon :icon="walletOutline"></ion-icon>
          </div>
          <div class="menu-item-text">
            <h4>Carteira & Saque PIX</h4>
            <p>Saldo disponível do prestador de serviço: <strong>R$ {{ store.walletBalance }},00</strong></p>
          </div>
          <ion-icon :icon="arrowForwardOutline" class="menu-arrow"></ion-icon>
        </div>

        <!-- Atalho para Minhas Solicitações (Modo Cliente) -->
        <div v-if="!isProviderMode" class="profile-menu-item" @click="switchToOrdersFromProfile">
          <div class="menu-item-icon">
            <ion-icon :icon="receiptOutline"></ion-icon>
          </div>
          <div class="menu-item-text">
            <h4>Minhas Solicitações ({{ store.ordersList.length }})</h4>
            <p>Compare propostas de prestadores e acompanhe agendamentos.</p>
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
import { ref, computed, watch } from 'vue';
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
  briefcase,
  briefcaseOutline,
  rocket,
  rocketOutline,
  wallet,
  walletOutline,
  checkmarkCircle,
  chatbubbleOutline,
  swapHorizontalOutline,
  headsetOutline,
  refreshOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import { useAppStore } from '@/stores/useAppStore';

const router = useRouter();
const route = useRoute();
const store = useAppStore();

const resetToastOpen = ref(false);
const expandedOrdersMap = ref({});

function isOrderExpanded(orderId) {
  return Boolean(expandedOrdersMap.value[orderId]);
}

function toggleOrderExpansion(orderId) {
  expandedOrdersMap.value = {
    ...expandedOrdersMap.value,
    [orderId]: !expandedOrdersMap.value[orderId]
  };
}

function getOrderProposals(ord) {
  if (Array.isArray(ord.proposals) && ord.proposals.length > 0) {
    return ord.proposals;
  }
  return [
    {
      id: `prop-fallback-${ord.id}`,
      isClientChoice: true,
      price: ord.budget || ord.price || 180,
      tag: 'Aceitou sua oferta',
      pro: ord.professional
    }
  ];
}

function getOrderBadgeText(ord) {
  if (ord.status === 'COMPLETED') return 'Concluído';
  if (ord.status === 'CANCELLED') return 'Cancelado';
  if (ord.status === 'REJECTED') return 'Recusado';
  if (ord.acceptedProposalId) return '✓ Acordo Fechado';
  const count = getOrderProposals(ord).length;
  return `${count} ${count === 1 ? 'proposta' : 'propostas'}`;
}

function handleAcceptProposal(ord, prop) {
  store.acceptOrderProposal(ord.id, prop.id);
}

function handleDeclineProposal(orderId, propId) {
  store.declineOrderProposal(orderId, propId);
}

function openProposalChat(ord, prop) {
  store.ordersModalOpen = false;
  store.openChatWithPro(prop.pro || ord.professional, {
    ...ord,
    budget: prop.price || ord.budget,
    price: prop.price || ord.price
  });
}

// Mantém store.role estritamente alinhado à rota para nunca exibir ícones do prestador na Home
watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith('/provider')) {
      store.role = 'PROVIDER';
    } else {
      store.role = 'CLIENT';
    }
  },
  { immediate: true }
);

const isProviderMode = computed(() => {
  return route.path.startsWith('/provider');
});

const ongoingOrdersCount = computed(() => {
  return store.ordersList.filter(o => o.status === 'IN_PROGRESS').length;
});

const providerActiveCount = computed(() => {
  return store.acceptedJobs.filter(j => j.status !== 'COMPLETED').length + store.jobLeads.length;
});

const activeTab = computed(() => {
  if (store.ordersModalOpen) return 'orders';
  if (store.boostModalOpen) return 'impulsos';
  if (store.profileMenuModalOpen) return isProviderMode.value ? 'perfil' : 'profile';
  if (isProviderMode.value) {
    if (store.providerTab === 'carteira') return 'carteira';
    if (store.providerTab === 'perfil') return 'perfil';
    return 'servicos';
  }
  if (route.path.startsWith('/client')) return 'search';
  return 'home';
});

function closeAllGlobalModals() {
  store.ordersModalOpen = false;
  store.profileMenuModalOpen = false;
  store.boostModalOpen = false;
}

async function handleProviderTab(tabName) {
  closeAllGlobalModals();
  store.role = 'PROVIDER';
  store.providerTab = tabName;
  const nextQuery = tabName === 'servicos' ? {} : { tab: tabName };
  if (!route.path.startsWith('/provider')) {
    await router.push({ path: '/provider', query: nextQuery });
  } else {
    await router.replace({ path: '/provider', query: nextQuery });
  }
}

async function openProviderBoostModal() {
  store.ordersModalOpen = false;
  store.profileMenuModalOpen = false;
  store.role = 'PROVIDER';
  if (!route.path.startsWith('/provider')) {
    store.providerTab = 'servicos';
    await router.push('/provider');
  }
  store.boostModalOpen = true;
}

function handleTabClick(tab) {
  if (tab === 'home') {
    closeAllGlobalModals();
    store.role = 'CLIENT';
    router.push('/home');
    return;
  }

  if (tab === 'search') {
    closeAllGlobalModals();
    store.role = 'CLIENT';
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
  store.role = 'CLIENT';
  router.push('/client/dashboard');
}

function openOrderChat(ord) {
  store.ordersModalOpen = false;
  store.openChatWithPro(ord.professional, ord);
}

async function toggleAppMode() {
  store.profileMenuModalOpen = false;
  if (isProviderMode.value) {
    store.role = 'CLIENT';
    await router.push('/home');
  } else {
    store.role = 'PROVIDER';
    store.providerTab = 'servicos';
    await router.push('/provider');
  }
}

async function goToProviderWallet() {
  store.profileMenuModalOpen = false;
  store.role = 'PROVIDER';
  store.providerTab = 'carteira';
  await router.push('/provider');
}

async function goToFullGamifiedProfile() {
  store.profileMenuModalOpen = false;
  store.role = 'PROVIDER';
  store.providerTab = 'perfil';
  await router.push('/provider?tab=perfil');
}

async function goToAuthScreen() {
  store.profileMenuModalOpen = false;
  await router.push('/login');
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
/* ================= BARRA INFERIOR FIXA (4 ABAS PRINCIPAIS - MOBILE APP) ================= */
.global-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 440px;
  margin: 0 auto;
  z-index: 1000;
  background: rgba(7, 10, 16, 0.96);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.55);
  transition: border-color 0.2s ease;
}

.global-bottom-nav.provider-mode-nav {
  border-top: 1px solid rgba(212, 255, 36, 0.35);
}

.bottom-nav-inner {
  width: 100%;
  height: 64px;
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
  background: #101521;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 13px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.order-item-card.indrive-req-card.expanded {
  border-color: rgba(212, 255, 36, 0.35);
  background: #0d121c;
}

.req-clickable-header {
  cursor: pointer;
  user-select: none;
}

.req-top-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.req-expand-arrow {
  color: #D4FF24;
  font-size: 13px;
  font-weight: 900;
}

.order-meta-line.compact-meta {
  margin-bottom: 0;
  align-items: center;
}

.client-offer-label {
  font-size: 11.5px;
  color: #cbd5e1;
}

.req-expanded-body {
  margin-top: 12px;
  padding-top: 11px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.proposals-sub-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.proposals-sub-header span {
  font-size: 9.5px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: #9ca3af;
}

.cancel-req-text-btn {
  background: transparent;
  border: none;
  color: #f87171;
  font-size: 10.5px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.indrive-proposals-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.indrive-bid-card {
  background: #141b2a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 11px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.indrive-bid-card.client-choice-highlight {
  border-color: rgba(212, 255, 36, 0.38);
  background: linear-gradient(145deg, #131b29 0%, #16201c 100%);
}

.indrive-bid-card.accepted-bid-highlight {
  border-color: #4ade80;
  background: rgba(34, 197, 94, 0.08);
}

.bid-top-flags {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.bid-flags-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.flag-client-choice {
  background: #D4FF24;
  color: #050800;
  font-size: 9.5px;
  font-weight: 900;
  padding: 2px 7px;
  border-radius: 99px;
}

.flag-accepted-deal {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.45);
  color: #4ade80;
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 99px;
}

.flag-bid-type {
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 99px;
}

.flag-bid-type.counter {
  background: rgba(250, 204, 21, 0.14);
  color: #facc15;
}

.bid-price-big {
  font-size: 14px;
  font-weight: 900;
  color: #D4FF24;
  white-space: nowrap;
}

.bid-pro-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.bid-jobs-count {
  font-style: normal;
  color: #9ca3af;
}

.bid-actions-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.btn-bid-decline {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  border-radius: 8px;
  padding: 6px 9px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.btn-bid-accept {
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 11.5px;
  font-weight: 900;
  cursor: pointer;
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

.order-status-pill.cancelled {
  background: rgba(239, 68, 68, 0.16);
  color: #f87171;
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
