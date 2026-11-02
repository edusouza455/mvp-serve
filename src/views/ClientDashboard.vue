<template>
  <ion-page>
    <!-- Header com simulação de Usuário Logado e navegação do Dashboard -->
    <ion-header class="client-header ion-no-border">
      <ion-toolbar class="header-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" class="header-back-btn"></ion-back-button>
        </ion-buttons>

        <!-- Brand Logo + Breadcrumb / Caminho da página -->
        <div class="header-brand-block" @click="goToHome">
          <span class="neon-brand">+serve</span>
          <span class="header-separator">/</span>
          <span class="header-path">Painel</span>
        </div>

        <ion-buttons slot="end" class="header-end-buttons">
          <!-- Botão para mudar para o Modo Prestador e navegar para /provider -->
          <div class="user-profile-badge" @click="switchToProvider" title="Mudar para Modo Prestador">
            <img
              :src="appStore.currentUser.avatar"
              :alt="appStore.currentUser.name"
              class="user-avatar"
            />
            <div class="user-text-meta">
              <span class="user-name">{{ appStore.currentUser.name }}</span>
              <span class="user-role-label">Mudar p/ Prestador ➔</span>
            </div>
          </div>

          <ion-button fill="clear" size="small" class="icon-toggle-role" @click="switchToProvider" title="Mudar para Modo Prestador">
            <ion-icon slot="icon-only" :icon="swapHorizontalOutline"></ion-icon>
          </ion-button>

          <ion-button fill="clear" class="header-icon-btn" aria-label="Notificações">
            <ion-icon slot="icon-only" :icon="notificationsOutline"></ion-icon>
          </ion-button>

          <ion-button
            fill="clear"
            size="small"
            class="reset-demo-btn"
            title="Resetar Demo"
            aria-label="Resetar Demo"
            @click="handleResetDemo"
          >
            <ion-icon slot="icon-only" :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="client-content">
      <div class="dashboard-container">

        <!-- Top Actions Bar: Abas (Ativos / Concluídos) + Botão Novo Evento -->
        <div class="top-dashboard-bar">
          <div class="tabs-segmented">
            <button
              class="tab-btn"
              :class="{ active: currentTab === 'active' }"
              @click="currentTab = 'active'"
            >
              Ativos ({{ activeRequestsList.length }})
            </button>
            <button
              class="tab-btn"
              :class="{ active: currentTab === 'completed' }"
              @click="currentTab = 'completed'"
            >
              Concluídos ({{ completedRequestsList.length }})
            </button>
          </div>

          <ion-button
            fill="solid"
            class="btn-new-event"
            @click="isCreateModalOpen = true"
          >
            <ion-icon slot="start" :icon="addCircleOutline"></ion-icon>
            Novo Serviço
          </ion-button>
        </div>

        <!-- LISTA DE EVENTOS (Cada um em sua própria seção expansível/colapsável) -->
        <div v-if="filteredRequests.length > 0" class="events-sections-wrapper">
          <div
            v-for="req in filteredRequests"
            :key="req.id"
            class="event-section-box"
          >
            <!-- Header do Evento: Clicável para abrir/expandir ou recolher -->
            <div class="event-header-row" @click="appStore.toggleExpandRequest(req.id)">
              <div class="event-header-top-mobile">
                <div class="event-header-badges">
                  <span
                    class="expand-icon"
                    :class="{ rotated: req.isExpanded }"
                  >
                    <ion-icon :icon="chevronDownOutline"></ion-icon>
                  </span>
                  <span class="category-badge">{{ req.category }}</span>
                </div>

                <div class="event-header-status-wrap">
                  <span
                    class="status-chip"
                    :class="getStatusClass(req.status)"
                  >
                    {{ getStatusText(req.status) }}
                  </span>
                  <span class="offers-badge-counter">
                    {{ req.offers?.length || 0 }} {{ req.offers?.length === 1 ? 'proposta' : 'propostas' }}
                  </span>
                </div>
              </div>

              <div class="event-header-titles">
                <h3 class="event-title">{{ req.location || 'Local a combinar' }}</h3>
                <span class="event-submeta">
                  {{ req.date || 'Hoje' }} às {{ req.time || '14:00' }} •
                  <strong>{{ formatCurrency(req.budget) }}</strong>
                </span>
              </div>
            </div>

            <!-- Corpo Expandido: Isolado por Evento (Os trabalhadores não se misturam!) -->
            <div v-show="req.isExpanded" class="event-body-expandable">
              <!-- Detalhes do Evento -->
              <div class="event-details-preview">
                <p v-if="req.description" class="desc-line">
                  <ion-icon :icon="informationCircleOutline"></ion-icon>
                  "{{ req.description }}"
                </p>
                <div class="details-mini-chips">
                  <span>Data: {{ req.date }} ({{ req.time }})</span>
                  <span>Endereço: {{ req.location }}</span>
                  <span>Teto: {{ formatCurrency(req.budget) }}</span>
                </div>
              </div>

              <!-- Seção de Ofertas Exclusivas deste Evento -->
              <div class="event-offers-wrapper">
                <div class="offers-top-label">
                  <span class="pulse-dot" v-if="req.status !== 'COMPLETED'"></span>
                  <h4>Profissionais disputando este evento:</h4>
                </div>

                <!-- Carregando propostas para este evento -->
                <div v-if="(!req.offers || req.offers.length === 0) && req.status !== 'COMPLETED'" class="offers-loading">
                  <ion-spinner name="crescent" color="primary"></ion-spinner>
                  <p>Buscando os melhores prestadores próximos ao local...</p>
                </div>

                <!-- Evento Concluído -->
                <div v-else-if="req.status === 'COMPLETED'" class="completed-event-summary">
                  <ion-icon :icon="checkmarkCircleOutline" class="check-icon"></ion-icon>
                  <div>
                    <h5>Serviço Concluído com Sucesso!</h5>
                    <p v-if="req.selectedOffer">
                      Executado por <strong>{{ req.selectedOffer.professional?.name }}</strong> no valor de {{ formatCurrency(req.selectedOffer.price) }}.
                    </p>
                  </div>
                </div>

                <!-- Cards de Ofertas Recebidas -->
                <div v-else class="candidates-cards-list">
                  <ion-card
                    v-for="offer in req.offers"
                    :key="offer.id"
                    class="candidate-card"
                  >
                    <ion-card-content class="candidate-card-body">
                      <div class="candidate-main-row">
                        <img
                          :src="offer.professional?.avatar"
                          :alt="offer.professional?.name"
                          class="candidate-avatar"
                        />

                        <div class="candidate-meta">
                          <h4 class="candidate-name">{{ offer.professional?.name }}</h4>
                          <div class="candidate-rating">
                            <ion-icon :icon="star" class="star-icon"></ion-icon>
                            <span>{{ offer.professional?.rating }}</span>
                            <span class="rating-reviews">(40+ avaliações)</span>
                          </div>
                        </div>

                        <div class="candidate-price-box">
                          <span class="price-kicker">Proposta</span>
                          <span class="price-val">{{ formatCurrency(offer.price) }}</span>
                        </div>
                      </div>

                      <p v-if="offer.message" class="candidate-msg">"{{ offer.message }}"</p>

                      <div class="candidate-actions">
                        <ion-button
                          fill="outline"
                          class="btn-profile"
                          @click="openProfileModal(offer.professional)"
                        >
                          Ver Perfil
                        </ion-button>

                        <ion-button
                          class="btn-accept"
                          @click="handleAcceptOffer(offer, req.id)"
                        >
                          Aceitar Profissional
                        </ion-button>
                      </div>
                    </ion-card-content>
                  </ion-card>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado Vazio: Nenhum Evento no filtro atual -->
        <div v-else class="empty-state-card">
          <div class="empty-icon-circle">
            <ion-icon :icon="calendarOutline"></ion-icon>
          </div>
          <h3>{{ currentTab === 'active' ? 'Nenhum evento ativo no momento' : 'Nenhum evento concluído ainda' }}</h3>
          <p>
            {{ currentTab === 'active' ? 'Cadastre seu primeiro serviço e receba propostas imediatas.' : 'Eventos finalizados aparecerão arquivados nesta aba.' }}
          </p>

          <ion-button
            v-if="currentTab === 'active'"
            class="btn-empty-create"
            @click="isCreateModalOpen = true"
          >
            Cadastrar Novo Serviço
          </ion-button>
        </div>

      </div>

      <!-- Modal Bottom Sheet: Cadastrar Novo Evento / Serviço -->
      <ion-modal
        :is-open="isCreateModalOpen"
        :breakpoints="[0, 0.75, 1.0]"
        :initial-breakpoint="0.85"
        @didDismiss="isCreateModalOpen = false"
        class="custom-bottom-sheet"
      >
        <ion-content class="modal-sheet-content ion-padding">
          <div class="modal-form-wrapper">
            <div class="modal-header-top">
              <h2 class="modal-title">Novo Evento / Serviço</h2>
              <ion-button fill="clear" size="small" @click="isCreateModalOpen = false">
                <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
              </ion-button>
            </div>
            <p class="modal-subtitle">Preencha as informações para abrir uma nova solicitação.</p>

            <ion-item class="form-item">
              <ion-select
                label="Categoria Profissional"
                label-placement="floating"
                v-model="formCategory"
                cancel-text="Cancelar"
                ok-text="Confirmar"
                @ionChange="handleCategoryChange"
              >
                <ion-select-option
                  v-for="cat in availableCategories"
                  :key="cat.name"
                  :value="cat.name"
                >
                  {{ cat.name }} (Piso R$ {{ cat.minPrice }})
                </ion-select-option>
              </ion-select>
            </ion-item>

            <div class="two-col-row">
              <ion-item class="form-item col-item">
                <ion-input
                  type="date"
                  label="Data do Evento"
                  label-placement="floating"
                  v-model="formDate"
                ></ion-input>
              </ion-item>

              <ion-item class="form-item col-item">
                <ion-input
                  type="time"
                  label="Horário"
                  label-placement="floating"
                  v-model="formTime"
                ></ion-input>
              </ion-item>
            </div>

            <ion-item class="form-item">
              <ion-input
                type="text"
                label="Local / Endereço"
                label-placement="floating"
                placeholder="Ex: Av. Paulista, 1000 - Apto 42"
                v-model="formLocation"
              ></ion-input>
            </ion-item>

            <div class="budget-input-wrapper">
              <ion-item class="form-item" :class="{ 'has-error': isBudgetBelowMin }">
                <ion-label position="stacked">Orçamento Máximo (R$)</ion-label>
                <ion-input
                  v-model.number="formBudget"
                  type="number"
                  placeholder="80.00"
                ></ion-input>
              </ion-item>
              <span v-if="isBudgetBelowMin" class="error-msg-red">
                O valor mínimo para {{ formCategory }} é R$ {{ currentMinPrice.toFixed(2) }}.
              </span>
            </div>

            <ion-item class="form-item">
              <ion-textarea
                label="Detalhes e Observações"
                label-placement="floating"
                placeholder="Descreva o que será feito..."
                v-model="formDescription"
                :auto-grow="true"
              ></ion-textarea>
            </ion-item>

            <ion-button
              expand="block"
              class="btn-confirm-create"
              :disabled="!isFormValid"
              @click="submitNewEvent"
            >
              Publicar Evento e Buscar Profissionais
            </ion-button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- Modal de Perfil do Profissional -->
      <ion-modal
        :is-open="isProfileModalOpen"
        :breakpoints="[0, 0.55, 0.8]"
        :initial-breakpoint="0.6"
        @didDismiss="isProfileModalOpen = false"
        class="custom-bottom-sheet"
      >
        <ion-content class="modal-sheet-content ion-padding">
          <div v-if="selectedProfessional" class="profile-inner">
            <div class="profile-header">
              <img
                :src="selectedProfessional.avatar"
                :alt="selectedProfessional.name"
                class="profile-large-avatar"
              />
              <div class="profile-title-box">
                <h3 class="profile-name">{{ selectedProfessional.name }}</h3>
                <div class="profile-rating-badge">
                  <ion-icon :icon="star" class="star-icon"></ion-icon>
                  <span>{{ selectedProfessional.rating }} / 5.0</span>
                </div>
              </div>
            </div>

            <div class="profile-details-box">
              <h4 class="details-heading">Sobre o Profissional</h4>
              <p class="profile-desc">{{ selectedProfessional.description }}</p>
            </div>

            <ion-button
              expand="block"
              fill="outline"
              class="btn-close-modal"
              @click="isProfileModalOpen = false"
            >
              Fechar
            </ion-button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- Toast Feedback -->
      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :color="toastColor"
        :duration="2500"
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
  IonSelect,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonSpinner,
  IonToast
} from '@ionic/vue';
import {
  notificationsOutline,
  refreshOutline,
  addCircleOutline,
  chevronDownOutline,
  informationCircleOutline,
  checkmarkCircleOutline,
  calendarOutline,
  closeOutline,
  swapHorizontalOutline,
  star
} from 'ionicons/icons';
import { useAppStore } from '@/stores/useAppStore';

