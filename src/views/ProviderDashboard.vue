<template>
  <ion-page class="provider-page-root">
    <!-- Header Fixo (+ SERVE / TRABALHADOR) -->
    <ion-header class="ion-no-border provider-header">
      <ion-toolbar class="provider-toolbar">
        <div class="header-inner">
          <div class="brand-block" @click="goToHome">
            <span class="neon-plus">+</span>
            <span class="brand-name">SERVE</span>
            <span class="worker-mode-tag">TRABALHADOR</span>
          </div>

          <div class="header-right-actions">
            <div class="wallet-pill-btn" @click="currentTab = 'wallet'" title="Ver Saldo da Carteira">
              <span class="wallet-tiny-label">Saldo</span>
              <span class="wallet-value-text">{{ formatCurrency(store.walletBalance) }}</span>
            </div>

            <button class="switch-to-client-btn" @click="goToClientDashboard" title="Ir para Painel do Cliente">
              <ion-icon :icon="personCircleOutline"></ion-icon>
              <span class="btn-text-hide-sm">Modo Cliente</span>
            </button>
          </div>
        </div>
      </ion-toolbar>

      <!-- Sub-Barra de Navegação Mobile-First -->
      <div class="subnav-container">
        <div class="subnav-inner">
          <button
            class="subnav-item"
            :class="{ active: currentTab === 'leads' }"
            @click="currentTab = 'leads'"
          >
            <ion-icon :icon="flashOutline"></ion-icon>
            <span>Trabalhos</span>
            <span v-if="store.acceptedJobs.length" class="subnav-badge">{{ store.acceptedJobs.length }}</span>
          </button>

          <button
            class="subnav-item"
            :class="{ active: currentTab === 'wallet' }"
            @click="currentTab = 'wallet'"
          >
            <ion-icon :icon="walletOutline"></ion-icon>
            <span>Carteira</span>
          </button>

          <button
            class="subnav-item"
            :class="{ active: currentTab === 'boosts' }"
            @click="currentTab = 'boosts'"
          >
            <ion-icon :icon="rocketOutline"></ion-icon>
            <span>Impulsos</span>
          </button>

          <button
            class="subnav-item"
            :class="{ active: currentTab === 'profile' }"
            @click="currentTab = 'profile'"
          >
            <ion-icon :icon="personCircleOutline"></ion-icon>
            <span>Perfil</span>
          </button>
        </div>
      </div>
    </ion-header>

    <ion-content :fullscreen="true" class="provider-content">
      <div class="page-wrapper">

        <!-- ================= ABA 1: TRABALHOS (ATIVOS + DISPONÍVEIS) ================= -->
        <section v-if="currentTab === 'leads'" class="tab-pane">

          <!-- SEÇÃO DE TRABALHOS ACEITOS / EM ANDAMENTO (FECHAMENTO DE FLUXO DO PRESTADOR) -->
          <div v-if="store.acceptedJobs.length > 0" class="accepted-jobs-section">
            <div class="section-top-bar">
              <div>
                <h2 class="pane-title">Em Andamento ({{ store.acceptedJobs.length }})</h2>
                <p class="pane-subtitle">Combine detalhes no chat e finalize para liberar o PIX</p>
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
                  <span class="accepted-status-tag">{{ actJob.status === 'COMPLETED' ? '✓ Finalizado' : '⚡ Em Atendimento' }}</span>
                </div>

                <h3 class="accepted-title">{{ actJob.title }}</h3>
                <p class="accepted-meta">📅 {{ actJob.date }} às {{ actJob.time }} • 📍 {{ actJob.location }}</p>

                <div class="accepted-client-bar">
                  <div class="client-mini-box">
                    <img :src="actJob.clientAvatar || 'https://i.pravatar.cc/150?img=32'" class="client-mini-avatar" alt="Cliente" />
                    <div>
                      <strong class="client-mini-name">{{ actJob.clientName || 'Cliente +SERVE' }}</strong>
                      <span class="client-mini-val">Valor líquido (95%): {{ formatCurrency(actJob.budget * 0.95) }}</span>
                    </div>
                  </div>

                  <div class="accepted-actions-row">
                    <button class="btn-chat-client" @click="openChatWithClient(actJob)">
                      <ion-icon :icon="chatbubbleOutline"></ion-icon>
                      <span>Chat</span>
                    </button>
                    <button
                      v-if="actJob.status !== 'COMPLETED'"
                      class="btn-finish-job"
                      @click="finishWorkerJob(actJob)"
                    >
                      <ion-icon :icon="checkmarkOutline"></ion-icon>
                      <span>Concluir e Receber</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FILTRO DE CATEGORIAS PARA TRABALHOS DISPONÍVEIS -->
          <div class="section-top-bar">
            <div>
              <h2 class="pane-title">Chamados Disponíveis</h2>
              <p class="pane-subtitle">Solicitações abertas na sua região em tempo real</p>
            </div>
            <span class="leads-counter-pill">{{ filteredJobLeads.length }} disponíveis</span>
          </div>

          <div class="filter-pills-scroll">
            <button
              v-for="catFilter in ['Todos', 'Garçom', 'Eletricista', 'Diarista', 'Encanador', 'Reformas']"
              :key="catFilter"
              class="cat-filter-pill"
              :class="{ active: selectedJobFilter === catFilter }"
              @click="selectedJobFilter = catFilter"
            >
              {{ catFilter }}
            </button>
          </div>

          <!-- Se não houver pedidos -->
          <div v-if="filteredJobLeads.length === 0" class="empty-leads-box">
            <ion-icon :icon="sparklesOutline" class="empty-icon"></ion-icon>
            <h3 class="empty-title">Nenhum chamado nesta categoria</h3>
            <p class="empty-desc">Recarregue os chamados de demonstração ou altere o filtro acima.</p>
            <button class="reload-jobs-btn" @click="resetJobs">
              <ion-icon :icon="refreshOutline"></ion-icon>
              <span>Recarregar Chamados</span>
            </button>
          </div>

          <!-- ListaMinimalista de Cards de Trabalhos -->
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
                    <span class="payout-label">Oferta</span>
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

              <!-- Ações do Card -->
              <div class="job-card-actions">
                <button class="job-skip-btn" @click="skipJob(job.id)">
                  <ion-icon :icon="closeOutline"></ion-icon>
                  <span>Recusar</span>
                </button>
                <button class="job-accept-btn" @click="acceptJob(job)">
                  <ion-icon :icon="checkmarkOutline"></ion-icon>
                  <span>ACEITAR • {{ formatCurrency(job.budget) }}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= ABA 2: CARTEIRA & SAQUE PIX ================= -->
        <section v-if="currentTab === 'wallet'" class="tab-pane">
          <div class="wallet-balance-card">
            <div class="balance-meta">
              <span class="balance-label">Saldo Disponível para Saque</span>
              <h2 class="balance-giant-number">{{ formatCurrency(store.walletBalance) }}</h2>
              <span class="balance-sub">Repasse de 95% líquido direto via PIX após conclusão</span>
            </div>

            <div class="wallet-actions-row">
              <button class="wallet-primary-btn" @click="openWithdrawModal">
                <ion-icon :icon="arrowUpCircleOutline"></ion-icon>
                <span>Sacar via PIX</span>
              </button>
              <button class="wallet-secondary-btn" @click="isRechargeModalOpen = true">
                <ion-icon :icon="addCircleOutline"></ion-icon>
                <span>Adicionar Saldo</span>
              </button>
            </div>
          </div>

          <!-- Histórico de Transações -->
          <div class="transactions-section">
            <h3 class="pane-subheading">Extrato da Carteira</h3>
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

        <!-- ================= ABA 3: IMPULSOS ================= -->
        <section v-if="currentTab === 'boosts'" class="tab-pane">
          <div class="section-top-bar">
            <div>
              <h2 class="pane-title">Impulsione seu Perfil</h2>
              <p class="pane-subtitle">Apareça nos Destaques da Semana para mais clientes</p>
            </div>
          </div>

          <div class="boost-plans-stack">
            <div
              v-for="plan in boostPlans"
              :key="plan.id"
              class="boost-plan-card"
              :class="{ 'featured-boost': plan.isPopular }"
            >
              <div v-if="plan.isPopular" class="popular-badge">Mais Escolhido</div>
              <div class="boost-plan-header">
                <span class="plan-tag-text">{{ plan.tag }}</span>
                <h3 class="plan-title-text">{{ plan.name }}</h3>
                <div class="plan-price-wrap">
                  <span class="price-big">{{ formatCurrency(plan.price) }}</span>
                  <span class="price-duration">/ {{ plan.duration }}</span>
                </div>
              </div>

              <div class="plan-features-list">
                <div class="feature-line">
                  <ion-icon :icon="flashOutline" class="feature-icon"></ion-icon>
                  <span>Alcance <strong>{{ plan.multiplier }} maior</strong></span>
                </div>
                <div class="feature-line">
                  <ion-icon :icon="checkmarkCircleOutline" class="feature-icon"></ion-icon>
                  <span>{{ plan.desc }}</span>
                </div>
              </div>

              <button
                class="activate-boost-btn"
                :class="{ 'btn-highlight': plan.isPopular }"
                @click="buyBoost(plan)"
              >
                Ativar Impulso
              </button>
            </div>
          </div>
        </section>

        <!-- ================= ABA 4: PERFIL DO PRESTADOR ================= -->
        <section v-if="currentTab === 'profile'" class="tab-pane">
          <div class="profile-main-card">
            <div class="profile-top-avatar-row">
              <div class="avatar-ring-box">
                <img :src="store.workerProfile.avatar" :alt="store.workerProfile.name" class="worker-avatar-img" />
                <span class="level-indicator-tag">Nv. {{ store.workerProfile.level }}</span>
              </div>

              <div class="worker-meta-details">
                <span class="worker-badge-role">{{ store.workerProfile.levelName }}</span>
                <h3 class="worker-name-big">{{ store.workerProfile.name }}</h3>
                <div class="worker-rating-line">
                  <ion-icon :icon="star" class="star-gold"></ion-icon>
                  <span>{{ store.workerProfile.rating }} / 5.0</span>
                  <span class="jobs-counter-text">({{ store.workerProfile.completedJobs }} serviços)</span>
                </div>
              </div>
            </div>

            <!-- Especialidade Ativa do Prestador -->
            <div class="specialty-selector-box">
              <label class="spec-label">Sua categoria principal de atuação:</label>
              <div class="filter-pills-scroll">
                <button
                  v-for="cat in store.categoriesList"
                  :key="cat.id"
                  class="cat-filter-pill"
                  :class="{ active: store.workerProfile.category === cat.name }"
                  @click="updateWorkerCategory(cat.name)"
                >
                  {{ cat.label }}
                </button>
              </div>
            </div>

            <!-- Progresso de Nível XP -->
            <div class="xp-container">
              <div class="xp-labels-row">
                <span>Progresso para Nível {{ store.workerProfile.level + 1 }}</span>
                <strong>{{ store.workerProfile.xp }} / {{ store.workerProfile.nextLevelXp }} XP</strong>
              </div>
              <div class="xp-bar-track">
                <div class="xp-bar-fill" :style="{ width: `${Math.min(100, (store.workerProfile.xp / store.workerProfile.nextLevelXp) * 100)}%` }"></div>
              </div>
            </div>

            <!-- Conquistas e Selos -->
            <div class="badges-chips-wrap">
              <div class="badge-pill-item">
                <ion-icon :icon="flashOutline" class="neon-icon"></ion-icon>
                <span>Resposta Rápida</span>
              </div>
              <div class="badge-pill-item">
                <ion-icon :icon="star" class="neon-icon"></ion-icon>
                <span>Top Avaliado</span>
              </div>
              <div class="badge-pill-item">
                <ion-icon :icon="shieldCheckmarkOutline" class="neon-icon"></ion-icon>
                <span>Identidade Verificada</span>
              </div>
            </div>

            <!-- Botão de Resetar Apresentação (Restaurar todos os estados iniciais) -->
            <div class="reset-presentation-box">
              <button class="reset-presentation-btn" @click="handleResetDemo">
                <ion-icon :icon="refreshOutline"></ion-icon>
                <span>Resetar Apresentação (Restaurar Estados Iniciais)</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      <!-- MODAL 1: SAQUE VIA PIX (FECHAMENTO DE FLUXO FINANCEIRO) -->
      <ion-modal
        :is-open="isWithdrawModalOpen"
        :breakpoints="[0, 0.65, 0.85]"
        :initial-breakpoint="0.65"
        @didDismiss="isWithdrawModalOpen = false"
        class="custom-modal-sheet"
      >
        <ion-content class="modal-sheet-inner ion-padding">
          <div class="modal-header-row">
            <div>
              <h2 class="sheet-title">Sacar via PIX</h2>
              <p class="sheet-subtitle">Disponível: {{ formatCurrency(store.walletBalance) }}</p>
            </div>
            <button class="btn-close-modal" @click="isWithdrawModalOpen = false">✕</button>
          </div>

          <div class="withdraw-form-stack">
            <label class="field-label">Chave PIX de destino</label>
            <input
              type="text"
              v-model="pixKeyInput"
              placeholder="CPF, Celular ou E-mail"
              class="modal-dark-input"
            />

            <label class="field-label">Valor do saque (R$)</label>
            <div class="quick-recharge-row">
              <button
                v-for="amt in [50, 100, store.walletBalance]"
                :key="amt"
                class="quick-amt-btn"
                :class="{ active: withdrawAmount === amt }"
                @click="withdrawAmount = amt"
              >
                {{ amt === store.walletBalance ? `Tudo (${formatCurrency(amt)})` : `R$ ${amt}` }}
              </button>
            </div>

            <button class="confirm-recharge-btn" @click="confirmWithdrawPix">
              Transferir {{ formatCurrency(withdrawAmount) }} Agora
            </button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- MODAL 2: RECARGA -->
      <ion-modal
        :is-open="isRechargeModalOpen"
        :breakpoints="[0, 0.55, 0.8]"
        :initial-breakpoint="0.55"
        @didDismiss="isRechargeModalOpen = false"
        class="custom-modal-sheet"
      >
        <ion-content class="modal-sheet-inner ion-padding">
          <div class="modal-header-row">
            <div>
              <h2 class="sheet-title">Adicionar Saldo</h2>
              <p class="sheet-subtitle">Recarga instantânea via PIX</p>
            </div>
            <button class="btn-close-modal" @click="isRechargeModalOpen = false">✕</button>
          </div>

          <div class="quick-recharge-row">
            <button
              v-for="amt in [30, 50, 100]"
              :key="amt"
              class="quick-amt-btn"
              :class="{ active: rechargeValue === amt }"
              @click="rechargeValue = amt"
            >
              + R$ {{ amt }}
            </button>
          </div>

          <button class="confirm-recharge-btn" @click="confirmRecharge">
            Confirmar Recarga de R$ {{ rechargeValue }}
          </button>
        </ion-content>
      </ion-modal>

      <!-- Toast Feedback -->
      <ion-toast
        :is-open="showToast"
        :message="toastMsg"
        :duration="2400"
        position="bottom"
        @didDismiss="showToast = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
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
  flashOutline,
  walletOutline,
  rocketOutline,
  personCircleOutline,
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
  checkmarkCircleOutline,
  chatbubbleOutline,
  star,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import { useAppStore } from '@/stores/useAppStore';

