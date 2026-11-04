<template>
  <ion-page class="client-dashboard-page">
    <!-- Header Minimalista (+ SERVE) -->
    <ion-header class="ion-no-border main-header">
      <ion-toolbar class="header-toolbar">
        <div class="header-inner">
          <div class="brand-logo" @click="goToHome">
            <span class="neon-plus">+</span>
            <span class="brand-name">SERVE</span>
          </div>

          <!-- Links de Navegação no Desktop -->
          <nav class="desktop-nav ion-hide-md-down">
            <a href="/" class="nav-item" @click.prevent="goToHome">
              <ion-icon :icon="homeOutline"></ion-icon>
              <span>Início</span>
            </a>
            <a href="#" class="nav-item" @click.prevent="openOrdersModal">
              <ion-icon :icon="clipboardOutline"></ion-icon>
              <span>Meus pedidos</span>
              <span class="orders-count-dot">{{ store.ordersList.length }}</span>
            </a>
            <a href="#" class="nav-item icon-only" title="Mensagens" @click.prevent="openChatModalDirect">
              <ion-icon :icon="chatbubbleOutline"></ion-icon>
            </a>
            <a href="#" class="nav-item profile-dropdown" @click.prevent="openProfileMenuModal">
              <ion-icon :icon="personCircleOutline" class="profile-icon"></ion-icon>
              <span>Entrar / Perfil</span>
              <ion-icon :icon="chevronDownOutline" class="dropdown-chevron"></ion-icon>
            </a>
          </nav>

          <!-- Ações Rápidas Mobile (Navegação principal fica no BottomNav global) -->
          <div class="mobile-nav-actions ion-hide-md-up">
            <button class="mobile-icon-btn" aria-label="Mensagens" title="Abrir Chat" @click="openChatModalDirect">
              <ion-icon :icon="chatbubbleOutline"></ion-icon>
            </button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="dashboard-content">
      <div class="page-wrapper">

        <!-- SELETOR DE CATEGORIAS MINIMALISTA (MOBILE-FIRST) -->
        <div class="category-selection-wrapper">
          <div class="categories-scroll-bar">
            <button
              v-for="cat in store.categoriesList"
              :key="cat.id"
              class="category-pill-btn"
              :class="{ active: selectedCategoryName === cat.name }"
              @click="setCategory(cat.name)"
            >
              <ion-icon :icon="getCategoryIcon(cat.icon)" class="cat-pill-icon"></ion-icon>
              <span class="cat-pill-text">{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <!-- GRID PRINCIPAL: HERO + FORMULÁRIO (7) & DESTAQUES (5) -->
        <ion-grid class="ion-no-padding main-grid">
          <ion-row class="hero-form-row">
            
            <!-- COLUNA ESQUERDA (Mobile: 100% | Desktop: 7/12) -->
            <ion-col size="12" size-lg="7" class="left-col">
              
              <!-- Título & Subtítulo Limpos e Minimalistas (Sem botão "alternar") -->
              <div class="hero-header-box">
                <h1 class="hero-headline">
                  Encontre o <span class="neon-highlight">{{ activeConfig.noun }} ideal</span> {{ activeConfig.headlineSuffix }}.
                </h1>
                <p class="hero-subtext">
                  {{ activeConfig.subtitle }}
                </p>
              </div>

              <!-- CARD DO FORMULÁRIO MINIMALISTA -->
              <div id="form-event-card" class="form-card-container">
                
                <!-- BANNER QUANDO HÁ UM PROFISSIONAL SELECIONADO -->
                <div v-if="store.selectedProfessional" class="selected-pro-card-banner">
                  <div class="selected-pro-left">
                    <img :src="store.selectedProfessional.avatar" :alt="store.selectedProfessional.nome" class="selected-pro-img" />
                    <div class="selected-pro-meta">
                      <span class="selected-headline-tag">CONTRATAÇÃO DIRETA</span>
                      <h3 class="selected-name-title">{{ store.selectedProfessional.nome }}</h3>
                      <p class="selected-spec-text">{{ store.selectedProfessional.especialidade }} • ★ {{ store.selectedProfessional.nota }}</p>
                    </div>
                  </div>
                  <button class="clear-selected-btn" @click="store.clearSelectedProfessional">
                    Trocar
                  </button>
                </div>

                <div class="form-fields-grid">
                  
                  <!-- 1. O QUE VOCÊ PRECISA? -->
                  <div class="form-section-block">
                    <label class="field-label-clean">{{ activeConfig.serviceTypeLabel }}</label>
                    <div class="quick-chips-grid">
                      <button
                        v-for="opt in activeConfig.serviceTypes"
                        :key="opt"
                        type="button"
                        class="choice-chip-btn"
                        :class="{ active: store.eventForm.tipoEvento === opt }"
                        @click="selectServiceType(opt)"
                      >
                        {{ opt }}
                      </button>
                    </div>
                  </div>

                  <!-- 2. QUANDO PRECISA? -->
                  <div class="form-section-block">
                    <label class="field-label-clean">Quando você precisa?</label>
                    
                    <div class="quick-chips-grid dates-grid">
                      <button
                        v-for="dateOpt in quickDateOptions"
                        :key="dateOpt.id"
                        type="button"
                        class="choice-chip-btn date-chip"
                        :class="{ active: activeDateMode === dateOpt.id }"
                        @click="selectDateMode(dateOpt.id)"
                      >
                        <span>{{ dateOpt.icon }}</span>
                        <span>{{ dateOpt.label }}</span>
                      </button>
                    </div>

                    <!-- Horários Rápidos (quando Hoje ou Amanhã está ativo) -->
                    <div v-if="activeDateMode !== 'custom'" class="time-pills-row">
                      <span class="time-pill-label">Horário:</span>
                      <button
                        v-for="slot in ['09:00', '14:00', '18:00', '20:00']"
                        :key="slot"
                        type="button"
                        class="time-slot-pill"
                        :class="{ active: store.eventForm.horarioInicio === slot }"
                        @click="store.eventForm.horarioInicio = slot"
                      >
                        {{ slot }}
                      </button>
                    </div>

                    <!-- Seletores de Data/Hora (apenas quando "Escolher Data" é selecionado) -->
                    <div v-else class="datetime-compact-row">
                      <div class="input-block">
                        <label class="field-sublabel">Data</label>
                        <div class="input-with-icon">
                          <ion-icon :icon="calendarOutline" class="inner-icon"></ion-icon>
                          <input type="date" v-model="store.eventForm.data" class="clean-input" />
                        </div>
                      </div>

                      <div class="input-block">
                        <label class="field-sublabel">Início</label>
                        <div class="input-with-icon">
                          <ion-icon :icon="timeOutline" class="inner-icon"></ion-icon>
                          <input type="time" v-model="store.eventForm.horarioInicio" class="clean-input" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 3. ESCOPO / PORTE + OBSERVAÇÃO OPCIONAL -->
                  <div class="form-section-block">
                    <label class="field-label-clean">{{ activeConfig.scopeLabel }}</label>
                    
                    <div class="quick-chips-grid scopes-grid">
                      <button
                        v-for="sc in activeConfig.scopes"
                        :key="sc"
                        type="button"
                        class="choice-chip-btn"
                        :class="{ active: store.eventForm.qtdProfissionais === sc }"
                        @click="store.eventForm.qtdProfissionais = sc"
                      >
                        {{ sc }}
                      </button>
                    </div>

                    <div class="input-with-icon ion-margin-top">
                      <ion-icon :icon="locationOutline" class="inner-icon"></ion-icon>
                      <input
                        type="text"
                        v-model="store.eventForm.descricao"
                        :placeholder="activeConfig.detailsPlaceholder"
                        class="clean-input"
                      />
                    </div>
                  </div>

                  <!-- 4. VALOR OFERECIDO -->
                  <div class="form-section-block value-section">
                    <div class="value-header-line">
                      <label class="field-label-clean">Valor oferecido (R$)</label>
                      <span class="value-hint">Sugestão editável</span>
                    </div>

                    <div class="value-stepper-container">
                      <button type="button" class="stepper-btn" @click="adjustPrice(-10)">-</button>
                      <div class="value-display-box">
                        <span class="currency-tag">R$</span>
                        <input
                          type="number"
                          v-model.number="store.eventForm.valorOferecido"
                          class="clean-input-price"
                        />
                      </div>
                      <button type="button" class="stepper-btn plus" @click="adjustPrice(+10)">+</button>
                    </div>

                    <div class="price-presets-row">
                      <button
                        v-for="p in activeConfig.prices"
                        :key="p"
                        type="button"
                        class="price-preset-pill"
                        :class="{ active: store.eventForm.valorOferecido === p }"
                        @click="store.eventForm.valorOferecido = p"
                      >
                        R$ {{ p }}
                      </button>
                    </div>
                  </div>

                </div>

                <!-- Botão de Ação Principal -->
                <button class="primary-search-button" @click="handleConfirmOrder">
                  <span>{{ actionButtonText }}</span>
                  <ion-icon :icon="arrowForwardOutline" class="btn-arrow"></ion-icon>
                </button>

                <!-- Rodapé de Confiança Compacto -->
                <div class="trust-footer-row">
                  <ion-icon :icon="shieldCheckmarkOutline" class="trust-shield-icon"></ion-icon>
                  <span class="trust-items">Profissionais verificados • Avaliações reais • Pagamento protegido</span>
                </div>

              </div>
            </ion-col>

            <!-- COLUNA DIREITA: DESTAQUES DA SEMANA (Mobile: 100% | Desktop: 5/12) -->
            <ion-col size="12" size-lg="5" class="right-col">
              
              <!-- CARD 1: BANNER RECOMENDADO COMPACTO (Oculto em telas muito pequenas se já há Destaques, ou exibido de forma enxuta) -->
              <div class="neon-service-card" @click="selectAndScrollToForm(currentCarouselPro)">
                <div class="service-floating-badge">
                  <img :src="currentCarouselPro.avatar" :alt="currentCarouselPro.nome" class="badge-mini-avatar" />
                  <div class="badge-mini-info">
                    <span class="badge-mini-tag">DISPONÍVEL AGORA • {{ selectedCategoryName.toUpperCase() }}</span>
                    <strong class="badge-mini-name">{{ currentCarouselPro.nome }} (★ {{ currentCarouselPro.nota }})</strong>
                  </div>
                  <button class="badge-mini-action" @click.stop="selectAndScrollToForm(currentCarouselPro)">
                    <span>Selecionar</span>
                  </button>
                </div>
              </div>

              <!-- CARD 2: DESTAQUES DA SEMANA -->
              <div class="highlights-card">
                <div class="highlights-header">
                  <div class="highlights-title-row">
                    <ion-icon :icon="starOutline" class="highlight-star-icon"></ion-icon>
                    <h2 class="highlights-title">Destaques da semana</h2>
                  </div>
                  <p class="highlights-subtitle">Mais contratados em {{ activeConfig.plural.toLowerCase() }}</p>
                </div>

                <div class="highlights-list">
                  <div
                    v-for="(pro, idx) in weeklyHighlights"
                    :key="pro.id"
                    class="highlight-row-item"
                    @click="openProfileModal(pro)"
                  >
                    <div class="rank-ribbon" :class="`rank-${idx + 1}`">
                      <span class="ribbon-text">{{ idx + 1 }}º</span>
                    </div>

                    <img :src="pro.avatar" :alt="pro.nome" class="highlight-avatar" />

                    <div class="highlight-details">
                      <div class="name-verified-row">
                        <span class="pro-name">{{ pro.nome }}</span>
                        <ion-icon :icon="checkmarkCircle" class="verified-badge"></ion-icon>
                      </div>
                      <div class="pro-stats-row">
                        <span class="star-rating">★ {{ pro.nota }}</span>
                        <span class="services-count">{{ pro.servicos }} serviços</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button class="view-all-highlights-link" @click="scrollToAvailable">
                  <span>Ver todos os {{ activeConfig.plural.toLowerCase() }}</span>
                  <ion-icon :icon="arrowForwardOutline"></ion-icon>
                </button>
              </div>
            </ion-col>

          </ion-row>

          <!-- SEÇÃO: PROFISSIONAIS DISPONÍVEIS -->
          <ion-row id="available-section" class="available-section-row">
            <ion-col size="12">
              <div class="section-heading-row">
                <ion-icon :icon="personOutline" class="section-icon-neon"></ion-icon>
                <h2 class="available-section-title">{{ activeConfig.plural }} disponíveis para você</h2>
              </div>

              <div class="available-pros-stack">
                <div
                  v-for="pro in displayedAvailablePros"
                  :key="pro.id"
                  class="pro-profile-card"
                >
                  <div class="card-left-block" @click="openProfileModal(pro)">
                    <div class="avatar-status-wrap">
                      <img :src="pro.avatar" :alt="pro.nome" class="pro-main-avatar" />
                      <span class="online-dot"></span>
                    </div>

                    <div class="pro-core-info">
                      <div class="pro-name-verified">
                        <h3 class="pro-full-name">{{ pro.nome }}</h3>
                        <ion-icon :icon="checkmarkCircle" class="verified-badge"></ion-icon>
                      </div>

                      <div class="pro-stats-strip">
                        <span class="rating-val">★ {{ pro.nota }}</span>
                        <span class="dot-sep">•</span>
                        <span class="jobs-val">{{ pro.servicos }} serviços</span>
                      </div>

                      <div class="pro-pills-row">
                        <span v-for="tag in pro.tags" :key="tag" class="pro-pill">{{ tag }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="card-meta-block">
                    <div class="meta-line">
                      <ion-icon :icon="calendarOutline" class="meta-icon"></ion-icon>
                      <span>{{ pro.exp }} de experiência</span>
                    </div>
                    <div class="meta-line">
                      <ion-icon :icon="locationOutline" class="meta-icon"></ion-icon>
                      <span>{{ pro.local }}</span>
                    </div>
                  </div>

                  <div class="card-action-block">
                    <button class="view-profile-btn" @click="openProfileModal(pro)">
                      <span>Ver perfil</span>
                      <ion-icon :icon="arrowForwardOutline"></ion-icon>
                    </button>
                  </div>
                </div>
              </div>

              <div class="load-more-container" v-if="filteredAvailable.length > 3">
                <button class="load-more-btn" @click="toggleShowMorePros">
                  <span>{{ showAllPros ? 'Recolher lista' : `Ver mais ${activeConfig.plural.toLowerCase()} disponíveis` }}</span>
                  <ion-icon :icon="showAllPros ? chevronUpOutline : chevronDownOutline"></ion-icon>
                </button>
              </div>
            </ion-col>
          </ion-row>

          <!-- CARD: PRECISA DE AJUDA? / SUPORTE -->
          <ion-row class="support-banner-row">
            <ion-col size="12">
              <div class="support-banner-box">
                <div class="support-left">
                  <div class="headphone-icon-circle">
                    <ion-icon :icon="headsetOutline"></ion-icon>
                  </div>
                  <div class="support-text-meta">
                    <h3 class="support-title">Precisa de ajuda?</h3>
                    <p class="support-subtitle">Nossa equipe está pronta para te atender.</p>
                  </div>
                </div>

                <div class="support-right">
                  <button class="support-cta-btn" @click="isSupportModalOpen = true">
                    <span>Falar com suporte</span>
                    <ion-icon :icon="arrowForwardOutline"></ion-icon>
                  </button>
                </div>
              </div>
            </ion-col>
          </ion-row>

        </ion-grid>
      </div>

      <!-- ================= MODAL: PERFIL DO PROFISSIONAL ================= -->
      <ion-modal
        :is-open="isProfileModalOpen"
        :breakpoints="[0, 0.8, 1]"
        :initial-breakpoint="0.8"
        @didDismiss="isProfileModalOpen = false"
        class="custom-modal-sheet"
      >
        <ion-content v-if="activeModalPro" class="modal-sheet-inner ion-padding">
          <div class="modal-header-row">
            <div>
              <span class="pro-modal-category">{{ activeModalPro.categoria }}</span>
              <h2 class="sheet-title">{{ activeModalPro.nome }}</h2>
            </div>
            <button class="btn-close-modal" @click="isProfileModalOpen = false">✕</button>
          </div>

          <div class="pro-modal-profile-header">
            <img :src="activeModalPro.avatar" :alt="activeModalPro.nome" class="pro-modal-avatar-big" />
            <div class="pro-modal-stats-summary">
              <div class="stat-pill-box">
                <span class="stat-val">★ {{ activeModalPro.nota }}</span>
                <span class="stat-lbl">Avaliação</span>
              </div>
              <div class="stat-pill-box">
                <span class="stat-val">{{ activeModalPro.servicos }}</span>
                <span class="stat-lbl">Serviços</span>
              </div>
              <div class="stat-pill-box">
                <span class="stat-val">R$ {{ activeModalPro.valorBase }}</span>
                <span class="stat-lbl">Base</span>
              </div>
            </div>
          </div>

          <div class="pro-modal-bio-section">
            <h4 class="modal-section-title">Sobre o Profissional</h4>
            <p class="pro-bio-text">{{ activeModalPro.bio || 'Profissional qualificado com documentação e antecedentes checados.' }}</p>
          </div>

          <div v-if="activeModalPro.badges && activeModalPro.badges.length" class="pro-modal-badges-section">
            <h4 class="modal-section-title">Verificações</h4>
            <div class="badges-row-flex">
              <span v-for="b in activeModalPro.badges" :key="b" class="badge-modal-pill">
                ✓ {{ b }}
              </span>
            </div>
          </div>

          <div v-if="activeModalPro.reviews && activeModalPro.reviews.length" class="pro-modal-reviews-section">
            <h4 class="modal-section-title">Avaliações Recentes</h4>
            <div v-for="(rev, i) in activeModalPro.reviews" :key="i" class="review-modal-box">
              <div class="review-top-meta">
                <strong>{{ rev.author }}</strong>
                <span class="review-stars">★★★★★</span>
              </div>
              <p class="review-comment-p">"{{ rev.comment }}"</p>
            </div>
          </div>

          <div class="modal-pro-actions-footer">
            <button class="hire-now-modal-btn" @click="hireFromModal(activeModalPro)">
              <span>CONTRATAR {{ activeModalPro.nome.toUpperCase() }}</span>
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
            </button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- ================= MODAL 3: CONFIRMAÇÃO DO PEDIDO ================= -->
      <ion-modal
        :is-open="isOrderSuccessModalOpen"
        :breakpoints="[0, 0.72, 0.9]"
        :initial-breakpoint="0.72"
        @didDismiss="isOrderSuccessModalOpen = false"
        class="custom-modal-sheet"
      >
        <ion-content v-if="createdOrderData" class="modal-sheet-inner ion-padding text-center">
          <div class="success-check-circle">
            <ion-icon :icon="checkmarkCircle"></ion-icon>
          </div>
          <h2 class="sheet-title">Solicitação Publicada!</h2>
          <p class="sheet-subtitle">{{ activeConfig.plural }} qualificados da sua região já receberam seu chamado.</p>

          <div class="order-summary-box">
            <div class="summary-line">
              <span class="sum-label">Serviço:</span>
              <strong class="sum-val">{{ createdOrderData.categoria }} • {{ createdOrderData.tipoEvento }}</strong>
            </div>
            <div class="summary-line">
              <span class="sum-label">Data e Horário:</span>
              <span class="sum-val">{{ createdOrderData.data }} às {{ createdOrderData.horarioInicio }}</span>
            </div>
            <div class="summary-line">
              <span class="sum-label">Escopo:</span>
              <span class="sum-val">{{ createdOrderData.qtdProfissionais }}</span>
            </div>
            <div class="summary-line">
              <span class="sum-label">Valor Oferecido:</span>
              <strong class="sum-val neon-color">R$ {{ createdOrderData.valorOferecido }},00</strong>
            </div>
          </div>

          <div class="modal-buttons-stack">
            <button class="btn-primary-modal" @click="openChatFromSuccess">
              <ion-icon :icon="chatbubbleOutline"></ion-icon>
              <span>Abrir Chat com Profissional</span>
            </button>
            <button class="btn-secondary-modal" @click="viewOrdersFromSuccess">
              <span>Acompanhar em Meus Pedidos</span>
            </button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- ================= MODAL 4: SUPORTE 24H ================= -->
      <ion-modal
        :is-open="isSupportModalOpen"
        :breakpoints="[0, 0.65, 0.85]"
        :initial-breakpoint="0.65"
        @didDismiss="isSupportModalOpen = false"
        class="custom-modal-sheet"
      >
        <ion-content class="modal-sheet-inner ion-padding">
          <div class="modal-header-row">
            <div>
              <h2 class="sheet-title">Suporte +SERVE 24h</h2>
              <p class="sheet-subtitle">Atendimento imediato para clientes e profissionais</p>
            </div>
            <button class="btn-close-modal" @click="isSupportModalOpen = false">✕</button>
          </div>

          <div class="support-options-list">
            <div class="support-option-item" @click="openWhatsAppSupport">
              <div class="support-opt-icon whatsapp">
                <ion-icon :icon="chatbubbleOutline"></ion-icon>
              </div>
              <div class="support-opt-info">
                <h4>Chat ao Vivo de Suporte</h4>
                <p>Converse diretamente com nossa central de ajuda.</p>
              </div>
              <ion-icon :icon="arrowForwardOutline" class="opt-arrow"></ion-icon>
            </div>

            <div class="support-option-item" @click="reportIssue">
              <div class="support-opt-icon shield">
                <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
              </div>
              <div class="support-opt-info">
                <h4>Garantia e Reembolso</h4>
                <p>Seu pagamento só é liberado após a conclusão.</p>
              </div>
              <ion-icon :icon="arrowForwardOutline" class="opt-arrow"></ion-icon>
            </div>
          </div>
        </ion-content>
      </ion-modal>

      <!-- Toast de feedback -->
      <ion-toast
        :is-open="showToast"
        :message="toastMsg"
        :duration="2300"
        position="bottom"
        @didDismiss="showToast = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonModal,
  IonToast
} from '@ionic/vue';
import {
  homeOutline,
  clipboardOutline,
  chatbubbleOutline,
  personCircleOutline,
  chevronDownOutline,
  chevronUpOutline,
  calendarOutline,
  timeOutline,
  personOutline,
  arrowForwardOutline,
  shieldCheckmarkOutline,
  starOutline,
  checkmarkCircle,
  locationOutline,
  headsetOutline,
  flashOutline,
  sparklesOutline,
  waterOutline,
  constructOutline,
  wineOutline
} from 'ionicons/icons';
import { useAppStore, CATEGORY_CONFIGS } from '@/stores/useAppStore';

const router = useRouter();
const route = useRoute();
const store = useAppStore();

const showToast = ref(false);
const toastMsg = ref('');

// Modais
const isOrdersModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isOrderSuccessModalOpen = ref(false);
const isSupportModalOpen = ref(false);
const isProfileMenuModalOpen = ref(false);
const activeModalPro = ref(null);
const createdOrderData = ref(null);

// Estado da Categoria e Filtros
const selectedCategoryName = ref('Garçom');
const showAllPros = ref(false);
const activeDateMode = ref('today');

// Fonte única de configuração importada da Store
const activeConfig = computed(() => {
  return CATEGORY_CONFIGS[selectedCategoryName.value] || CATEGORY_CONFIGS.Garçom;
});

const quickDateOptions = [
  { id: 'today', label: 'Hoje', icon: '⚡' },
  { id: 'tomorrow', label: 'Amanhã', icon: '📅' },
  { id: 'custom', label: 'Outra Data', icon: '🗓️' }
];

function getCategoryIcon(iconKey) {
  switch (iconKey) {
    case 'flash': return flashOutline;
    case 'sparkles': return sparklesOutline;
    case 'water': return waterOutline;
    case 'construct': return constructOutline;
    default: return wineOutline;
  }
}

function setCategory(catName) {
  selectedCategoryName.value = catName;
  store.eventForm.categoria = catName;

  const conf = CATEGORY_CONFIGS[catName] || CATEGORY_CONFIGS.Garçom;
  store.eventForm.tipoEvento = conf.serviceTypes[0];
  store.eventForm.qtdProfissionais = conf.scopes[1] || conf.scopes[0];
  store.eventForm.valorOferecido = conf.defaultPrice;
  store.eventForm.descricao = '';

  if (store.selectedProfessional && store.selectedProfessional.categoria !== catName) {
    store.clearSelectedProfessional();
  }
}

function selectServiceType(opt) {
  store.eventForm.tipoEvento = opt;
}

function selectDateMode(modeId) {
  activeDateMode.value = modeId;
  const now = new Date();
  if (modeId === 'today') {
    store.eventForm.data = now.toISOString().split('T')[0];
    store.eventForm.horarioInicio = '18:00';
  } else if (modeId === 'tomorrow') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    store.eventForm.data = tomorrow.toISOString().split('T')[0];
    store.eventForm.horarioInicio = '14:00';
  }
}

