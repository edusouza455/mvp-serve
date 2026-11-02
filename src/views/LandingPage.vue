<template>
  <ion-page>
    <!-- Background Animado Futurista com Efeito de Luzes Neon & Mesh -->
    <div class="animated-bg-container" aria-hidden="true">
      <div class="mesh-grid"></div>
      <div class="glow-orb orb-primary"></div>
      <div class="glow-orb orb-secondary"></div>
      <div class="glow-orb orb-accent"></div>
    </div>

    <!-- Header Fixo com Glassmorphism Moderno -->
    <ion-header class="landing-header ion-no-border">
      <ion-toolbar class="header-toolbar">
        <ion-title slot="start" class="brand-title">
          <div class="brand-logo-wrap" @click="handleResetDemo">
            <span class="neon-brand">+serve</span>
            <span class="brand-status-dot" title="Sistema online"></span>
          </div>
        </ion-title>

        <ion-buttons slot="end" class="header-actions">
          <!-- Role Pill Switcher Clicável -->
          <button
            class="current-role-pill"
            :class="appStore.role === 'CLIENT' ? 'role-client' : 'role-provider'"
            @click="handlePillClick"
            :title="appStore.role === 'CLIENT' ? 'Ir para Painel do Cliente' : 'Ir para Painel do Prestador'"
          >
            <span class="pill-dot"></span>
            <span class="pill-text">{{ appStore.role === 'CLIENT' ? 'Painel Cliente' : 'Painel Prestador' }}</span>
            <ion-icon :icon="arrowForwardOutline" class="pill-arrow"></ion-icon>
          </button>

          <!-- Botão Resetar Demo -->
          <ion-button
            fill="clear"
            size="small"
            class="header-icon-btn reset-demo-btn"
            title="Resetar Dados de Demonstração"
            aria-label="Resetar Demo"
            @click="handleResetDemo"
          >
            <ion-icon slot="icon-only" :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="landing-content">
      <div class="page-container">
        
        <!-- ================= HERO SECTION ================= -->
        <section class="hero-section">
          <!-- Live Status Badge -->
          <div class="live-badge-wrapper">
            <span class="live-pulse-dot"></span>
            <span class="live-badge-text">+3.420 profissionais disponíveis em São Paulo</span>
          </div>

          <ion-grid class="ion-no-padding hero-grid">
            <ion-row class="ion-align-items-center">
              
              <!-- Coluna Esquerda: Copywriting & Busca Mobile-First -->
              <ion-col size="12" size-lg="7" class="hero-text-col">
                <h1 class="hero-title">
                  Serviços sob demanda com os <span class="highlight-neon">melhores profissionais</span> da sua região
                </h1>
                
                <p class="hero-subtitle">
                  Encontre eletricistas, diaristas, garçons e reparos rápidos. Negocie direto no chat e receba orçamentos em tempo real sem mensalidade.
                </p>

                <!-- Campo de Pesquisa Interativo (Padrão de Mercado) -->
                <div class="search-box-trigger" @click="openRequestModal">
                  <div class="search-icon-wrapper">
                    <ion-icon :icon="searchOutline"></ion-icon>
                  </div>
                  <div class="search-labels">
                    <span class="search-static-text">Preciso de um</span>
                    <span class="search-dynamic-profession" :key="currentProfessionIndex">
                      {{ professions[currentProfessionIndex] }}
                    </span>
                  </div>
                  <button class="search-action-btn" aria-label="Buscar profissional">
                    <span class="btn-text">Buscar</span>
                    <ion-icon :icon="arrowForwardOutline"></ion-icon>
                  </button>
                </div>

                <!-- Chips de Atalhos de Categorias Mais Buscadas (Mobile-First Touch) -->
                <div class="quick-categories-scroll">
                  <span class="quick-label">Em alta:</span>
                  <div class="quick-chips-list">
                    <button
                      v-for="cat in quickCategories"
                      :key="cat.name"
                      class="quick-category-chip"
                      @click="selectCategoryAndOpen(cat.name)"
                    >
                      <ion-icon :icon="cat.icon" class="chip-icon"></ion-icon>
                      <span>{{ cat.name }}</span>
                    </button>
                  </div>
                </div>

                <!-- Trust Metrics Bar (Prova Social Imediata) -->
                <div class="trust-metrics-strip">
                  <div class="metric-item">
                    <div class="metric-value">
                      <span class="metric-star">★</span> 4.9<span class="metric-total">/5</span>
                    </div>
                    <span class="metric-label">Média das avaliações</span>
                  </div>
                  <div class="metric-divider"></div>
                  <div class="metric-item">
                    <div class="metric-value">15 min</div>
                    <span class="metric-label">Resposta média</span>
                  </div>
                  <div class="metric-divider"></div>
                  <div class="metric-item">
                    <div class="metric-value verified-val">
                      <ion-icon :icon="shieldCheckmarkOutline"></ion-icon> 100%
                    </div>
                    <span class="metric-label">Verificados</span>
                  </div>
                </div>
              </ion-col>

              <!-- Coluna Direita: Showcase 3D Cards de Profissionais -->
              <ion-col size="12" size-lg="5" class="hero-3d-col">
                <div class="showcase-card-deck" @click="cycleCards">
                  <div
                    v-for="(prof, index) in appStore.professionals"
                    :key="prof.id"
                    class="card-3d-item"
                    :class="`pos-${getCardPosition(index)}`"
                  >
                    <!-- Header do Card -->
                    <div class="card-avatar-wrapper">
                      <div class="avatar-with-ring">
                        <img :src="prof.avatar" :alt="prof.name" class="card-avatar-img" />
                        <span class="online-indicator"></span>
                      </div>
                      <div class="card-rating-badge">
                        <ion-icon :icon="star"></ion-icon>
                        <span>{{ prof.rating }}</span>
                      </div>
                    </div>

                    <!-- Conteúdo do Card -->
                    <div class="card-info">
                      <div class="card-name-row">
                        <h4 class="card-name">{{ prof.name }}</h4>
                        <ion-icon :icon="checkmarkCircle" class="verified-icon" title="Identidade Verificada"></ion-icon>
                      </div>
                      <p class="card-desc">{{ prof.description }}</p>
                    </div>

                    <!-- Footer do Card -->
                    <div class="card-bottom-row">
                      <div class="card-avail-tag">
                        <span class="pulse-green"></span>
                        Disponível agora
                      </div>
                      <span class="card-action-cue">Ver perfil ➔</span>
                    </div>
                  </div>
                </div>

                <!-- Indicadores de Pontos (Dots de Paginação) -->
                <div class="deck-dots">
                  <span
                    v-for="(prof, idx) in appStore.professionals"
                    :key="'dot-' + idx"
                    class="deck-dot"
                    :class="{ active: idx === activeTopIndex }"
                    @click.stop="activeTopIndex = idx"
                  ></span>
                </div>
                <span class="tap-hint">Toque no card para alternar o profissional</span>
              </ion-col>

            </ion-row>
          </ion-grid>
        </section>

        <!-- ================= CATEGORIAS POPULARES ================= -->
        <section class="popular-categories-section">
          <div class="section-heading">
            <span class="steps-kicker">Catálogo de Serviços</span>
            <h2 class="section-title">Categorias mais requisitadas</h2>
            <p class="section-desc">Escolha a categoria e contrate profissionais avaliados em instantes</p>
          </div>

          <div class="categories-grid">
            <div
              v-for="cat in featuredCategories"
              :key="cat.id"
              class="category-feature-card"
              @click="selectCategoryAndOpen(cat.title)"
            >
              <div class="cat-card-header">
                <div class="cat-icon-container" :style="{ background: cat.iconBg }">
                  <ion-icon :icon="cat.icon" :style="{ color: cat.iconColor }"></ion-icon>
                </div>
                <span v-if="cat.badge" class="cat-badge-trend">{{ cat.badge }}</span>
              </div>
              
              <div class="cat-card-body">
                <h3 class="cat-card-title">{{ cat.title }}</h3>
                <p class="cat-card-desc">{{ cat.description }}</p>
              </div>

              <div class="cat-card-footer">
                <div class="cat-price-info">
                  <span class="price-prefix">Piso médio</span>
                  <span class="price-value">{{ cat.priceFloor }}</span>
                </div>
                <button class="cat-solicitar-btn">
                  <span>Solicitar</span>
                  <ion-icon :icon="arrowForwardOutline"></ion-icon>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= FLUXO COMO FUNCIONA (4 STEPS) ================= -->
        <section class="steps-section">
          <div class="section-heading">
            <span class="steps-kicker">Sem Complicação</span>
            <h2 class="section-title">Como funciona o fluxo</h2>
            <p class="section-desc">Do pedido à entrega, tudo acontece de forma transparente e segura</p>
          </div>

          <div class="steps-grid">
            <div
              v-for="(step, index) in steps"
              :key="step.number"
              class="step-card-wrapper"
            >
              <div class="step-card">
                <div class="card-top">
                  <span class="step-badge">{{ step.number }}</span>
                  <div class="step-icon-box">
                    <ion-icon :icon="step.icon"></ion-icon>
                  </div>
                </div>
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-description">{{ step.description }}</p>
                <div class="step-highlight-tag">{{ step.highlight }}</div>
              </div>

              <div v-if="index < steps.length - 1" class="step-connector">
                <ion-icon :icon="chevronForwardOutline" class="connector-arrow"></ion-icon>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= BANNER CTA PARA PRESTADORES ================= -->
        <section class="provider-banner-section">
          <div class="provider-banner-card">
            <div class="banner-content">
              <span class="banner-tag">Para Trabalhadores & Autônomos</span>
              <h2 class="banner-title">Quer aumentar sua renda e conquistar clientes diários?</h2>
              <p class="banner-desc">
                Na <strong>+serve</strong> você tem autonomia total, recebe propostas na sua região, define seus preços e sobe de nível com nosso sistema gamificado de reputação.
              </p>
              
              <div class="banner-perks">
                <div class="perk-item">
                  <ion-icon :icon="checkmarkCircle"></ion-icon>
                  <span>Zero mensalidade</span>
                </div>
                <div class="perk-item">
                  <ion-icon :icon="checkmarkCircle"></ion-icon>
                  <span>Chat direto com cliente</span>
                </div>
                <div class="perk-item">
                  <ion-icon :icon="checkmarkCircle"></ion-icon>
                  <span>Saques e ganhos instantâneos</span>
                </div>
              </div>

              <button class="banner-cta-btn" @click="goToProvider">
                <span>Quero ser um Prestador</span>
                <ion-icon :icon="arrowForwardOutline"></ion-icon>
              </button>
            </div>
          </div>
        </section>

        <!-- ================= FOOTER ================= -->
        <footer class="landing-footer">
          <div class="footer-top">
            <span class="neon-brand">+serve</span>
            <p class="footer-tagline">A plataforma definitiva para contratação de serviços sob demanda.</p>
          </div>
          <div class="footer-bottom">
            <span>© 2026 +serve Inc. Todos os direitos reservados.</span>
            <span class="footer-mode-indicator" @click="handleToggleRole">
              Alternar para {{ appStore.role === 'CLIENT' ? 'Modo Prestador' : 'Modo Cliente' }}
            </span>
          </div>
        </footer>

      </div>

      <!-- Botão Flutuante (FAB) para Alternar Modo em 1 Toque -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="magic-fab">
        <ion-fab-button
          class="magic-fab-btn"
          :title="appStore.role === 'CLIENT' ? 'Mudar para Visão do Prestador' : 'Mudar para Visão do Cliente'"
          @click="handleToggleRole"
        >
          <ion-icon :icon="appStore.role === 'CLIENT' ? briefcaseOutline : personOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- ================= MODAL BOTTOM SHEET MOBILE-FIRST: CRIAR SOLICITAÇÃO ================= -->
      <ion-modal
        :is-open="isRequestModalOpen"
        :breakpoints="[0, 0.75, 0.95]"
        :initial-breakpoint="0.75"
        @didDismiss="isRequestModalOpen = false"
        class="request-modal-sheet"
      >
        <ion-content class="modal-content ion-padding">
          <div class="modal-handle-bar"></div>

          <div class="modal-inner-form">
            <div class="modal-header-row">
              <div>
                <h2 class="modal-title">Solicitar Serviço</h2>
                <p class="modal-subtitle">Preencha os detalhes e receba propostas em minutos.</p>
              </div>
              <ion-button fill="clear" size="small" class="modal-close-btn" @click="isRequestModalOpen = false">
                <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
              </ion-button>
            </div>

            <!-- Seleção de Categoria com Pills Grandes para Toque -->
            <div class="form-group">
              <label class="form-label">Selecione a Categoria</label>
              <div class="category-pills-selector">
                <button
                  v-for="cat in availableCategories"
                  :key="cat.name"
                  type="button"
                  class="cat-select-pill"
                  :class="{ active: selectedCategory === cat.name }"
                  @click="handleSelectCategory(cat)"
                >
                  <ion-icon :icon="cat.icon" class="pill-icon"></ion-icon>
                  <span>{{ cat.name }}</span>
                </button>
              </div>
            </div>

            <!-- Orçamento com Chips Rápidos -->
            <div class="form-group">
              <div class="label-with-hint">
                <label class="form-label">Orçamento Proposto (R$)</label>
                <span class="hint-text">Piso mínimo da categoria: R$ {{ currentCategoryFloor }}</span>
              </div>
              <div class="budget-presets">
                <button
                  v-for="preset in budgetPresets"
                  :key="preset"
                  type="button"
                  class="budget-preset-chip"
                  :class="{ active: requestBudget === preset }"
                  @click="requestBudget = preset"
                >
                  R$ {{ preset }}
                </button>
              </div>
              <div class="custom-budget-input-wrapper">
                <span class="currency-symbol">R$</span>
                <input
                  type="number"
                  v-model.number="requestBudget"
                  class="custom-number-input"
                  placeholder="Valor personalizado"
                  min="50"
                  step="10"
                />
              </div>
            </div>

            <!-- Descrição do Pedido -->
            <div class="form-group">
              <label class="form-label">Descrição do que precisa ser feito</label>
              <textarea
                v-model="requestDescription"
                rows="3"
                class="custom-textarea"
                placeholder="Ex: Instalação de duas luminárias na sala e troca de um disjuntor de 20A."
              ></textarea>
            </div>

            <!-- Botão de Ação Primário -->
            <button
              class="modal-submit-btn"
              :disabled="!isRequestValid"
              @click="submitClientRequest"
            >
              <span>Publicar Pedido & Ir ao Painel</span>
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
            </button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- Toast Feedback Feedback -->
      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :duration="3000"
        position="bottom"
        @didDismiss="showToast = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonModal,
  IonToast
} from '@ionic/vue';
import {
  notificationsOutline,
  refreshOutline,
  searchOutline,
  arrowForwardOutline,
  personOutline,
  briefcaseOutline,
  closeOutline,
  createOutline,
  chatbubbleEllipsesOutline,
  checkmarkDoneOutline,
  chevronForwardOutline,
  flashOutline,
  waterOutline,
  brushOutline,
  restaurantOutline,
  cubeOutline,
  shieldCheckmarkOutline,
  star,
  checkmarkCircle,
  sparklesOutline
} from 'ionicons/icons';
import { useAppStore } from '@/stores/useAppStore';

