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
            <a href="/home" class="nav-item" @click.prevent="goToHome">
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

          <!-- Ação Rápida de Chat no Mobile -->
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

        <!-- GRID PRINCIPAL PADRÃO (7x5 no Desktop | Empilhado Fluido no Mobile) -->
        <ion-grid class="ion-no-padding main-grid">
          <ion-row class="hero-form-row">
            
            <!-- COLUNA ESQUERDA: TÍTULO DINÂMICO + FORMULÁRIO PRECISO (Mobile: 100% | Desktop: 7/12) -->
            <ion-col size="12" size-lg="7" class="left-col">
              
              <!-- Título & Subtítulo com Seletor Contextual Integrado -->
              <div class="hero-header-box">
                <h1 class="hero-headline">
                  Encontre o <span class="neon-highlight">{{ activeConfig.noun }} ideal</span> {{ activeConfig.headlineSuffix }}.
                </h1>
                <p class="hero-subtext">
                  {{ activeConfig.subtitle }}
                </p>
              </div>

              <!-- CARD DO FORMULÁRIO PADRÃO (+SERVE) -->
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

                  <!-- 1. SELETOR INTUITIVO DE PROFISSIONAL / MODALIDADE (INTEGRADO AO FORMULÁRIO) -->
                  <div class="form-section-block">
                    <div class="section-label-row">
                      <label class="field-label-clean">
                        <ion-icon :icon="briefcaseOutline" class="label-neon-icon"></ion-icon>
                        <span>Qual profissional você precisa?</span>
                      </label>
                    </div>

                    <div class="integrated-role-selector">
                      <button
                        v-for="cat in store.categoriesList"
                        :key="cat.id"
                        type="button"
                        class="role-tab-btn"
                        :class="{ active: selectedCategoryName === cat.name }"
                        @click="setCategory(cat.name)"
                      >
                        <ion-icon :icon="getCategoryIcon(cat.icon)" class="role-tab-icon"></ion-icon>
                        <span>{{ cat.name }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- 2. DATA, INÍCIO E FIM DO EVENTO / ATENDIMENTO (PRECISO COMO NO DESIGN PADRÃO) -->
                  <div class="form-section-block">
                    <div class="section-label-row">
                      <label class="field-label-clean">
                        <ion-icon :icon="calendarOutline" class="label-neon-icon"></ion-icon>
                        <span>Quando você precisa do profissional?</span>
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

                    <!-- Grade de 3 Colunas: Data | Início | Fim (Fiel à Referência Original) -->
                    <div class="precise-datetime-grid">
                      <div class="boxed-field date-col">
                        <ion-icon :icon="calendarOutline" class="boxed-icon"></ion-icon>
                        <div class="boxed-inner">
                          <span class="boxed-label">Data do evento</span>
                          <input
                            type="date"
                            v-model="store.eventForm.data"
                            @change="activeDateShortcut = 'custom'"
                            class="boxed-input"
                          />
                        </div>
                      </div>

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
                      <span>⏱️ Período agendado: <strong>{{ formattedDateBR }}</strong> das <strong>{{ store.eventForm.horarioInicio }}</strong> às <strong>{{ store.eventForm.horarioFim }}</strong> ({{ calculatedDuration }})</span>
                    </div>
                  </div>

                  <!-- 3. QUANTIDADE / ESCOPO & TIPO DE EVENTO (2 COLUNAS LADO A LADO COMO NO PADRÃO) -->
                  <div class="two-cols-boxed-row">
                    <!-- Coluna 1: Quantidade / Porte -->
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

                    <!-- Coluna 2: Tipo de Evento / Serviço -->
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
                    <!-- Local -->
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

                    <!-- Breve Descrição -->
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
                        <span class="boxed-label">Valor oferecido por profissional (Piso: R$ 50)</span>
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

                  <!-- Aviso inline caso tente baixar de R$ 50 -->
                  <div v-if="minPriceWarningActive" class="min-floor-inline-notice">
                    ⚠️ O piso mínimo para contratação na plataforma é de <strong>R$ 50,00</strong>.
                  </div>

                  <!-- Sugestões rápidas de valor da categoria -->
                  <div class="price-presets-row">
                    <span class="preset-hint">Valores comuns para {{ activeConfig.noun }}:</span>
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

                <!-- Botão de Ação Principal -->
                <button class="primary-search-button" @click="handleConfirmOrder">
                  <span>{{ actionButtonText }}</span>
                  <ion-icon :icon="arrowForwardOutline" class="btn-arrow"></ion-icon>
                </button>

                <!-- Rodapé de Confiança Padrão -->
                <div class="trust-footer-row">
                  <ion-icon :icon="shieldCheckmarkOutline" class="trust-shield-icon"></ion-icon>
                  <div class="trust-copy">
                    <strong>Contrate com segurança</strong>
                    <span>Profissionais verificados • Avaliações reais • Pagamento protegido</span>
                  </div>
                </div>

              </div>
            </ion-col>

            <!-- COLUNA DIREITA: DESTAQUES DA SEMANA PADRÃO (Mobile: 100% | Desktop: 5/12) -->
            <ion-col size="12" size-lg="5" class="right-col">
              <div class="highlights-card">
                <div class="highlights-header">
                  <div class="highlights-title-row">
                    <ion-icon :icon="starOutline" class="highlight-star-icon"></ion-icon>
                    <h2 class="highlights-title">Destaques da semana</h2>
                  </div>
                  <p class="highlights-subtitle">Profissionais mais contratados e bem avaliados em {{ activeConfig.plural.toLowerCase() }}</p>
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
                  <span>Ver todos os destaques</span>
                  <ion-icon :icon="arrowForwardOutline"></ion-icon>
                </button>
              </div>
            </ion-col>

          </ion-row>

          <!-- SEÇÃO INFERIOR: PROFISSIONAIS DISPONÍVEIS PARA VOCÊ -->
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

      <!-- ================= MODAL: CONFIRMAÇÃO DO PEDIDO ================= -->
      <ion-modal
        :is-open="isOrderSuccessModalOpen"
        :breakpoints="[0, 0.78, 0.92]"
        :initial-breakpoint="0.78"
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
  peopleOutline,
  briefcaseOutline,
  documentTextOutline,
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
const minPriceWarningActive = ref(false);

// Modais locais
const isProfileModalOpen = ref(false);
const isOrderSuccessModalOpen = ref(false);
const isSupportModalOpen = ref(false);
const activeModalPro = ref(null);
const createdOrderData = ref(null);

// Estado da Categoria e Datas
const selectedCategoryName = ref('Garçom');
const showAllPros = ref(false);
const activeDateShortcut = ref('today');

const activeConfig = computed(() => {
  return CATEGORY_CONFIGS[selectedCategoryName.value] || CATEGORY_CONFIGS.Garçom;
});

function getCategoryIcon(iconKey) {
  switch (iconKey) {
    case 'flash': return flashOutline;
    case 'sparkles': return sparklesOutline;
    case 'water': return waterOutline;
    case 'construct': return constructOutline;
    default: return wineOutline;
  }
}

// A cada categoria selecionada, adapta todos os campos do formulário
function setCategory(catName) {
  selectedCategoryName.value = catName;
  store.eventForm.categoria = catName;
  minPriceWarningActive.value = false;

  const conf = CATEGORY_CONFIGS[catName] || CATEGORY_CONFIGS.Garçom;
  store.eventForm.tipoEvento = conf.serviceTypes[0];
  store.eventForm.qtdProfissionais = conf.scopes[1] || conf.scopes[0];
  store.eventForm.horarioInicio = conf.defaultStart || '18:00';
  store.eventForm.horarioFim = conf.defaultEnd || '00:00';
  store.eventForm.valorOferecido = conf.defaultPrice;

  if (store.selectedProfessional && store.selectedProfessional.categoria !== catName) {
    store.clearSelectedProfessional();
  }
}

function applyDateShortcut(mode) {
  activeDateShortcut.value = mode;
  const now = new Date();
  if (mode === 'today') {
    store.eventForm.data = now.toISOString().split('T')[0];
  } else if (mode === 'tomorrow') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    store.eventForm.data = tomorrow.toISOString().split('T')[0];
  }
}

