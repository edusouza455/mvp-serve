<template>
  <ion-page class="provider-page-root">
    <!-- Header Mobile App (+ SERVE / PRESTADOR) -->
    <ion-header class="ion-no-border provider-header">
      <ion-toolbar class="provider-toolbar">
        <div class="header-inner">
          <!-- Clicar na logo dentro do painel mantém o prestador em Meus Serviços sem sair para a Home -->
          <div class="brand-block" @click="store.providerTab = 'servicos'">
            <span class="neon-plus">+</span>
            <span class="brand-name">SERVE</span>
            <span class="provider-mode-tag">PRESTADOR</span>
          </div>

          <div class="header-right-actions">
            <button
              type="button"
              class="wallet-pill-btn"
              @click="store.providerTab = 'carteira'"
              title="Abrir Carteira"
            >
              <span class="wallet-tiny-label">Saldo</span>
              <span class="wallet-value-text">{{ formatCurrency(store.walletBalance) }}</span>
            </button>

            <button
              type="button"
              class="switch-to-client-btn"
              @click="exitToClientHome"
              title="Voltar para a Home (Modo Cliente)"
            >
              <ion-icon :icon="swapHorizontalOutline"></ion-icon>
              <span>Cliente</span>
            </button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="provider-content">
      <div class="page-wrapper">

        <!-- ================= TELA 1: MEUS SERVIÇOS (SUA AGENDA + PROPOSTAS NO MOBILE) ================= -->
        <section v-if="store.providerTab !== 'carteira' && store.providerTab !== 'perfil'" class="tab-pane">

          <!-- BARRA MINIMALISTA DE IMPULSO MOBILE -->
          <div class="boost-minimal-strip" @click="store.boostModalOpen = true">
            <div class="boost-strip-info">
              <span class="boost-strip-icon">🚀</span>
              <span class="boost-strip-text">
                <strong>{{ store.activeBoost.name }}</strong> • {{ store.activeBoost.multiplier }} alcance ativo
              </span>
            </div>
            <button type="button" class="boost-strip-btn">
              <span>Turbinar</span>
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
            </button>
          </div>

          <!-- SELETOR SEGMENTADO MOBILE (PROPOSTAS PRIMEIRO, AGENDA DEPOIS) -->
          <div class="mobile-services-segmented">
            <button
              type="button"
              class="seg-pill-btn"
              :class="{ active: servicesSubView === 'propostas' }"
              @click="servicesSubView = 'propostas'"
            >
              <span>📋 Propostas ({{ filteredJobLeads.length }})</span>
            </button>
            <button
              type="button"
              class="seg-pill-btn"
              :class="{ active: servicesSubView === 'agenda' }"
              @click="servicesSubView = 'agenda'"
            >
              <span>📅 Sua Agenda</span>
            </button>
            <button
              type="button"
              class="seg-pill-btn"
              :class="{ active: servicesSubView === 'all' }"
              @click="servicesSubView = 'all'"
            >
              <span>Ver Tudo</span>
            </button>
          </div>

          <!-- ================= 1º BLOCO: PROPOSTAS RECEBIDAS & SERVIÇOS CONFIRMADOS (NO TOPO) ================= -->
          <div v-if="servicesSubView === 'all' || servicesSubView === 'propostas'" class="proposals-outer-card">

            <!-- 1. SERVIÇOS CONFIRMADOS / EM ANDAMENTO -->
            <div v-if="store.acceptedJobs.length > 0" class="accepted-jobs-section">
              <div class="section-top-bar">
                <div>
                  <h2 class="pane-title">Serviços Confirmados ({{ store.acceptedJobs.length }})</h2>
                  <p class="pane-subtitle">Converse no chat e conclua para receber diretamente</p>
                </div>
              </div>

              <div class="accepted-stack">
                <div
                  v-for="actJob in store.acceptedJobs"
                  :key="actJob.id"
                  class="accepted-job-card"
                >
                  <div class="accepted-top-row">
                    <span class="accepted-cat-pill">{{ actJob.category }} • {{ actJob.subType }}</span>
                    <span class="accepted-status-tag">
                      {{ actJob.status === 'COMPLETED' ? '✓ Finalizado' : '⚡ Na Agenda' }}
                    </span>
                  </div>

                  <h3 class="accepted-title">{{ actJob.title }}</h3>
                  <p class="accepted-meta">📅 {{ actJob.date }} às {{ actJob.time }} • 📍 {{ actJob.location }}</p>

                  <div class="accepted-client-bar">
                    <div class="client-mini-box">
                      <img :src="actJob.clientAvatar || 'https://i.pravatar.cc/150?img=32'" class="client-mini-avatar" alt="Cliente" />
                      <div>
                        <strong class="client-mini-name">{{ actJob.clientName || 'Cliente +SERVE' }}</strong>
                        <span class="client-mini-val">Líquido estimado: {{ formatCurrency(actJob.budget * 0.90) }}</span>
                      </div>
                    </div>

                    <div class="accepted-actions-row">
                      <button type="button" class="btn-chat-client" @click="openChatWithClient(actJob)">
                        <ion-icon :icon="chatbubbleOutline"></ion-icon>
                        <span>Chat & Acordo</span>
                      </button>
                      <button
                        v-if="actJob.status !== 'COMPLETED'"
                        type="button"
                        class="btn-finish-job"
                        @click="finishWorkerJob(actJob)"
                        title="Informar que o serviço foi executado"
                      >
                        <ion-icon :icon="checkmarkOutline"></ion-icon>
                        <span>Serviço Feito</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. PROPOSTAS RECEBIDAS DE CLIENTES -->
            <div class="available-leads-section">
              <div class="section-top-bar">
                <div>
                  <h2 class="pane-title">Propostas Recebidas</h2>
                  <p class="pane-subtitle">Solicitações abertas aguardando sua resposta</p>
                </div>
                <span class="leads-counter-pill">{{ filteredJobLeads.length }} disponíveis</span>
              </div>

              <div class="filter-pills-scroll">
                <button
                  v-for="catFilter in ['Todos', 'Garçom', 'Eletricista', 'Diarista', 'Encanador', 'Reformas']"
                  :key="catFilter"
                  type="button"
                  class="cat-filter-pill"
                  :class="{ active: selectedJobFilter === catFilter }"
                  @click="selectedJobFilter = catFilter"
                >
                  {{ catFilter }}
                </button>
              </div>

              <div v-if="filteredJobLeads.length === 0" class="empty-leads-box">
                <ion-icon :icon="sparklesOutline" class="empty-icon"></ion-icon>
                <h3 class="empty-title">Nenhuma proposta nesta categoria</h3>
                <p class="empty-desc">Recarregue as propostas de demonstração ou altere o filtro acima.</p>
                <button type="button" class="reload-jobs-btn" @click="resetJobs">
                  <ion-icon :icon="refreshOutline"></ion-icon>
                  <span>Recarregar Propostas</span>
                </button>
              </div>

              <div v-else class="jobs-stack">
                <div
                  v-for="job in filteredJobLeads"
                  :key="job.id"
                  class="job-card-item"
                >
                  <div class="job-card-body">
                    <div class="job-top-badges">
                      <span class="job-type-chip">{{ job.category }} • {{ job.subType }}</span>
                      <span class="job-scope-chip">{{ job.proCount }}</span>
                    </div>

                    <div class="job-header-row">
                      <h3 class="job-title">{{ job.title }}</h3>
                      <div class="job-payout-box">
                        <span class="payout-label">Proposta</span>
                        <span class="payout-amount">{{ formatCurrency(job.budget) }}</span>
                      </div>
                    </div>

                    <div class="job-meta-grid">
                      <div class="meta-item">
                        <ion-icon :icon="calendarOutline" class="meta-icon-neon"></ion-icon>
                        <span>{{ job.date }} • {{ job.time }}</span>
                      </div>
                      <div class="meta-item">
                        <ion-icon :icon="locationOutline" class="meta-icon-neon"></ion-icon>
                        <span>{{ job.location }}</span>
                      </div>
                    </div>

                    <p class="job-description-text">"{{ job.description }}"</p>
                  </div>

                  <div class="job-card-actions">
                    <button type="button" class="job-skip-btn" @click="skipJob(job.id)" title="Recusar chamado">
                      <ion-icon :icon="closeOutline"></ion-icon>
                      <span>Recusar</span>
                    </button>
                    <button type="button" class="job-counter-btn" @click="openCounterOfferModal(job)" title="Fazer contraproposta de valor">
                      <ion-icon :icon="cashOutline"></ion-icon>
                      <span>Contraproposta</span>
                    </button>
                    <button type="button" class="job-accept-btn" @click="acceptJob(job)" title="Aceitar proposta">
                      <ion-icon :icon="checkmarkOutline"></ion-icon>
                      <span>ACEITAR • {{ formatCurrency(job.budget) }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- ================= 2º BLOCO: SUA AGENDA & CALENDÁRIO (LÁ EMBAIXO) ================= -->
          <div v-if="servicesSubView === 'all' || servicesSubView === 'agenda'" class="agenda-outer-card">
            <div class="agenda-card-header">
              <div>
                <h2 class="agenda-main-title">Sua Agenda</h2>
                <p class="agenda-sub-caption">Defina os dias livres para receber novas solicitações</p>
              </div>
              <span class="agenda-summary-badge">
                {{ freeDaysInMonthCount }} livres • {{ busyDaysInMonthCount }} ocupados
              </span>
            </div>

            <!-- CAIXA INTERNA DO CALENDÁRIO ("estou livre aos finde" + Calendário) -->
            <div class="agenda-inner-box">
              <!-- Botão / Chip de Disponibilidade Rápida ("estou livre aos finde") -->
              <div class="weekend-preset-bar">
                <button
                  type="button"
                  class="weekend-toggle-pill"
                  :class="{ active: weekendOnlyMode }"
                  @click="toggleWeekendPreset"
                >
                  <span class="status-dot" :class="{ on: weekendOnlyMode }"></span>
                  <span class="finde-label">estou livre aos finde</span>
                </button>

                <button
                  type="button"
                  class="all-free-link"
                  @click="markAllFutureFree"
                >
                  Liberar mês
                </button>
              </div>

              <!-- Navegação de Mês -->
              <div class="agenda-month-nav">
                <button
                  type="button"
                  class="agenda-nav-btn"
                  @click="changeAgendaMonth(-1)"
                  aria-label="Mês anterior"
                >
                  <ion-icon :icon="chevronBackOutline"></ion-icon>
                </button>

                <div class="agenda-month-label">
                  <strong>{{ currentAgendaMonthName }}</strong>
                  <span>{{ agendaYear }}</span>
                </div>

                <button
                  type="button"
                  class="agenda-nav-btn"
                  @click="changeAgendaMonth(1)"
                  aria-label="Próximo mês"
                >
                  <ion-icon :icon="chevronForwardOutline"></ion-icon>
                </button>
              </div>

              <!-- Dias da Semana -->
              <div class="agenda-weekdays-row">
                <span
                  v-for="(wd, i) in weekdays"
                  :key="wd"
                  class="agenda-wd-cell"
                  :class="{ weekend: i === 0 || i === 6 }"
                >
                  {{ wd }}
                </span>
              </div>

              <!-- Grade Compacta Mobile do Calendário -->
              <div class="agenda-days-grid">
                <button
                  v-for="cell in agendaCells"
                  :key="cell.key"
                  type="button"
                  class="agenda-day-cell"
                  :class="{
                    empty: cell.empty,
                    past: !cell.empty && cell.status === 'PAST',
                    free: !cell.empty && cell.status === 'FREE',
                    busy: !cell.empty && cell.status === 'BUSY',
                    today: !cell.empty && cell.isToday
                  }"
                  :disabled="cell.empty"
                  @click="toggleDayAvailability(cell)"
                >
                  <span v-if="!cell.empty" class="cell-day-num">{{ cell.day }}</span>
                  <span
                    v-if="!cell.empty"
                    class="cell-status-dot"
                    :class="cell.status.toLowerCase()"
                  ></span>
                </button>
              </div>

              <!-- Legenda Intuitiva do Calendário -->
              <div class="agenda-legend-row">
                <span class="legend-item">
                  <i class="leg-dot free"></i> Livre
                </span>
                <span class="legend-item">
                  <i class="leg-dot busy"></i> Ocupado
                </span>
                <span class="legend-item">
                  <i class="leg-dot past"></i> Passado
                </span>
              </div>
            </div>

            <!-- Botão Inferior Esquerdo (Conforme o wireframe "Sua Agenda") -->
            <div class="agenda-bottom-action-row">
              <button type="button" class="save-agenda-btn" @click="saveAgendaSettings">
                <ion-icon :icon="checkmarkOutline"></ion-icon>
                <span>Salvar Agenda</span>
              </button>
              <span class="agenda-helper-note">
                Disponibilidade visível para contratantes.
              </span>
            </div>
          </div>
        </section>

        <!-- ================= TELA 2: SALDO DO PRESTADOR (MODELO INDRIVE - RECARGA PIX / DÉBITO) ================= -->
        <section v-if="store.providerTab === 'carteira'" class="tab-pane">
          <div class="minimal-wallet-card">
            <div class="wallet-card-header">
              <div>
                <span class="wallet-eyebrow">SALDO DO PRESTADOR</span>
                <p class="wallet-sub-caption">Saldo para aceitar serviços e impulsos. O valor do serviço você recebe direto do cliente.</p>
              </div>
              <div class="wallet-shield-badge">
                <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
                <span>Ativo</span>
              </div>
            </div>

            <div class="wallet-balance-display">
              <span class="currency-prefix">R$</span>
              <strong class="balance-big-digits">{{ store.walletBalance }},00</strong>
            </div>

            <div class="wallet-cta-grid single-cta">
              <button type="button" class="btn-deposit-main" @click="openDepositModal('PIX')">
                <ion-icon :icon="addCircleOutline"></ion-icon>
                <span>Adicionar Saldo (PIX ou Débito)</span>
              </button>
            </div>

            <div class="deposit-methods-strip">
              <button type="button" class="method-mini-pill" @click="openDepositModal('PIX')">
                <ion-icon :icon="qrCodeOutline" class="neon-icon"></ion-icon>
                <span>Recarga via PIX</span>
              </button>
              <button type="button" class="method-mini-pill" @click="openDepositModal('DEBITO')">
                <ion-icon :icon="cardOutline" class="neon-icon"></ion-icon>
                <span>Cartão de Débito</span>
              </button>
            </div>

            <div class="wallet-model-notice">
              <ion-icon :icon="sparklesOutline" class="neon-icon"></ion-icon>
              <span><strong>Como funciona:</strong> A plataforma conecta você ao cliente e debita apenas a taxa de intermediação (10%) deste saldo após a realização. O pagamento total do cliente é feito diretamente a você via PIX ou dinheiro.</span>
            </div>
          </div>

          <div class="transactions-section">
            <div class="section-top-bar">
              <h3 class="pane-subheading">Histórico de Movimentações</h3>
              <span class="tx-count-label">{{ store.transactions.length }} registros</span>
            </div>

            <div class="transactions-list">
              <div
                v-for="tx in store.transactions"
                :key="tx.id"
                class="tx-card-row"
              >
                <div class="tx-left-block">
                  <div
                    class="tx-icon-round"
                    :class="{
                      'tx-earning': tx.type === 'EARNING',
                      'tx-debit': tx.type === 'DEBIT',
                      'tx-recharge': tx.type === 'RECHARGE'
                    }"
                  >
                    <ion-icon
                      :icon="tx.type === 'EARNING' ? cashOutline : (tx.type === 'DEBIT' ? removeCircleOutline : addCircleOutline)"
                    ></ion-icon>
                  </div>
                  <div class="tx-info-block">
                    <span class="tx-title-text">{{ tx.title }}</span>
                    <span class="tx-date-meta">{{ tx.date }}</span>
                  </div>
                </div>

                <span
                  class="tx-amount-value"
                  :class="tx.amount > 0 ? 'amount-green' : 'amount-red'"
                >
                  {{ tx.amount > 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= TELA 3: PERFIL MOBILE DO PRESTADOR DE SERVIÇO ================= -->
        <section v-if="store.providerTab === 'perfil'" class="tab-pane">
          <div class="profile-main-card">
            <div class="profile-top-avatar-row">
              <div class="avatar-ring-box">
                <img :src="store.workerProfile.avatar" :alt="store.workerProfile.name" class="worker-avatar-img" />
                <span class="level-indicator-tag">Nv. {{ store.workerProfile.level }}</span>
              </div>

              <div class="worker-meta-details">
                <span class="worker-badge-role">PRESTADOR VERIFICADO</span>
                <h3 class="worker-name-big">{{ store.workerProfile.name }}</h3>
                <div class="worker-rating-line">
                  <ion-icon :icon="star" class="star-gold"></ion-icon>
                  <span>{{ store.workerProfile.rating }} / 5.0</span>
                  <span class="jobs-counter-text">({{ store.workerProfile.completedJobs }} serviços)</span>
                </div>
              </div>
            </div>

            <div class="specialty-selector-box">
              <label class="spec-label">Sua especialidade principal:</label>
              <div class="filter-pills-scroll">
                <button
                  v-for="cat in allProfileCategories"
                  :key="cat.id"
                  type="button"
                  class="cat-filter-pill"
                  :class="{ active: store.workerProfile.category === cat.name }"
                  @click="updateWorkerCategory(cat.name)"
                >
                  {{ cat.name }}
                </button>
              </div>
            </div>

            <div class="xp-container">
              <div class="xp-labels-row">
                <span>Reputação para Nível {{ store.workerProfile.level + 1 }}</span>
                <strong>{{ store.workerProfile.xp }} / {{ store.workerProfile.nextLevelXp }} XP</strong>
              </div>
              <div class="xp-bar-track">
                <div
                  class="xp-bar-fill"
                  :style="{ width: `${Math.min(100, (store.workerProfile.xp / store.workerProfile.nextLevelXp) * 100)}%` }"
                ></div>
              </div>
            </div>

            <div class="profile-quick-actions">
              <button type="button" class="switch-client-card-btn" @click="exitToClientHome">
                <div class="switch-btn-left">
                  <ion-icon :icon="swapHorizontalOutline" class="neon-icon"></ion-icon>
                  <div>
                    <strong>Voltar para a Home (Modo Cliente)</strong>
                    <span>Retornar ao início da navegação como Contratante</span>
                  </div>
                </div>
                <ion-icon :icon="arrowForwardOutline"></ion-icon>
              </button>

              <button type="button" class="reset-presentation-btn" @click="handleResetDemo">
                <ion-icon :icon="refreshOutline"></ion-icon>
                <span>Resetar Apresentação (Restaurar Estados)</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      <!-- ================= MODAL 1: IMPULSOS DO PRESTADOR DE SERVIÇO ================= -->
      <ion-modal
        :is-open="store.boostModalOpen"
        :breakpoints="[0, 0.82, 0.95]"
        :initial-breakpoint="0.82"
        @didDismiss="store.boostModalOpen = false"
        class="custom-modal-sheet"
      >
        <ion-content class="modal-sheet-inner ion-padding">
          <div class="modal-header-row">
            <div>
              <span class="modal-kicker-neon">DESTAQUE SEU PERFIL</span>
              <h2 class="sheet-title">Impulsos de Visibilidade</h2>
              <p class="sheet-subtitle">Apareça no topo para os clientes da sua categoria</p>
            </div>
            <button type="button" class="btn-close-modal" @click="store.boostModalOpen = false">✕</button>
          </div>

          <div class="boost-wallet-mini-bar">
            <div>
              <span class="mini-bar-label">Saldo na Carteira:</span>
              <strong class="mini-bar-val">{{ formatCurrency(store.walletBalance) }}</strong>
            </div>
            <button type="button" class="mini-deposit-link" @click="switchFromBoostToDeposit">
              + Depositar (PIX / Débito)
            </button>
          </div>

          <div class="boost-modal-stack">
            <div
              v-for="plan in boostPlans"
              :key="plan.id"
              class="boost-modal-card"
              :class="{
                featured: plan.isPopular,
                active: store.activeBoost.id === plan.id
              }"
            >
              <div class="boost-modal-top">
                <span class="boost-tag-chip" :class="{ popular: plan.isPopular }">
                  {{ plan.isPopular ? '★ Mais Escolhido' : plan.tag }}
                </span>
                <span class="boost-mult-badge">{{ plan.multiplier }} mais clientes</span>
              </div>

              <div class="boost-modal-main">
                <div>
                  <h3 class="boost-plan-title">{{ plan.name }}</h3>
                  <p class="boost-plan-desc">{{ plan.desc }}</p>
                </div>
                <div class="boost-price-box">
                  <strong class="boost-price-val">{{ formatCurrency(plan.price) }}</strong>
                  <span class="boost-duration-txt">por {{ plan.duration }}</span>
                </div>
              </div>

              <button
                type="button"
                class="boost-activate-cta"
                :class="{ current: store.activeBoost.id === plan.id }"
                @click="handleActivateBoost(plan)"
              >
                <ion-icon :icon="store.activeBoost.id === plan.id ? checkmarkOutline : rocketOutline"></ion-icon>
                <span>
                  {{ store.activeBoost.id === plan.id ? 'Impulso Ativo no Momento' : `Ativar ${plan.name} • ${formatCurrency(plan.price)}` }}
                </span>
              </button>
            </div>
          </div>
        </ion-content>
      </ion-modal>

      <!-- ================= MODAL 2: DEPÓSITO MOCKADO (PIX E CARTÃO DE DÉBITO) ================= -->
      <ion-modal
        :is-open="isDepositModalOpen"
        :breakpoints="[0, 0.82, 0.95]"
        :initial-breakpoint="0.82"
        @didDismiss="isDepositModalOpen = false"
        class="custom-modal-sheet"
      >
        <ion-content class="modal-sheet-inner ion-padding">
          <div class="modal-header-row">
            <div>
              <span class="modal-kicker-neon">CARTEIRA DO PRESTADOR</span>
              <h2 class="sheet-title">Fazer Depósito</h2>
              <p class="sheet-subtitle">Adicione saldo via PIX ou Cartão de Débito (Simulado)</p>
            </div>
            <button type="button" class="btn-close-modal" @click="isDepositModalOpen = false">✕</button>
          </div>

          <div class="deposit-method-tabs">
            <button
              type="button"
              class="method-tab-btn"
              :class="{ active: depositMethod === 'PIX' }"
              @click="depositMethod = 'PIX'"
            >
              <ion-icon :icon="qrCodeOutline"></ion-icon>
              <span>Via PIX</span>
            </button>

            <button
              type="button"
              class="method-tab-btn"
              :class="{ active: depositMethod === 'DEBITO' }"
              @click="depositMethod = 'DEBITO'"
            >
              <ion-icon :icon="cardOutline"></ion-icon>
              <span>Cartão de Débito</span>
            </button>
          </div>

          <label class="field-label">Valor do depósito</label>
          <div class="quick-recharge-row">
            <button
              v-for="amt in [20, 50, 100, 200]"
              :key="amt"
              type="button"
              class="quick-amt-btn"
              :class="{ active: depositAmount === amt }"
              @click="depositAmount = amt"
            >
              R$ {{ amt }}
            </button>
          </div>

          <div v-if="depositMethod === 'PIX'" class="mock-payment-box">
            <div class="mock-qr-row">
              <div class="mock-qr-placeholder">
                <ion-icon :icon="qrCodeOutline" class="qr-giant-icon"></ion-icon>
                <span>QR Code PIX</span>
              </div>
              <div class="mock-pix-info">
                <strong>Pagamento Instantâneo</strong>
                <p>Copie o código abaixo ou toque em confirmar para simular aprovação.</p>
                <div class="pix-copy-box" @click="copyMockPixCode">
                  <code>00020126580014BR.GOV.BCB.PIX+SERVE{{ depositAmount }}</code>
                  <span>Copiar</span>
                </div>
              </div>
            </div>

            <button type="button" class="confirm-recharge-btn" @click="confirmMockDeposit">
              <ion-icon :icon="checkmarkOutline"></ion-icon>
              <span>Confirmar Depósito PIX de {{ formatCurrency(depositAmount) }}</span>
            </button>
          </div>

          <div v-else class="mock-payment-box">
            <div class="debit-form-grid">
              <div>
                <label class="field-label">Número do Cartão de Débito</label>
                <input
                  type="text"
                  v-model="mockDebitCard.number"
                  placeholder="0000 0000 0000 0000"
                  class="modal-dark-input"
                />
              </div>

              <div>
                <label class="field-label">Nome impresso no cartão</label>
                <input
                  type="text"
                  v-model="mockDebitCard.holder"
                  placeholder="NOME COMPLETO"
                  class="modal-dark-input"
                />
              </div>

              <div class="debit-two-cols">
                <div>
                  <label class="field-label">Validade</label>
                  <input
                    type="text"
                    v-model="mockDebitCard.expiry"
                    placeholder="MM/AA"
                    class="modal-dark-input"
                  />
                </div>
                <div>
                  <label class="field-label">CVV</label>
                  <input
                    type="password"
                    maxlength="4"
                    v-model="mockDebitCard.cvv"
                    placeholder="123"
                    class="modal-dark-input"
                  />
                </div>
              </div>
            </div>

            <button type="button" class="confirm-recharge-btn" @click="confirmMockDeposit">
              <ion-icon :icon="cardOutline"></ion-icon>
              <span>Depositar {{ formatCurrency(depositAmount) }} no Débito</span>
            </button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- ================= MODAL: FAZER CONTRAPROPOSTA (PRESTADOR) ================= -->
      <ion-modal
        :is-open="isCounterOfferModalOpen"
        :breakpoints="[0, 0.65, 0.85]"
        :initial-breakpoint="0.65"
        @didDismiss="isCounterOfferModalOpen = false"
        class="custom-modal-sheet"
      >
        <ion-content v-if="selectedTargetJob" class="modal-sheet-inner ion-padding">
          <div class="modal-header-row">
            <div>
              <span class="modal-kicker-neon">NEGOCIAÇÃO DIRETA</span>
              <h2 class="sheet-title">Fazer Contraproposta</h2>
              <p class="sheet-subtitle">{{ selectedTargetJob.title }} • Proposta do cliente: {{ formatCurrency(selectedTargetJob.budget) }}</p>
            </div>
            <button type="button" class="btn-close-modal" @click="isCounterOfferModalOpen = false">✕</button>
          </div>

          <div class="counter-offer-form">
            <label class="field-label">Seu novo valor proposto (R$)</label>
            <div class="quick-recharge-row">
              <button
                v-for="suggested in [selectedTargetJob.budget + 20, selectedTargetJob.budget + 40, selectedTargetJob.budget + 60, selectedTargetJob.budget + 80]"
                :key="suggested"
                type="button"
                class="quick-amt-btn"
                :class="{ active: counterOfferAmount === suggested }"
                @click="counterOfferAmount = suggested"
              >
                R$ {{ suggested }}
              </button>
            </div>

            <div class="custom-amount-input-box">
              <span class="rs-label">R$</span>
              <input
                type="number"
                v-model.number="counterOfferAmount"
                class="counter-num-input"
                placeholder="Valor personalizado"
              />
              <span class="cents-label">,00</span>
            </div>

            <label class="field-label">Mensagem para o cliente (opcional)</label>
            <input
              type="text"
              v-model="counterOfferNote"
              placeholder="Ex: Levo materiais próprios / Horário adicional incluso"
              class="modal-dark-input"
            />

            <button type="button" class="confirm-recharge-btn" @click="submitProviderCounterOffer">
              <ion-icon :icon="checkmarkOutline"></ion-icon>
              <span>Enviar Contraproposta de {{ formatCurrency(counterOfferAmount) }}</span>
            </button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- Toast Feedback -->
      <ion-toast
        :is-open="showToast"
        :message="toastMsg"
        :duration="2500"
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
  rocketOutline,
  calendarOutline,
  locationOutline,
  closeOutline,
  checkmarkOutline,
  sparklesOutline,
  refreshOutline,
  addCircleOutline,
  arrowUpCircleOutline,
  cashOutline,
  removeCircleOutline,
  chatbubbleOutline,
  swapHorizontalOutline,
  arrowForwardOutline,
  chevronBackOutline,
  chevronForwardOutline,
  qrCodeOutline,
  cardOutline,
  star,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import { useAppStore, CATEGORY_CONFIGS } from '@/stores/useAppStore';

const router = useRouter();
const route = useRoute();
const store = useAppStore();

const selectedJobFilter = ref('Todos');
const servicesSubView = ref('all'); // 'all' | 'agenda' | 'propostas'

const showToast = ref(false);
const toastMsg = ref('');

// ================= LÓGICA DA AGENDA DO PRESTADOR ("SUA AGENDA") =================
const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const now = new Date();
const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const agendaYear = ref(todayDate.getFullYear());
const agendaMonth = ref(todayDate.getMonth());

// Modo "Estou livre aos finais de semana" ativo por padrão conforme wireframe
const weekendOnlyMode = ref(true);

// Mapa customizado de dias alterados manualmente pelo prestador ('FREE' | 'BUSY')
const customDayOverrides = ref({});

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function seedDemoBusyDays() {
  const y = todayDate.getFullYear();
  const m = todayDate.getMonth();
  const d1 = new Date(y, m, Math.min(28, todayDate.getDate() + 2));
  const d2 = new Date(y, m, Math.min(28, todayDate.getDate() + 5));
  customDayOverrides.value = {
    [toISODate(d1)]: 'BUSY',
    [toISODate(d2)]: 'BUSY'
  };
}
seedDemoBusyDays();

const currentAgendaMonthName = computed(() => monthNames[agendaMonth.value]);

function changeAgendaMonth(delta) {
  let nextM = agendaMonth.value + delta;
  let nextY = agendaYear.value;
  if (nextM > 11) {
    nextM = 0;
    nextY += 1;
  } else if (nextM < 0) {
    nextM = 11;
    nextY -= 1;
  }
  agendaMonth.value = nextM;
  agendaYear.value = nextY;
}

const agendaCells = computed(() => {
  const year = agendaYear.value;
  const month = agendaMonth.value;
  const firstWeekday = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const todayISO = toISODate(todayDate);

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ key: `empty-${year}-${month}-${i}`, empty: true });
  }

  for (let day = 1; day <= totalDays; day++) {
    const dObj = new Date(year, month, day);
    const iso = toISODate(dObj);
    const wd = dObj.getDay();
    const isPast = dObj < todayDate;

    let status = 'FREE';
    if (isPast) {
      status = 'PAST';
    } else if (customDayOverrides.value[iso]) {
      status = customDayOverrides.value[iso];
    } else if (weekendOnlyMode.value) {
      status = (wd === 0 || wd === 6) ? 'FREE' : 'BUSY';
    } else {
      status = 'FREE';
    }

    cells.push({
      key: iso,
      empty: false,
      day,
      iso,
      isToday: iso === todayISO,
      status
    });
  }

  return cells;
});

