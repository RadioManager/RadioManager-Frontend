<script setup>
import { ref, onMounted } from 'vue'
import { useCityStore } from '@/stores/city'
import { useUserStore } from '@/stores/user'
import { useRadioStationStore } from '@/stores/radio_station'
import '@/assets/common_styles.css'

const emit = defineEmits(['close','created'])
const cityStore = useCityStore()
const userStore = useUserStore()
const stationStore = useRadioStationStore()

const cities = ref([])
const loading = ref(false)
const error = ref(null)

const station = ref({
  id: 0,
  name: '',
  frequency: null,
  cityId: null,
  representativeId: userStore.profile.id
})

onMounted(async () => {
  await cityStore.loadAllCities()
  cities.value = cityStore.cities
})

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    const created = await stationStore.createStation(station.value)
    if (created) {
      emit('created')
      emit('close')
    }
  } catch (e) {
    error.value = e.response?.data || e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <teleport to="body">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <h2 class="title">Создание радиостанции</h2>
        </header>
        <form @submit.prevent="onSubmit" class="form">
          <div class="form-group">
            <label for="stationName">Название станции</label>
            <input
                id="stationName"
                v-model="station.name"
                type="text"
                placeholder="Введите название станции"
                required
            />
          </div>
          <div class="form-group">
            <label for="frequency">FM Частота</label>
            <input
                id="frequency"
                v-model.number="station.frequency"
                type="number"
                step="0.1"
                min="87.5"
                max="108.0"
                placeholder="Введите частоту (например, 101,5)"
                required
            />
          </div>
          <div class="form-group">
            <label for="city">Город</label>
            <select id="city" v-model.number="station.cityId" required>
              <option disabled value="">-- Выберите город --</option>
              <option
                  v-for="city in cities"
                  :key="city.id"
                  :value="city.id"
              >
                {{ city.name }} ({{ city.region }})
              </option>
            </select>
          </div>
          <button type="submit" class="submit-button" :disabled="loading">
            {{ loading ? 'Создание...' : 'Создать' }}
          </button>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </teleport>
</template>