const router = useRouter();
const appStore = useAppStore();

const currentTab = ref('active'); // 'active' | 'completed'
const isCreateModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const selectedProfessional = ref(null);

const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('success');

// Categorias e pisos mínimos
const availableCategories = [
  { name: 'Eletricista', minPrice: 80 },
  { name: 'Garçom', minPrice: 100 },
  { name: 'Diarista', minPrice: 120 },
  { name: 'Encanador', minPrice: 90 },
  { name: 'Pintor', minPrice: 100 }
];

// Dados do Formulário para Novo Evento
const formCategory = ref('Eletricista');
const formDate = ref(new Date().toISOString().split('T')[0]);
const formTime = ref('14:30');
const formLocation = ref('Av. Paulista, 1000 - Bela Vista');
const formBudget = ref(80);
const formDescription = ref('');

// Formatação BRL
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function formatCurrency(val) {
  return currencyFormatter.format(Number(val) || 0);
}

// Filtro de Eventos Ativos vs Concluídos
const activeRequestsList = computed(() => {
  return appStore.requests.filter((r) => r.status !== 'COMPLETED');
});

const completedRequestsList = computed(() => {
  return appStore.requests.filter((r) => r.status === 'COMPLETED');
});

const filteredRequests = computed(() => {
  return currentTab.value === 'active' ? activeRequestsList.value : completedRequestsList.value;
});