const freeDaysInMonthCount = computed(() => {
  return agendaCells.value.filter(c => !c.empty && c.status === 'FREE').length;
});

const busyDaysInMonthCount = computed(() => {
  return agendaCells.value.filter(c => !c.empty && c.status === 'BUSY').length;
});

function toggleDayAvailability(cell) {
  if (cell.empty) return;
  if (cell.status === 'PAST') {
    toastMsg.value = 'Datas passadas são apenas para histórico da sua agenda.';
    showToast.value = true;
    return;
  }
  const nextStatus = cell.status === 'FREE' ? 'BUSY' : 'FREE';
  customDayOverrides.value = {
    ...customDayOverrides.value,
    [cell.iso]: nextStatus
  };
}

function toggleWeekendPreset() {
  weekendOnlyMode.value = !weekendOnlyMode.value;
  customDayOverrides.value = {};
  toastMsg.value = weekendOnlyMode.value
    ? 'Modo "Livre aos finais de semana" ativado!'
    : 'Todos os dias futuros liberados na agenda!';
  showToast.value = true;
}

function markAllFutureFree() {
  weekendOnlyMode.value = false;
  customDayOverrides.value = {};
  toastMsg.value = 'Todos os dias futuros marcados como Livres!';
  showToast.value = true;
}