const router = useRouter();
const appStore = useAppStore();

// Profissões rotativas para a barra de pesquisa animada
const professions = ['Eletricista', 'Diarista', 'Encanador', 'Pintor', 'Garçom', 'Freteiro'];
const currentProfessionIndex = ref(0);
let professionInterval = null;

// Deck de cards 3D
const activeTopIndex = ref(0);

// Modal de Solicitação
const isRequestModalOpen = ref(false);
const selectedCategory = ref('Eletricista');
const requestBudget = ref(120);
const requestDescription = ref('');
const showToast = ref(false);
const toastMessage = ref('');

// Categorias rápidas para barra de atalho
const quickCategories = [
  { name: 'Eletricista', icon: flashOutline, floor: 80 },
  { name: 'Diarista', icon: sparklesOutline, floor: 120 },
  { name: 'Encanador', icon: waterOutline, floor: 90 },
  { name: 'Pintor', icon: brushOutline, floor: 100 },
  { name: 'Garçom', icon: restaurantOutline, floor: 100 },
  { name: 'Fretes', icon: cubeOutline, floor: 150 }
];

// Categorias disponíveis no modal
const availableCategories = [
  { name: 'Eletricista', icon: flashOutline, floor: 80 },
  { name: 'Diarista', icon: sparklesOutline, floor: 120 },
  { name: 'Encanador', icon: waterOutline, floor: 90 },
  { name: 'Pintor', icon: brushOutline, floor: 100 },
  { name: 'Garçom', icon: restaurantOutline, floor: 100 },
  { name: 'Fretes', icon: cubeOutline, floor: 150 }
];

