<template>
  <ion-page class="landing-page-root">
    <!-- Header Minimalista (+ SERVE) -->
    <ion-header class="ion-no-border landing-header">
      <ion-toolbar class="landing-toolbar">
        <div class="header-inner">
          <div class="brand-logo" @click="goToHome">
            <span class="neon-plus">+</span>
            <span class="brand-name">SERVE</span>
          </div>

          <!-- Localização Sutil no Mobile / Links Limpos no Desktop -->
          <div class="header-right">
            <span class="location-badge">
              <ion-icon :icon="locationOutline" class="loc-icon"></ion-icon>
              <span>Boa Vista - RR</span>
            </span>

            <button class="desktop-worker-link ion-hide-md-down" @click="goToProvider">
              <ion-icon :icon="briefcaseOutline"></ion-icon>
              <span>Modo Trabalhador</span>
            </button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="landing-content">
      <div class="page-container">

        <!-- ================= 1. HERO MINIMALISTA & RESPIRÁVEL ================= -->
        <section class="hero-section">
          <div class="hero-kicker">
            <span class="pulse-dot"></span>
            <span>Profissionais verificados disponíveis agora</span>
          </div>

          <h1 class="hero-headline">
            Encontre o <span class="neon-highlight">{{ activeHeroConfig.noun }} ideal</span> {{ activeHeroConfig.headlineSuffix }}.
          </h1>

          <p class="hero-subtext">
            {{ activeHeroConfig.subtitle }}
          </p>

          <button class="hero-primary-btn" @click="goToClientDashboard(activeCategory)">
            <span>BUSCAR {{ activeHeroConfig.plural.toUpperCase() }} DISPONÍVEIS</span>
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </button>

          <div class="hero-trust-inline">
            <span><ion-icon :icon="shieldCheckmarkOutline"></ion-icon> Identidade verificada</span>
            <span class="dot">•</span>
            <span>Avaliações reais</span>
            <span class="dot">•</span>
            <span>PIX protegido</span>
          </div>
        </section>

        <!-- ================= 2. CATEGORIAS (SELEÇÃO ÚNICA E DESPOLUÍDA) ================= -->
        <section class="categories-section">
          <div class="section-top-line">
            <h2 class="section-title">Categorias</h2>
            <span class="section-hint">Toque para alternar ou buscar</span>
          </div>

          <div class="categories-minimal-grid">
            <button
              v-for="cat in store.categoriesList"
              :key="cat.id"
              type="button"
              class="cat-minimal-card"
              :class="{ active: activeCategory === cat.name }"
              @click="handleCategoryCardTap(cat.name)"
            >
              <div class="cat-icon-box">
                <ion-icon :icon="getCategoryIcon(cat.icon)"></ion-icon>
              </div>
              <div class="cat-text-box">
                <span class="cat-title">{{ cat.name }}</span>
                <span class="cat-price">A partir de R$ {{ cat.defaultPrice }}</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="cat-arrow"></ion-icon>
            </button>
          </div>
        </section>

        <!-- ================= 3. PROFISSIONAIS DISPONÍVEIS HOJE (LISTA ENXUTA) ================= -->
        <section class="featured-pros-section">
          <div class="section-top-line">
            <h2 class="section-title">Destaques disponíveis hoje</h2>
            <button class="text-link-btn" @click="goToClientDashboard(activeCategory)">
              Ver todos
            </button>
          </div>

          <div class="pros-minimal-list">
            <div
              v-for="pro in displayedPros"
              :key="pro.id"
              class="pro-minimal-row"
              @click="hireThisPro(pro)"
            >
              <div class="pro-row-left">
                <div class="pro-avatar-wrap">
                  <img :src="pro.avatar" :alt="pro.nome" class="pro-avatar" />
                  <span class="online-indicator"></span>
                </div>
                <div class="pro-info">
                  <div class="pro-name-line">
                    <strong class="pro-name">{{ pro.nome }}</strong>
                    <ion-icon :icon="checkmarkCircle" class="verified-icon"></ion-icon>
                  </div>
                  <span class="pro-meta">{{ pro.categoria }} • ★ {{ pro.nota }} ({{ pro.servicos }})</span>
                </div>
              </div>

              <div class="pro-row-right">
                <span class="pro-base-price">R$ {{ pro.valorBase }}</span>
                <button class="pro-hire-pill" @click.stop="hireThisPro(pro)">
                  Contratar
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 4. BANNER COMPACTO PARA TRABALHADORES ================= -->
        <section class="worker-compact-section">
          <div class="worker-compact-banner" @click="goToProvider">
            <div class="worker-banner-left">
              <div class="worker-icon-circle">
                <ion-icon :icon="briefcaseOutline"></ion-icon>
              </div>
              <div>
                <h3 class="worker-banner-title">Quer trabalhar com a +SERVE?</h3>
                <p class="worker-banner-sub">Aceite chamados na sua região e receba via PIX.</p>
              </div>
            </div>
            <ion-icon :icon="arrowForwardOutline" class="worker-banner-arrow"></ion-icon>
          </div>
        </section>

      </div>
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
  IonContent,
  IonIcon
} from '@ionic/vue';
import {
  briefcaseOutline,
  arrowForwardOutline,
  chevronForwardOutline,
  sparklesOutline,
  flashOutline,
  waterOutline,
  constructOutline,
  wineOutline,
  locationOutline,
  shieldCheckmarkOutline,
  checkmarkCircle
} from 'ionicons/icons';
import { useAppStore, CATEGORY_CONFIGS } from '@/stores/useAppStore';

