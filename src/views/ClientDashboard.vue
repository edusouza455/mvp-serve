<template>
  <ion-page class="client-dashboard-page">
    <!-- Header Mobile App (+ SERVE) -->
    <ion-header class="ion-no-border main-header">
      <ion-toolbar class="header-toolbar">
        <div class="header-inner">
          <div class="header-left-group">
            <button type="button" class="back-home-btn" @click="goToHome" aria-label="Voltar para Início">
              <ion-icon :icon="chevronBackOutline"></ion-icon>
            </button>
            <div class="brand-logo" @click="goToHome">
              <span class="neon-plus">+</span>
              <span class="brand-name">SERVE</span>
            </div>
            <span class="active-cat-header-pill">{{ selectedCategoryName }}</span>
          </div>

          <div class="mobile-nav-actions">
            <button type="button" class="mobile-orders-pill" @click="openOrdersModal">
              <ion-icon :icon="clipboardOutline"></ion-icon>
              <span>Pedidos</span>
              <span class="orders-count-dot">{{ store.ordersList.length }}</span>
            </button>
            <button type="button" class="mobile-icon-btn" aria-label="Mensagens" title="Abrir Chat" @click="openChatModalDirect">
              <ion-icon :icon="chatbubbleOutline"></ion-icon>
            </button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="dashboard-content">
      <div class="page-wrapper">

        <!-- CARD DO FORMULÁRIO MOBILE (+SERVE) -->
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
            <button type="button" class="clear-selected-btn" @click="store.clearSelectedProfessional">
              Trocar
            </button>
          </div>

          <div class="form-fields-grid">

            <!-- 1. SELETOR INTUITIVO DE PROFISSIONAL (EVENTOS | CASA | LIMPEZA + CARDS) -->
            <div class="pro-selector-showcase-card">
              <h3 class="pro-selector-heading">Qual profissional você precisa?</h3>

              <!-- Abas de Macro-Categoria (Eventos | Casa | Limpeza) -->
              <div class="macro-group-pills">
                <button
                  v-for="grp in professionGroups"
                  :key="grp.id"
                  type="button"
                  class="macro-pill-btn"
                  :class="{ active: selectedGroupName === grp.id }"
                  @click="selectMacroGroup(grp.id)"
                >
                  {{ grp.label }}
                </button>
              </div>

              <!-- Linha divisória sutil -->
              <div class="pro-selector-divider"></div>

              <!-- Grade de Profissões da Macro-Categoria (Setas só aparecem se houver mais de 3 profissões) -->
              <div class="pro-subcards-carousel-wrap">
                <button
                  v-if="hasMoreProfessionsInGroup"
                  type="button"
                  class="subcard-nav-arrow left"
                  @click="stepProfession(-1)"
                  aria-label="Profissão anterior"
                >
                  <ion-icon :icon="chevronBackOutline"></ion-icon>
                </button>

                <div class="pro-subcards-grid">
                  <button
                    v-for="profName in visibleGroupProfessions"
                    :key="profName"
                    type="button"
                    class="pro-subcard-item"
                    :class="{ active: selectedCategoryName === profName }"
                    @click="setCategory(profName)"
                  >
                    <ion-icon
                      :icon="getCategoryIcon(CATEGORY_CONFIGS[profName]?.icon)"
                      class="pro-subcard-icon"
                    ></ion-icon>
                    <span class="pro-subcard-label">{{ profName }}</span>
                  </button>
                </div>

                <button
                  v-if="hasMoreProfessionsInGroup"
                  type="button"
                  class="subcard-nav-arrow right"
                  @click="stepProfession(1)"
                  aria-label="Próxima profissão"
                >
                  <ion-icon :icon="chevronForwardOutline"></ion-icon>
                </button>
              </div>
            </div>

            <!-- 2. DATA, INÍCIO E FIM DO EVENTO / ATENDIMENTO -->
            <div class="form-section-block">
              <div class="section-label-row">
                <label class="field-label-clean">
                  <ion-icon :icon="calendarOutline" class="label-neon-icon"></ion-icon>
                  <span>Quando você precisa?</span>
                </label>
                <div class="quick-date-links">
                  <button
                    type="button"
                    class="tiny-date-shortcut"
                    :class="{ active: activeDateShortcut === 'today' }"
                    @click="applyDateShortcut('today')"
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    class="tiny-date-shortcut"
                    :class="{ active: activeDateShortcut === 'tomorrow' }"
                    @click="applyDateShortcut('tomorrow')"
                  >
                    Amanhã
                  </button>
                </div>
              </div>

              <!-- Grade Mobile: Data em cima | Início e Fim lado a lado -->
              <div class="precise-datetime-grid">
                <button
                  type="button"
                  class="boxed-field date-col clickable-date-trigger"
                  @click="isCalendarModalOpen = true"
                >
                  <ion-icon :icon="calendarOutline" class="boxed-icon"></ion-icon>
                  <div class="boxed-inner">
                    <span class="boxed-label">Data do evento</span>
                    <span class="boxed-date-display">{{ formattedDateDisplay }}</span>
                  </div>
                  <ion-icon :icon="chevronDownOutline" class="date-trigger-chevron"></ion-icon>
                </button>

                <div class="boxed-field time-col">
                  <ion-icon :icon="timeOutline" class="boxed-icon"></ion-icon>
                  <div class="boxed-inner">
                    <span class="boxed-label">Início</span>
                    <input
                      type="time"
                      v-model="store.eventForm.horarioInicio"
                      class="boxed-input"
                    />
                  </div>
                </div>

                <div class="boxed-field time-col">
                  <ion-icon :icon="timeOutline" class="boxed-icon"></ion-icon>
                  <div class="boxed-inner">
                    <span class="boxed-label">Fim (Até)</span>
                    <input
                      type="time"
                      v-model="store.eventForm.horarioFim"
                      class="boxed-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Resumo automático de duração -->
              <div class="duration-helper-bar">
                <span>⏱️ {{ formattedDateBR }} das <strong>{{ store.eventForm.horarioInicio }}</strong> às <strong>{{ store.eventForm.horarioFim }}</strong> ({{ calculatedDuration }})</span>
              </div>
            </div>

            <!-- 3. QUANTIDADE & TIPO DE EVENTO (2 COLUNAS LADO A LADO NO MOBILE) -->
            <div class="two-cols-boxed-row">
              <div class="boxed-field">
                <ion-icon :icon="peopleOutline" class="boxed-icon"></ion-icon>
                <div class="boxed-inner">
                  <span class="boxed-label">{{ activeConfig.scopeLabel }}</span>
                  <select v-model="store.eventForm.qtdProfissionais" class="boxed-select">
                    <option v-for="sc in activeConfig.scopes" :key="sc" :value="sc">
                      {{ sc }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="boxed-field">
                <ion-icon :icon="sparklesOutline" class="boxed-icon"></ion-icon>
                <div class="boxed-inner">
                  <span class="boxed-label">{{ activeConfig.serviceTypeLabel }}</span>
                  <select v-model="store.eventForm.tipoEvento" class="boxed-select">
                    <option v-for="opt in activeConfig.serviceTypes" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 4. LOCAL DO EVENTO + BREVE DESCRIÇÃO -->
            <div class="location-desc-stack">
              <div class="boxed-field">
                <ion-icon :icon="locationOutline" class="boxed-icon"></ion-icon>
                <div class="boxed-inner">
                  <span class="boxed-label">{{ activeConfig.locationLabel }}</span>
                  <input
                    type="text"
                    v-model="store.eventForm.local"
                    :placeholder="activeConfig.locationPlaceholder"
                    class="boxed-input"
                  />
                </div>
              </div>

              <div class="boxed-field">
                <ion-icon :icon="documentTextOutline" class="boxed-icon"></ion-icon>
                <div class="boxed-inner">
                  <span class="boxed-label">{{ activeConfig.detailsLabel }}</span>
                  <input
                    type="text"
                    v-model="store.eventForm.descricao"
                    :placeholder="activeConfig.detailsPlaceholder"
                    class="boxed-input"
                  />
                </div>
              </div>
            </div>

            <!-- 5. VALOR OFERECIDO POR PROFISSIONAL (PISO MÍNIMO DE R$ 50,00) -->
            <div class="boxed-field price-boxed-field" :class="{ 'min-price-alert': minPriceWarningActive }">
              <div class="price-left-meta">
                <div class="currency-circle">$</div>
                <div class="boxed-inner">
                  <span class="boxed-label">Valor por profissional (Mín: R$ 50)</span>
                  <div class="price-value-line">
                    <span class="rs-prefix">R$</span>
                    <input
                      type="number"
                      min="50"
                      v-model.number="store.eventForm.valorOferecido"
                      @blur="validateMinimumPrice"
                      class="boxed-price-input"
                    />
                    <span class="rs-decimals">,00</span>
                  </div>
                </div>
              </div>

              <div class="price-stepper-controls">
                <button type="button" class="step-circle-btn" @click="adjustPrice(-10)" title="Diminuir R$ 10">−</button>
                <button type="button" class="step-circle-btn plus" @click="adjustPrice(10)" title="Aumentar R$ 10">+</button>
              </div>
            </div>

            <div v-if="minPriceWarningActive" class="min-floor-inline-notice">
              ⚠️ O piso mínimo para contratação na plataforma é de <strong>R$ 50,00</strong>.
            </div>

            <!-- Sugestões rápidas de valor da categoria -->
            <div class="price-presets-row">
              <span class="preset-hint">Sugestões:</span>
              <button
                v-for="p in activeConfig.prices"
                :key="p"
                type="button"
                class="price-preset-pill"
                :class="{ active: store.eventForm.valorOferecido === p }"
                @click="setPresetPrice(p)"
              >
                R$ {{ p }}
              </button>
            </div>

          </div>

          <!-- Botão de Ação Principal Mobile -->
          <button type="button" class="primary-search-button" @click="handleConfirmOrder">
            <span>{{ actionButtonText }}</span>
            <ion-icon :icon="arrowForwardOutline" class="btn-arrow"></ion-icon>
          </button>

          <!-- Rodapé de Confiança Compacto -->
          <div class="trust-footer-row">
            <ion-icon :icon="shieldCheckmarkOutline" class="trust-shield-icon"></ion-icon>
            <div class="trust-copy">
              <strong>Contrate com segurança</strong>
              <span>Profissionais verificados • Pagamento protegido</span>
            </div>
          </div>

        </div>

        <!-- SEÇÃO MOBILE: PROFISSIONAIS DISPONÍVEIS -->
        <div id="available-section" class="available-mobile-section">
          <div class="section-heading-row">
            <div class="heading-left">
              <ion-icon :icon="personOutline" class="section-icon-neon"></ion-icon>
              <h2 class="available-section-title">{{ activeConfig.plural }} disponíveis</h2>
            </div>
            <span class="pros-count-badge">{{ filteredAvailable.length }} online</span>
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
                    <span class="pro-base-price-tag">R$ {{ pro.valorBase }}</span>
                  </div>

                  <div class="pro-stats-strip">
                    <span class="rating-val">★ {{ pro.nota }}</span>
                    <span class="dot-sep">•</span>
                    <span class="jobs-val">{{ pro.servicos }} serviços</span>
                    <span class="dot-sep">•</span>
                    <span class="jobs-val">{{ pro.exp }}</span>
                  </div>

                  <div class="pro-pills-row">
                    <span v-for="tag in pro.tags" :key="tag" class="pro-pill">{{ tag }}</span>
                  </div>
                </div>
              </div>

              <div class="card-mobile-actions">
                <button type="button" class="view-profile-btn" @click="openProfileModal(pro)">
                  <span>Ver perfil</span>
                </button>
                <button type="button" class="quick-select-pro-btn" @click="selectAndScrollToForm(pro)">
                  <span>Selecionar</span>
                  <ion-icon :icon="arrowForwardOutline"></ion-icon>
                </button>
              </div>
            </div>
          </div>

          <div class="load-more-container" v-if="filteredAvailable.length > 3">
            <button type="button" class="load-more-btn" @click="toggleShowMorePros">
              <span>{{ showAllPros ? 'Recolher lista' : `Ver mais ${activeConfig.plural.toLowerCase()} disponíveis` }}</span>
              <ion-icon :icon="showAllPros ? chevronUpOutline : chevronDownOutline"></ion-icon>
            </button>
          </div>
        </div>

        <!-- CARD COMPACTO DE SUPORTE MOBILE -->
        <div class="support-banner-box" @click="isSupportModalOpen = true">
          <div class="support-left">
            <div class="headphone-icon-circle">
              <ion-icon :icon="headsetOutline"></ion-icon>
            </div>
            <div class="support-text-meta">
              <h3 class="support-title">Precisa de ajuda?</h3>
              <p class="support-subtitle">Suporte 24h para clientes e prestadores.</p>
            </div>
          </div>
          <ion-icon :icon="arrowForwardOutline" class="support-chevron"></ion-icon>
        </div>

      </div>

      <!-- ================= MODAL: PERFIL DO PROFISSIONAL ================= -->
      <ion-modal
        :is-open="isProfileModalOpen"
        :breakpoints="[0, 0.82, 0.96]"
        :initial-breakpoint="0.82"
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

      <!-- ================= MODAL: CONFIRMAÇÃO DO PEDIDO ================= -->
      <ion-modal
        :is-open="isOrderSuccessModalOpen"
        :breakpoints="[0, 0.8, 0.94]"
        :initial-breakpoint="0.8"
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
              <span class="sum-label">Início e Fim:</span>
              <span class="sum-val">{{ createdOrderData.data }} ({{ createdOrderData.horarioInicio }} às {{ createdOrderData.horarioFim }})</span>
            </div>
            <div class="summary-line">
              <span class="sum-label">Local:</span>
              <span class="sum-val">{{ createdOrderData.local || 'Boa Vista - RR' }}</span>
            </div>
            <div v-if="createdOrderData.descricao" class="summary-line">
              <span class="sum-label">Descrição:</span>
              <span class="sum-val">{{ createdOrderData.descricao }}</span>
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

      <!-- ================= MODAL: SUPORTE 24H ================= -->
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

      <!-- COMPONENTE REUTILIZÁVEL: MODAL DE CALENDÁRIO AMIGÁVEL -->
      <CalendarModal
        v-model:is-open="isCalendarModalOpen"
        v-model="store.eventForm.data"
        title="Escolha a data do evento"
        @select="onCalendarDateSelected"
      />

      <!-- Toast de feedback -->
      <ion-toast
        :is-open="showToast"
        :message="toastMsg"
        :duration="2600"
        position="top"
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
  IonIcon,
  IonModal,
  IonToast
} from '@ionic/vue';
import {
  homeOutline,
  clipboardOutline,
  chatbubbleOutline,
  chevronDownOutline,
  chevronUpOutline,
  chevronBackOutline,
  chevronForwardOutline,
  calendarOutline,
  timeOutline,
  personOutline,
  peopleOutline,
  documentTextOutline,
  arrowForwardOutline,
  shieldCheckmarkOutline,
  checkmarkCircle,
  locationOutline,
  headsetOutline,
  flashOutline,
  sparklesOutline,
  waterOutline,
  constructOutline,
  wineOutline,
  restaurantOutline,
  flameOutline,
  shirtOutline
} from 'ionicons/icons';
import { useAppStore, CATEGORY_CONFIGS, PROFESSION_GROUPS } from '@/stores/useAppStore';
import CalendarModal from '@/components/CalendarModal.vue';