// Presets de orçamento
const budgetPresets = [80, 120, 180, 250];

// Categorias em destaque para os cards visuais
const featuredCategories = [
  {
    id: 'feat-1',
    title: 'Eletricista Residencial',
    description: 'Instalação de tomadas, disjuntores, chuveiros, fiação e luminárias.',
    priceFloor: 'A partir de R$ 80',
    icon: flashOutline,
    iconColor: '#D4FF24',
    iconBg: 'rgba(212, 255, 36, 0.12)',
    badge: 'Mais Pedido'
  },
  {
    id: 'feat-2',
    title: 'Diarista & Limpeza',
    description: 'Higienização de apartamentos, casas e escritórios com produtos de alta performance.',
    priceFloor: 'A partir de R$ 120',
    icon: sparklesOutline,
    iconColor: '#5d93f7',
    iconBg: 'rgba(21, 88, 201, 0.15)',
    badge: 'Alta Demanda'
  },
  {
    id: 'feat-3',
    title: 'Encanador & Reparos',
    description: 'Localização de vazamentos, desentupimentos, torneiras e encanamento.',
    priceFloor: 'A partir de R$ 90',
    icon: waterOutline,
    iconColor: '#38ef7d',
    iconBg: 'rgba(56, 239, 125, 0.12)',
    badge: 'Rápido'
  },
  {
    id: 'feat-4',
    title: 'Garçom para Eventos',
    description: 'Atendimento de convidados, coquetéis, festas de aniversário e eventos corporativos.',
    priceFloor: 'A partir de R$ 100',
    icon: restaurantOutline,
    iconColor: '#ffaa00',
    iconBg: 'rgba(255, 170, 0, 0.12)',
    badge: 'Fim de Semana'
  }
];