const formattedDateBR = computed(() => {
  const raw = store.eventForm.data;
  if (!raw || !raw.includes('-')) return raw || 'Hoje';
  const [y, m, d] = raw.split('-');
  return `${d}/${m}/${y}`;
});

const calculatedDuration = computed(() => {
  const start = store.eventForm.horarioInicio || '18:00';
  const end = store.eventForm.horarioFim || '00:00';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if (isNaN(sh) || isNaN(eh)) return '6 horas';
  let diffMinutes = (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0));
  if (diffMinutes <= 0) diffMinutes += 24 * 60;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return mins > 0 ? `${hours}h${mins}min` : `${hours}h de duração`;
});

// Validação de Piso Mínimo de R$ 50,00 com Notificação
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
  applyDateShortcut('today');

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
  --min-height: 58px;
}

.header-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 16px;
  height: 58px;
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
  font-size: 27px;
  font-weight: 900;
  line-height: 1;
}

.brand-name {
  color: #ffffff;
  font-size: 20px;
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
}

.orders-count-dot {
  background: #D4FF24;
  color: #050800;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 99px;
}

.mobile-icon-btn {
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
  padding: 16px 16px 96px;
}

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
  font-size: clamp(25px, 4.2vw, 36px);
  font-weight: 800;
  line-height: 1.18;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.4px;
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