const router = useRouter();
const route = useRoute();
const store = useAppStore();

const showToast = ref(false);
const toastMsg = ref('');
const minPriceWarningActive = ref(false);

// Modais locais
const isCalendarModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isOrderSuccessModalOpen = ref(false);
const isSupportModalOpen = ref(false);
const activeModalPro = ref(null);
const createdOrderData = ref(null);

// Estado da Macro-Categoria, Profissão e Datas
const professionGroups = PROFESSION_GROUPS;
const selectedGroupName = ref('Eventos');
const selectedCategoryName = ref('Garçom');
const groupPageStartIndex = ref(0);
const showAllPros = ref(false);
const activeDateShortcut = ref('today');

const activeGroupProfessions = computed(() => {
  const found = professionGroups.find(g => g.id === selectedGroupName.value);
  return found ? found.items : professionGroups[0].items;
});

const hasMoreProfessionsInGroup = computed(() => {
  return activeGroupProfessions.value.length > 3;
});

const visibleGroupProfessions = computed(() => {
  const list = activeGroupProfessions.value;
  if (list.length <= 3) return list;
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push(list[(groupPageStartIndex.value + i) % list.length]);
  }
  return result;
});

const activeConfig = computed(() => {
  return CATEGORY_CONFIGS[selectedCategoryName.value] || CATEGORY_CONFIGS.Garçom;
});