// 4 Passos do Fluxo
const steps = [
  {
    number: '01',
    title: 'Publique seu pedido',
    description: 'Descreva a sua necessidade, defina seu orçamento sugerido e informe o bairro.',
    icon: createOutline,
    highlight: 'Grátis e em 1 min'
  },
  {
    number: '02',
    title: 'Receba propostas',
    description: 'Profissionais avaliados da sua redondeza respondem em tempo real.',
    icon: searchOutline,
    highlight: 'Em até 15 minutos'
  },
  {
    number: '03',
    title: 'Converse & Negocie',
    description: 'Tire dúvidas e alinhe os detalhes através do chat integrado sem expor seu telefone.',
    icon: chatbubbleEllipsesOutline,
    highlight: 'Chat protegido'
  },
  {
    number: '04',
    title: 'Aprove & Conclua',
    description: 'Contato oficial liberado, serviço feito com garantia e avaliação com estrelas.',
    icon: checkmarkDoneOutline,
    highlight: 'Avaliação real'
  }
];

onMounted(() => {
  professionInterval = setInterval(() => {
    currentProfessionIndex.value = (currentProfessionIndex.value + 1) % professions.length;
  }, 2400);
});

onUnmounted(() => {
  if (professionInterval) clearInterval(professionInterval);
});