const currentMinPrice = computed(() => {
  const cat = availableCategories.find((c) => c.name === formCategory.value);
  return cat ? cat.minPrice : 80;
});

const isBudgetBelowMin = computed(() => {
  if (formBudget.value === null || formBudget.value === '') return false;
  return Number(formBudget.value) < currentMinPrice.value;
});

const isFormValid = computed(() => {
  return (
    formCategory.value &&
    formLocation.value.trim() &&
    formBudget.value &&
    Number(formBudget.value) >= currentMinPrice.value
  );
});

function handleCategoryChange() {
  if (!formBudget.value || formBudget.value < currentMinPrice.value) {
    formBudget.value = currentMinPrice.value;
  }
}

function submitNewEvent() {
  if (!isFormValid.value) return;

  appStore.createRequest({
    category: formCategory.value,
    date: formDate.value,
    time: formTime.value,
    location: formLocation.value,
    budget: Number(formBudget.value),
    description: formDescription.value
  });

  isCreateModalOpen.value = false;
  currentTab.value = 'active';
  toastMessage.value = 'Novo evento criado! Profissionais notificados.';
  toastColor.value = 'success';
  showToast.value = true;
}

function openProfileModal(prof) {
  selectedProfessional.value = prof;
  isProfileModalOpen.value = true;
}