function adjustPrice(delta) {
  const current = Number(store.eventForm.valorOferecido) || 100;
  store.eventForm.valorOferecido = Math.max(50, current + delta);
}

const actionButtonText = computed(() => {
  if (store.selectedProfessional) {
    return `CONTRATAR ${store.selectedProfessional.nome.toUpperCase()}`;
  }
  return `BUSCAR ${activeConfig.value.plural.toUpperCase()} DISPONÍVEIS`;
});

const weeklyHighlights = computed(() => {
  const matches = store.highlightedProfessionals.filter(p => p.categoria === selectedCategoryName.value);
  return matches.length ? matches.slice(0, 3) : store.highlightedProfessionals.slice(0, 3);
});

const filteredAvailable = computed(() => {
  const matches = store.availableProfessionals.filter(p => p.categoria === selectedCategoryName.value);
  return matches.length ? matches : store.availableProfessionals;
});

const displayedAvailablePros = computed(() => {
  return showAllPros.value ? filteredAvailable.value : filteredAvailable.value.slice(0, 3);
});

const currentCarouselPro = computed(() => {
  return weeklyHighlights.value[0] || store.highlightedProfessionals[0];
});

function toggleShowMorePros() {
  showAllPros.value = !showAllPros.value;
}

onMounted(() => {
  selectDateMode('today');

  if (route.query.category) {
    const cat = String(route.query.category);
    const match = store.categoriesList.find(c => c.name.toLowerCase() === cat.toLowerCase());
    if (match) setCategory(match.name);
  }

  if (route.query.proId) {
    const all = [...store.highlightedProfessionals, ...store.availableProfessionals];
    const matchPro = all.find(p => String(p.id) === String(route.query.proId));
    if (matchPro) {
      if (matchPro.categoria) setCategory(matchPro.categoria);
      store.selectProfessional(matchPro);
      toastMsg.value = `${matchPro.nome} selecionado!`;
      showToast.value = true;
    }
  }
});