function cycleCards() {
  const total = appStore.professionals.length || 3;
  activeTopIndex.value = (activeTopIndex.value + 1) % total;
}

function getCardPosition(index) {
  const total = appStore.professionals.length || 3;
  return (index - activeTopIndex.value + total) % total;
}

function handleToggleRole() {
  appStore.toggleRole();
  const targetRoute = appStore.role === 'PROVIDER' ? '/provider' : '/client/dashboard';
  router.push(targetRoute);
}

function handlePillClick() {
  if (appStore.role === 'PROVIDER') {
    router.push('/provider');
  } else {
    router.push('/client/dashboard');
  }
}

function openRequestModal() {
  isRequestModalOpen.value = true;
}

function selectCategoryAndOpen(categoryName) {
  selectedCategory.value = categoryName;
  const match = availableCategories.find(c => c.name === categoryName);
  if (match) {
    requestBudget.value = match.floor;
  }
  isRequestModalOpen.value = true;
}

function handleSelectCategory(cat) {
  selectedCategory.value = cat.name;
  if (requestBudget.value < cat.floor) {
    requestBudget.value = cat.floor;
  }
}

const currentCategoryFloor = computed(() => {
  const match = availableCategories.find(c => c.name === selectedCategory.value);
  return match ? match.floor : 80;
});

const isRequestValid = computed(() => {
  return selectedCategory.value && requestBudget.value && requestBudget.value >= 50;
});

function submitClientRequest() {
  if (!isRequestValid.value) return;

  appStore.role = 'CLIENT';
  appStore.createRequest({
    category: selectedCategory.value,
    budget: requestBudget.value,
    description: requestDescription.value || `Solicitação de serviço para ${selectedCategory.value}`
  });

  isRequestModalOpen.value = false;
  toastMessage.value = 'Solicitação criada com sucesso! Redirecionando para seu painel...';
  showToast.value = true;

  setTimeout(() => {
    router.push('/client/dashboard');
  }, 400);
}

function goToProvider() {
  appStore.role = 'PROVIDER';
  router.push('/provider');
}

function handleResetDemo() {
  appStore.role = 'CLIENT';
  appStore.walletBalance = 20.00;
  appStore.activeRequest = null;
  appStore.chatModalOpen = false;
  toastMessage.value = 'Ambiente de demonstração reiniciado!';
  showToast.value = true;
}
</script>

<style scoped>
/* ================= FUNDO ANIMADO FUTURISTA ================= */
.animated-bg-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background-color: #030407;
}

.mesh-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(circle at 50% 30%, black 40%, transparent 85%);
  -webkit-mask-image: radial-gradient(circle at 50% 30%, black 40%, transparent 85%);
  opacity: 0.6;
}

/* Orbs de luz flutuantes */
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.22;
  will-change: transform;
  animation-duration: 18s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.orb-primary {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, #D4FF24 0%, rgba(212, 255, 36, 0.05) 70%, transparent 100%);
  top: -120px;
  right: -80px;
  animation-name: floatPrimary;
}

.orb-secondary {
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, #1558C9 0%, rgba(21, 88, 201, 0.08) 70%, transparent 100%);
  bottom: 10%;
  left: -150px;
  opacity: 0.35;
  animation-name: floatSecondary;
  animation-duration: 22s;
}

.orb-accent {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, #00d2ff 0%, rgba(0, 210, 255, 0.05) 70%, transparent 100%);
  top: 45%;
  right: 15%;
  opacity: 0.14;
  animation-name: floatAccent;
  animation-duration: 26s;
}

@keyframes floatPrimary {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-60px, 80px) scale(1.15);
  }
}

@keyframes floatSecondary {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(80px, -60px) scale(1.2);
  }
}

@keyframes floatAccent {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-70px, -70px) scale(0.9);
  }
}

/* ================= HEADER ================= */
.landing-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
}

.header-toolbar {
  --background: rgba(3, 4, 7, 0.78);
  --border-style: none;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 4px 12px;
}