const router = useRouter();
const store = useAppStore();

const currentTab = ref('leads');
const selectedJobFilter = ref('Todos');

const showToast = ref(false);
const toastMsg = ref('');

const isRechargeModalOpen = ref(false);
const rechargeValue = ref(50);

const isWithdrawModalOpen = ref(false);
const pixKeyInput = ref(store.workerProfile.pixKey || 'carlos.oliveira@pix.com.br');
const withdrawAmount = ref(100);

const filteredJobLeads = computed(() => {
  if (selectedJobFilter.value === 'Todos') return store.jobLeads;
  return store.jobLeads.filter(j => j.category === selectedJobFilter.value);
});

const boostPlans = [
  {
    id: 'b-1',
    name: 'Impulso Básico',
    tag: 'Econômico',
    price: 19.90,
    duration: '3 dias',
    multiplier: '1.5x',
    desc: 'Destaque na listagem da sua categoria para chamados urgentes.',
    isPopular: false
  },
  {
    id: 'b-2',
    name: 'Impulso Turbo Pro',
    tag: 'Recomendado',
    price: 39.90,
    duration: '7 dias',
    multiplier: '3.8x',
    desc: 'Prioridade máxima no topo das buscas com selo Verificado Destaque.',
    isPopular: true
  },
  {
    id: 'b-3',
    name: 'Impulso VIP Mensal',
    tag: 'Performance',
    price: 89.90,
    duration: '30 dias',
    multiplier: '5.5x',
    desc: 'Exposição contínua em Destaques da Semana durante todo o mês.',
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

function goToHome() {
  router.push('/home');
}

function goToClientDashboard() {
  router.push('/client/dashboard');
}

function skipJob(jobId) {
  store.skipJobLead(jobId);
  toastMsg.value = 'Chamado ocultado da sua fila.';
  showToast.value = true;
}

function acceptJob(job) {
  store.acceptJobLead(job);
  toastMsg.value = `Chamado aceito! Combine os detalhes em "Em Andamento".`;
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
  store.completeWorkerJob(job.id);
  const net = Math.round(job.budget * 0.95);
  toastMsg.value = `Serviço concluído! +R$ ${net} liberados na sua Carteira!`;
  showToast.value = true;
}

function resetJobs() {
  store.resetJobLeads();
  selectedJobFilter.value = 'Todos';
  toastMsg.value = 'Fila de chamados atualizada!';
  showToast.value = true;
}

function openWithdrawModal() {
  withdrawAmount.value = store.walletBalance > 0 ? store.walletBalance : 50;
  isWithdrawModalOpen.value = true;
}

function confirmWithdrawPix() {
  if (store.walletBalance <= 0) {
    toastMsg.value = 'Saldo insuficiente para saque.';
    showToast.value = true;
    return;
  }
  const ok = store.withdrawPix(withdrawAmount.value, pixKeyInput.value);
  if (ok) {
    isWithdrawModalOpen.value = false;
    toastMsg.value = `PIX de ${formatCurrency(withdrawAmount.value)} enviado para ${pixKeyInput.value}!`;
    showToast.value = true;
  }
}

function confirmRecharge() {
  store.rechargeWallet(rechargeValue.value);
  isRechargeModalOpen.value = false;
  toastMsg.value = `Recarga de R$ ${rechargeValue.value} adicionada!`;
  showToast.value = true;
}

function buyBoost(plan) {
  toastMsg.value = `${plan.name} ativado com sucesso!`;
  showToast.value = true;
}

function updateWorkerCategory(catName) {
  store.workerProfile.category = catName;
  store.workerProfile.levelName = `Especialista Ouro • ${catName}`;
  toastMsg.value = `Categoria principal atualizada para ${catName}!`;
  showToast.value = true;
}

function handleResetDemo() {
  store.resetPresentation();
  selectedJobFilter.value = 'Todos';
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

/* ================= HEADER ================= */
.provider-header {
  background: #030407;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.provider-toolbar {
  --background: #030407;
  --min-height: 60px;
}

.header-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 16px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.neon-plus {
  color: #D4FF24;
  font-size: 26px;
  font-weight: 900;
}

.brand-name {
  font-size: 20px;
  font-weight: 900;
  font-style: italic;
  color: #ffffff;
}

.worker-mode-tag {
  background: rgba(212, 255, 36, 0.14);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 6px;
  margin-left: 4px;
}

.header-right-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wallet-pill-btn {
  background: #0b0f17;
  border: 1px solid rgba(212, 255, 36, 0.35);
  border-radius: 10px;
  padding: 4px 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  cursor: pointer;
}

.wallet-tiny-label {
  font-size: 9px;
  color: #9ca3af;
  text-transform: uppercase;
}

.wallet-value-text {
  font-size: 13px;
  font-weight: 800;
  color: #D4FF24;
}

.switch-to-client-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
  border-radius: 10px;
  padding: 8px 11px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.btn-text-hide-sm {
  display: none;
}

@media (min-width: 540px) {
  .btn-text-hide-sm {
    display: inline;
  }
}

/* Subnav */
.subnav-container {
  background: #06090f;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.subnav-inner {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.subnav-item {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #9ca3af;
  padding: 11px 6px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
}

.subnav-item.active {
  color: #D4FF24;
  border-bottom-color: #D4FF24;
  font-weight: 700;
}

.subnav-badge {
  background: #D4FF24;
  color: #050800;
  font-size: 10px;
  font-weight: 900;
  padding: 1px 5px;
  border-radius: 99px;
}

/* ================= CONTEÚDO ================= */
.provider-content {
  --background: #030407;
}

.page-wrapper {
  max-width: 820px;
  margin: 0 auto;
  padding: 16px 16px 96px;
}

.section-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.pane-title {
  font-size: 19px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.pane-subtitle {
  font-size: 12.5px;
  color: #9ca3af;
  margin: 2px 0 0;
}

.leads-counter-pill {
  background: rgba(212, 255, 36, 0.12);
  border: 1px solid rgba(212, 255, 36, 0.3);
  color: #D4FF24;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
}

/* ================= TRABALHOS EM ANDAMENTO ================= */
.accepted-jobs-section {
  margin-bottom: 24px;
}

.accepted-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.accepted-job-card {
  background: rgba(212, 255, 36, 0.05);
  border: 1px solid rgba(212, 255, 36, 0.35);
  border-radius: 14px;
  padding: 14px;
}

.accepted-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.accepted-cat-pill {
  font-size: 11px;
  font-weight: 800;
  color: #D4FF24;
  text-transform: uppercase;
}

.accepted-status-tag {
  font-size: 11px;
  font-weight: 700;
  color: #4ade80;
}

.accepted-title {
  font-size: 15px;
  font-weight: 800;
  margin: 0 0 4px;
}

.accepted-meta {
  font-size: 12px;
  color: #9ca3af;
  margin: 0 0 12px;
}

.accepted-client-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  flex-wrap: wrap;
}

.client-mini-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.client-mini-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
}

.client-mini-name {
  display: block;
  font-size: 12.5px;
}

.client-mini-val {
  font-size: 11px;
  color: #D4FF24;
  font-weight: 700;
}

.accepted-actions-row {
  display: flex;
  gap: 8px;
}

.btn-chat-client {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.btn-finish-job {
  background: #D4FF24;
  border: none;
  color: #050800;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

/* ================= FILTROS & CARDS DE CHAMADOS ================= */
.filter-pills-scroll {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 14px;
  scrollbar-width: none;
}

.filter-pills-scroll::-webkit-scrollbar {
  display: none;
}

.cat-filter-pill {
  background: #090d15;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  padding: 7px 13px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.cat-filter-pill.active {
  background: rgba(212, 255, 36, 0.14);
  border-color: #D4FF24;
  color: #D4FF24;
  font-weight: 700;
}

.jobs-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.job-card-item {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
}

.job-top-badges {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.job-type-chip {
  font-size: 11px;
  font-weight: 800;
  color: #D4FF24;
  text-transform: uppercase;
}

.job-scope-chip {
  font-size: 11px;
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 6px;
}

.job-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.job-title {
  font-size: 16px;
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
  font-size: 10px;
  color: #9ca3af;
}

.payout-amount {
  font-size: 18px;
  font-weight: 900;
  color: #D4FF24;
}

.job-meta-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12.5px;
  color: #d1d5db;
  margin-bottom: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.meta-icon-neon {
  color: #D4FF24;
}

.job-description-text {
  font-size: 12.5px;
  color: #9ca3af;
  margin: 0 0 14px;
  line-height: 1.4;
}

.job-card-actions {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
}

.job-skip-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #9ca3af;
  border-radius: 10px;
  height: 44px;
  font-size: 12.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
}

.job-accept-btn {
  background: #D4FF24;
  border: none;
  color: #050800;
  border-radius: 10px;
  height: 44px;
  font-size: 13px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.empty-leads-box {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 32px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 36px;
  color: #D4FF24;
}

.empty-title {
  font-size: 16px;
  font-weight: 800;
  margin: 8px 0 4px;
}

.empty-desc {
  font-size: 12.5px;
  color: #9ca3af;
  margin: 0 0 16px;
}

.reload-jobs-btn {
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 12.5px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

/* ================= CARTEIRA ================= */
.wallet-balance-card {
  background: #070a10;
  border: 1px solid rgba(212, 255, 36, 0.25);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.balance-label {
  font-size: 12px;
  color: #9ca3af;
}

.balance-giant-number {
  font-size: 32px;
  font-weight: 900;
  color: #D4FF24;
  margin: 4px 0;
}

.balance-sub {
  font-size: 11.5px;
  color: #9ca3af;
}

.wallet-actions-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
}

.wallet-primary-btn {
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 10px;
  height: 44px;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.wallet-secondary-btn {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  height: 44px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.pane-subheading {
  font-size: 15px;
  font-weight: 800;
  margin: 0 0 10px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tx-card-row {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tx-left-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tx-icon-round {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.tx-earning {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.tx-debit {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.tx-recharge {
  background: rgba(212, 255, 36, 0.15);
  color: #D4FF24;
}

.tx-info-block {
  display: flex;
  flex-direction: column;
}

.tx-title-text {
  font-size: 13px;
  font-weight: 700;
}

.tx-date-meta {
  font-size: 11px;
  color: #9ca3af;
}

.tx-amount-value {
  font-size: 13.5px;
  font-weight: 800;
}

.amount-green {
  color: #4ade80;
}

.amount-red {
  color: #f87171;
}

/* ================= IMPULSOS ================= */
.boost-plans-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.boost-plan-card {
  position: relative;
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px;
}

.boost-plan-card.featured-boost {
  border-color: #D4FF24;
}

.popular-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #D4FF24;
  color: #050800;
  font-size: 10px;
  font-weight: 900;
  padding: 2px 8px;
  border-radius: 99px;
}

.plan-tag-text {
  font-size: 10.5px;
  color: #D4FF24;
  font-weight: 700;
  text-transform: uppercase;
}

.plan-title-text {
  font-size: 16px;
  font-weight: 800;
  margin: 2px 0 6px;
}

.price-big {
  font-size: 20px;
  font-weight: 900;
  color: #ffffff;
}

.price-duration {
  font-size: 12px;
  color: #9ca3af;
}

.plan-features-list {
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-line {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: #d1d5db;
}

.feature-icon {
  color: #D4FF24;
}

.activate-boost-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  border-radius: 10px;
  height: 42px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.activate-boost-btn.btn-highlight {
  background: #D4FF24;
  color: #050800;
  border: none;
}

/* ================= PERFIL ================= */
.profile-main-card {
  background: #070a10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 18px;
}

.profile-top-avatar-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.avatar-ring-box {
  position: relative;
}

.worker-avatar-img {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.level-indicator-tag {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #D4FF24;
  color: #050800;
  font-size: 10px;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 99px;
}

.worker-badge-role {
  font-size: 11px;
  color: #D4FF24;
  font-weight: 700;
}

.worker-name-big {
  font-size: 18px;
  font-weight: 800;
  margin: 2px 0 4px;
}

.worker-rating-line {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
}

.star-gold {
  color: #facc15;
}

.jobs-counter-text {
  color: #9ca3af;
}

.specialty-selector-box {
  margin-bottom: 16px;
}

.spec-label {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.xp-container {
  background: #0b0f17;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 14px;
}

.xp-labels-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 6px;
}

.xp-bar-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 99px;
  overflow: hidden;
}

.xp-bar-fill {
  height: 100%;
  background: #D4FF24;
}

.badges-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge-pill-item {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 99px;
  padding: 6px 12px;
  font-size: 11.5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.neon-icon {
  color: #D4FF24;
}

.reset-presentation-box {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.reset-presentation-btn {
  width: 100%;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
  border-radius: 10px;
  height: 44px;
  font-size: 12.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

/* ================= MODAIS ================= */
.modal-sheet-inner {
  --background: #0b0e14;
  --color: #ffffff;
}

.modal-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.sheet-title {
  font-size: 18px;
  font-weight: 800;
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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.withdraw-form-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-label {
  font-size: 12px;
  font-weight: 700;
  color: #d1d5db;
}

.modal-dark-input {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 11px 12px;
  color: #ffffff;
  font-size: 13.5px;
  outline: none;
}

.quick-recharge-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 6px 0 12px;
}

.quick-amt-btn {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  border-radius: 10px;
  height: 42px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}

.quick-amt-btn.active {
  background: rgba(212, 255, 36, 0.14);
  border-color: #D4FF24;
  color: #D4FF24;
}

.confirm-recharge-btn {
  width: 100%;
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 10px;
  height: 46px;
  font-size: 13.5px;
  font-weight: 900;
  cursor: pointer;
}
</style>