function saveAgendaSettings() {
  toastMsg.value = `Agenda salva! ${freeDaysInMonthCount.value} dias livres e ${busyDaysInMonthCount.value} dias ocupados neste mês.`;
  showToast.value = true;
}

// ================= RECARGA DE SALDO MOCKADO (PIX / DÉBITO) =================
const isDepositModalOpen = ref(false);
const depositMethod = ref('PIX'); // 'PIX' | 'DEBITO'
const depositAmount = ref(50);
const mockDebitCard = ref({
  number: '4589 •••• •••• 9012',
  holder: 'JOÃO SILVA',
  expiry: '11/29',
  cvv: '342'
});

const allProfileCategories = Object.values(CATEGORY_CONFIGS);

const filteredJobLeads = computed(() => {
  if (selectedJobFilter.value === 'Todos') return store.jobLeads;
  return store.jobLeads.filter(j => j.category === selectedJobFilter.value);
});

const boostPlans = [
  {
    id: 'b-1',
    name: 'Impulso Básico',
    tag: '3 Dias',
    price: 19,
    duration: '3 dias',
    multiplier: '1.5x',
    desc: 'Destaque na sua categoria para chamados urgentes do fim de semana.',
    isPopular: false
  },
  {
    id: 'b-2',
    name: 'Impulso Turbo Pro',
    tag: 'Recomendado',
    price: 39,
    duration: '7 dias',
    multiplier: '3.8x',
    desc: 'Prioridade máxima no topo das buscas com selo Prestador Destaque.',
    isPopular: true
  },
  {
    id: 'b-3',
    name: 'Impulso VIP Mensal',
    tag: 'Performance',
    price: 89,
    duration: '30 dias',
    multiplier: '5.5x',
    desc: 'Máxima exposição para contratantes durante 30 dias completos.',
    isPopular: false
  }
];