.brand-title {
  padding-inline: 0;
}

.brand-logo-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.neon-brand {
  font-size: 1.85rem;
  font-weight: 800;
  color: #D4FF24;
  letter-spacing: -0.7px;
  text-shadow: 0 0 20px rgba(212, 255, 36, 0.3);
}

.brand-status-dot {
  width: 7px;
  height: 7px;
  background: #25d366;
  border-radius: 50%;
  box-shadow: 0 0 10px #25d366;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.current-role-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;
  outline: none;
}

.role-client {
  background: rgba(21, 88, 201, 0.18);
  color: #72a4ff;
  border: 1px solid rgba(21, 88, 201, 0.4);
}

.role-client:hover {
  background: rgba(21, 88, 201, 0.28);
  border-color: #1558C9;
}

.role-provider {
  background: rgba(212, 255, 36, 0.14);
  color: #D4FF24;
  border: 1px solid rgba(212, 255, 36, 0.4);
}

.role-provider:hover {
  background: rgba(212, 255, 36, 0.22);
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.pill-arrow {
  font-size: 0.85rem;
  transition: transform 0.2s ease;
}

.current-role-pill:hover .pill-arrow {
  transform: translateX(2px);
}

.header-icon-btn {
  --color: #8e8e90;
  font-size: 1.2rem;
  transition: --color 0.2s ease;
}

.header-icon-btn:hover {
  --color: #D4FF24;
}

/* ================= CONTAINER GERAL ================= */
.landing-content {
  --background: transparent;
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
}

.page-container {
  max-width: 1220px;
  margin: 0 auto;
  padding: 20px 18px 100px;
  display: flex;
  flex-direction: column;
  gap: 72px;
}

/* ================= HERO SECTION ================= */
.hero-section {
  padding-top: 10px;
}

.live-badge-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 22px;
  backdrop-filter: blur(8px);
}

.live-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #25d366;
  box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
  animation: pulseGreenDot 2s infinite;
}

@keyframes pulseGreenDot {
  0% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
  }
  70% {
    box-shadow: 0 0 0 7px rgba(37, 211, 102, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
  }
}

.live-badge-text {
  color: #cfd3dc;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.hero-text-col {
  padding-right: 0;
}

@media (min-width: 992px) {
  .hero-text-col {
    padding-right: 32px;
  }
}

.hero-title {
  font-size: clamp(2.1rem, 4.5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.15;
  color: #ffffff;
  margin: 0 0 16px 0;
  letter-spacing: -0.6px;
}

.highlight-neon {
  color: #D4FF24;
  position: relative;
  display: inline-block;
  text-shadow: 0 0 30px rgba(212, 255, 36, 0.25);
}

.hero-subtitle {
  font-size: clamp(0.98rem, 1.8vw, 1.12rem);
  line-height: 1.6;
  color: #9a9b9c;
  margin: 0 0 32px 0;
  max-width: 580px;
}

/* Barra de Pesquisa Animada / Trigger */
.search-box-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(13, 16, 23, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 8px 10px 8px 18px;
  max-width: 560px;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  backdrop-filter: blur(12px);
}

.search-box-trigger:hover {
  border-color: rgba(212, 255, 36, 0.5);
  box-shadow: 0 10px 36px rgba(212, 255, 36, 0.15);
  transform: translateY(-2px);
}

.search-icon-wrapper {
  color: #D4FF24;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
}

.search-labels {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.search-static-text {
  color: #8e8e90;
  font-size: 0.95rem;
}

.search-dynamic-profession {
  color: #ffffff;
  font-weight: 800;
  font-size: 1.05rem;
  animation: fadeUpProfession 0.35s ease;
  border-bottom: 2px solid #D4FF24;
  padding-bottom: 1px;
}

@keyframes fadeUpProfession {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1558C9;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.search-action-btn:hover {
  background: #1c68eb;
  transform: scale(1.02);
}

/* Quick Categories Scroll (Chips) */
.quick-categories-scroll {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  max-width: 580px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: none;
}

.quick-categories-scroll::-webkit-scrollbar {
  display: none;
}

.quick-label {
  color: #68686a;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.quick-chips-list {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-category-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e1e3e8;
  font-size: 0.82rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.quick-category-chip:hover {
  background: rgba(212, 255, 36, 0.12);
  border-color: rgba(212, 255, 36, 0.4);
  color: #D4FF24;
  transform: translateY(-1px);
}

.chip-icon {
  font-size: 0.95rem;
  color: #D4FF24;
}

/* Trust Metrics Strip */
.trust-metrics-strip {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  max-width: 560px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-value {
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-star {
  color: #D4FF24;
}

.metric-total {
  color: #68686a;
  font-size: 0.85rem;
  font-weight: 500;
}

.verified-val {
  color: #25d366;
}

.metric-label {
  color: #747577;
  font-size: 0.75rem;
}

.metric-divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.08);
}

/* ================= HERO 3D DECK CARDS ================= */
.hero-3d-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  margin-top: 48px;
}

@media (min-width: 992px) {
  .hero-3d-col {
    margin-top: 0;
  }
}

.showcase-card-deck {
  position: relative;
  width: 320px;
  max-width: 90vw;
  height: 380px;
  cursor: pointer;
}

.card-3d-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(13, 16, 23, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease, border-color 0.3s;
  user-select: none;
  backdrop-filter: blur(14px);
}

.card-3d-item.pos-0 {
  transform: translateY(0) scale(1);
  opacity: 1;
  z-index: 3;
  border-color: rgba(212, 255, 36, 0.4);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(212, 255, 36, 0.12);
}

.card-3d-item.pos-1 {
  transform: translateY(22px) scale(0.92);
  opacity: 0.65;
  z-index: 2;
}

.card-3d-item.pos-2 {
  transform: translateY(44px) scale(0.84);
  opacity: 0.3;
  z-index: 1;
}

.card-avatar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.avatar-with-ring {
  position: relative;
}

.card-avatar-img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #25d366;
  border: 2px solid #0d1017;
  box-shadow: 0 0 8px #25d366;
}

.card-rating-badge {
  background: rgba(212, 255, 36, 0.14);
  color: #D4FF24;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(212, 255, 36, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-name {
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0;
}

.verified-icon {
  color: #25d366;
  font-size: 1.15rem;
}

.card-desc {
  color: #9a9b9c;
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0;
}

.card-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.card-avail-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #25d366;
  font-weight: 600;
}

.pulse-green {
  width: 8px;
  height: 8px;
  background: #25d366;
  border-radius: 50%;
  box-shadow: 0 0 8px #25d366;
}

.card-action-cue {
  color: #D4FF24;
  font-size: 0.82rem;
  font-weight: 700;
}

.deck-dots {
  display: flex;
  gap: 8px;
  margin-top: 36px;
}

.deck-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.25s ease;
}

