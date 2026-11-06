<template>
  <ion-page class="landing-page-root">
    <!-- Header Mobile App (+ SERVE) -->
    <ion-header class="ion-no-border landing-header">
      <ion-toolbar class="landing-toolbar">
        <div class="header-inner">
          <div class="brand-logo" @click="goToHome">
            <span class="neon-plus">+</span>
            <span class="brand-name">SERVE</span>
          </div>

          <div class="header-right">
            <span class="location-badge">
              <ion-icon :icon="locationOutline" class="loc-icon"></ion-icon>
              <span>Boa Vista</span>
            </span>

            <button type="button" class="mobile-provider-pill" @click="goToProvider">
              <ion-icon :icon="briefcaseOutline"></ion-icon>
              <span>Sou Prestador</span>
            </button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="landing-content">
      <div class="page-container">

        <!-- ================= 1. HERO MOBILE COM ROLETA DE PROFISSÕES ================= -->
        <section class="hero-roulette-section">
          <div class="hero-kicker">
            <span class="pulse-dot"></span>
            <span>Toque na foto para abrir a categoria</span>
          </div>

          <h1 class="hero-headline">
            Encontre o <span class="neon-highlight">{{ activeHeroConfig.noun }} ideal</span> {{ activeHeroConfig.headlineSuffix }}.
          </h1>

          <p class="hero-subtext">
            {{ activeHeroConfig.subtitle }}
          </p>

          <!-- Roleta 3D Mobile-First (Fotos das Profissões: Garçom, Eletricista, Diarista, Encanador, Reformas) -->
          <div class="piao-roulette-stage">
            <div class="piao-pointer-top">▼</div>

            <div class="piao-wheel-track">
              <button
                v-for="(catItem, idx) in rouletteCategories"
                :key="'mob-piao-' + catItem.id"
                type="button"
                class="piao-photo-face"
                :class="getFacePositionClass(idx)"
                @click="handlePhotoClick(catItem, idx)"
                :aria-label="catItem.name"
              >
                <img :src="catItem.photoUrl" :alt="catItem.name" class="piao-only-img" />
                <div v-if="idx === activeIndex" class="face-active-caption">
                  <span>{{ catItem.name }}</span>
                </div>
              </button>
            </div>

            <div class="piao-pointer-bottom">▲</div>
          </div>

          <!-- Botão Principal Mobile (Thumb-Zone) -->
          <button type="button" class="hero-primary-btn" @click="goToClientDashboard(activeCategory)">
            <span>BUSCAR {{ activeHeroConfig.plural.toUpperCase() }} DISPONÍVEIS</span>
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </button>

          <div class="hero-trust-inline">
            <span><ion-icon :icon="shieldCheckmarkOutline"></ion-icon> Verificados</span>
            <span class="dot">•</span>
            <span>Avaliações reais</span>
            <span class="dot">•</span>
            <span>Pagamento protegido</span>
          </div>
        </section>

        <!-- ================= 2. GRADE MOBILE DE CATEGORIAS (2 COLUNAS COMPACTAS) ================= -->
        <section class="categories-section">
          <div class="section-top-line">
            <h2 class="section-title">Categorias</h2>
            <span class="section-hint">Toque para buscar</span>
          </div>

          <div class="categories-mobile-grid">
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
                <span class="cat-price">Desde R$ {{ cat.defaultPrice }}</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="cat-arrow"></ion-icon>
            </button>
          </div>
        </section>

        <!-- ================= 3. CARD COMPACTO PARA PRESTADOR DE SERVIÇO ================= -->
        <section class="worker-compact-section">
          <div class="worker-compact-banner" @click="goToProvider">
            <div class="worker-banner-left">
              <div class="worker-icon-circle">
                <ion-icon :icon="briefcaseOutline"></ion-icon>
              </div>
              <div>
                <h3 class="worker-banner-title">É Prestador de Serviço?</h3>
                <p class="worker-banner-sub">Gerencie sua agenda, impulsos e propostas no app.</p>
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
  shieldCheckmarkOutline
} from 'ionicons/icons';
import { useAppStore, CATEGORY_CONFIGS } from '@/stores/useAppStore';