function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(Number(val) || 0);
}

onMounted(() => {
  store.role = 'PROVIDER';
  if (route.query.tab) {
    const t = String(route.query.tab);
    if (t === 'impulsos') {
      store.boostModalOpen = true;
    } else if (t === 'carteira' || t === 'wallet') {
      store.providerTab = 'carteira';
    } else if (t === 'perfil' || t === 'profile') {
      store.providerTab = 'perfil';
    } else {
      store.providerTab = 'servicos';
    }
  }
});

function exitToClientHome() {
  store.role = 'CLIENT';
  router.push('/home');
}

function skipJob(jobId) {
  store.rejectJobLead(jobId, 'Recusado pelo prestador');
  toastMsg.value = 'Proposta recusada e removida da fila.';
  showToast.value = true;
}

// ================= CONTRAPROPOSTA DO PRESTADOR =================
const isCounterOfferModalOpen = ref(false);
const selectedTargetJob = ref(null);
const counterOfferAmount = ref(0);
const counterOfferNote = ref('');

function openCounterOfferModal(job) {
  selectedTargetJob.value = job;
  counterOfferAmount.value = (Number(job.budget) || 100) + 20;
  counterOfferNote.value = '';
  isCounterOfferModalOpen.value = true;
}

function submitProviderCounterOffer() {
  if (!selectedTargetJob.value) return;
  store.submitCounterOffer(
    selectedTargetJob.value.id,
    counterOfferAmount.value,
    counterOfferNote.value
  );
  isCounterOfferModalOpen.value = false;
  toastMsg.value = `Contraproposta de ${formatCurrency(counterOfferAmount.value)} enviada ao cliente!`;
  showToast.value = true;
}