// Navegação & Ações
function goToHome() {
  router.push('/home');
}

function openOrdersModal() {
  store.profileMenuModalOpen = false;
  store.ordersModalOpen = true;
}

function openProfileMenuModal() {
  store.ordersModalOpen = false;
  store.profileMenuModalOpen = true;
}

function openChatModalDirect() {
  const firstOrder = store.ordersList[0];
  if (firstOrder) {
    store.openChatWithPro(firstOrder.professional, firstOrder);
  } else {
    store.openChatWithPro(weeklyHighlights.value[0]);
  }
}

function openProfileModal(pro) {
  activeModalPro.value = pro;
  isProfileModalOpen.value = true;
}

function selectAndScrollToForm(pro) {
  if (pro.categoria && pro.categoria !== selectedCategoryName.value) {
    setCategory(pro.categoria);
  }
  store.selectProfessional(pro);
  toastMsg.value = `${pro.nome} selecionado! Revise os dados e confirme.`;
  showToast.value = true;
  const el = document.getElementById('form-event-card');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hireFromModal(pro) {
  isProfileModalOpen.value = false;
  selectAndScrollToForm(pro);
}

function handleConfirmOrder() {
  const newOrd = store.createNewOrder(store.selectedProfessional);
  createdOrderData.value = {
    ...store.eventForm,
    orderObj: newOrd
  };
  isOrderSuccessModalOpen.value = true;
}

function openChatFromSuccess() {
  isOrderSuccessModalOpen.value = false;
  if (createdOrderData.value && createdOrderData.value.orderObj) {
    const ord = createdOrderData.value.orderObj;
    store.openChatWithPro(ord.professional, ord);
  }
}

function viewOrdersFromSuccess() {
  isOrderSuccessModalOpen.value = false;
  store.ordersModalOpen = true;
}

function scrollToAvailable() {
  showAllPros.value = true;
  const el = document.getElementById('available-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function openWhatsAppSupport() {
  isSupportModalOpen.value = false;
  store.openChatWithPro({
    id: 999,
    nome: 'Suporte +SERVE',
    name: 'Suporte +SERVE',
    categoria: 'Atendimento 24h',
    avatar: 'https://i.pravatar.cc/150?img=47',
    nota: '5,0'
  });
}

function reportIssue() {
  isSupportModalOpen.value = false;
  toastMsg.value = 'Pagamento protegido pela Garantia +SERVE.';
  showToast.value = true;
}
</script>

<style scoped>
.client-dashboard-page {
  --ion-background-color: #030407;
  --ion-text-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ================= HEADER ================= */
.main-header {
  background: #030407;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-toolbar {
  --background: #030407;
  --min-height: 60px;
  --padding-start: 0;
  --padding-end: 0;
}

.header-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 16px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 3px;
  cursor: pointer;
}

.neon-plus {
  color: #D4FF24;
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
}

.brand-name {
  color: #ffffff;
  font-size: 21px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.6px;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #d1d5db;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
}

.nav-item:hover {
  color: #D4FF24;
}

.orders-count-dot {
  background: #D4FF24;
  color: #050800;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 99px;
}

.orders-count-dot.mobile {
  position: absolute;
  top: -3px;
  right: -3px;
  padding: 1px 5px;
}

.mobile-nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-icon-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  cursor: pointer;
}

/* ================= CONTEÚDO ================= */
.dashboard-content {
  --background: #030407;
}

.page-wrapper {
  max-width: 1180px;
  margin: 0 auto;
  padding: 12px 16px 96px;
}

/* ================= CATEGORIAS MINIMALISTAS ================= */
.category-selection-wrapper {
  margin-bottom: 18px;
}

.categories-scroll-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.categories-scroll-bar::-webkit-scrollbar {
  display: none;
}

.category-pill-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #090d15;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  padding: 9px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-pill-btn.active {
  background: rgba(212, 255, 36, 0.12);
  border-color: #D4FF24;
  color: #D4FF24;
  font-weight: 700;
}