.deck-dot.active {
  width: 24px;
  border-radius: 999px;
  background: #D4FF24;
  box-shadow: 0 0 10px rgba(212, 255, 36, 0.5);
}

.tap-hint {
  color: #68686a;
  font-size: 0.8rem;
  margin-top: 8px;
}

/* ================= CATEGORIAS POPULARES ================= */
.popular-categories-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-heading {
  text-align: center;
  max-width: 650px;
  margin: 0 auto;
}

.steps-kicker {
  color: #5d93f7;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.section-title {
  color: #ffffff;
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  font-weight: 800;
  margin: 8px 0;
  letter-spacing: -0.4px;
}

.section-desc {
  color: #8e8e90;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 600px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.category-feature-card {
  background: rgba(13, 16, 23, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  backdrop-filter: blur(10px);
}

.category-feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 255, 36, 0.35);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 255, 36, 0.08);
}

.cat-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cat-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.cat-badge-trend {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cfd3dc;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  text-transform: uppercase;
}

.cat-card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cat-card-title {
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

.cat-card-desc {
  color: #8e8e90;
  font-size: 0.85rem;
  line-height: 1.45;
  margin: 0;
}

.cat-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.cat-price-info {
  display: flex;
  flex-direction: column;
}

.price-prefix {
  font-size: 0.72rem;
  color: #68686a;
}

.price-value {
  color: #D4FF24;
  font-weight: 700;
  font-size: 0.88rem;
}

.cat-solicitar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(21, 88, 201, 0.2);
  border: 1px solid rgba(21, 88, 201, 0.4);
  color: #72a4ff;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-feature-card:hover .cat-solicitar-btn {
  background: #1558C9;
  color: #ffffff;
}

/* ================= STEPS SECTION (COMO FUNCIONA) ================= */
.steps-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.steps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  position: relative;
}