function handleAcceptOffer(offer, reqId) {
  try {
    appStore.acceptProfessional(offer, reqId);
    toastMessage.value = `Proposta de ${offer.professional?.name} aceita! Chat liberado.`;
    toastColor.value = 'success';
    showToast.value = true;
  } catch (error) {
    toastMessage.value = error.message || 'Erro ao aceitar proposta';
    toastColor.value = 'danger';
    showToast.value = true;
  }
}

function getStatusClass(status) {
  if (status === 'COMPLETED') return 'status-completed';
  if (status === 'IN_PROGRESS') return 'status-progress';
  return 'status-pending';
}

function getStatusText(status) {
  if (status === 'COMPLETED') return 'Concluído';
  if (status === 'IN_PROGRESS') return 'Em Andamento';
  return 'Aguardando';
}

function goToHome() {
  router.push('/');
}

function switchToProvider() {
  appStore.setRole('PROVIDER');
  router.push('/provider');
}

function handleResetDemo() {
  appStore.resetDemo();
  toastMessage.value = 'Ambiente de demonstração resetado com sucesso!';
  toastColor.value = 'success';
  showToast.value = true;
}
</script>

<style scoped>
.client-header {
  background: transparent;
}

.header-toolbar {
  --background: rgba(3, 4, 7, 0.95);
  --border-style: none;
  backdrop-filter: blur(10px);
  padding: 0 4px;
  border-bottom: 1px solid #1c202b;
}

.header-back-btn {
  --color: #ffffff;
  margin-inline-start: -4px;
}

/* Breadcrumb no topo */
.header-brand-block {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.neon-brand {
  font-size: 1.4rem;
  font-weight: 800;
  color: #D4FF24;
  letter-spacing: -0.5px;
}

.header-separator {
  color: #68686a;
  font-size: 0.95rem;
}

.header-path {
  color: #cdcdce;
  font-size: 0.85rem;
  font-weight: 600;
}

.header-end-buttons {
  display: flex;
  align-items: center;
}

/* Usuário Logado Mockado */
.user-profile-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0e121a;
  border: 1px solid #1c2436;
  padding: 3px 8px;
  border-radius: 999px;
  margin-right: 2px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #1558C9;
}