.cat-pill-icon {
  font-size: 15px;
}

/* ================= HERO MINIMALISTA ================= */
.left-col {
  padding-right: 0;
}

@media (min-width: 992px) {
  .left-col {
    padding-right: 22px;
  }
}

.hero-header-box {
  margin-bottom: 16px;
}

.hero-headline {
  font-size: 26px;
  font-weight: 800;
  line-height: 1.2;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.4px;
}

@media (min-width: 768px) {
  .hero-headline {
    font-size: 36px;
  }
}

.neon-highlight {
  color: #D4FF24;
}

.hero-subtext {
  font-size: 13.5px;
  line-height: 1.45;
  color: #9ca3af;
  margin: 0;
}

/* ================= CARD DO FORMULÁRIO ================= */
.form-card-container {
  background: #070a10;
  border: 1px solid rgba(212, 255, 36, 0.25);
  border-radius: 16px;
  padding: 18px 16px;
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .form-card-container {
    padding: 24px 22px;
  }
}

/* Banner de profissional selecionado */
.selected-pro-card-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(212, 255, 36, 0.08);
  border: 1px solid rgba(212, 255, 36, 0.35);
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 16px;
}

.selected-pro-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.selected-pro-img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.selected-headline-tag {
  font-size: 9.5px;
  font-weight: 800;
  color: #D4FF24;
  letter-spacing: 0.5px;
}

