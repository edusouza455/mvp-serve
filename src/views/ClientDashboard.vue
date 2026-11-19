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
              <span>Solicitações</span>
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
          
          <!-- BANNER QUANDO HÁ UM PROFISSIONAL SELECIONADO (COM STATUS DA AGENDA) -->
          <div v-if="store.selectedProfessional" class="selected-pro-card-banner" :class="{ 'pro-busy-alert': !isSelectedProFreeOnDate }">
            <div class="selected-pro-left" @click="openProfileModal(store.selectedProfessional)">
              <img :src="store.selectedProfessional.avatar" :alt="store.selectedProfessional.nome" class="selected-pro-img" />
              <div class="selected-pro-meta">
                <div class="selected-top-tags">
                  <span class="selected-headline-tag">SELECIONADO</span>
                  <span
                    class="pro-date-availability-tag"
                    :class="isSelectedProFreeOnDate ? 'free' : 'busy'"
                  >
                    {{ isSelectedProFreeOnDate ? '✓ Livre na data' : '⚠️ Ocupado na data' }}
                  </span>
                </div>
                <h3 class="selected-name-title">{{ store.selectedProfessional.nome }}</h3>
                <p class="selected-spec-text">
                  <span v-if="isSelectedProFreeOnDate" class="text-green-avail">✓ Disponível para {{ formattedDateDisplay }}</span>
                  <span v-else class="text-amber-busy">Toque para ver os dias livres na agenda</span>
                </p>
              </div>
            </div>
            <div class="selected-right-actions">
              <button type="button" class="view-agenda-selected-btn" @click="openProfileModal(store.selectedProfessional)">
                📅 Agenda
              </button>
              <button type="button" class="clear-selected-btn" @click="store.clearSelectedProfessional">
                Trocar
              </button>
            </div>
          </div>

          <div class="form-fields-grid">

            <!-- 1. SELETOR INTUITIVO DE PROFISSIONAL (BUSCA, MACRO-CATEGORIAS E GRADE 3x2) -->
            <div class="pro-selector-showcase-card">
              <div class="pro-selector-header-row">
                <h3 class="pro-selector-heading">Profissional</h3>

                <div class="pro-search-input-wrap">
                  <ion-icon :icon="searchOutline" class="search-micro-icon"></ion-icon>
                  <input
                    type="text"
                    v-model="searchProfessionQuery"
                    placeholder="Buscar profissional..."
                    class="pro-search-input"
                  />
                  <button
                    v-if="searchProfessionQuery"
                    type="button"
                    class="clear-search-btn"
                    @click="searchProfessionQuery = ''"
                  >✕</button>
                </div>
              </div>

              <!-- Abas de Macro-Categoria (Eventos | Casa | Limpeza | Saúde e Bem-estar | Aulas | Tecnologia) -->
              <div class="macro-group-pills">
                <button
                  v-for="grp in professionGroups"
                  :key="grp.id"
                  type="button"
                  class="macro-pill-btn"
                  :class="{ active: selectedGroupName === grp.id && !searchProfessionQuery }"
                  @click="selectMacroGroup(grp.id)"
                >
                  {{ grp.label }}
                </button>
              </div>

              <!-- Grade de Profissões (3 cards no topo, expansível com seta para ver o resto) -->
              <div class="pro-subcards-grid">
                <button
                  v-for="profName in displayedGroupProfessions"
                  :key="profName"
                  type="button"
                  class="pro-subcard-item"
                  :class="{ active: selectedCategoryName === profName }"
                  @click="chooseProfession(profName)"
                >
                  <ion-icon
                    :icon="getCategoryIcon(CATEGORY_CONFIGS[profName]?.icon)"
                    class="pro-subcard-icon"
                  ></ion-icon>
                  <span class="pro-subcard-label">{{ CATEGORY_CONFIGS[profName]?.label || profName }}</span>
                </button>
              </div>

              <!-- Seta / Botão Minimalista para Expandir / Recolher o resto dos cards -->
              <div v-if="hasMoreThanThreeProfessions && !searchProfessionQuery" class="pro-expand-toggle-row">
                <button
                  type="button"
                  class="pro-expand-pill-btn"
                  @click="isProfessionsExpanded = !isProfessionsExpanded"
                  :title="isProfessionsExpanded ? 'Recolher' : 'Ver mais'"
                >
                  <span>{{ isProfessionsExpanded ? 'Recolher' : 'Ver mais' }}</span>
                  <ion-icon :icon="isProfessionsExpanded ? chevronUpOutline : chevronDownOutline" class="expand-chevron-icon"></ion-icon>
                </button>
              </div>
            </div>

            <!-- 2. DATA, INÍCIO E FIM DO EVENTO / ATENDIMENTO -->
            <div class="form-section-block">
              <div class="section-label-row">
                <label class="field-label-clean">
                  <ion-icon :icon="calendarOutline" class="label-neon-icon"></ion-icon>
                  <span>Data e Horário</span>
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
                    <span class="boxed-label">Data</span>
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
                    <span class="boxed-label">Término</span>
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
                <span>⏱️ {{ formattedDateDisplay }} • {{ store.eventForm.horarioInicio }} às {{ store.eventForm.horarioFim }} ({{ calculatedDuration }})</span>
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

            <!-- 5. VALOR OFERECIDO POR PROFISSIONAL -->
            <div class="boxed-field price-boxed-field" :class="{ 'min-price-alert': minPriceWarningActive }">
              <div class="price-left-meta">
                <div class="currency-circle">$</div>
                <div class="boxed-inner">
                  <span class="boxed-label">Valor oferecido</span>
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
              ⚠️ Mínimo: <strong>R$ 50,00</strong>.
            </div>

            <!-- Sugestões rápidas de valor da categoria -->
            <div class="price-presets-row">
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
            <span>Profissionais verificados • Pagamento direto</span>
          </div>

        </div>

        <!-- SEÇÃO MOBILE: RANKING DOS MELHORES AVALIADOS & IMPULSIONADOS -->
        <div id="available-section" class="available-mobile-section">
          <div class="section-heading-row">
            <div class="heading-left">
              <ion-icon :icon="trophyOutline" class="section-icon-neon"></ion-icon>
              <div>
                <h2 class="available-section-title">Ranking • {{ activeConfig.plural }}</h2>
                <span class="ranking-sub-caption">Melhores avaliados & perfis com Impulso</span>
              </div>
            </div>
            <span class="ranking-legend-pill">🚀 Destaque</span>
          </div>

          <div class="available-pros-stack">
            <div
              v-for="(pro, idx) in displayedAvailablePros"
              :key="pro.id"
              class="pro-profile-card"
              :class="{ 'boosted-rank-card': pro.isBoosted || idx === 0 }"
            >
              <div class="card-left-block" @click="openProfileModal(pro)">
                <div class="avatar-status-wrap">
                  <span class="rank-pos-badge" :class="{ top1: idx === 0, top2: idx === 1, top3: idx === 2 }">
                    #{{ idx + 1 }}
                  </span>
                  <img :src="pro.avatar" :alt="pro.nome" class="pro-main-avatar" />
                  <span class="online-dot"></span>
                </div>

                <div class="pro-core-info">
                  <div class="pro-name-verified">
                    <h3 class="pro-full-name">{{ pro.nome }}</h3>
                    <span v-if="pro.isBoosted || idx === 0" class="boost-rank-tag">
                      <ion-icon :icon="rocketOutline"></ion-icon>
                      <span>Impulso</span>
                    </span>
                    <span v-else class="top-rated-tag">★ Top</span>
                  </div>

                  <div class="pro-stats-strip">
                    <span class="rating-val">★ {{ pro.nota }}</span>
                    <span class="dot-sep">•</span>
                    <span class="jobs-val">{{ pro.servicos }} serv.</span>
                    <span class="dot-sep">•</span>
                    <span
                      v-if="store.isProfessionalFreeOnDate(pro, store.eventForm.data)"
                      class="pro-agenda-inline free"
                    >
                      🟢 Livre na data
                    </span>
                    <span
                      v-else
                      class="pro-agenda-inline busy"
                    >
                      🔴 Ocupado na data
                    </span>
                  </div>
                </div>
              </div>

              <div class="card-mobile-actions">
                <button type="button" class="view-profile-btn" @click="openProfileModal(pro)">
                  <span>📅 Agenda</span>
                </button>
                <button
                  type="button"
                  class="quick-select-pro-btn"
                  :class="{ 'busy-warn': !store.isProfessionalFreeOnDate(pro, store.eventForm.data) }"
                  @click="selectAndScrollToForm(pro)"
                >
                  <span>Escolher</span>
                  <ion-icon :icon="arrowForwardOutline"></ion-icon>
                </button>
              </div>
            </div>
          </div>

          <div class="load-more-container" v-if="filteredAvailable.length > 3">
            <button type="button" class="load-more-btn" @click="toggleShowMorePros">
              <span>{{ showAllPros ? 'Recolher' : 'Ver mais' }}</span>
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
              <p class="support-subtitle">Suporte 24h no WhatsApp</p>
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
                <span class="stat-val">{{ activeModalPro.exp || '5 anos' }}</span>
                <span class="stat-lbl">Experiência</span>
              </div>
            </div>
          </div>

          <!-- SEÇÃO INTERATIVA: AGENDA & DIAS LIVRES DO GARÇOM / PROFISSIONAL -->
          <div class="pro-modal-agenda-section">
            <div class="modal-agenda-header">
              <div class="modal-agenda-title-wrap">
                <ion-icon :icon="calendarOutline" class="neon-icon"></ion-icon>
                <h4 class="modal-section-title">Agenda de {{ activeModalPro.nome.split(' ')[0] }}</h4>
              </div>
              <span
                class="agenda-status-pill"
                :class="isModalProFreeOnDate ? 'free' : 'busy'"
              >
                {{ isModalProFreeOnDate ? '🟢 Livre na sua data' : '🔴 Ocupado na sua data' }}
              </span>
            </div>

            <p class="modal-agenda-tip">
              Toque em um <strong>dia verde (livre)</strong> para escolher a data da proposta:
            </p>

            <!-- Mini Calendário do Profissional (Novembro 2026) -->
            <div class="modal-mini-calendar">
              <div class="mini-cal-month-bar">
                <strong>Novembro 2026</strong>
                <span class="mini-cal-legend">
                  <i class="dot-leg free"></i> Livre
                  <i class="dot-leg busy"></i> Ocupado
                </span>
              </div>

              <div class="mini-cal-weekdays">
                <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
              </div>

              <div class="mini-cal-grid">
                <button
                  v-for="cell in modalProScheduleCells"
                  :key="cell.key"
                  type="button"
                  class="mini-cal-day-cell"
                  :class="{
                    empty: cell.empty,
                    free: !cell.empty && cell.status === 'FREE',
                    busy: !cell.empty && cell.status === 'BUSY',
                    past: !cell.empty && cell.status === 'PAST',
                    selected: !cell.empty && cell.iso === store.eventForm.data
                  }"
                  :disabled="cell.empty || cell.status === 'PAST'"
                  @click="pickFreeDateFromModalAgenda(cell)"
                >
                  <span v-if="!cell.empty">{{ cell.day }}</span>
                  <span v-if="!cell.empty" class="mini-cell-dot" :class="cell.status.toLowerCase()"></span>
                </button>
              </div>
            </div>

            <!-- Feedback da data selecionada na agenda -->
            <div class="modal-agenda-feedback" :class="isModalProFreeOnDate ? 'success' : 'warn'">
              <span v-if="isModalProFreeOnDate">
                ✓ <strong>{{ activeModalPro.nome.split(' ')[0] }} está livre</strong> para {{ formattedDateDisplay }}! Pronto para propor.
              </span>
              <span v-else>
                ⚠️ <strong>Indisponível em {{ formattedDateDisplay }}.</strong> Toque em um dia verde acima para liberar o envio da proposta.
              </span>
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
            <button
              class="hire-now-modal-btn"
              :class="{ 'disabled-btn': !isModalProFreeOnDate }"
              :disabled="!isModalProFreeOnDate"
              @click="hireFromModal(activeModalPro)"
            >
              <span v-if="isModalProFreeOnDate">ENVIAR PROPOSTA PARA {{ activeModalPro.nome.split(' ')[0].toUpperCase() }}</span>
              <span v-else>ESCOLHA UMA DATA LIVRE NA AGENDA</span>
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
          <h2 class="sheet-title">Pedido Enviado!</h2>
          <p class="sheet-subtitle">Profissionais da região já receberam seu chamado.</p>

          <div class="order-summary-box">
            <div class="summary-line">
              <span class="sum-label">Serviço:</span>
              <strong class="sum-val">{{ createdOrderData.categoria }} • {{ createdOrderData.tipoEvento }}</strong>
            </div>
            <div class="summary-line">
              <span class="sum-label">Horário:</span>
              <span class="sum-val">{{ createdOrderData.data }} • {{ createdOrderData.horarioInicio }} às {{ createdOrderData.horarioFim }}</span>
            </div>
            <div class="summary-line">
              <span class="sum-label">Local:</span>
              <span class="sum-val">{{ createdOrderData.local || 'Boa Vista - RR' }}</span>
            </div>
            <div v-if="createdOrderData.descricao" class="summary-line">
              <span class="sum-label">Detalhes:</span>
              <span class="sum-val">{{ createdOrderData.descricao }}</span>
            </div>
            <div class="summary-line">
              <span class="sum-label">Valor:</span>
              <strong class="sum-val neon-color">R$ {{ createdOrderData.valorOferecido }},00</strong>
            </div>
          </div>

          <div class="modal-buttons-stack">
            <button class="btn-primary-modal" @click="openChatFromSuccess">
              <ion-icon :icon="chatbubbleOutline"></ion-icon>
              <span>Abrir Chat</span>
            </button>
            <button class="btn-secondary-modal" @click="viewOrdersFromSuccess">
              <span>Ver Pedidos</span>
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
  closeCircleOutline,
  locationOutline,
  headsetOutline,
  flashOutline,
  sparklesOutline,
  waterOutline,
  constructOutline,
  wineOutline,
  restaurantOutline,
  flameOutline,
  shirtOutline,
  searchOutline,
  shieldOutline,
  idCardOutline,
  cameraOutline,
  colorPaletteOutline,
  keyOutline,
  leafOutline,
  fitnessOutline,
  cutOutline,
  heartOutline,
  schoolOutline,
  laptopOutline,
  phonePortraitOutline,
  musicalNotesOutline,
  cafeOutline,
  snowOutline,
  ribbonOutline,
  trophyOutline,
  rocketOutline
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
const isProfessionsExpanded = ref(false);
const searchProfessionQuery = ref('');
const showAllPros = ref(false);
const activeDateShortcut = ref('today');

