<template>
  <ion-page class="auth-page-root">
    <ion-header class="ion-no-border auth-header">
      <ion-toolbar class="auth-toolbar">
        <div class="header-inner">
          <div class="brand-logo" @click="goHome">
            <span class="neon-plus">+</span>
            <span class="brand-name">SERVE</span>
          </div>

          <button type="button" class="back-pill" @click="goHome">
            <ion-icon :icon="arrowBackOutline"></ion-icon>
            <span>Voltar</span>
          </button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="auth-content">
      <div class="auth-container">

        <!-- Switcher Minimalista: Login vs Cadastro -->
        <div class="auth-segmented">
          <button
            type="button"
            class="seg-btn"
            :class="{ active: activeAuthTab === 'login' }"
            @click="activeAuthTab = 'login'"
          >
            Entrar
          </button>
          <button
            type="button"
            class="seg-btn"
            :class="{ active: activeAuthTab === 'register' }"
            @click="activeAuthTab = 'register'"
          >
            Criar Conta
          </button>
        </div>

        <!-- ================= LOGIN MINIMALISTA (MOCKADO) ================= -->
        <section v-if="activeAuthTab === 'login'" class="auth-card">
          <div class="card-head">
            <div>
              <h1 class="card-title">Acesse sua conta</h1>
              <p class="card-sub">Credenciais preenchidas para acesso rápido</p>
            </div>
            <span class="demo-tag">DEMO</span>
          </div>

          <!-- Papel de acesso em linha única -->
          <div class="role-switch-inline">
            <button
              type="button"
              class="role-pill"
              :class="{ active: loginRole === 'PROVIDER' }"
              @click="loginRole = 'PROVIDER'"
            >
              <ion-icon :icon="briefcaseOutline"></ion-icon>
              <span>Prestador</span>
            </button>
            <button
              type="button"
              class="role-pill"
              :class="{ active: loginRole === 'CLIENT' }"
              @click="loginRole = 'CLIENT'"
            >
              <ion-icon :icon="personOutline"></ion-icon>
              <span>Cliente</span>
            </button>
          </div>

          <div class="fields-stack">
            <div class="field-item">
              <label>Usuário ou E-mail</label>
              <div class="input-box">
                <ion-icon :icon="personOutline" class="f-icon"></ion-icon>
                <input
                  type="text"
                  v-model="loginForm.username"
                  placeholder="carlos.oliveira@serve.app"
                />
              </div>
            </div>

            <div class="field-item">
              <label>Senha</label>
              <div class="input-box">
                <ion-icon :icon="lockClosedOutline" class="f-icon"></ion-icon>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="loginForm.password"
                  placeholder="••••••••"
                />
                <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                  {{ showPassword ? 'Ocultar' : 'Ver' }}
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="cta-neon-btn" @click="handleMockLogin">
            <span>Entrar como {{ loginRole === 'PROVIDER' ? 'Prestador' : 'Cliente' }}</span>
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </button>
        </section>

        <!-- ================= CADASTRO MINIMALISTA ================= -->
        <section v-else class="auth-card">
          <div class="card-head">
            <div>
              <h1 class="card-title">Novo Cadastro</h1>
              <p class="card-sub">Preencha seus dados básicos</p>
            </div>
          </div>

          <!-- Tipo de Conta -->
          <div class="role-switch-inline">
            <button
              type="button"
              class="role-pill"
              :class="{ active: registerForm.accountType === 'PROVIDER' }"
              @click="registerForm.accountType = 'PROVIDER'"
            >
              <ion-icon :icon="briefcaseOutline"></ion-icon>
              <span>Sou Prestador</span>
            </button>
            <button
              type="button"
              class="role-pill"
              :class="{ active: registerForm.accountType === 'CLIENT' }"
              @click="registerForm.accountType = 'CLIENT'"
            >
              <ion-icon :icon="personOutline"></ion-icon>
              <span>Sou Cliente</span>
            </button>
          </div>

          <div class="fields-stack">
            <div class="field-item">
              <label>Nome Completo</label>
              <div class="input-box">
                <ion-icon :icon="personOutline" class="f-icon"></ion-icon>
                <input type="text" v-model="registerForm.name" placeholder="Seu nome" />
              </div>
            </div>

            <div class="grid-2-cols">
              <div class="field-item">
                <label>Telefone</label>
                <div class="input-box">
                  <ion-icon :icon="callOutline" class="f-icon"></ion-icon>
                  <input type="tel" v-model="registerForm.phone" placeholder="(95) 99142-8830" />
                </div>
              </div>

              <div class="field-item">
                <label>Senha</label>
                <div class="input-box">
                  <ion-icon :icon="lockClosedOutline" class="f-icon"></ion-icon>
                  <input type="password" v-model="registerForm.password" placeholder="••••••" />
                </div>
              </div>
            </div>

            <div class="field-item">
              <label>E-mail</label>
              <div class="input-box">
                <ion-icon :icon="mailOutline" class="f-icon"></ion-icon>
                <input type="email" v-model="registerForm.email" placeholder="voce@email.com" />
              </div>
            </div>

            <!-- Campos exclusivos de Prestador: Especialidade + Certificado + Recebimento -->
            <template v-if="registerForm.accountType === 'PROVIDER'">
              <!-- 1. ESPECIALIDADE COM BUSCA + ALGUMAS SUGESTÕES CLICÁVEIS (MENOS POLUÍDO) -->
              <div class="field-item">
                <div class="label-row-between">
                  <label>Especialidade</label>
                  <span class="selected-cat-hint">Selecionada: {{ registerForm.category }}</span>
                </div>

                <!-- Input para pesquisar especialidade -->
                <div class="input-box spec-search-box">
                  <ion-icon :icon="searchOutline" class="f-icon"></ion-icon>
                  <input
                    type="text"
                    v-model="specialtySearchQuery"
                    placeholder="Pesquisar especialidade (ex: Cerimonialista, Garçom...)"
                  />
                  <button
                    v-if="specialtySearchQuery"
                    type="button"
                    class="clear-search-btn"
                    @click="specialtySearchQuery = ''"
                  >
                    ✕
                  </button>
                </div>

                <!-- Mostra apenas algumas sugestões (4 opções) ou o resultado da busca -->
                <div class="specialty-grid-options">
                  <button
                    v-for="prof in visibleProfessionOptions"
                    :key="prof.name"
                    type="button"
                    class="spec-option-btn"
                    :class="{ active: registerForm.category === prof.name }"
                    @click="selectRegisterCategory(prof.name)"
                  >
                    <div class="spec-opt-left">
                      <ion-icon :icon="prof.icon" class="spec-opt-icon"></ion-icon>
                      <span class="spec-opt-name">{{ prof.label }}</span>
                    </div>
                    <span class="spec-opt-check" :class="{ on: registerForm.category === prof.name }">
                      {{ registerForm.category === prof.name ? '✓' : '' }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- 2. CAMPO DE ENVIO DE CERTIFICADO PARA COMPROVAR A CATEGORIA -->
              <div class="field-item">
                <div class="label-row-between">
                  <label>Certificado para Comprovar Categoria</label>
                  <span class="xp-bonus-tag">+300 XP</span>
                </div>

                <!-- Input de arquivo oculto acionado pelo clique -->
                <input
                  ref="certFileInputRef"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  class="hidden-file-input"
                  @change="handleCertificateFileSelect"
                />

                <!-- Estado: Nenhum arquivo enviado ainda -->
                <div
                  v-if="!registerForm.certificateFile"
                  class="cert-upload-dropzone"
                  @click="triggerCertificateFileDialog"
                >
                  <div class="cert-upload-icon-box">
                    <ion-icon :icon="cloudUploadOutline"></ion-icon>
                  </div>
                  <div class="cert-upload-texts">
                    <strong>Enviar certificado de {{ registerForm.category }}</strong>
                    <span>Toque para anexar PDF ou foto do diploma/certificado</span>
                  </div>
                </div>

                <!-- Estado: Certificado já anexado -->
                <div v-else class="cert-attached-card">
                  <div class="cert-attached-left" @click="triggerCertificateFileDialog">
                    <div class="cert-ok-icon">
                      <ion-icon :icon="documentTextOutline"></ion-icon>
                    </div>
                    <div class="cert-file-meta">
                      <strong>{{ registerForm.certificateFile.name }}</strong>
                      <span>Comprovante de {{ registerForm.category }} • {{ registerForm.certificateFile.sizeLabel }}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="cert-remove-btn"
                    @click="removeAttachedCertificate"
                    title="Remover arquivo"
                  >
                    <ion-icon :icon="trashOutline"></ion-icon>
                  </button>
                </div>
              </div>

              <!-- 3. Métodos de Pagamento Compactos -->
              <div class="field-item">
                <label>Como prefere receber?</label>
                <div class="pm-compact-grid">
                  <button
                    type="button"
                    class="pm-chip-card"
                    :class="{ selected: registerForm.paymentMethods.fisico }"
                    @click="registerForm.paymentMethods.fisico = !registerForm.paymentMethods.fisico"
                  >
                    <ion-icon :icon="cashOutline"></ion-icon>
                    <span>Físico</span>
                  </button>

                  <button
                    type="button"
                    class="pm-chip-card"
                    :class="{ selected: registerForm.paymentMethods.pix }"
                    @click="registerForm.paymentMethods.pix = !registerForm.paymentMethods.pix"
                  >
                    <ion-icon :icon="qrCodeOutline"></ion-icon>
                    <span>PIX</span>
                  </button>

                  <button
                    type="button"
                    class="pm-chip-card"
                    :class="{ selected: registerForm.paymentMethods.cartao }"
                    @click="toggleRegisterCardMethod"
                  >
                    <ion-icon :icon="cardOutline"></ion-icon>
                    <span>Cartão</span>
                    <small class="req-tag">Maquininha</small>
                  </button>
                </div>

                <label v-if="registerForm.paymentMethods.cartao" class="machine-note">
                  <input type="checkbox" v-model="registerForm.paymentMethods.hasCardMachine" />
                  <span>Possuo maquininha própria para cobrar no local</span>
                </label>
              </div>
            </template>
          </div>

          <button type="button" class="cta-neon-btn" @click="handleMockRegister">
            <span>Concluir Cadastro</span>
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </button>
        </section>

      </div>

      <ion-toast
        :is-open="toastOpen"
        :message="toastMessage"
        :duration="2200"
        position="top"
        @didDismiss="toastOpen = false"
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
  IonToast
} from '@ionic/vue';
import {
  arrowBackOutline,
  arrowForwardOutline,
  personOutline,
  lockClosedOutline,
  briefcaseOutline,
  callOutline,
  mailOutline,
  cashOutline,
  qrCodeOutline,
  cardOutline,
  wineOutline,
  sparklesOutline,
  cafeOutline,
  flameOutline,
  heartOutline,
  ribbonOutline,
  snowOutline,
  restaurantOutline,
  flashOutline,
  waterOutline,
  constructOutline,
  searchOutline,
  cloudUploadOutline,
  documentTextOutline,
  trashOutline
} from 'ionicons/icons';
import { useAppStore } from '@/stores/useAppStore';

