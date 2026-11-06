<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="closeModal"
    class="serve-calendar-modal"
  >
    <div class="calendar-modal-sheet">
      <div class="modal-drag-handle"></div>

      <!-- Cabeçalho amigável -->
      <div class="cal-header">
        <div>
          <span class="cal-eyebrow">AGENDAMENTO +SERVE</span>
          <h3 class="cal-title">{{ title }}</h3>
        </div>
        <button type="button" class="cal-close-btn" @click="closeModal" aria-label="Fechar calendário">
          <ion-icon :icon="closeOutline"></ion-icon>
        </button>
      </div>

      <!-- Atalhos inteligentes para escolha rápida -->
      <div class="cal-shortcuts-row">
        <button
          type="button"
          class="cal-shortcut-chip"
          :class="{ active: isSameISO(internalDate, todayISO) }"
          @click="selectQuickDate(todayISO)"
        >
          Hoje
        </button>
        <button
          type="button"
          class="cal-shortcut-chip"
          :class="{ active: isSameISO(internalDate, tomorrowISO) }"
          @click="selectQuickDate(tomorrowISO)"
        >
          Amanhã
        </button>
        <button
          type="button"
          class="cal-shortcut-chip"
          :class="{ active: isSameISO(internalDate, nextSaturdayISO) }"
          @click="selectQuickDate(nextSaturdayISO)"
        >
          Próx. Sábado
        </button>
        <button
          type="button"
          class="cal-shortcut-chip"
          :class="{ active: isSameISO(internalDate, nextSundayISO) }"
          @click="selectQuickDate(nextSundayISO)"
        >
          Próx. Domingo
        </button>
      </div>

      <!-- Navegação de Mês e Ano -->
      <div class="cal-month-nav">
        <button
          type="button"
          class="month-arrow-btn"
          :disabled="isCurrentMonthMin"
          @click="changeMonth(-1)"
          aria-label="Mês anterior"
        >
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </button>

        <div class="month-label-wrap">
          <span class="month-title-text">{{ currentMonthName }}</span>
          <span class="year-title-text">{{ currentYear }}</span>
        </div>

        <button
          type="button"
          class="month-arrow-btn"
          @click="changeMonth(1)"
          aria-label="Próximo mês"
        >
          <ion-icon :icon="chevronForwardOutline"></ion-icon>
        </button>
      </div>

      <!-- Cabeçalho dos Dias da Semana -->
      <div class="cal-weekdays-grid">
        <span
          v-for="(wd, idx) in weekdays"
          :key="wd"
          class="weekday-cell"
          :class="{ weekend: idx === 0 || idx === 6 }"
        >
          {{ wd }}
        </span>
      </div>

      <!-- Grade de Dias do Mês -->
      <div class="cal-days-grid">
        <button
          v-for="cell in calendarCells"
          :key="cell.key"
          type="button"
          class="day-cell-btn"
          :class="{
            empty: cell.empty,
            disabled: cell.isPast,
            today: cell.isToday,
            selected: cell.isSelected,
            weekend: cell.isWeekend
          }"
          :disabled="cell.empty || cell.isPast"
          @click="pickDay(cell)"
        >
          <span v-if="!cell.empty" class="day-number">{{ cell.day }}</span>
          <span v-if="!cell.empty && cell.isToday" class="today-dot"></span>
        </button>
      </div>

      <!-- Resumo da Data Selecionada + Botão Confirmar -->
      <div class="cal-footer">
        <div class="selected-date-preview">
          <div class="preview-icon-box">
            <ion-icon :icon="calendarOutline"></ion-icon>
          </div>
          <div class="preview-text-col">
            <span class="preview-label">Data selecionada</span>
            <strong class="preview-full-date">{{ formattedSelectedLong }}</strong>
          </div>
        </div>

        <button type="button" class="cal-confirm-btn" @click="confirmSelection">
          <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
          <span>CONFIRMAR DATA</span>
        </button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IonModal, IonIcon } from '@ionic/vue';