.user-text-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.1;
  max-width: 65px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role-label {
  color: #5d93f7;
  font-size: 0.62rem;
  font-weight: 500;
}

@media (max-width: 420px) {
  .user-text-meta {
    display: none; /* Em telas muito pequenas esconde o texto e mantém só o avatar */
  }
}

.header-icon-btn {
  --color: #ffffff;
  font-size: 1.15rem;
  --padding-start: 4px;
  --padding-end: 4px;
}

.reset-demo-btn {
  --color: #68686a;
  opacity: 0.7;
  --padding-start: 4px;
  --padding-end: 4px;
}

.reset-demo-btn:hover {
  opacity: 1;
  --color: #D4FF24;
}

.client-content {
  --background: #030407;
  --padding-top: 12px;
  --padding-bottom: 24px;
  --padding-start: 12px;
  --padding-end: 12px;
  font-family: 'Inter', sans-serif;
}

.dashboard-container {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Top Dashboard Bar */
.top-dashboard-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tabs-segmented {
  display: flex;
  background: #0d1017;
  border: 1px solid #1c202b;
  border-radius: 12px;
  padding: 3px;
  gap: 4px;
  flex: 1 1 auto;
}

.tab-btn {
  background: transparent;
  border: none;
  color: #8e8e90;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  text-align: center;
  white-space: nowrap;
}

.tab-btn.active {
  background: #1558C9;
  color: #ffffff;
}

.btn-new-event {
  --background: #D4FF24;
  --background-activated: #bbe020;
  --color: #030407;
  font-weight: 800;
  font-size: 0.85rem;
  --border-radius: 10px;
  margin: 0;
  flex: 0 0 auto;
}

/* Modern Minimalist Cards */
.events-sections-wrapper {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.event-section-box {
  background: #090c13;
  border: 1px solid #171d2b;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
  transition: border-color 0.2s ease;
}

.event-section-box:hover {
  border-color: #222b3d;
}

.event-header-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  background: #0d121c;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #161b28;
  transition: background 0.2s;
}

.event-header-row:hover {
  background: #111724;
}

.event-header-top-mobile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.event-header-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-icon {
  color: #5d93f7;
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  transition: transform 0.25s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.category-badge {
  background: rgba(21, 88, 201, 0.15);
  border: 1px solid rgba(21, 88, 201, 0.35);
  color: #6398ff;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.event-header-status-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-chip {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
}

.status-pending {
  background: rgba(212, 255, 36, 0.1);
  color: #D4FF24;
  border: 1px solid rgba(212, 255, 36, 0.25);
}

.status-progress {
  background: rgba(37, 211, 102, 0.12);
  color: #25d366;
  border: 1px solid rgba(37, 211, 102, 0.3);
}

.status-completed {
  background: rgba(255, 255, 255, 0.08);
  color: #9a9b9c;
  border: 1px solid #232733;
}

.offers-badge-counter {
  background: #121724;
  color: #b3b4b5;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid #1e2638;
}

.event-header-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-title {
  color: #ffffff;
  font-size: 0.98rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

.event-submeta {
  color: #8e8e90;
  font-size: 0.8rem;
}

.event-submeta strong {
  color: #D4FF24;
}

/* Event Body Expandable */
.event-body-expandable {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: fadeIn 0.25s ease;
  background: #07090f;
}

.event-details-preview {
  background: #0e121a;
  border: 1px solid #1a2233;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.desc-line {
  color: #d9dada;
  font-size: 0.82rem;
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  line-height: 1.45;
}

.desc-line ion-icon {
  color: #5d93f7;
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.details-mini-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.details-mini-chips span {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: #8e8e90;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
}

/* Offers per Event */
.event-offers-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.offers-top-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  background: #25d366;
  border-radius: 50%;
  box-shadow: 0 0 8px #25d366;
}

.offers-top-label h4 {
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 700;
  margin: 0;
}

.offers-loading {
  background: #0c0f17;
  border: 1px solid #182030;
  border-radius: 12px;
  padding: 24px 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.offers-loading p {
  color: #8e8e90;
  font-size: 0.8rem;
  margin: 0;
}

.completed-event-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(37, 211, 102, 0.08);
  border: 1px solid rgba(37, 211, 102, 0.25);
  border-radius: 12px;
  padding: 14px 16px;
}

.check-icon {
  font-size: 1.8rem;
  color: #25d366;
}

.completed-event-summary h5 {
  color: #25d366;
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 2px 0;
}

.completed-event-summary p {
  color: #cdcdce;
  font-size: 0.8rem;
  margin: 0;
}

.candidates-cards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.candidate-card {
  background: #0d121c;
  border: 1px solid #1a2233;
  border-radius: 14px;
  margin: 0;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.candidate-card:hover {
  border-color: #2a3754;
  transform: translateY(-1px);
}

.candidate-card-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.candidate-main-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.candidate-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1558C9;
  flex-shrink: 0;
}

.candidate-meta {
  flex: 1;
  min-width: 0;
}

.candidate-name {
  color: #ffffff;
  font-size: 0.98rem;
  font-weight: 700;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.candidate-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #D4FF24;
  font-size: 0.78rem;
  font-weight: 600;
}

.star-icon {
  font-size: 0.82rem;
}

.rating-reviews {
  color: #68686a;
  font-size: 0.72rem;
}

.candidate-price-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.price-kicker {
  color: #747577;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.price-val {
  color: #D4FF24;
  font-size: 1.22rem;
  font-weight: 800;
}

.candidate-msg {
  color: #a7a7a8;
  font-size: 0.82rem;
  margin: 0;
  background: #111724;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #1c263c;
  line-height: 1.4;
}

.candidate-actions {
  display: flex;
  gap: 8px;
  flex-direction: row;
}

@media (max-width: 380px) {
  .candidate-actions {
    flex-direction: column;
  }
}

.btn-profile {
  --border-color: #1558C9;
  --color: #6398ff;
  font-weight: 600;
  font-size: 0.8rem;
  height: 38px;
  flex: 1;
  margin: 0;
  --border-radius: 8px;
}

.btn-accept {
  --background: #D4FF24;
  --background-activated: #bbe020;
  --color: #030407;
  font-weight: 800;
  font-size: 0.82rem;
  height: 38px;
  flex: 1.3;
  margin: 0;
  --border-radius: 8px;
}

/* Empty State */
.empty-state-card {
  background: #0b0d14;
  border: 1px solid #1c202b;
  border-radius: 14px;
  padding: 36px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.empty-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(21, 88, 201, 0.15);
  color: #5d93f7;
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state-card h3 {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.empty-state-card p {
  color: #8e8e90;
  font-size: 0.85rem;
  margin: 0;
  max-width: 340px;
}

.btn-empty-create {
  --background: #1558C9;
  --color: #ffffff;
  font-weight: 700;
  margin-top: 4px;
}

/* Modal Form Styles */
.custom-bottom-sheet {
  --background: #0b0d14;
}

.modal-sheet-content {
  --background: #0b0d14;
  --color: #ffffff;
}

.modal-form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
}

.modal-subtitle {
  color: #8e8e90;
  font-size: 0.82rem;
  margin: 0;
}

.two-col-row {
  display: flex;
  gap: 8px;
}

@media (max-width: 480px) {
  .two-col-row {
    flex-direction: column;
    gap: 10px;
  }
}

.col-item {
  flex: 1;
}

.form-item {
  --background: #141722;
  --color: #ffffff;
  --border-color: #242c3d;
  border-radius: 8px;
}

.budget-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.has-error {
  --border-color: #ff4961;
}

.error-msg-red {
  color: #ff4961;
  font-size: 0.78rem;
  padding-left: 4px;
  font-weight: 500;
}

.btn-confirm-create {
  --background: #D4FF24;
  --color: #030407;
  font-weight: 800;
  height: 46px;
  margin-top: 8px;
  font-size: 0.88rem;
}

.btn-confirm-create[disabled] {
  opacity: 0.4;
}

/* Profile Modal Styles */
.profile-inner {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-large-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #D4FF24;
}

.profile-name {
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0 0 4px 0;
}

.profile-rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(212, 255, 36, 0.15);
  color: #D4FF24;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.profile-details-box {
  background: #11141e;
  border: 1px solid #1a2030;
  border-radius: 8px;
  padding: 12px;
}

.details-heading {
  color: #5d93f7;
  font-size: 0.88rem;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.profile-desc {
  color: #cdcdce;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

.btn-close-modal {
  --border-color: #242c3d;
  --color: #ffffff;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