.selected-name-title {
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  margin: 1px 0;
}

.selected-spec-text {
  font-size: 11.5px;
  color: #9ca3af;
  margin: 0;
}

.clear-selected-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #d1d5db;
  font-size: 11.5px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

/* Blocos do Formulário */
.form-fields-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-section-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label-clean {
  font-size: 13px;
  font-weight: 700;
  color: #e5e7eb;
}

.quick-chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.choice-chip-btn {
  background: #0b0f17;
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #d1d5db;
  padding: 9px 13px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.choice-chip-btn.active {
  background: rgba(212, 255, 36, 0.12);
  border-color: #D4FF24;
  color: #D4FF24;
  font-weight: 700;
}

.dates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.date-chip {
  justify-content: center;
  padding: 10px 6px;
}

.time-pills-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.time-pill-label {
  font-size: 11.5px;
  color: #9ca3af;
  margin-right: 2px;
}

.time-slot-pill {
  background: #0b0f17;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  padding: 5px 11px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.time-slot-pill.active {
  background: rgba(212, 255, 36, 0.14);
  border-color: #D4FF24;
  color: #D4FF24;
}

.datetime-compact-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 4px;
}

.field-sublabel {
  font-size: 11px;
  color: #9ca3af;
  margin-bottom: 4px;
  display: block;
}