const activeGroupProfessions = computed(() => {
  const query = searchProfessionQuery.value.trim().toLowerCase();
  if (query) {
    const allKeys = Object.keys(CATEGORY_CONFIGS);
    return allKeys.filter(k => {
      const conf = CATEGORY_CONFIGS[k];
      return (
        k.toLowerCase().includes(query) ||
        (conf.label && conf.label.toLowerCase().includes(query)) ||
        (conf.group && conf.group.toLowerCase().includes(query)) ||
        (conf.plural && conf.plural.toLowerCase().includes(query))
      );
    });
  }
  const found = professionGroups.find(g => g.id === selectedGroupName.value);
  return found ? found.items : professionGroups[0].items;
});

const hasMoreThanThreeProfessions = computed(() => {
  return activeGroupProfessions.value.length > 3;
});

const displayedGroupProfessions = computed(() => {
  if (searchProfessionQuery.value.trim()) {
    return activeGroupProfessions.value.slice(0, 9);
  }
  if (isProfessionsExpanded.value) {
    return activeGroupProfessions.value;
  }
  return activeGroupProfessions.value.slice(0, 3);
});

const activeConfig = computed(() => {
  return CATEGORY_CONFIGS[selectedCategoryName.value] || CATEGORY_CONFIGS.Garçom;
});