const router = useRouter();
const route = useRoute();
const store = useAppStore();

const activeAuthTab = ref('login');
const loginRole = ref('PROVIDER');
const showPassword = ref(false);
const toastOpen = ref(false);
const toastMessage = ref('');
const certFileInputRef = ref(null);
const specialtySearchQuery = ref('');

const loginForm = ref({
  username: store.mockCredentials?.username || 'carlos.oliveira@serve.app',
  password: store.mockCredentials?.password || 'serve2026'
});

const professionOptions = [
  { name: 'Bartender', label: 'Bartender', icon: wineOutline },
  { name: 'Diarista', label: 'Diarista', icon: sparklesOutline },
  { name: 'Churrasqueiro', label: 'Churrasqueiro', icon: flameOutline },
  { name: 'Técnico de Ar-Condicionado', label: 'Ar-Condicionado', icon: snowOutline },
  { name: 'Barista', label: 'Barista', icon: cafeOutline },
  { name: 'Babá', label: 'Babá', icon: heartOutline },
  { name: 'Cerimonialista', label: 'Cerimonialista', icon: ribbonOutline },
  { name: 'Garçom', label: 'Garçom', icon: restaurantOutline },
  { name: 'Eletricista', label: 'Eletricista', icon: flashOutline },
  { name: 'Encanador', label: 'Encanador', icon: waterOutline },
  { name: 'Reformas', label: 'Reformas', icon: constructOutline }
];