function acceptJob(job) {
  store.acceptJobLead(job);
  const targetDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), Math.min(28, todayDate.getDate() + 1));
  customDayOverrides.value = {
    ...customDayOverrides.value,
    [toISODate(targetDay)]: 'BUSY'
  };
  toastMsg.value = 'Proposta aceita! Data marcada como Ocupada na Sua Agenda.';
  showToast.value = true;
}

function openChatWithClient(job) {
  store.openChatWithPro(
    {
      id: job.id,
      nome: job.clientName || 'Cliente +SERVE',
      name: job.clientName || 'Cliente +SERVE',
      categoria: `Cliente • ${job.category}`,
      avatar: job.clientAvatar || 'https://i.pravatar.cc/150?img=32',
      nota: '5,0'
    },
    {
      id: job.orderId || job.id,
      title: job.title,
      price: job.budget
    }
  );
}

function finishWorkerJob(job) {
  const res = store.completeWorkerJob(job.id);
  if (res) {
    toastMsg.value = `Serviço realizado! Taxa de ${formatCurrency(res.fee)} debitada do seu Saldo.`;
  } else {
    toastMsg.value = 'Serviço marcado como realizado!';
  }
  showToast.value = true;
}

function resetJobs() {
  store.resetJobLeads();
  selectedJobFilter.value = 'Todos';
  toastMsg.value = 'Propostas recarregadas!';
  showToast.value = true;
}