.input-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #0b0f17;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 10px;
  padding: 9px 12px;
}

.inner-icon {
  color: #D4FF24;
  font-size: 16px;
  flex-shrink: 0;
}

.clean-input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  width: 100%;
  color-scheme: dark;
}

/* Valor Oferecido */
.value-section {
  background: #0b0f17;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 12px;
}

.value-header-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.value-hint {
  font-size: 11px;
  color: #9ca3af;
}

.value-stepper-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: #06090e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 6px 10px;
}

.stepper-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.stepper-btn.plus {
  background: rgba(212, 255, 36, 0.14);
  border-color: rgba(212, 255, 36, 0.4);
  color: #D4FF24;
}

.value-display-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.currency-tag {
  font-size: 15px;
  font-weight: 800;
  color: #D4FF24;
}

.clean-input-price {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 20px;
  font-weight: 900;
  width: 76px;
  text-align: center;
}

.price-presets-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.price-preset-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  font-size: 11.5px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 99px;
  cursor: pointer;
}

.price-preset-pill.active {
  background: rgba(212, 255, 36, 0.15);
  border-color: #D4FF24;
  color: #D4FF24;
}

/* Botão Principal */
.primary-search-button {
  width: 100%;
  margin-top: 16px;
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 12px;
  height: 50px;
  font-size: 13.5px;
  font-weight: 900;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(212, 255, 36, 0.25);
}