const router = useRouter();
const store = useAppStore();

const activeCategory = ref('Garçom');
const activeIndex = ref(0);
let rouletteTimer = null;

const rouletteCategories = computed(() => store.categoriesList);

const activeHeroConfig = computed(() => {
  return CATEGORY_CONFIGS[activeCategory.value] || CATEGORY_CONFIGS.Garçom;
});

function getFacePositionClass(idx) {
  const total = rouletteCategories.value.length;
  if (!total) return 'face-hidden';
  let diff = idx - activeIndex.value;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  if (diff === 0) return 'face-center';
  if (diff === -1) return 'face-left-1';
  if (diff === 1) return 'face-right-1';
  if (diff === -2) return 'face-left-2';
  if (diff === 2) return 'face-right-2';
  return 'face-hidden';
}

function spinNextFace() {
  const total = rouletteCategories.value.length;
  if (!total) return;
  activeIndex.value = (activeIndex.value + 1) % total;
  const centerCat = rouletteCategories.value[activeIndex.value];
  if (centerCat && centerCat.name) {
    activeCategory.value = centerCat.name;
  }
}

function handlePhotoClick(catItem, idx) {
  activeIndex.value = idx;
  activeCategory.value = catItem.name;
  store.clearSelectedProfessional();
  goToClientDashboard(catItem.name);
}

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
  activeCategory.value = catName;
  const matchIdx = rouletteCategories.value.findIndex(c => c.name === catName);
  if (matchIdx !== -1) activeIndex.value = matchIdx;
  goToClientDashboard(catName);
}

onMounted(() => {
  store.role = 'CLIENT';
  rouletteTimer = setInterval(() => {
    spinNextFace();
  }, 2400);
});

onUnmounted(() => {
  if (rouletteTimer) clearInterval(rouletteTimer);
});

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
  store.providerTab = 'servicos';
  router.push('/provider');
}
</script>