/* ================= CARD DO FORMULÁRIO PADRÃO (+SERVE) ================= */
.form-card-container {
  background: #070a10;
  border: 1px solid rgba(212, 255, 36, 0.28);
  border-radius: 16px;
  padding: 18px 16px;
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .form-card-container {
    padding: 22px 22px;
  }
}

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

/* Campos do Formulário */
.form-fields-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-section-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.field-label-clean {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
}

.label-neon-icon {
  color: #D4FF24;
  font-size: 17px;
}

/* Seletor Integrado de Modalidade */
.integrated-role-selector {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  background: #0b0f17;
  padding: 5px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.07);
}

@media (max-width: 520px) {
  .integrated-role-selector {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .integrated-role-selector::-webkit-scrollbar {
    display: none;
  }
}

.role-tab-btn {
  background: transparent;
  border: 1px solid transparent;
  color: #9ca3af;
  border-radius: 9px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.16s ease;
}

.role-tab-btn.active {
  background: rgba(212, 255, 36, 0.14);
  border-color: rgba(212, 255, 36, 0.45);
  color: #D4FF24;
  font-weight: 800;
}

.role-tab-icon {
  font-size: 14px;
}

/* Atalhos rápidos Hoje / Amanhã */
.quick-date-links {
  display: flex;
  gap: 6px;
}

.tiny-date-shortcut {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 99px;
  cursor: pointer;
}

.tiny-date-shortcut.active {
  background: rgba(212, 255, 36, 0.14);
  border-color: #D4FF24;
  color: #D4FF24;
}

/* Grade de Data, Início e Fim (Fiel à imagem de referência) */
.precise-datetime-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.precise-datetime-grid .date-col {
  grid-column: span 2;
}

@media (min-width: 600px) {
  .precise-datetime-grid {
    grid-template-columns: 1.35fr 1fr 1fr;
  }
  .precise-datetime-grid .date-col {
    grid-column: span 1;
  }
}

/* Campos em Caixa Padrão (+SERVE) */
.boxed-field {
  background: #0b0f17;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: border-color 0.18s;
}

.boxed-field:focus-within {
  border-color: rgba(212, 255, 36, 0.55);
}

.boxed-icon {
  color: #D4FF24;
  font-size: 18px;
  flex-shrink: 0;
}

.boxed-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.boxed-label {
  font-size: 10.5px;
  color: #9ca3af;
  margin-bottom: 2px;
}

.boxed-input,
.boxed-select {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 13.5px;
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
  font-size: 11.5px;
  color: #9ca3af;
  padding-left: 2px;
}

.duration-helper-bar strong {
  color: #e5e7eb;
}

/* Duas colunas para Quantidade & Tipo de Evento */
.two-cols-boxed-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

@media (min-width: 540px) {
  .two-cols-boxed-row {
    grid-template-columns: 1fr 1fr;
  }
}

.location-desc-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Campo de Valor Oferecido (Piso R$ 50) */
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
  gap: 10px;
}

.currency-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid #D4FF24;
  color: #D4FF24;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.price-value-line {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.rs-prefix {
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
}

.boxed-price-input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 16px;
  font-weight: 900;
  width: 58px;
  padding: 0;
}

.rs-decimals {
  font-size: 13px;
  font-weight: 700;
  color: #9ca3af;
}

.price-stepper-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.step-circle-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 16px;
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
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 10px;
}

.price-presets-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.preset-hint {
  font-size: 11px;
  color: #9ca3af;
}

.price-preset-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  font-size: 11.5px;
  font-weight: 600;
  padding: 4px 10px;
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
  gap: 10px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.trust-shield-icon {
  color: #D4FF24;
  font-size: 22px;
  flex-shrink: 0;
}

.trust-copy {
  display: flex;
  flex-direction: column;
}

.trust-copy strong {
  font-size: 12.5px;
  color: #ffffff;
}

.trust-copy span {
  font-size: 11.5px;
  color: #9ca3af;
}

/* ================= COLUNA DIREITA: DESTAQUES ================= */
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
  gap: 10px;
  font-size: 12.5px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-line:last-child {
  border-bottom: none;
}

.sum-label {
  color: #9ca3af;
  flex-shrink: 0;
}

.sum-val {
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