function openDepositModal(method = 'PIX') {
  depositMethod.value = method;
  isDepositModalOpen.value = true;
}

function switchFromBoostToDeposit() {
  store.boostModalOpen = false;
  depositMethod.value = 'PIX';
  isDepositModalOpen.value = true;
}

function copyMockPixCode() {
  toastMsg.value = 'Código PIX Copia e Cola copiado!';
  showToast.value = true;
}

function confirmMockDeposit() {
  store.rechargeWallet(depositAmount.value, depositMethod.value);
  isDepositModalOpen.value = false;
  const label = depositMethod.value === 'DEBITO' ? 'Cartão de Débito' : 'PIX';
  toastMsg.value = `Depósito de ${formatCurrency(depositAmount.value)} via ${label} adicionado ao Saldo!`;
  showToast.value = true;
}

function handleActivateBoost(plan) {
  const res = store.activateBoostPlan(plan);
  if (!res.ok && res.reason === 'INSUFFICIENT_FUNDS') {
    toastMsg.value = 'Saldo insuficiente. Adicione saldo via PIX ou Débito!';
    showToast.value = true;
    store.boostModalOpen = false;
    isDepositModalOpen.value = true;
    return;
  }
  store.boostModalOpen = false;
  toastMsg.value = `🚀 ${plan.name} ativado! Seu perfil já está em destaque.`;
  showToast.value = true;
}

function updateWorkerCategory(catName) {
  store.workerProfile.category = catName;
  store.workerProfile.levelName = `Prestador Verificado • ${catName}`;
  toastMsg.value = `Especialidade principal atualizada para ${catName}!`;
  showToast.value = true;
}

function handleResetDemo() {
  store.resetPresentation();
  selectedJobFilter.value = 'Todos';
  weekendOnlyMode.value = true;
  seedDemoBusyDays();
  toastMsg.value = 'Apresentação restaurada! Todos os estados voltaram ao padrão inicial.';
  showToast.value = true;
}
</script>