// Exibe apenas 4 opções enxutas por padrão (incluindo a selecionada) ou filtra ao pesquisar
const visibleProfessionOptions = computed(() => {
  const q = specialtySearchQuery.value.trim().toLowerCase();
  if (q) {
    const matches = professionOptions.filter(
      p => p.name.toLowerCase().includes(q) || p.label.toLowerCase().includes(q)
    );
    if (matches.length > 0) return matches.slice(0, 6);
    return [
      {
        name: specialtySearchQuery.value.trim(),
        label: specialtySearchQuery.value.trim(),
        icon: briefcaseOutline
      }
    ];
  }

  const baseFour = professionOptions.slice(0, 4);
  const currentSelected = professionOptions.find(p => p.name === registerForm.value.category);
  if (currentSelected && !baseFour.some(p => p.name === currentSelected.name)) {
    return [currentSelected, ...baseFour.slice(0, 3)];
  }
  return baseFour;
});

const registerForm = ref({
  accountType: 'PROVIDER',
  name: 'Carlos Oliveira',
  phone: '(95) 99142-8830',
  email: 'carlos.oliveira@serve.app',
  category: 'Bartender',
  password: 'serve2026',
  certificateFile: null,
  paymentMethods: {
    fisico: true,
    pix: true,
    cartao: true,
    hasCardMachine: true
  }
});

