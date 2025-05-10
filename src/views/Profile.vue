<script setup>
import {onMounted, computed, ref} from 'vue'
import { useUserStore } from '@/stores/user'
import { useRadioStationStore } from '@/stores/radio_station'
import CreateTopUpModal from '@/components/CreateTopUpModal.vue'

const userStore = useUserStore()
const stationStore = useRadioStationStore()

const profile = computed(() => userStore.profile || {})
const station = computed(() => stationStore.selectedStation)

const showTopUpModal = ref(false)

const roleLabel = computed(() => {
  switch (profile.value.role) {
    case 'ADMIN': return 'Админ'
    case 'ADVERTISER': return 'Рекламодатель'
    case 'RADIO_REPRESENTATIVE': return 'Представитель радиостанции'
    default: return profile.value.role
  }
})

onMounted(() => {
  if (profile.value.role === 'RADIO_REPRESENTATIVE') {
    stationStore.loadStationByRepresentativeId(profile.value.id)
  }
})

function onTopUp() {
  showTopUpModal.value = true
}

function onHistory() {
  alert('История транзакций пока недоступна')
}

function onTopUpCompleted() {
  showTopUpModal.value = false
}

function onModalClose() {
  showTopUpModal.value = false
}
</script>

<template>
  <div class="page-wrapper">
    <h1 class="title">Профиль</h1>

    <p class="profile-text">
      <span class="profile-label">Имя:</span>&nbsp;{{ profile.name }}
      &nbsp;&nbsp;<span class="profile-label">Фамилия:</span>&nbsp;{{ profile.surname }}
    </p>

    <p class="profile-text">
      <span class="profile-label">Роль:</span>&nbsp;{{ roleLabel }}
    </p>

    <p class="profile-text">
      <span class="profile-label">Баланс:</span>&nbsp;{{ profile.balance }} руб.
    </p>

    <p v-if="station" class="profile-text">
      <span class="profile-label">Радиостанция:</span>&nbsp;{{ station.name }} ({{ station.frequency }} FM)
    </p>

    <div class="buttons">
      <button class="submit-button" @click="onTopUp">Пополнить счет</button>
      <button class="submit-button" @click="onHistory">История транзакций</button>
    </div>
    <CreateTopUpModal
        v-if="showTopUpModal"
        @close="onModalClose"
        @completed="onTopUpCompleted"
    />
  </div>
</template>

<style scoped>
.profile-label {
  color: var(--color-heading);  /* тот же цвет, что у заголовков */
  font-weight: 600;             /* можно даже 700, если нужно жирнее */
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Новый стиль для текстовых значений в профиле */
.profile-text {
  font-size: 1.2rem;                /* чуть крупнее */
  color: var(--color-heading);         /* меняется при смене темы */
  line-height: 1.4;
  margin: 0.5rem auto 0.5rem 0;
}
</style>