<style scoped>
.provider-page-root {
  --ion-background-color: #030407;
  --ion-text-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ================= HEADER MOBILE APP ================= */
.provider-header {
  background: #030407;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.provider-toolbar {
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

.brand-block {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.neon-plus {
  color: #D4FF24;
  font-size: 22px;
  font-weight: 900;
}

.brand-name {
  font-size: 17px;
  font-weight: 900;
  font-style: italic;
  color: #ffffff;
}

.provider-mode-tag {
  background: rgba(212, 255, 36, 0.14);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  font-size: 8.5px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 5px;
  margin-left: 2px;
  letter-spacing: 0.3px;
}

.header-right-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wallet-pill-btn {
  background: #0b0f17;
  border: 1px solid rgba(212, 255, 36, 0.35);
  border-radius: 9px;
  padding: 3px 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  cursor: pointer;
}

.wallet-tiny-label {
  font-size: 8px;
  color: #9ca3af;
  text-transform: uppercase;
}

.wallet-value-text {
  font-size: 11.5px;
  font-weight: 800;
  color: #D4FF24;
}

.switch-to-client-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e5e7eb;
  border-radius: 9px;
  padding: 7px 9px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

/* ================= CONTEÚDO MOBILE ================= */
.provider-content {
  --background: #030407;
}

.page-wrapper {
  padding: 12px 12px 92px;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ================= BARRA MINIMALISTA DE IMPULSO MOBILE ================= */
.boost-minimal-strip {
  background: linear-gradient(90deg, rgba(212, 255, 36, 0.08) 0%, rgba(11, 15, 24, 0.95) 100%);
  border: 1px solid rgba(212, 255, 36, 0.28);
  border-radius: 10px;
  padding: 7px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.boost-minimal-strip:hover {
  border-color: rgba(212, 255, 36, 0.5);
  background: linear-gradient(90deg, rgba(212, 255, 36, 0.14) 0%, rgba(11, 15, 24, 0.98) 100%);
}

.boost-strip-info {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.boost-strip-icon {
  font-size: 14px;
}

.boost-strip-text {
  font-size: 11px;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.boost-strip-text strong {
  color: #D4FF24;
}

.boost-strip-btn {
  background: rgba(212, 255, 36, 0.14);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  border-radius: 7px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  flex-shrink: 0;
}

/* ================= SELETOR SEGMENTADO MOBILE (AGENDA vs PROPOSTAS) ================= */
.mobile-services-segmented {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 4px;
}

.seg-pill-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 700;
  padding: 8px 4px;
  border-radius: 9px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.16s ease;
}

.seg-pill-btn.active {
  background: rgba(212, 255, 36, 0.15);
  color: #D4FF24;
  font-weight: 800;
  box-shadow: inset 0 0 0 1px rgba(212, 255, 36, 0.4);
}

/* ================= CARD: SUA AGENDA (OTIMIZADO PARA MOBILE) ================= */
.agenda-outer-card {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agenda-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.agenda-main-title {
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 2px;
}

.agenda-sub-caption {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
}

.agenda-summary-badge {
  background: rgba(212, 255, 36, 0.12);
  border: 1px solid rgba(212, 255, 36, 0.3);
  color: #D4FF24;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 99px;
  white-space: nowrap;
}

.agenda-inner-box {
  background: #0b0f18;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weekend-preset-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.weekend-toggle-pill {
  flex: 1;
  background: #06090f;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  border-radius: 99px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.weekend-toggle-pill.active {
  background: rgba(212, 255, 36, 0.14);
  border-color: #D4FF24;
  color: #ffffff;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #64748b;
  flex-shrink: 0;
}

.status-dot.on {
  background: #D4FF24;
  box-shadow: 0 0 8px #D4FF24;
}

.all-free-link {
  background: transparent;
  border: none;
  color: #D4FF24;
  font-size: 10.5px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.agenda-month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #06090f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 4px 6px;
}

.agenda-nav-btn {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.agenda-month-label {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.agenda-month-label strong {
  font-size: 13px;
  color: #ffffff;
}

.agenda-month-label span {
  font-size: 12px;
  font-weight: 700;
  color: #D4FF24;
}

.agenda-weekdays-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.agenda-wd-cell {
  font-size: 9.5px;
  font-weight: 800;
  color: #64748b;
}

.agenda-wd-cell.weekend {
  color: #94a3b8;
}

/* Células compactas para caber perfeitamente na tela do celular */
.agenda-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.agenda-day-cell {
  height: 33px;
  border-radius: 7px;
  background: #080c14;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-size: 11.5px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  cursor: pointer;
  transition: all 0.15s ease;
}

.agenda-day-cell.empty {
  background: transparent;
  border-color: transparent;
  cursor: default;
}

.agenda-day-cell.past {
  opacity: 0.25;
  color: #475569;
  background: transparent;
  border-color: transparent;
}

.agenda-day-cell.free {
  background: rgba(212, 255, 36, 0.08);
  border-color: rgba(212, 255, 36, 0.4);
  color: #D4FF24;
}

.agenda-day-cell.busy {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(251, 146, 60, 0.3);
  color: #e2e8f0;
}

.agenda-day-cell.today {
  box-shadow: 0 0 0 1.5px #D4FF24;
  color: #ffffff;
}

.cell-status-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.cell-status-dot.free {
  background: #D4FF24;
  box-shadow: 0 0 4px #D4FF24;
}

.cell-status-dot.busy {
  background: #fb923c;
}

.cell-status-dot.past {
  background: #334155;
}

.agenda-legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 10.5px;
  color: #9ca3af;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.leg-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.leg-dot.free {
  background: #D4FF24;
}

.leg-dot.busy {
  background: #fb923c;
}

.leg-dot.past {
  background: #475569;
}

.agenda-bottom-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.save-agenda-btn {
  background: #D4FF24;
  color: #05070b;
  border: none;
  border-radius: 10px;
  padding: 9px 14px;
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  cursor: pointer;
}

.agenda-helper-note {
  font-size: 10.5px;
  color: #9ca3af;
  line-height: 1.25;
}

/* ================= CARD: PROPOSTAS & SERVIÇOS MOBILE ================= */
.proposals-outer-card {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.pane-title {
  font-size: 15.5px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 2px 0;
}

.pane-subtitle {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
}

/* ================= CARTEIRA MOBILE DO PRESTADOR ================= */
.minimal-wallet-card {
  background: #070a10;
  border: 1px solid rgba(212, 255, 36, 0.35);
  border-radius: 16px;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wallet-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.wallet-eyebrow {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: #D4FF24;
}

.wallet-sub-caption {
  font-size: 11px;
  color: #9ca3af;
  margin: 2px 0 0;
}

.wallet-shield-badge {
  background: rgba(212, 255, 36, 0.1);
  border: 1px solid rgba(212, 255, 36, 0.3);
  color: #D4FF24;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 99px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.wallet-balance-display {
  display: flex;
  align-items: baseline;
  gap: 5px;
  padding: 2px 0;
}

.currency-prefix {
  font-size: 16px;
  font-weight: 800;
  color: #94a3b8;
}

.balance-big-digits {
  font-size: 34px;
  font-weight: 900;
  color: #D4FF24;
  letter-spacing: -0.8px;
  line-height: 1;
}

.wallet-cta-grid.single-cta {
  grid-template-columns: 1fr;
}

.wallet-model-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(212, 255, 36, 0.06);
  border: 1px solid rgba(212, 255, 36, 0.2);
  border-radius: 10px;
  padding: 10px 11px;
  font-size: 11px;
  color: #cbd5e1;
  line-height: 1.35;
}

.wallet-model-notice strong {
  color: #D4FF24;
}

.btn-deposit-main {
  background: #D4FF24;
  border: none;
  color: #05070b;
  border-radius: 11px;
  padding: 12px 10px;
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
}

.btn-withdraw-sub {
  background: #0d121d;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  border-radius: 11px;
  padding: 12px 10px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
}

.deposit-methods-strip {
  display: flex;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.method-mini-pill {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  border-radius: 9px;
  padding: 8px;
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
}

.tx-count-label {
  font-size: 11px;
  color: #9ca3af;
}

/* ================= SERVIÇOS EM ANDAMENTO & PROPOSTAS ================= */
.accepted-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.accepted-job-card {
  background: #0b101b;
  border: 1px solid rgba(212, 255, 36, 0.4);
  border-radius: 13px;
  padding: 12px;
}

.accepted-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.accepted-cat-pill {
  font-size: 10px;
  font-weight: 800;
  color: #D4FF24;
  background: rgba(212, 255, 36, 0.12);
  padding: 2px 7px;
  border-radius: 5px;
}

.accepted-status-tag {
  font-size: 10.5px;
  font-weight: 700;
  color: #D4FF24;
}

.accepted-title {
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 3px 0;
}

.accepted-meta {
  font-size: 11.5px;
  color: #9ca3af;
  margin: 0 0 10px 0;
}

.accepted-client-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.client-mini-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.client-mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.client-mini-name {
  display: block;
  font-size: 12px;
  color: #ffffff;
}

.client-mini-val {
  font-size: 10.5px;
  color: #D4FF24;
  font-weight: 700;
}

.accepted-actions-row {
  display: flex;
  gap: 6px;
}

.btn-chat-client {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.btn-finish-job {
  background: #D4FF24;
  border: none;
  color: #05070b;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 11px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.leads-counter-pill {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 99px;
}

.filter-pills-scroll {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 4px;
  margin-bottom: 10px;
}

.filter-pills-scroll::-webkit-scrollbar {
  display: none;
}

.cat-filter-pill {
  background: #0b0f18;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #9ca3af;
  font-size: 11.5px;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 99px;
  white-space: nowrap;
  cursor: pointer;
}

.cat-filter-pill.active {
  background: rgba(212, 255, 36, 0.14);
  border-color: #D4FF24;
  color: #D4FF24;
  font-weight: 800;
}

.jobs-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.job-card-item {
  background: #0b0f18;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 13px;
  padding: 12px;
}

.job-top-badges {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.job-type-chip {
  background: rgba(212, 255, 36, 0.12);
  color: #D4FF24;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 5px;
}

.job-scope-chip {
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 5px;
}

.job-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.job-title {
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.job-payout-box {
  text-align: right;
  flex-shrink: 0;
}

.payout-label {
  display: block;
  font-size: 9px;
  color: #9ca3af;
  text-transform: uppercase;
}

.payout-amount {
  font-size: 15px;
  font-weight: 900;
  color: #D4FF24;
}

.job-meta-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 6px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #cbd5e1;
}

.meta-icon-neon {
  color: #D4FF24;
}

.job-description-text {
  font-size: 11.5px;
  color: #9ca3af;
  font-style: italic;
  margin: 0 0 10px 0;
}

.agenda-wireframe-subtitle {
  text-align: center;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: #64748b;
  padding: 3px 0 1px;
}

.job-card-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.job-skip-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #9ca3af;
  border-radius: 9px;
  padding: 9px 11px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.job-skip-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #f87171;
}

.job-counter-btn {
  background: rgba(212, 255, 36, 0.06);
  border: 1px solid rgba(212, 255, 36, 0.3);
  color: #D4FF24;
  border-radius: 9px;
  padding: 9px 11px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.job-counter-btn:hover {
  background: rgba(212, 255, 36, 0.15);
  border-color: #D4FF24;
}

.job-accept-btn {
  flex: 1;
  background: #D4FF24;
  border: none;
  color: #05070b;
  border-radius: 9px;
  padding: 9px 12px;
  font-size: 11.5px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-amount-input-box {
  display: flex;
  align-items: center;
  background: #0b0f17;
  border: 1px solid rgba(212, 255, 36, 0.35);
  border-radius: 10px;
  padding: 8px 12px;
  margin: 10px 0;
}

.rs-label {
  font-size: 15px;
  font-weight: 800;
  color: #D4FF24;
  margin-right: 6px;
}

.counter-num-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 17px;
  font-weight: 800;
  outline: none;
}

.cents-label {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 700;
}

/* ================= EXTRATO ================= */
.pane-subheading {
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.tx-card-row {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tx-left-block {
  display: flex;
  align-items: center;
  gap: 9px;
}

.tx-icon-round {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: rgba(212, 255, 36, 0.12);
  color: #D4FF24;
}

.tx-info-block {
  display: flex;
  flex-direction: column;
}

.tx-title-text {
  font-size: 12.5px;
  font-weight: 700;
  color: #ffffff;
}

.tx-date-meta {
  font-size: 10.5px;
  color: #9ca3af;
}

.tx-amount-value {
  font-size: 13px;
  font-weight: 800;
}

.amount-green {
  color: #D4FF24;
}

.amount-red {
  color: #f87171;
}

/* ================= PERFIL DO PRESTADOR ================= */
.profile-main-card {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.profile-top-avatar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-ring-box {
  position: relative;
}

.worker-avatar-img {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.level-indicator-tag {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #D4FF24;
  color: #05070b;
  font-size: 9.5px;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 99px;
}

.worker-badge-role {
  font-size: 9.5px;
  font-weight: 800;
  color: #D4FF24;
  letter-spacing: 0.4px;
}

.worker-name-big {
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
  margin: 2px 0;
}

.worker-rating-line {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #e5e7eb;
}

.star-gold {
  color: #D4FF24;
}

.jobs-counter-text {
  color: #9ca3af;
}

.spec-label {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: #cbd5e1;
  margin-bottom: 6px;
}

.xp-container {
  background: #0b0f17;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 11px;
  padding: 10px;
}

.xp-labels-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #cbd5e1;
  margin-bottom: 5px;
}

.xp-bar-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 99px;
  overflow: hidden;
}

.xp-bar-fill {
  height: 100%;
  background: #D4FF24;
  border-radius: 99px;
}

.neon-icon {
  color: #D4FF24;
}

.profile-quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.switch-client-card-btn {
  width: 100%;
  background: rgba(212, 255, 36, 0.08);
  border: 1px solid rgba(212, 255, 36, 0.35);
  border-radius: 11px;
  padding: 11px 12px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
}

.switch-btn-left {
  display: flex;
  align-items: center;
  gap: 9px;
}

.switch-btn-left strong {
  display: block;
  font-size: 12.5px;
  color: #D4FF24;
}

.switch-btn-left span {
  font-size: 11px;
  color: #9ca3af;
}

.reset-presentation-btn {
  width: 100%;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: #fca5a5;
  border-radius: 11px;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
}

.empty-leads-box {
  background: #0b0f18;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 13px;
  padding: 22px 14px;
  text-align: center;
}

.empty-icon {
  font-size: 26px;
  color: #D4FF24;
}

.empty-title {
  font-size: 14px;
  font-weight: 800;
  margin: 5px 0 3px;
}

.empty-desc {
  font-size: 11.5px;
  color: #9ca3af;
  margin: 0 0 10px;
}

.reload-jobs-btn {
  background: #D4FF24;
  color: #05070b;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 11.5px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

/* ================= MODAIS MOBILE (IMPULSOS, DEPÓSITO, SAQUE) ================= */
.custom-modal-sheet {
  --background: #080c14;
  --border-radius: 20px 20px 0 0;
}

.modal-sheet-inner {
  --background: #080c14;
  --color: #ffffff;
}

.modal-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.modal-kicker-neon {
  display: block;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.7px;
  color: #D4FF24;
  margin-bottom: 2px;
}

.sheet-title {
  font-size: 17px;
  font-weight: 800;
  margin: 0;
}

.sheet-subtitle {
  font-size: 11.5px;
  color: #9ca3af;
  margin: 2px 0 0;
}

.btn-close-modal {
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: #9ca3af;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
}

.boost-wallet-mini-bar {
  background: #0c121e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 11px;
  padding: 9px 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.mini-bar-label {
  font-size: 11px;
  color: #9ca3af;
  margin-right: 5px;
}

.mini-bar-val {
  font-size: 13px;
  color: #D4FF24;
  font-weight: 800;
}

.mini-deposit-link {
  background: rgba(212, 255, 36, 0.14);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  border-radius: 7px;
  padding: 5px 9px;
  font-size: 10.5px;
  font-weight: 800;
  cursor: pointer;
}

.boost-modal-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 18px;
}

.boost-modal-card {
  background: #0c121e;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 13px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.boost-modal-card.featured {
  border-color: rgba(212, 255, 36, 0.4);
}

.boost-modal-card.active {
  background: rgba(212, 255, 36, 0.07);
  border: 1.5px solid #D4FF24;
}

.boost-modal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.boost-tag-chip {
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.07);
  color: #cbd5e1;
}

.boost-tag-chip.popular {
  background: #D4FF24;
  color: #05070b;
}

.boost-mult-badge {
  font-size: 11px;
  font-weight: 800;
  color: #D4FF24;
}

.boost-modal-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.boost-plan-title {
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 2px;
}

.boost-plan-desc {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.35;
}

.boost-price-box {
  text-align: right;
  flex-shrink: 0;
}

.boost-price-val {
  display: block;
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
}

.boost-duration-txt {
  font-size: 10px;
  color: #9ca3af;
}

.boost-activate-cta {
  width: 100%;
  background: #D4FF24;
  color: #05070b;
  border: none;
  border-radius: 9px;
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
}

.boost-activate-cta.current {
  background: rgba(212, 255, 36, 0.16);
  color: #D4FF24;
  border: 1px solid rgba(212, 255, 36, 0.4);
}

/* Depósito Modal (PIX e Débito) */
.deposit-method-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.method-tab-btn {
  background: #0c121e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #9ca3af;
  border-radius: 10px;
  padding: 9px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.method-tab-btn.active {
  background: rgba(212, 255, 36, 0.14);
  border-color: #D4FF24;
  color: #D4FF24;
  font-weight: 800;
}

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #cbd5e1;
  margin-bottom: 5px;
}

.quick-recharge-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.quick-recharge-row.three-cols {
  grid-template-columns: repeat(3, 1fr);
}

.quick-amt-btn {
  background: #0e131f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
  border-radius: 9px;
  padding: 9px 6px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.quick-amt-btn.active {
  background: rgba(212, 255, 36, 0.15);
  border-color: #D4FF24;
  color: #D4FF24;
}

.mock-payment-box {
  background: #0c111c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 13px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mock-qr-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mock-qr-placeholder {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  background: #070a10;
  border: 1px dashed rgba(212, 255, 36, 0.45);
  color: #D4FF24;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 9.5px;
  font-weight: 700;
  flex-shrink: 0;
}

.qr-giant-icon {
  font-size: 30px;
}

.mock-pix-info {
  flex: 1;
  min-width: 0;
}

.mock-pix-info strong {
  display: block;
  font-size: 12.5px;
  color: #ffffff;
  margin-bottom: 2px;
}

.mock-pix-info p {
  font-size: 11px;
  color: #9ca3af;
  margin: 0 0 6px;
}

.pix-copy-box {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 5px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  cursor: pointer;
}

.pix-copy-box code {
  font-size: 10px;
  color: #cbd5e1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pix-copy-box span {
  font-size: 10.5px;
  font-weight: 800;
  color: #D4FF24;
}

.debit-form-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.debit-two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.modal-dark-input {
  width: 100%;
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9px;
  padding: 9px 11px;
  color: #ffffff;
  font-size: 12.5px;
  outline: none;
}

.confirm-recharge-btn {
  width: 100%;
  background: #D4FF24;
  color: #05070b;
  border: none;
  border-radius: 11px;
  padding: 12px;
  font-size: 13px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.withdraw-form-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