import {
  closeOutline,
  chevronBackOutline,
  chevronForwardOutline,
  calendarOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Data do Evento'
  },
  allowPast: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'update:isOpen', 'close', 'select']);

const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function toISODate(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISODate(isoStr) {
  if (!isoStr || !isoStr.includes('-')) return new Date();
  const [y, m, d] = isoStr.split('-').map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}

const now = new Date();
const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const todayISO = toISODate(todayDate);

const tomorrowDate = new Date(todayDate);
tomorrowDate.setDate(todayDate.getDate() + 1);
const tomorrowISO = toISODate(tomorrowDate);

function getNextWeekdayISO(targetDay) {
  const d = new Date(todayDate);
  const current = d.getDay();
  let diff = (targetDay - current + 7) % 7;
  if (diff === 0) diff = 7;
  d.setDate(d.getDate() + diff);
  return toISODate(d);
}

const nextSaturdayISO = getNextWeekdayISO(6);
const nextSundayISO = getNextWeekdayISO(0);

const internalDate = ref(props.modelValue || todayISO);
const viewYear = ref(todayDate.getFullYear());
const viewMonth = ref(todayDate.getMonth());

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      internalDate.value = newVal;
      const parsed = parseISODate(newVal);
      viewYear.value = parsed.getFullYear();
      viewMonth.value = parsed.getMonth();
    }
  },
  { immediate: true }
);

watch(
  () => props.isOpen,
  (opened) => {
    if (opened) {
      const target = props.modelValue || todayISO;
      internalDate.value = target;
      const parsed = parseISODate(target);
      viewYear.value = parsed.getFullYear();
      viewMonth.value = parsed.getMonth();
    }
  }
);

const currentMonthName = computed(() => monthNames[viewMonth.value]);
const currentYear = computed(() => viewYear.value);

const isCurrentMonthMin = computed(() => {
  if (props.allowPast) return false;
  return (
    viewYear.value < todayDate.getFullYear() ||
    (viewYear.value === todayDate.getFullYear() && viewMonth.value <= todayDate.getMonth())
  );
});

function changeMonth(delta) {
  let nextM = viewMonth.value + delta;
  let nextY = viewYear.value;
  if (nextM > 11) {
    nextM = 0;
    nextY += 1;
  } else if (nextM < 0) {
    nextM = 11;
    nextY -= 1;
  }
  viewMonth.value = nextM;
  viewYear.value = nextY;
}

const calendarCells = computed(() => {
  const year = viewYear.value;
  const month = viewMonth.value;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({
      key: `empty-${year}-${month}-${i}`,
      empty: true
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const iso = toISODate(cellDate);
    const weekday = cellDate.getDay();
    const isPast = !props.allowPast && cellDate < todayDate;

    cells.push({
      key: iso,
      empty: false,
      day,
      iso,
      isPast,
      isToday: iso === todayISO,
      isSelected: iso === internalDate.value,
      isWeekend: weekday === 0 || weekday === 6
    });
  }

  return cells;
});

const formattedSelectedLong = computed(() => {
  const d = parseISODate(internalDate.value);
  const longWeekdays = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];
  const wd = longWeekdays[d.getDay()];
  const day = String(d.getDate()).padStart(2, '0');
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();

  if (internalDate.value === todayISO) {
    return `Hoje • ${wd}, ${day} de ${month}`;
  }
  if (internalDate.value === tomorrowISO) {
    return `Amanhã • ${wd}, ${day} de ${month}`;
  }
  return `${wd}, ${day} de ${month} de ${year}`;
});

function isSameISO(a, b) {
  return a === b;
}

function selectQuickDate(iso) {
  internalDate.value = iso;
  const parsed = parseISODate(iso);
  viewYear.value = parsed.getFullYear();
  viewMonth.value = parsed.getMonth();
  emit('update:modelValue', iso);
  emit('select', iso);
}