function getCategoryIcon(iconKey) {
  switch (iconKey) {
    case 'restaurant': return restaurantOutline;
    case 'wine': return wineOutline;
    case 'flame': return flameOutline;
    case 'flash': return flashOutline;
    case 'sparkles': return sparklesOutline;
    case 'water': return waterOutline;
    case 'construct': return constructOutline;
    case 'home': return homeOutline;
    case 'shirt': return shirtOutline;
    default: return restaurantOutline;
  }
}

function selectMacroGroup(groupId) {
  selectedGroupName.value = groupId;
  groupPageStartIndex.value = 0;
  const grp = professionGroups.find(g => g.id === groupId);
  if (grp && grp.items.length > 0 && !grp.items.includes(selectedCategoryName.value)) {
    setCategory(grp.items[0]);
  }
}

function stepProfession(delta) {
  const list = activeGroupProfessions.value;
  if (list.length <= 3) return;
  groupPageStartIndex.value = (groupPageStartIndex.value + delta + list.length) % list.length;
}

function setCategory(catName) {
  const conf = CATEGORY_CONFIGS[catName] || CATEGORY_CONFIGS.Garçom;
  selectedCategoryName.value = conf.name;
  if (conf.group) {
    selectedGroupName.value = conf.group;
  }
  store.eventForm.categoria = conf.name;
  minPriceWarningActive.value = false;

  store.eventForm.tipoEvento = conf.serviceTypes[0];
  store.eventForm.qtdProfissionais = conf.scopes[1] || conf.scopes[0];
  store.eventForm.horarioInicio = conf.defaultStart || '18:00';
  store.eventForm.horarioFim = conf.defaultEnd || '00:00';
  store.eventForm.valorOferecido = conf.defaultPrice;

  if (store.selectedProfessional && store.selectedProfessional.categoria !== conf.name) {
    store.clearSelectedProfessional();
  }
}