onMounted(() => {
  if (route.query.tab === 'register' || route.path.includes('cadastro') || route.path.includes('register')) {
    activeAuthTab.value = 'register';
  }
});

function selectRegisterCategory(catName) {
  registerForm.value.category = catName;
  if (registerForm.value.certificateFile && registerForm.value.certificateFile.isAutoNamed) {
    const slug = catName.toLowerCase().replace(/\s+/g, '_');
    registerForm.value.certificateFile.name = `certificado_${slug}.pdf`;
  }
}

function triggerCertificateFileDialog() {
  if (certFileInputRef.value) {
    certFileInputRef.value.click();
  }
}

function handleCertificateFileSelect(event) {
  const file = event.target?.files?.[0];
  if (!file) return;
  const sizeKB = Math.max(12, Math.round(file.size / 1024));
  registerForm.value.certificateFile = {
    name: file.name,
    sizeLabel: sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`,
    isAutoNamed: false
  };
  toastMessage.value = `Certificado "${file.name}" anexado com sucesso!`;
  toastOpen.value = true;
}

function removeAttachedCertificate() {
  registerForm.value.certificateFile = null;
  if (certFileInputRef.value) {
    certFileInputRef.value.value = '';
  }
}

function toggleRegisterCardMethod() {
  registerForm.value.paymentMethods.cartao = !registerForm.value.paymentMethods.cartao;
  if (registerForm.value.paymentMethods.cartao) {
    registerForm.value.paymentMethods.hasCardMachine = true;
  }
}

function handleMockLogin() {
  store.loginWithMock(loginRole.value);
  toastMessage.value = 'Acesso liberado!';
  toastOpen.value = true;

  setTimeout(() => {
    if (loginRole.value === 'PROVIDER') {
      store.role = 'PROVIDER';
      store.providerTab = 'perfil';
      router.push('/provider?tab=perfil');
    } else {
      store.role = 'CLIENT';
      router.push('/home');
    }
  }, 250);
}

function handleMockRegister() {
  store.registerWithMock({
    name: registerForm.value.name,
    phone: registerForm.value.phone,
    email: registerForm.value.email,
    category: registerForm.value.category,
    paymentMethods: registerForm.value.paymentMethods
  });

  if (registerForm.value.accountType === 'PROVIDER' && registerForm.value.certificateFile) {
    store.addWorkerCertificate(
      `Certificado de ${registerForm.value.category} (${registerForm.value.certificateFile.name})`,
      'Enviado no Cadastro • Verificado'
    );
  }

  toastMessage.value = registerForm.value.certificateFile
    ? 'Cadastro salvo + Certificado enviado (+300 XP)!'
    : 'Cadastro salvo!';
  toastOpen.value = true;

  setTimeout(() => {
    if (registerForm.value.accountType === 'PROVIDER') {
      store.role = 'PROVIDER';
      store.providerTab = 'perfil';
      router.push('/provider?tab=perfil');
    } else {
      store.role = 'CLIENT';
      router.push('/home');
    }
  }, 280);
}

function goHome() {
  router.push('/home');
}
</script>

<style scoped>
.auth-page-root {
  --ion-background-color: #030407;
  --ion-text-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.auth-header {
  background: #030407;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.auth-toolbar {
  --background: #030407;
  --min-height: 52px;
}

.header-inner {
  max-width: 440px;
  margin: 0 auto;
  padding: 0 14px;
  height: 52px;
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
  font-size: 22px;
  font-weight: 900;
}

.brand-name {
  color: #ffffff;
  font-size: 17px;
  font-weight: 900;
  font-style: italic;
}

.back-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #cbd5e1;
  font-size: 11.5px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 99px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.auth-content {
  --background: #030407;
}

.auth-container {
  max-width: 440px;
  margin: 0 auto;
  padding: 16px 14px 96px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Segmented Control */
.auth-segmented {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #0b0f17;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.seg-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 12.5px;
  font-weight: 700;
  padding: 9px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.seg-btn.active {
  background: #D4FF24;
  color: #050800;
  font-weight: 800;
}

/* Card */
.auth-card {
  background: #090d14;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  color: #ffffff;
}

.card-sub {
  font-size: 12px;
  color: #9ca3af;
  margin: 2px 0 0;
}

.demo-tag {
  background: rgba(212, 255, 36, 0.12);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 99px;
}

/* Role Switch Inline */
.role-switch-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.role-pill {
  background: #111622;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  border-radius: 10px;
  padding: 9px 10px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.role-pill.active {
  background: rgba(212, 255, 36, 0.12);
  border-color: #D4FF24;
  color: #D4FF24;
  font-weight: 800;
}

/* Inputs */
.fields-stack {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.grid-2-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-item > label,
.label-row-between > label {
  font-size: 11px;
  font-weight: 700;
  color: #cbd5e1;
}

.label-row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.selected-cat-hint {
  font-size: 10.5px;
  font-weight: 800;
  color: #D4FF24;
}

.xp-bonus-tag {
  background: rgba(212, 255, 36, 0.14);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  font-size: 9.5px;
  font-weight: 800;
  padding: 1px 7px;
  border-radius: 99px;
}

.input-box {
  display: flex;
  align-items: center;
  background: #111723;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 10px;
  padding: 0 10px;
  height: 42px;
}

.input-box:focus-within {
  border-color: #D4FF24;
}

.f-icon {
  color: #D4FF24;
  font-size: 16px;
  margin-right: 7px;
  flex-shrink: 0;
}

.input-box input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 600;
}

.eye-btn,
.clear-search-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.spec-search-box {
  height: 38px;
  background: #0d121c;
}

/* ================= ESPECIALIDADES EM GRADE CLICÁVEL (2 COLUNAS VISÍVEIS) ================= */
.specialty-grid-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.spec-option-btn {
  background: #111723;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 9px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.16s ease;
  text-align: left;
}

.spec-option-btn:active {
  transform: scale(0.98);
}

.spec-opt-left {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.spec-opt-icon {
  font-size: 16px;
  color: #9ca3af;
  flex-shrink: 0;
}

.spec-opt-name {
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spec-opt-check {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
  color: #050800;
  flex-shrink: 0;
}

.spec-option-btn.active {
  background: rgba(212, 255, 36, 0.11);
  border-color: #D4FF24;
  color: #ffffff;
}

.spec-option-btn.active .spec-opt-icon {
  color: #D4FF24;
}

.spec-opt-check.on {
  background: #D4FF24;
  border-color: #D4FF24;
}

/* ================= UPLOAD DE CERTIFICADO DA CATEGORIA ================= */
.hidden-file-input {
  display: none;
}

.cert-upload-dropzone {
  background: #101622;
  border: 1.5px dashed rgba(212, 255, 36, 0.38);
  border-radius: 12px;
  padding: 11px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.cert-upload-dropzone:active {
  background: rgba(212, 255, 36, 0.08);
}

.cert-upload-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(212, 255, 36, 0.12);
  color: #D4FF24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.cert-upload-texts {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.cert-upload-texts strong {
  font-size: 12px;
  color: #ffffff;
}

.cert-upload-texts span {
  font-size: 10.5px;
  color: #9ca3af;
}

.cert-attached-card {
  background: rgba(212, 255, 36, 0.09);
  border: 1px solid #D4FF24;
  border-radius: 12px;
  padding: 10px 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.cert-attached-left {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  cursor: pointer;
}

.cert-ok-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #D4FF24;
  color: #050800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.cert-file-meta {
  min-width: 0;
}

.cert-file-meta strong {
  display: block;
  font-size: 12px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cert-file-meta span {
  display: block;
  font-size: 10px;
  color: #D4FF24;
}

.cert-remove-btn {
  background: rgba(248, 113, 113, 0.14);
  border: none;
  color: #f87171;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
  flex-shrink: 0;
}

/* Métodos de Pagamento em 3 Colunas Compactas */
.pm-compact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
}

.pm-chip-card {
  background: #111723;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 11px;
  padding: 10px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #cbd5e1;
  cursor: pointer;
  position: relative;
}

.pm-chip-card ion-icon {
  font-size: 18px;
  color: #9ca3af;
}

.pm-chip-card span {
  font-size: 11.5px;
  font-weight: 700;
}

.pm-chip-card .req-tag {
  font-size: 8.5px;
  color: #facc15;
  font-weight: 800;
}

.pm-chip-card.selected {
  background: rgba(212, 255, 36, 0.11);
  border-color: #D4FF24;
  color: #ffffff;
}

.pm-chip-card.selected ion-icon {
  color: #D4FF24;
}

.machine-note {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #fef08a;
  background: rgba(250, 204, 21, 0.08);
  border: 1px dashed rgba(250, 204, 21, 0.35);
  padding: 7px 9px;
  border-radius: 8px;
  cursor: pointer;
}

.cta-neon-btn {
  width: 100%;
  height: 44px;
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 11px;
  font-size: 13px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
}

@media (max-width: 350px) {
  .grid-2-cols,
  .specialty-grid-options {
    grid-template-columns: 1fr;
  }
}
</style>
