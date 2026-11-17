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

          <!-- Roleta 3D Mobile-First (Fotos das Profissões do diretório profissoes) -->
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
                <img :src="catItem.photoUrl" :alt="catItem.label || catItem.name" class="piao-only-img" />
              </button>
            </div>

            <div class="piao-pointer-bottom">▲</div>
          </div>

          <!-- Indicador da Profissão Ativa (Abaixo da Roleta, sem poluição na imagem) -->
          <div class="roulette-indicator-wrap">
            <span class="roulette-indicator-pill">
              <span class="indicator-neon-dot"></span>
              <span class="indicator-pro-name">{{ activeHeroConfig.label || activeHeroConfig.name }}</span>
            </span>
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
  shieldCheckmarkOutline,
  flameOutline,
  heartOutline,
  cafeOutline,
  snowOutline,
  ribbonOutline
} from 'ionicons/icons';
import { useAppStore, CATEGORY_CONFIGS } from '@/stores/useAppStore';

const router = useRouter();
const store = useAppStore();

const activeCategory = ref('Bartender');
const activeIndex = ref(0);
let rouletteTimer = null;

const rouletteCategories = computed(() => store.categoriesList);

const activeHeroConfig = computed(() => {
  return CATEGORY_CONFIGS[activeCategory.value] || CATEGORY_CONFIGS.Bartender || CATEGORY_CONFIGS.Garçom;
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
    case 'wine': return wineOutline;
    case 'flame': return flameOutline;
    case 'heart': return heartOutline;
    case 'cafe': return cafeOutline;
    case 'snow': return snowOutline;
    case 'ribbon': return ribbonOutline;
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
  max-width: 440px;
  margin: 0 auto;
  padding: 0 14px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
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
  --overflow: hidden auto;
}

.landing-content::part(scroll) {
  overflow-x: hidden !important;
}

.page-container {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: 14px 14px 92px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  overflow-x: clip;
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

/* Palco 3D Mobile Responsivo (Cards Largos Proporcionais às Imagens 1080x900) */
.piao-roulette-stage {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: clamp(220px, 60vw, 255px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 900px;
  overflow: hidden;
  contain: paint;
  user-select: none;
  margin: 4px 0 6px;
  box-sizing: border-box;
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
  margin-bottom: 2px;
}

.piao-pointer-bottom {
  margin-top: 2px;
}

.piao-wheel-track {
  position: relative;
  width: 100%;
  height: clamp(190px, 53vw, 224px);
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.piao-photo-face {
  position: absolute;
  width: clamp(224px, 64vw, 268px);
  aspect-ratio: 1080 / 900;
  height: auto;
  max-height: clamp(186px, 53vw, 224px);
  border-radius: 20px;
  padding: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  background: #080b11;
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.35s ease,
              box-shadow 0.35s ease;
}

.piao-only-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  background: #080b11;
}

/* Card central ativo: largo, nítido e com destaque total */
.piao-photo-face.face-center {
  transform: translate3d(0, 0, 36px) rotateY(0deg) scale(1);
  z-index: 10;
  opacity: 1;
  border: 2px solid #D4FF24;
  box-shadow: 0 10px 32px rgba(212, 255, 36, 0.32);
}

/* Card esquerdo anterior (peeking suave atrás) */
.piao-photo-face.face-left-1 {
  transform: translate3d(calc(-1 * clamp(50px, 16vw, 76px)), 0, -28px) rotateY(16deg) scale(0.85);
  z-index: 5;
  opacity: 0.55;
  border-color: rgba(255, 255, 255, 0.1);
}

/* Card direito posterior (peeking suave atrás) */
.piao-photo-face.face-right-1 {
  transform: translate3d(clamp(50px, 16vw, 76px), 0, -28px) rotateY(-16deg) scale(0.85);
  z-index: 5;
  opacity: 0.55;
  border-color: rgba(255, 255, 255, 0.1);
}

.piao-photo-face.face-hidden {
  transform: translate3d(0, 0, -120px) rotateY(180deg) scale(0.3);
  z-index: 1;
  opacity: 0;
  pointer-events: none;
}

/* Indicador Limpo da Profissão Ativa (Abaixo da Roleta) */
.roulette-indicator-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  margin-bottom: 12px;
}

.roulette-indicator-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(13, 18, 28, 0.95);
  border: 1px solid rgba(212, 255, 36, 0.45);
  padding: 5px 14px;
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 14px rgba(212, 255, 36, 0.15);
}

.indicator-neon-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #D4FF24;
  box-shadow: 0 0 8px #D4FF24;
}

.indicator-pro-name {
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.3px;
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

.categories-section {
  width: 100%;
  box-sizing: border-box;
}

.categories-mobile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.cat-minimal-card {
  background: #080b11;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 13px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  text-align: left;
  color: #ffffff;
  cursor: pointer;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.16s ease;
}

/* Quando houver número ímpar de itens (7 categorias), o último ocupa a largura total com elegância */
.cat-minimal-card:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}

.cat-minimal-card.active {
  border-color: rgba(212, 255, 36, 0.55);
  background: rgba(212, 255, 36, 0.07);
}

.cat-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
}

.cat-minimal-card.active .cat-icon-box {
  background: rgba(212, 255, 36, 0.16);
  color: #D4FF24;
}

.cat-text-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.cat-title {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.1px;
}

.cat-price {
  font-size: 11px;
  color: #8b95a5;
  font-weight: 500;
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
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
}

.worker-banner-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
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

/* ================= RESPONSIVIDADE MULTI-TELA (MOBILE ESTREITO, TABLET E DESKTOP) ================= */
@media (max-width: 360px) {
  .header-inner {
    padding: 0 8px;
  }
  .brand-name {
    font-size: 16px;
  }
  .location-badge {
    padding: 4px 6px;
    font-size: 10px;
  }
  .mobile-provider-pill {
    padding: 4px 8px;
    font-size: 10px;
  }
  .hero-headline {
    font-size: 20px;
  }
  .hero-primary-btn {
    height: 44px;
    font-size: 11.5px;
  }
  .categories-mobile-grid {
    gap: 6px;
  }
  .cat-minimal-card {
    padding: 8px 8px;
    gap: 7px;
  }
  .cat-title {
    font-size: 11.5px;
  }
  .cat-price {
    font-size: 10px;
  }
}

@media (min-width: 600px) {
  .page-container {
    max-width: 620px;
    padding: 24px 20px 100px;
    gap: 28px;
  }
  .header-inner {
    max-width: 620px;
    padding: 0 20px;
  }
  .hero-headline {
    font-size: 27px;
  }
  .categories-mobile-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .cat-minimal-card:last-child:nth-child(odd) {
    grid-column: auto;
  }
}

@media (min-width: 900px) {
  .page-container {
    max-width: 720px;
  }
  .header-inner {
    max-width: 720px;
  }
  .categories-mobile-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