function getLocalISODate(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function applyDateShortcut(mode) {
  activeDateShortcut.value = mode;
  const now = new Date();
  if (mode === 'today') {
    store.eventForm.data = getLocalISODate(now);
  } else if (mode === 'tomorrow') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    store.eventForm.data = getLocalISODate(tomorrow);
  }
}

function onCalendarDateSelected(selectedISO) {
  const now = new Date();
  const todayStr = getLocalISODate(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getLocalISODate(tomorrow);

  if (selectedISO === todayStr) {
    activeDateShortcut.value = 'today';
  } else if (selectedISO === tomorrowStr) {
    activeDateShortcut.value = 'tomorrow';
  } else {
    activeDateShortcut.value = 'custom';
  }
}

const formattedDateBR = computed(() => {
  const raw = store.eventForm.data;
  if (!raw || !raw.includes('-')) return raw || 'Hoje';
  const [y, m, d] = raw.split('-');
  return `${d}/${m}/${y}`;
});

const formattedDateDisplay = computed(() => {
  const raw = store.eventForm.data;
  if (!raw || !raw.includes('-')) return 'Selecionar data';
  const [y, m, d] = raw.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const shortWeekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const wd = shortWeekdays[dateObj.getDay()];
  const dd = String(d).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  return `${wd}, ${dd}/${mm}/${y}`;
});

const calculatedDuration = computed(() => {
  const start = store.eventForm.horarioInicio || '18:00';
  const end = store.eventForm.horarioFim || '00:00';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if (isNaN(sh) || isNaN(eh)) return '6h';
  let diffMinutes = (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0));
  if (diffMinutes <= 0) diffMinutes += 24 * 60;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
});