function getCategoryIcon(iconKey) {
  switch (iconKey) {
    case 'restaurant': return restaurantOutline;
    case 'wine': return wineOutline;
    case 'flame': return flameOutline;
    case 'shield': return shieldOutline;
    case 'id-card': return idCardOutline;
    case 'camera': return cameraOutline;
    case 'flash': return flashOutline;
    case 'sparkles': return sparklesOutline;
    case 'water': return waterOutline;
    case 'construct': return constructOutline;
    case 'home': return homeOutline;
    case 'shirt': return shirtOutline;
    case 'color-palette': return colorPaletteOutline;
    case 'key': return keyOutline;
    case 'leaf': return leafOutline;
    case 'fitness': return fitnessOutline;
    case 'cut': return cutOutline;
    case 'heart': return heartOutline;
    case 'school': return schoolOutline;
    case 'laptop': return laptopOutline;
    case 'phone-portrait': return phonePortraitOutline;
    case 'musical-notes': return musicalNotesOutline;
    case 'cafe': return cafeOutline;
    case 'snow': return snowOutline;
    case 'ribbon': return ribbonOutline;
    default: return restaurantOutline;
  }
}

function selectMacroGroup(groupId) {
  selectedGroupName.value = groupId;
  searchProfessionQuery.value = '';
  isProfessionsExpanded.value = false;
  const grp = professionGroups.find(g => g.id === groupId);
  if (grp && grp.items.length > 0 && !grp.items.includes(selectedCategoryName.value)) {
    setCategory(grp.items[0]);
  }
}