@media (min-width: 768px) {
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .steps-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.step-card-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.step-card {
  width: 100%;
  height: 100%;
  background: rgba(13, 16, 23, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  backdrop-filter: blur(10px);
  transition: border-color 0.25s, transform 0.25s;
}

.step-card:hover {
  border-color: rgba(21, 88, 201, 0.5);
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-badge {
  font-size: 0.9rem;
  font-weight: 800;
  color: #D4FF24;
  background: rgba(212, 255, 36, 0.1);
  border: 1px solid rgba(212, 255, 36, 0.25);
  padding: 4px 12px;
  border-radius: 8px;
}

.step-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(21, 88, 201, 0.15);
  border: 1px solid rgba(21, 88, 201, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5d93f7;
  font-size: 1.35rem;
}

.step-title {
  color: #ffffff;
  font-size: 1.18rem;
  font-weight: 700;
  margin: 0;
}

.step-description {
  color: #9a9b9c;
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0;
}

.step-highlight-tag {
  color: #5d93f7;
  font-size: 0.78rem;
  font-weight: 600;
  background: rgba(21, 88, 201, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  align-self: flex-start;
  margin-top: auto;
}

.step-connector {
  display: none;
}

@media (min-width: 1024px) {
  .step-connector {
    display: flex;
    align-items: center;
    position: absolute;
    right: -14px;
    z-index: 2;
    color: #1558C9;
    font-size: 1.3rem;
  }
}

/* ================= BANNER PRESTADORES ================= */
.provider-banner-section {
  width: 100%;
}

.provider-banner-card {
  background: linear-gradient(135deg, rgba(21, 88, 201, 0.18) 0%, rgba(13, 16, 23, 0.95) 100%);
  border: 1px solid rgba(21, 88, 201, 0.35);
  border-radius: 24px;
  padding: clamp(24px, 5vw, 44px);
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
}

.provider-banner-card::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(212, 255, 36, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 680px;
}

.banner-tag {
  display: inline-block;
  color: #D4FF24;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 12px;
}

.banner-title {
  color: #ffffff;
  font-size: clamp(1.5rem, 3.2vw, 2.3rem);
  font-weight: 800;
  line-height: 1.25;
  margin: 0 0 14px 0;
}

.banner-desc {
  color: #a7a7a8;
  font-size: 0.98rem;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.banner-perks {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.perk-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #cfd3dc;
  font-size: 0.85rem;
  font-weight: 600;
}

.perk-item ion-icon {
  color: #25d366;
  font-size: 1.1rem;
}

.banner-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #D4FF24;
  color: #030407;
  border: none;
  padding: 14px 26px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(212, 255, 36, 0.3);
  transition: all 0.25s ease;
}

.banner-cta-btn:hover {
  background: #e1ff54;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 255, 36, 0.45);
}

/* ================= FOOTER ================= */
.landing-footer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-top {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-tagline {
  color: #68686a;
  font-size: 0.88rem;
  margin: 0;
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: #4e4f51;
  font-size: 0.82rem;
}

.footer-mode-indicator {
  color: #72a4ff;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.footer-mode-indicator:hover {
  color: #D4FF24;
}

/* ================= BOTÃO MÁGICO (ION-FAB) ================= */
.magic-fab {
  margin-bottom: 14px;
  margin-right: 14px;
}

.magic-fab-btn {
  --background: #D4FF24;
  --color: #030407;
  --box-shadow: 0 6px 24px rgba(212, 255, 36, 0.45);
  font-size: 1.4rem;
  transition: transform 0.2s;
}

.magic-fab-btn:hover {
  transform: scale(1.05);
}

/* ================= MODAL BOTTOM SHEET MOBILE-FIRST ================= */
.request-modal-sheet {
  --background: #0b0d14;
}

.modal-content {
  --background: #0b0d14;
  --color: #ffffff;
}

.modal-handle-bar {
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 auto 16px;
}

.modal-inner-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-title {
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
}

.modal-subtitle {
  color: #8e8e90;
  font-size: 0.85rem;
  margin: 4px 0 0 0;
}

.modal-close-btn {
  --color: #8e8e90;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: #cfd3dc;
  font-size: 0.85rem;
  font-weight: 700;
}

.label-with-hint {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint-text {
  color: #D4FF24;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Selector de Categorias em Pills para Toque Mobile */
.category-pills-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

@media (max-width: 400px) {
  .category-pills-selector {
    grid-template-columns: repeat(2, 1fr);
  }
}

.cat-select-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
  background: #141722;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #cfd3dc;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cat-select-pill .pill-icon {
  font-size: 1.25rem;
}

.cat-select-pill.active {
  background: rgba(212, 255, 36, 0.14);
  border-color: #D4FF24;
  color: #D4FF24;
}

/* Orçamentos Presets */
.budget-presets {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.budget-preset-chip {
  flex: 1;
  padding: 10px;
  background: #141722;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.budget-preset-chip.active {
  background: rgba(21, 88, 201, 0.3);
  border-color: #1558C9;
  color: #72a4ff;
}

.custom-budget-input-wrapper {
  display: flex;
  align-items: center;
  background: #141722;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 14px;
  gap: 6px;
}

.currency-symbol {
  color: #D4FF24;
  font-weight: 800;
  font-size: 1rem;
}

.custom-number-input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
}

.custom-textarea {
  background: #141722;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 14px;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;
}

.custom-textarea:focus,
.custom-budget-input-wrapper:focus-within {
  border-color: #1558C9;
}

.modal-submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1558C9;
  color: #ffffff;
  border: none;
  padding: 15px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 18px rgba(21, 88, 201, 0.4);
}

.modal-submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.modal-submit-btn:not(:disabled):hover {
  background: #1c68eb;
  transform: translateY(-1px);
}
</style>