function triggerMinimumFloorAlert() {
  store.eventForm.valorOferecido = 50;
  minPriceWarningActive.value = true;
  toastMsg.value = '⚠️ O piso mínimo por diária na plataforma é de R$ 50,00.';
  showToast.value = true;
}

function adjustPrice(delta) {
  const current = Number(store.eventForm.valorOferecido) || 50;
  const nextVal = current + delta;
  if (nextVal < 50) {
    triggerMinimumFloorAlert();
    return;
  }
  minPriceWarningActive.value = false;
  store.eventForm.valorOferecido = nextVal;
}

function validateMinimumPrice() {
  const current = Number(store.eventForm.valorOferecido);
  if (!current || current < 50) {
    triggerMinimumFloorAlert();
  } else {
    minPriceWarningActive.value = false;
  }
}

function setPresetPrice(p) {
  minPriceWarningActive.value = false;
  store.eventForm.valorOferecido = p;
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

function toggleShowMorePros() {
  showAllPros.value = !showAllPros.value;
}

onMounted(() => {
  store.role = 'CLIENT';
  applyDateShortcut('today');

  if (route.query.category) {
    const cat = String(route.query.category);
    const matchKey = Object.keys(CATEGORY_CONFIGS).find(k => k.toLowerCase() === cat.toLowerCase());
    if (matchKey) setCategory(matchKey);
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

function goToHome() {
  router.push('/home');
}

function openOrdersModal() {
  store.profileMenuModalOpen = false;
  store.ordersModalOpen = true;
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
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hireFromModal(pro) {
  isProfileModalOpen.value = false;
  selectAndScrollToForm(pro);
}

function handleConfirmOrder() {
  if (!store.eventForm.valorOferecido || store.eventForm.valorOferecido < 50) {
    triggerMinimumFloorAlert();
    return;
  }
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

/* ================= HEADER MOBILE APP ================= */
.main-header {
  background: #030407;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-toolbar {
  --background: #030407;
  --min-height: 54px;
}

.header-inner {
  padding: 0 12px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.header-left-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.back-home-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
}

.neon-plus {
  color: #D4FF24;
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
}

.brand-name {
  color: #ffffff;
  font-size: 17px;
  font-weight: 900;
  font-style: italic;
}

.active-cat-header-pill {
  background: rgba(212, 255, 36, 0.12);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 99px;
}

.mobile-nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mobile-orders-pill {
  background: #0b0f17;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
  border-radius: 9px;
  padding: 6px 9px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.orders-count-dot {
  background: #D4FF24;
  color: #050800;
  font-size: 9.5px;
  font-weight: 900;
  padding: 1px 5px;
  border-radius: 99px;
}

.mobile-icon-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  cursor: pointer;
}

/* ================= CONTEÚDO MOBILE ================= */
.dashboard-content {
  --background: #030407;
}

.page-wrapper {
  padding: 12px 12px 92px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ================= CARD DO FORMULÁRIO MOBILE (+SERVE) ================= */
.form-card-container {
  background: #070a10;
  border: 1px solid rgba(212, 255, 36, 0.28);
  border-radius: 16px;
  padding: 14px 12px;
}

.selected-pro-card-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(212, 255, 36, 0.08);
  border: 1px solid rgba(212, 255, 36, 0.35);
  border-radius: 12px;
  padding: 9px 10px;
  margin-bottom: 12px;
}

.selected-pro-left {
  display: flex;
  align-items: center;
  gap: 9px;
}

.selected-pro-img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.selected-headline-tag {
  font-size: 9px;
  font-weight: 800;
  color: #D4FF24;
}

.selected-name-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #ffffff;
  margin: 1px 0;
}

.selected-spec-text {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
}

.clear-selected-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #d1d5db;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 7px;
  cursor: pointer;
}

.form-fields-grid {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.form-section-block {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.section-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.field-label-clean {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 700;
  color: #ffffff;
}

.label-neon-icon {
  color: #D4FF24;
  font-size: 15px;
}

/* Seletor Hierárquico de Profissional (Eventos | Casa | Limpeza) */
.pro-selector-showcase-card {
  background: #0a0e17;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 13px;
  padding: 12px 10px;
}

.pro-selector-heading {
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 10px 0;
}

.macro-group-pills {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.macro-pill-btn {
  background: #0d121d;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  border-radius: 999px;
  padding: 7px 6px;
  font-size: 11.5px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.16s ease;
}

.macro-pill-btn.active {
  background: #f1f5f9;
  border-color: #ffffff;
  color: #05070b;
  font-weight: 800;
}

.pro-selector-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 10px 0;
}

.pro-subcards-carousel-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
}

.subcard-nav-arrow {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
  cursor: pointer;
}

.pro-subcards-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  min-width: 0;
}

.pro-subcard-item {
  background: #0d121d;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 10px;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #cbd5e1;
  cursor: pointer;
  min-width: 0;
}

.pro-subcard-item.active {
  background: rgba(212, 255, 36, 0.14);
  border: 1.5px solid #D4FF24;
  color: #ffffff;
}

.pro-subcard-icon {
  font-size: 18px;
  color: #94a3b8;
}

.pro-subcard-item.active .pro-subcard-icon {
  color: #D4FF24;
}

.pro-subcard-label {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.pro-subcard-item.active .pro-subcard-label {
  font-weight: 800;
  color: #ffffff;
}

.quick-date-links {
  display: flex;
  gap: 5px;
}

.tiny-date-shortcut {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #9ca3af;
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 99px;
  cursor: pointer;
}

.tiny-date-shortcut.active {
  background: rgba(212, 255, 36, 0.14);
  border-color: #D4FF24;
  color: #D4FF24;
}

/* Grade de Data, Início e Fim Mobile */
.precise-datetime-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.precise-datetime-grid .date-col {
  grid-column: span 2;
}

.boxed-field {
  background: #0b0f17;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 11px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clickable-date-trigger {
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.boxed-date-display {
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
}

.date-trigger-chevron {
  color: #9ca3af;
  font-size: 14px;
  flex-shrink: 0;
}

.boxed-icon {
  color: #D4FF24;
  font-size: 16px;
  flex-shrink: 0;
}

.boxed-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.boxed-label {
  font-size: 10px;
  color: #9ca3af;
  margin-bottom: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.boxed-input,
.boxed-select {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
  width: 100%;
  padding: 0;
  color-scheme: dark;
}

.boxed-select option {
  background: #0b0f17;
  color: #ffffff;
}

.duration-helper-bar {
  font-size: 11px;
  color: #9ca3af;
}

.duration-helper-bar strong {
  color: #e5e7eb;
}

/* 2 Colunas Lado a Lado no Mobile para Quantidade e Tipo de Serviço */
.two-cols-boxed-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.location-desc-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.price-boxed-field {
  justify-content: space-between;
}

.price-boxed-field.min-price-alert {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.06);
}

.price-left-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid #D4FF24;
  color: #D4FF24;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.price-value-line {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.rs-prefix {
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
}

.boxed-price-input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 15px;
  font-weight: 900;
  width: 52px;
  padding: 0;
}

.rs-decimals {
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
}

.price-stepper-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}

.step-circle-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.step-circle-btn.plus {
  background: rgba(212, 255, 36, 0.14);
  border-color: rgba(212, 255, 36, 0.4);
  color: #D4FF24;
}

.min-floor-inline-notice {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
  font-size: 11px;
  padding: 7px 10px;
  border-radius: 9px;
}

.price-presets-row {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.preset-hint {
  font-size: 10.5px;
  color: #9ca3af;
}

.price-preset-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: 99px;
  cursor: pointer;
}

.price-preset-pill.active {
  background: rgba(212, 255, 36, 0.15);
  border-color: #D4FF24;
  color: #D4FF24;
}

.primary-search-button {
  width: 100%;
  margin-top: 12px;
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 12px;
  height: 46px;
  font-size: 12.5px;
  font-weight: 900;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(212, 255, 36, 0.24);
}

.trust-footer-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.trust-shield-icon {
  color: #D4FF24;
  font-size: 18px;
  flex-shrink: 0;
}

.trust-copy {
  display: flex;
  flex-direction: column;
}

.trust-copy strong {
  font-size: 11.5px;
  color: #ffffff;
}

.trust-copy span {
  font-size: 10.5px;
  color: #9ca3af;
}

/* ================= LISTA DE PROFISSIONAIS DISPONÍVEIS MOBILE ================= */
.section-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.heading-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-icon-neon {
  color: #D4FF24;
  font-size: 18px;
}

.available-section-title {
  font-size: 15.5px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.pros-count-badge {
  background: rgba(34, 197, 94, 0.14);
  border: 1px solid rgba(34, 197, 94, 0.35);
  color: #4ade80;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 99px;
}

.available-pros-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pro-profile-card {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-left-block {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.avatar-status-wrap {
  position: relative;
  flex-shrink: 0;
}

.pro-main-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #070a10;
}

.pro-core-info {
  flex: 1;
  min-width: 0;
}

.pro-name-verified {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pro-full-name {
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.verified-badge {
  color: #4ade80;
  font-size: 14px;
}

.pro-base-price-tag {
  margin-left: auto;
  font-size: 12px;
  font-weight: 800;
  color: #D4FF24;
}

.pro-stats-strip {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  margin: 2px 0 5px;
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
  gap: 4px;
}

.pro-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 5px;
  padding: 2px 6px;
  font-size: 10px;
  color: #d1d5db;
}

.card-mobile-actions {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.view-profile-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-radius: 9px;
  padding: 8px 10px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
}

.quick-select-pro-btn {
  background: rgba(212, 255, 36, 0.14);
  border: 1px solid rgba(212, 255, 36, 0.45);
  color: #D4FF24;
  border-radius: 9px;
  padding: 8px 10px;
  font-size: 11.5px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
}

.load-more-container {
  margin-top: 8px;
}

.load-more-btn {
  width: 100%;
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  height: 38px;
  color: #d1d5db;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
}

/* ================= SUPORTE MOBILE ================= */
.support-banner-box {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
}

.support-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.headphone-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(212, 255, 36, 0.1);
  color: #D4FF24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.support-title {
  font-size: 13.5px;
  font-weight: 800;
  margin: 0;
}

.support-subtitle {
  font-size: 11px;
  color: #9ca3af;
  margin: 1px 0 0;
}

.support-chevron {
  color: #D4FF24;
  font-size: 17px;
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
  margin-bottom: 14px;
}

.sheet-title {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.sheet-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin: 2px 0 0;
}

.btn-close-modal {
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: #9ca3af;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
}

.pro-modal-category {
  font-size: 10.5px;
  font-weight: 800;
  color: #D4FF24;
  text-transform: uppercase;
}

.pro-modal-profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.pro-modal-avatar-big {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.pro-modal-stats-summary {
  display: flex;
  gap: 6px;
  flex: 1;
}

.stat-pill-box {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 7px;
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.stat-val {
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
}

.stat-lbl {
  font-size: 9.5px;
  color: #9ca3af;
}

.modal-section-title {
  font-size: 12.5px;
  font-weight: 700;
  color: #d1d5db;
  margin: 12px 0 5px;
}

.pro-bio-text {
  font-size: 12.5px;
  color: #9ca3af;
  line-height: 1.4;
  margin: 0;
}

.badges-row-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.badge-modal-pill {
  background: rgba(212, 255, 36, 0.1);
  border: 1px solid rgba(212, 255, 36, 0.3);
  color: #D4FF24;
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 99px;
}

.review-modal-box {
  background: #111622;
  border-radius: 10px;
  padding: 9px;
  margin-bottom: 7px;
}

.review-top-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  margin-bottom: 3px;
}

.review-stars {
  color: #facc15;
}

.review-comment-p {
  font-size: 11.5px;
  color: #9ca3af;
  margin: 0;
}

.hire-now-modal-btn {
  width: 100%;
  margin-top: 14px;
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 11px;
  height: 46px;
  font-size: 13px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.text-center {
  text-align: center;
}

.success-check-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(212, 255, 36, 0.14);
  color: #D4FF24;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px auto 10px;
}

.order-summary-box {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  margin: 14px 0;
  text-align: left;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-line:last-child {
  border-bottom: none;
}

.sum-label {
  color: #9ca3af;
}

.sum-val {
  color: #ffffff;
  text-align: right;
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
  width: 100%;
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 11px;
  height: 44px;
  font-size: 12.5px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.btn-secondary-modal {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 11px;
  height: 42px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.support-options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.support-option-item {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 13px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.support-opt-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  flex-shrink: 0;
}

.support-opt-icon.whatsapp {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.support-opt-icon.shield {
  background: rgba(212, 255, 36, 0.15);
  color: #D4FF24;
}

.support-opt-info {
  flex: 1;
}

.support-opt-info h4 {
  font-size: 13.5px;
  font-weight: 700;
  margin: 0 0 2px;
}

.support-opt-info p {
  font-size: 11.5px;
  color: #9ca3af;
  margin: 0;
}

.opt-arrow {
  color: #9ca3af;
}
</style>