.trust-footer-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.trust-shield-icon {
  color: #D4FF24;
  font-size: 18px;
  flex-shrink: 0;
}

.trust-items {
  font-size: 11.5px;
  color: #9ca3af;
}

/* ================= COLUNA DIREITA ================= */
.neon-service-card {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 14px;
  cursor: pointer;
}

.service-floating-badge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-mini-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.badge-mini-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.badge-mini-tag {
  font-size: 9.5px;
  font-weight: 800;
  color: #D4FF24;
}

.badge-mini-name {
  font-size: 13px;
  color: #ffffff;
}

.badge-mini-action {
  background: rgba(212, 255, 36, 0.14);
  border: 1px solid rgba(212, 255, 36, 0.4);
  color: #D4FF24;
  font-size: 11.5px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

/* Card Destaques */
.highlights-card {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 20px;
}

.highlights-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.highlight-star-icon {
  color: #D4FF24;
  font-size: 20px;
}

.highlights-title {
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.highlights-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin: 4px 0 14px;
}

.highlights-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.highlight-row-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.rank-ribbon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.rank-1 {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid #f59e0b;
  color: #fbbf24;
}

.rank-2 {
  background: rgba(156, 163, 175, 0.2);
  border: 1px solid #9ca3af;
  color: #e5e7eb;
}

.rank-3 {
  background: rgba(180, 83, 9, 0.2);
  border: 1px solid #d97706;
  color: #fdba74;
}

.highlight-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
}

.highlight-details {
  flex: 1;
}

.name-verified-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pro-name {
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
}

.verified-badge {
  color: #4ade80;
  font-size: 15px;
}

.pro-stats-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  margin-top: 2px;
}

.star-rating {
  color: #facc15;
  font-weight: 700;
}

.services-count {
  color: #9ca3af;
}