const router = useRouter();
const store = useAppStore();

const activeCategory = ref('Garçom');
const categoryOrder = Object.keys(CATEGORY_CONFIGS);
let autoRotateTimer = null;

const activeHeroConfig = computed(() => {
  return CATEGORY_CONFIGS[activeCategory.value] || CATEGORY_CONFIGS.Garçom;
});

// Exibe apenas 3 profissionais enxutos na Home para manter o visual limpo
const displayedPros = computed(() => {
  return store.highlightedProfessionals.slice(0, 3);
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

function handleCategoryCardTap(catName) {
  if (activeCategory.value === catName) {
    goToClientDashboard(catName);
  } else {
    activeCategory.value = catName;
  }
}

function cycleNextCategory() {
  const currentIndex = categoryOrder.indexOf(activeCategory.value);
  const nextIndex = (currentIndex + 1) % categoryOrder.length;
  activeCategory.value = categoryOrder[nextIndex];
}

onMounted(() => {
  autoRotateTimer = setInterval(() => {
    cycleNextCategory();
  }, 4200);
});

onUnmounted(() => {
  if (autoRotateTimer) clearInterval(autoRotateTimer);
});

function hireThisPro(pro) {
  store.selectProfessional(pro);
  router.push({
    path: '/client/dashboard',
    query: {
      proId: String(pro.id),
      category: pro.categoria || activeCategory.value
    }
  });
}

function goToHome() {
  router.push('/home');
}

function goToClientDashboard(catName) {
  store.role = 'CLIENT';
  const query = {};
  if (catName) query.category = catName;
  router.push({ path: '/client/dashboard', query });
}

function goToProvider() {
  store.role = 'PROVIDER';
  router.push('/provider/dashboard');
}
</script>

<style scoped>
.landing-page-root {
  --ion-background-color: #030407;
  --ion-text-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ================= HEADER ULTRA-LIMPO ================= */
.landing-header {
  background: #030407;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.landing-toolbar {
  --background: #030407;
  --min-height: 58px;
}

.header-inner {
  max-width: 840px;
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
  font-size: 26px;
  font-weight: 900;
  line-height: 1;
}

.brand-name {
  color: #ffffff;
  font-size: 20px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.location-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 5px 10px;
  border-radius: 99px;
}

.loc-icon {
  color: #D4FF24;
  font-size: 14px;
}

.desktop-worker-link {
  background: rgba(212, 255, 36, 0.1);
  border: 1px solid rgba(212, 255, 36, 0.3);
  color: #D4FF24;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 99px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

/* ================= CONTAINER PRINCIPAL ================= */
.landing-content {
  --background: #030407;
}

.page-container {
  max-width: 840px;
  margin: 0 auto;
  padding: 24px 18px 96px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* ================= 1. HERO SECTION ================= */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 12px;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #D4FF24;
  box-shadow: 0 0 8px #D4FF24;
}

.hero-headline {
  font-size: clamp(26px, 5vw, 40px);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.5px;
  color: #ffffff;
  margin: 0 0 12px;
}

.neon-highlight {
  color: #D4FF24;
}

.hero-subtext {
  font-size: 14.5px;
  line-height: 1.5;
  color: #9ca3af;
  margin: 0 0 22px;
  max-width: 580px;
}

.hero-primary-btn {
  width: 100%;
  max-width: 420px;
  height: 52px;
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 14px;
  font-size: 13.5px;
  font-weight: 900;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(212, 255, 36, 0.22);
}

.hero-trust-inline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  font-size: 12px;
  color: #6b7280;
}

.hero-trust-inline span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.hero-trust-inline ion-icon {
  color: #D4FF24;
  font-size: 14px;
}

.dot {
  opacity: 0.4;
}

/* ================= 2. CATEGORIAS MINIMALISTAS ================= */
.section-top-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16.5px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.section-hint {
  font-size: 11.5px;
  color: #6b7280;
}

.text-link-btn {
  background: transparent;
  border: none;
  color: #D4FF24;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.categories-minimal-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

@media (min-width: 560px) {
  .categories-minimal-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.cat-minimal-card {
  background: #080b11;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.18s ease;
}

.cat-minimal-card.active {
  border-color: rgba(212, 255, 36, 0.45);
  background: rgba(212, 255, 36, 0.05);
}

.cat-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  flex-shrink: 0;
}

.cat-minimal-card.active .cat-icon-box {
  background: rgba(212, 255, 36, 0.14);
  color: #D4FF24;
}

.cat-text-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cat-title {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.cat-price {
  font-size: 11.5px;
  color: #6b7280;
}

.cat-arrow {
  color: #4b5563;
  font-size: 16px;
}

.cat-minimal-card.active .cat-arrow {
  color: #D4FF24;
}

/* ================= 3. PROFISSIONAIS DISPONÍVEIS (ENXUTO) ================= */
.pros-minimal-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pro-minimal-row {
  background: #080b11;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  transition: border-color 0.18s ease;
}

.pro-minimal-row:hover {
  border-color: rgba(212, 255, 36, 0.3);
}

.pro-row-left {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.pro-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.pro-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #080b11;
}

.pro-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pro-name-line {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pro-name {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.verified-icon {
  color: #4ade80;
  font-size: 14px;
}

.pro-meta {
  font-size: 12px;
  color: #9ca3af;
}

.pro-row-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.pro-base-price {
  font-size: 13px;
  font-weight: 800;
  color: #d1d5db;
}

.pro-hire-pill {
  background: rgba(212, 255, 36, 0.12);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  border-radius: 8px;
  padding: 6px 11px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

/* ================= 4. BANNER COMPACTO TRABALHADOR ================= */
.worker-compact-banner {
  background: #080b11;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
}

.worker-banner-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.worker-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(212, 255, 36, 0.1);
  color: #D4FF24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  flex-shrink: 0;
}

.worker-banner-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2px;
}

.worker-banner-sub {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.worker-banner-arrow {
  color: #9ca3af;
  font-size: 18px;
  flex-shrink: 0;
}
</style>