<style scoped>
.landing-page-root {
  --ion-background-color: #030407;
  --ion-text-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ================= HEADER MOBILE APP ================= */
.landing-header {
  background: #030407;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.landing-toolbar {
  --background: #030407;
  --min-height: 54px;
}

.header-inner {
  padding: 0 14px;
  height: 54px;
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
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
}

.brand-name {
  color: #ffffff;
  font-size: 18px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 5px 8px;
  border-radius: 99px;
}

.loc-icon {
  color: #D4FF24;
  font-size: 13px;
}

.mobile-provider-pill {
  background: rgba(212, 255, 36, 0.12);
  border: 1px solid rgba(212, 255, 36, 0.35);
  color: #D4FF24;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 10px;
  border-radius: 99px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

/* ================= CONTAINER MOBILE ================= */
.landing-content {
  --background: #030407;
}

.page-container {
  padding: 14px 14px 92px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ================= 1. HERO MOBILE + ROLETA ================= */
.hero-roulette-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 6px;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #D4FF24;
  box-shadow: 0 0 8px #D4FF24;
}

.hero-headline {
  font-size: 23px;
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.4px;
  color: #ffffff;
  margin: 0 0 6px;
}

.neon-highlight {
  color: #D4FF24;
}

.hero-subtext {
  font-size: 12.5px;
  line-height: 1.42;
  color: #9ca3af;
  margin: 0 0 10px;
}

/* Palco 3D Mobile */
.piao-roulette-stage {
  position: relative;
  width: 100%;
  height: 184px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 900px;
  overflow: hidden;
  user-select: none;
  margin: 2px 0 12px;
}

.piao-pointer-top,
.piao-pointer-bottom {
  color: #D4FF24;
  font-size: 11px;
  line-height: 1;
  text-shadow: 0 0 10px rgba(212, 255, 36, 0.85);
  z-index: 20;
  pointer-events: none;
}

.piao-pointer-top {
  margin-bottom: 4px;
}

.piao-pointer-bottom {
  margin-top: 4px;
}

.piao-wheel-track {
  position: relative;
  width: 100%;
  height: 142px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.piao-photo-face {
  position: absolute;
  width: 114px;
  height: 140px;
  border-radius: 16px;
  padding: 0;
  border: 2px solid rgba(255, 255, 255, 0.14);
  background: #080b11;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.35s ease,
              box-shadow 0.35s ease;
}

.piao-only-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

.face-active-caption {
  position: absolute;
  bottom: 6px;
  left: 6px;
  right: 6px;
  background: rgba(5, 8, 14, 0.86);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(212, 255, 36, 0.45);
  border-radius: 8px;
  padding: 3px 6px;
  text-align: center;
}

.face-active-caption span {
  font-size: 10.5px;
  font-weight: 800;
  color: #D4FF24;
  letter-spacing: 0.2px;
}

.piao-photo-face.face-center {
  transform: translate3d(0, 0, 55px) rotateY(0deg) scale(1.04);
  z-index: 10;
  opacity: 1;
  border-color: #D4FF24;
  box-shadow: 0 0 24px rgba(212, 255, 36, 0.35);
}

.piao-photo-face.face-left-1 {
  transform: translate3d(-86px, 0, 0px) rotateY(32deg) scale(0.84);
  z-index: 6;
  opacity: 0.72;
}

.piao-photo-face.face-right-1 {
  transform: translate3d(86px, 0, 0px) rotateY(-32deg) scale(0.84);
  z-index: 6;
  opacity: 0.72;
}

.piao-photo-face.face-left-2 {
  transform: translate3d(-146px, 0, -55px) rotateY(52deg) scale(0.66);
  z-index: 3;
  opacity: 0.28;
}

.piao-photo-face.face-right-2 {
  transform: translate3d(146px, 0, -55px) rotateY(-52deg) scale(0.66);
  z-index: 3;
  opacity: 0.28;
}

.piao-photo-face.face-hidden {
  transform: translate3d(0, 0, -120px) rotateY(180deg) scale(0.4);
  z-index: 1;
  opacity: 0;
  pointer-events: none;
}

.hero-primary-btn {
  width: 100%;
  height: 48px;
  background: #D4FF24;
  color: #050800;
  border: none;
  border-radius: 13px;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(212, 255, 36, 0.22);
}

.hero-trust-inline {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  font-size: 11px;
  color: #6b7280;
}

.hero-trust-inline span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.hero-trust-inline ion-icon {
  color: #D4FF24;
  font-size: 13px;
}

.dot {
  opacity: 0.4;
}

/* ================= 2. CATEGORIAS EM GRADE 2 COLUNAS MOBILE ================= */
.section-top-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-title {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.section-hint {
  font-size: 11px;
  color: #6b7280;
}

.categories-mobile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.cat-minimal-card {
  background: #080b11;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 13px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.16s ease;
}

.cat-minimal-card.active {
  border-color: rgba(212, 255, 36, 0.5);
  background: rgba(212, 255, 36, 0.06);
}

.cat-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.cat-minimal-card.active .cat-icon-box {
  background: rgba(212, 255, 36, 0.15);
  color: #D4FF24;
}

.cat-text-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.cat-title {
  font-size: 12.5px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cat-price {
  font-size: 10.5px;
  color: #6b7280;
}

.cat-arrow {
  color: #4b5563;
  font-size: 14px;
  flex-shrink: 0;
}

.cat-minimal-card.active .cat-arrow {
  color: #D4FF24;
}

/* ================= 3. BANNER COMPACTO PRESTADOR ================= */
.worker-compact-banner {
  background: #080b11;
  border: 1px solid rgba(212, 255, 36, 0.22);
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
}

.worker-banner-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.worker-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(212, 255, 36, 0.12);
  color: #D4FF24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.worker-banner-title {
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 2px;
}

.worker-banner-sub {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
}

.worker-banner-arrow {
  color: #D4FF24;
  font-size: 17px;
  flex-shrink: 0;
}
</style>