.view-all-highlights-link {
  width: 100%;
  margin-top: 14px;
  background: transparent;
  border: 1px solid rgba(212, 255, 36, 0.3);
  border-radius: 10px;
  height: 40px;
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

/* ================= LISTA DE DISPONÍVEIS ================= */
.available-section-row {
  margin-top: 8px;
}

.section-heading-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.section-icon-neon {
  color: #D4FF24;
  font-size: 20px;
}

.available-section-title {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.available-pros-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pro-profile-card {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 768px) {
  .pro-profile-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.card-left-block {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;
}

.avatar-status-wrap {
  position: relative;
  flex-shrink: 0;
}

.pro-main-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #070a10;
}

.pro-name-verified {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pro-full-name {
  font-size: 15.5px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.pro-stats-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  margin: 3px 0 6px;
}

.rating-val {
  color: #facc15;
  font-weight: 700;
}

.dot-sep, .jobs-val {
  color: #9ca3af;
}

.pro-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.pro-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 11px;
  color: #d1d5db;
}

.card-meta-block {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.meta-line {
  display: flex;
  align-items: center;
  gap: 5px;
}

.meta-icon {
  color: #D4FF24;
}

.view-profile-btn {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #ffffff;
  border-radius: 10px;
  padding: 9px 16px;
  font-size: 12.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.load-more-container {
  margin-top: 12px;
}

.load-more-btn {
  width: 100%;
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  height: 42px;
  color: #d1d5db;
  font-size: 12.5px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

/* ================= SUPORTE ================= */
.support-banner-row {
  margin-top: 20px;
}

.support-banner-box {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 768px) {
  .support-banner-box {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.support-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.headphone-icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(212, 255, 36, 0.1);
  color: #D4FF24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.support-title {
  font-size: 15px;
  font-weight: 800;
  margin: 0;
}

.support-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin: 2px 0 0;
}

.support-cta-btn {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(212, 255, 36, 0.4);
  color: #ffffff;
  border-radius: 10px;
  padding: 9px 16px;
  font-size: 12.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

/* ================= MODAIS ================= */
.modal-sheet-inner {
  --background: #0b0e14;
  --color: #ffffff;
}

.modal-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
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

.btn-close-modal {
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: #9ca3af;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 15px;
  cursor: pointer;
}

.orders-modal-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-order-card {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
}

.order-top-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.order-cat-tag {
  font-size: 10.5px;
  font-weight: 800;
  color: #D4FF24;
  text-transform: uppercase;
}

.order-status-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
}

.status-ongoing {
  background: rgba(212, 255, 36, 0.14);
  color: #D4FF24;
}

.status-done {
  background: rgba(34, 197, 94, 0.16);
  color: #4ade80;
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.order-card-title {
  font-size: 14.5px;
  font-weight: 700;
  margin: 0 0 6px;
}

.order-meta-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 12px;
}

.order-footer-pro-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
}

.order-pro-avatar-box {
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

.order-pro-text {
  display: flex;
  flex-direction: column;
}

.pro-small-name {
  font-size: 12.5px;
  font-weight: 700;
}

.pro-small-rating {
  font-size: 11px;
  color: #facc15;
}

.order-actions-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.open-chat-from-order-btn {
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

.complete-order-btn {
  background: #D4FF24;
  border: none;
  color: #050800;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11.5px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.cancel-order-btn {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  font-size: 12px;
  cursor: pointer;
}

/* Modal Perfil */
.pro-modal-category {
  font-size: 11px;
  font-weight: 800;
  color: #D4FF24;
  text-transform: uppercase;
}

.pro-modal-profile-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.pro-modal-avatar-big {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.pro-modal-stats-summary {
  display: flex;
  gap: 8px;
  flex: 1;
}

.stat-pill-box {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 8px;
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.stat-val {
  font-size: 13.5px;
  font-weight: 800;
  color: #ffffff;
}

.stat-lbl {
  font-size: 10px;
  color: #9ca3af;
}

.modal-section-title {
  font-size: 13px;
  font-weight: 700;
  color: #d1d5db;
  margin: 14px 0 6px;
}

.pro-bio-text {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.45;
  margin: 0;
}

.badges-row-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge-modal-pill {
  background: rgba(212, 255, 36, 0.1);
  border: 1px solid rgba(212, 255, 36, 0.3);
  color: #D4FF24;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 99px;
}

.review-modal-box {
  background: #111622;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 8px;
}

.review-top-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}

.review-stars {
  color: #facc15;
}

.review-comment-p {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.hire-now-modal-btn {
  width: 100%;
  margin-top: 16px;
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 12px;
  height: 48px;
  font-size: 13.5px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

/* Modal Sucesso */
.text-center {
  text-align: center;
}

.success-check-circle {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: rgba(212, 255, 36, 0.14);
  color: #D4FF24;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6px auto 12px;
}

.order-summary-box {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
  margin: 16px 0;
  text-align: left;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-line:last-child {
  border-bottom: none;
}

.sum-label {
  color: #9ca3af;
}

.neon-color {
  color: #D4FF24;
}

.modal-buttons-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-primary-modal {
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 10px;
  height: 46px;
  font-size: 13.5px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.btn-secondary-modal {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  height: 44px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* Opções de Suporte / Conta */
.support-options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.support-option-item {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.support-opt-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: rgba(212, 255, 36, 0.12);
  color: #D4FF24;
}

.support-opt-info {
  flex: 1;
}

.support-opt-info h4 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 2px;
}

.support-opt-info p {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.opt-arrow {
  color: #9ca3af;
}
</style>