function chooseProfession(profName) {
  const conf = CATEGORY_CONFIGS[profName];
  if (conf && conf.group) {
    selectedGroupName.value = conf.group;
  }
  setCategory(profName);
  searchProfessionQuery.value = '';
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
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const wd = shortWeekdays[dateObj.getDay()];
  const dd = String(d).padStart(2, '0');
  const mm = months[m - 1] || String(m).padStart(2, '0');
  return `${wd}, ${dd} ${mm}`;
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

// Verificação de Disponibilidade na Agenda do Profissional
const isSelectedProFreeOnDate = computed(() => {
  if (!store.selectedProfessional) return true;
  return store.isProfessionalFreeOnDate(store.selectedProfessional, store.eventForm.data);
});

const isModalProFreeOnDate = computed(() => {
  if (!activeModalPro.value) return true;
  return store.isProfessionalFreeOnDate(activeModalPro.value, store.eventForm.data);
});

const modalProScheduleCells = computed(() => {
  if (!activeModalPro.value) return [];
  let y = 2026;
  let m = 10; // Novembro
  if (store.eventForm.data && store.eventForm.data.includes('-')) {
    const parts = store.eventForm.data.split('-').map(Number);
    y = parts[0];
    m = parts[1] - 1;
  }
  return store.getProfessionalScheduleCells(activeModalPro.value, y, m);
});

function pickFreeDateFromModalAgenda(cell) {
  if (cell.empty || cell.status === 'PAST') return;
  if (cell.status === 'BUSY') {
    toastMsg.value = `⚠️ ${activeModalPro.value?.nome?.split(' ')[0] || 'O profissional'} está ocupado no dia ${cell.day}. Escolha um dia verde (livre).`;
    showToast.value = true;
    return;
  }
  store.eventForm.data = cell.iso;
  activeDateShortcut.value = 'custom';
  toastMsg.value = `Data definida: ${formattedDateDisplay.value}! ${activeModalPro.value?.nome?.split(' ')[0]} está livre nesta data.`;
  showToast.value = true;
}

const actionButtonText = computed(() => {
  const price = store.eventForm.valorOferecido ? ` • R$ ${store.eventForm.valorOferecido}` : '';
  if (store.selectedProfessional) {
    const firstName = store.selectedProfessional.nome.split(' ')[0];
    if (!isSelectedProFreeOnDate.value) {
      return `⚠️ ${firstName.toUpperCase()} OCUPADO • ESCOLHER DATA LIVRE`;
    }
    return `CONTRATAR ${firstName.toUpperCase()}${price}`;
  }
  return `BUSCAR ${activeConfig.value.plural.toUpperCase()}${price}`;
});

const weeklyHighlights = computed(() => {
  const matches = store.highlightedProfessionals.filter(p => p.categoria === selectedCategoryName.value);
  return matches.length ? matches.slice(0, 3) : store.highlightedProfessionals.slice(0, 3);
});

const filteredAvailable = computed(() => {
  const matches = store.availableProfessionals.filter(p => p.categoria === selectedCategoryName.value);
  const baseList = matches.length ? [...matches] : [...store.availableProfessionals];
  return baseList.sort((a, b) => {
    const boostA = a.isBoosted ? 1 : 0;
    const boostB = b.isBoosted ? 1 : 0;
    if (boostB !== boostA) return boostB - boostA;
    const ratingA = parseFloat(String(a.nota || '4.8').replace(',', '.')) || 4.8;
    const ratingB = parseFloat(String(b.nota || '4.8').replace(',', '.')) || 4.8;
    if (ratingB !== ratingA) return ratingB - ratingA;
    return (Number(b.servicos) || 0) - (Number(a.servicos) || 0);
  });
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
  const isFree = store.isProfessionalFreeOnDate(pro, store.eventForm.data);
  if (!isFree) {
    toastMsg.value = `⚠️ ${pro.nome.split(' ')[0]} está ocupado(a) na data escolhida. Abra a agenda para escolher um dia livre.`;
  } else {
    toastMsg.value = `${pro.nome} selecionado! Livre para ${formattedDateDisplay.value}.`;
  }
  showToast.value = true;
  const el = document.getElementById('form-event-card');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hireFromModal(pro) {
  const isFree = store.isProfessionalFreeOnDate(pro, store.eventForm.data);
  if (!isFree) {
    toastMsg.value = `⚠️ Escolha um dia com ponto verde na agenda acima antes de enviar a proposta.`;
    showToast.value = true;
    return;
  }
  isProfileModalOpen.value = false;
  selectAndScrollToForm(pro);
}

function handleConfirmOrder() {
  if (!store.eventForm.valorOferecido || store.eventForm.valorOferecido < 50) {
    triggerMinimumFloorAlert();
    return;
  }
  if (store.selectedProfessional && !isSelectedProFreeOnDate.value) {
    const proName = store.selectedProfessional.nome.split(' ')[0];
    toastMsg.value = `⚠️ ${proName} está ocupado(a) em ${formattedDateDisplay.value}. Escolha uma data livre na agenda dele para enviar a proposta!`;
    showToast.value = true;
    openProfileModal(store.selectedProfessional);
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
  max-width: 440px;
  margin: 0 auto;
  padding: 0 12px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
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
  max-width: 440px;
  margin: 0 auto;
  width: 100%;
  padding: 12px 12px 92px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  overflow-x: hidden;
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

.selected-pro-card-banner.pro-busy-alert {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.35);
}

.selected-top-tags {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pro-date-availability-tag {
  font-size: 9px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 99px;
}

.pro-date-availability-tag.free {
  background: rgba(34, 197, 94, 0.16);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.35);
}

.pro-date-availability-tag.busy {
  background: rgba(239, 68, 68, 0.16);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.text-green-avail {
  color: #4ade80;
}

.text-amber-busy {
  color: #fbbf24;
}

.selected-right-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.view-agenda-selected-btn {
  background: rgba(212, 255, 36, 0.12);
  border: 1px solid rgba(212, 255, 36, 0.4);
  color: #D4FF24;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 7px;
  cursor: pointer;
  white-space: nowrap;
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

/* Seletor Hierárquico de Profissional (Fiel ao App Mobile - Imagem de Referência) */
.pro-selector-showcase-card {
  background: #04060b;
  border: 1.5px solid rgba(212, 255, 36, 0.28);
  border-radius: 16px;
  padding: 12px 12px 10px;
}

.pro-selector-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.pro-selector-heading {
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
}

.pro-search-input-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0a0e18;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9px;
  padding: 5px 8px;
  max-width: 200px;
  flex: 1;
}

.search-micro-icon {
  color: #64748b;
  font-size: 13px;
  flex-shrink: 0;
}

.pro-search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 0.74rem;
  width: 100%;
}

.pro-search-input::placeholder {
  color: #64748b;
}

.clear-search-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 10px;
  cursor: pointer;
  padding: 0 2px;
}



/* Abas de Macro-Categoria em Pílulas com Scroll Horizontal */
.macro-group-pills {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 8px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.macro-group-pills::-webkit-scrollbar {
  display: none;
}

.macro-pill-btn {
  background: #0d121c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.74rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.macro-pill-btn.active {
  background: #ffffff;
  border-color: #ffffff;
  color: #05070b;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

/* Grade de Profissões (3 colunas com minmax para evitar transpassar) */
.pro-subcards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
}

.pro-subcard-item {
  background: #080c14;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 4px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  min-height: 66px;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.15s ease;
}

.pro-subcard-item:hover {
  border-color: rgba(255, 255, 255, 0.18);
  background: #0b101c;
}

.pro-subcard-item.active {
  background: rgba(212, 255, 36, 0.05);
  border: 1.5px solid #D4FF24;
}

.pro-subcard-icon {
  font-size: 22px;
  color: #94a3b8;
  transition: color 0.15s ease;
  flex-shrink: 0;
}

.pro-subcard-item.active .pro-subcard-icon {
  color: #D4FF24;
}

.pro-subcard-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  width: 100%;
  display: block;
  text-align: center;
  padding: 0 2px;
  box-sizing: border-box;
}

.pro-subcard-item.active .pro-subcard-label {
  font-weight: 800;
  color: #ffffff;
}

/* Linha com Seta para Expandir / Recolher */
.pro-expand-toggle-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
}

.pro-expand-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pro-expand-pill-btn:hover {
  background: rgba(212, 255, 36, 0.08);
  border-color: rgba(212, 255, 36, 0.4);
  color: #D4FF24;
}

.expand-chevron-icon {
  font-size: 13px;
  color: #D4FF24;
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
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
}

.trust-shield-icon {
  color: #D4FF24;
  font-size: 18px;
  flex-shrink: 0;
}







/* ================= LISTA DE PROFISSIONAIS (RANKING MELHORES AVALIADOS & IMPULSO) ================= */
.section-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.heading-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon-neon {
  color: #D4FF24;
  font-size: 20px;
  flex-shrink: 0;
}

.available-section-title {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}

.ranking-sub-caption {
  display: block;
  font-size: 10.5px;
  color: #9ca3af;
  font-weight: 500;
}

.ranking-legend-pill {
  background: rgba(212, 255, 36, 0.12);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 9px;
  border-radius: 99px;
  white-space: nowrap;
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
  padding: 11px 12px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.pro-profile-card.boosted-rank-card {
  border-color: rgba(212, 255, 36, 0.38);
  background: linear-gradient(145deg, #080c13 0%, #0d131f 100%);
}

.rank-pos-badge {
  position: absolute;
  top: -5px;
  left: -5px;
  z-index: 3;
  background: #1e293b;
  border: 1.5px solid #070a10;
  color: #e2e8f0;
  font-size: 9.5px;
  font-weight: 900;
  padding: 1px 5px;
  border-radius: 99px;
  line-height: 1.2;
}

.rank-pos-badge.top1 {
  background: #D4FF24;
  color: #050800;
}

.rank-pos-badge.top2 {
  background: #cbd5e1;
  color: #050800;
}

.rank-pos-badge.top3 {
  background: #f59e0b;
  color: #050800;
}

.boost-rank-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: rgba(212, 255, 36, 0.14);
  border: 1px solid rgba(212, 255, 36, 0.4);
  color: #D4FF24;
  font-size: 9.5px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 99px;
}

.top-rated-tag {
  display: inline-flex;
  align-items: center;
  background: rgba(250, 204, 21, 0.12);
  border: 1px solid rgba(250, 204, 21, 0.3);
  color: #facc15;
  font-size: 9.5px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 99px;
}

.pro-agenda-inline {
  font-size: 10.5px;
  font-weight: 700;
}

.pro-agenda-inline.free {
  color: #4ade80;
}

.pro-agenda-inline.busy {
  color: #f87171;
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

.pro-agenda-status-line {
  margin: 3px 0 5px;
}

.pro-agenda-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
}

.pro-agenda-tag.free {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.28);
}

.pro-agenda-tag.busy {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.28);
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

.quick-select-pro-btn.busy-warn {
  border-color: rgba(239, 68, 68, 0.45);
  color: #f87171;
  background: rgba(239, 68, 68, 0.1);
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

/* ================= MODAL AGENDA & CALENDÁRIO DO PROFISSIONAL ================= */
.pro-modal-agenda-section {
  background: #0d121c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  margin: 14px 0 10px;
}

.modal-agenda-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.modal-agenda-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.modal-agenda-title-wrap .modal-section-title {
  margin: 0;
  color: #ffffff;
}

.modal-agenda-title-wrap .neon-icon {
  color: #D4FF24;
  font-size: 16px;
}

.agenda-status-pill {
  font-size: 10.5px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 99px;
}

.agenda-status-pill.free {
  background: rgba(34, 197, 94, 0.16);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.35);
}

.agenda-status-pill.busy {
  background: rgba(239, 68, 68, 0.16);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.modal-agenda-tip {
  font-size: 11.5px;
  color: #9ca3af;
  margin: 0 0 10px;
}

.modal-agenda-tip strong {
  color: #4ade80;
}

.modal-mini-calendar {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 10px;
}

.mini-cal-month-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #ffffff;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.mini-cal-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: #9ca3af;
}

.dot-leg {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 2px;
}

.dot-leg.free {
  background: #22c55e;
}

.dot-leg.busy {
  background: #ea580c;
}

.mini-cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 6px;
}

.mini-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.mini-cal-day-cell {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 7px;
  padding: 6px 0 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 11.5px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mini-cal-day-cell.empty {
  visibility: hidden;
  border: none;
  background: transparent;
}

.mini-cal-day-cell.past {
  opacity: 0.3;
  cursor: not-allowed;
}

.mini-cal-day-cell.free {
  border-color: rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.08);
}

.mini-cal-day-cell.free:hover {
  background: rgba(34, 197, 94, 0.2);
}

.mini-cal-day-cell.busy {
  border-color: rgba(234, 88, 12, 0.3);
  background: rgba(234, 88, 12, 0.08);
  opacity: 0.85;
}

.mini-cal-day-cell.selected {
  border: 2px solid #D4FF24 !important;
  background: rgba(212, 255, 36, 0.22) !important;
  color: #ffffff;
}

.mini-cell-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.mini-cell-dot.free {
  background: #22c55e;
  box-shadow: 0 0 5px rgba(34, 197, 94, 0.6);
}

.mini-cell-dot.busy {
  background: #ea580c;
}

.mini-cell-dot.past {
  background: #6b7280;
}

.modal-agenda-feedback {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 11.5px;
  line-height: 1.4;
}

.modal-agenda-feedback.success {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #d1fae5;
}

.modal-agenda-feedback.warn {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fecaca;
}

.hire-now-modal-btn.disabled-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #9ca3af !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  cursor: not-allowed !important;
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