function pickDay(cell) {
  if (cell.empty || cell.isPast) return;
  internalDate.value = cell.iso;
  emit('update:modelValue', cell.iso);
  emit('select', cell.iso);
}

function confirmSelection() {
  emit('update:modelValue', internalDate.value);
  emit('select', internalDate.value);
  closeModal();
}

function closeModal() {
  emit('update:isOpen', false);
  emit('close');
}
</script>

<style scoped>
.serve-calendar-modal {
  --background: transparent;
  --width: 100%;
  --max-width: 430px;
  --height: auto;
  --border-radius: 24px;
  padding: 14px;
}

.calendar-modal-sheet {
  background: #0a0e17;
  border: 1px solid rgba(212, 255, 36, 0.28);
  border-radius: 22px;
  padding: 14px 18px 20px;
  color: #ffffff;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85);
}

.modal-drag-handle {
  width: 38px;
  height: 4px;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 99px;
  margin: 0 auto 12px;
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.cal-eyebrow {
  display: block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.9px;
  color: #D4FF24;
  margin-bottom: 2px;
}

.cal-title {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.cal-close-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
}

/* Atalhos rápidos */
.cal-shortcuts-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 4px;
  margin-bottom: 14px;
}

.cal-shortcuts-row::-webkit-scrollbar {
  display: none;
}

.cal-shortcut-chip {
  background: #06090f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 11.5px;
  font-weight: 700;
  padding: 6px 11px;
  border-radius: 99px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.16s ease;
}

.cal-shortcut-chip.active {
  background: rgba(212, 255, 36, 0.15);
  border-color: #D4FF24;
  color: #D4FF24;
}

/* Navegação do Mês */
.cal-month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #06090f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 8px 10px;
  margin-bottom: 12px;
}

.month-arrow-btn {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.month-arrow-btn:hover:not(:disabled) {
  border-color: #D4FF24;
  color: #D4FF24;
}

.month-arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.month-label-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.month-title-text {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
}

.year-title-text {
  font-size: 13px;
  font-weight: 700;
  color: #D4FF24;
}

/* Cabeçalho da semana */
.cal-weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 6px;
}

.weekday-cell {
  font-size: 10.5px;
  font-weight: 800;
  color: #64748b;
  padding: 4px 0;
  letter-spacing: 0.4px;
}

.weekday-cell.weekend {
  color: #94a3b8;
}

/* Grade de dias */
.cal-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 16px;
}

.day-cell-btn {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  font-size: 13.5px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}

.day-cell-btn.empty {
  background: transparent;
  border-color: transparent;
  cursor: default;
}

.day-cell-btn.weekend:not(.empty):not(.disabled):not(.selected) {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.045);
}

.day-cell-btn:hover:not(.empty):not(.disabled):not(.selected) {
  border-color: rgba(212, 255, 36, 0.45);
  background: rgba(212, 255, 36, 0.08);
  color: #D4FF24;
}

.day-cell-btn.today:not(.selected) {
  border-color: rgba(212, 255, 36, 0.5);
  color: #D4FF24;
}

.day-cell-btn.selected {
  background: #D4FF24;
  border-color: #D4FF24;
  color: #05070b;
  font-weight: 900;
  box-shadow: 0 4px 16px rgba(212, 255, 36, 0.35);
  transform: scale(1.03);
}

.day-cell-btn.disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.today-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  margin-top: 2px;
}

/* Rodapé com resumo e botão */
.cal-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.selected-date-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #06090f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 9px 12px;
}

.preview-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: rgba(212, 255, 36, 0.12);
  color: #D4FF24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.preview-text-col {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.preview-label {
  font-size: 10px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-full-date {
  font-size: 13px;
  color: #ffffff;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cal-confirm-btn {
  width: 100%;
  background: #D4FF24;
  color: #04060a;
  border: none;
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(212, 255, 36, 0.25);
}

.cal-confirm-btn ion-icon {
  font-size: 18px;
}
</style>
