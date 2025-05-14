<template>
  <div class="page-wrapper">
    <h1 class="title">Пробелы вещания</h1>

    <!-- Controls for Admin and Advertiser -->
    <div v-if="isAdmin || isAdvertiser" class="form">
      <div class="form-group">
        <label for="citySelect">Город</label>
        <select id="citySelect" v-model="selectedCity">
          <option disabled value="">-- Выберите город --</option>
          <option v-for="city in cities" :key="city.id" :value="city.id">
            {{ city.name }} ({{ city.region }})
          </option>
        </select>
      </div>
      <div v-if="stations.length" class="form-group">
        <label for="stationSelect">Радиостанция</label>
        <select id="stationSelect" v-model="selectedStation">
          <option disabled :value="null">-- Выберите станцию --</option>
          <option
              v-for="st in stations"
              :key="st.id"
              :value="st"
          >
            {{ st.name }} ({{ st.frequency }} FM)
          </option>
        </select>
      </div>
      <div class="form-group buttons">
        <button class="submit-button" @click="onOpenUploadModal">Загрузить пробелы</button>
        <button class="submit-button" @click="onOpenAdModal">Добавить рекламу</button>
      </div>
    </div>

    <!-- Control for Representative -->
    <div v-else class="form-group">
      <button class="submit-button" @click="onOpenUploadModal">Загрузить пробелы</button>
    </div>

    <!-- Slots table -->
    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th>Начало пробела</th>
          <th>Конец пробела</th>
          <th>Статус</th>
          <th>Аудио</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="slot in slots" :key="slot.id">
          <td>{{ formatDate(slot.startTime) }}</td>
          <td>{{ formatDate(slot.endTime) }}</td>
          <td>{{ slot.status }}</td>
          <td>
            <audio
                v-if="slotAudio[slot.id]"
                controls
                :src="`data:audio/mp3;base64,${slotAudio[slot.id]}`"
            ></audio>
            <span v-else>—</span>
          </td>
        </tr>
        </tbody>
      </table>
      <p v-if="slots.length === 0" class="no-data">Нет пробелов для отображения</p>
    </div>
    <UploadSlotsModal
        v-if="showUploadModal"
        :stationId="currentStationId"
        @close="showUploadModal = false"
        @uploaded="onSlotsUploaded"
    />
    <AddAdvertisingModal
        v-if="showAdModal"
        :stationId="currentStationId"
        @close="showAdModal = false"
        @attached="onAdAttached"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch, onUnmounted} from 'vue'
import { useUserStore } from '@/stores/user'
import { useCityStore } from '@/stores/city'
import { useRadioStationStore } from '@/stores/radio_station'
import { useBroadcastSlotStore } from '@/stores/broadcast_slot'
import {formatDate} from "@/utils/date.js";
import UploadSlotsModal from "@/components/UploadSlotsModal.vue";
import {usePlacementStore} from "@/stores/placement.js";
import {getAudioRecordingById} from "@/services/audio_recording.js";
import AddAdvertisingModal from "@/components/AddAdvertisingModal.vue";

const userStore = useUserStore()
const cityStore = useCityStore()
const stationStore = useRadioStationStore()
const slotStore = useBroadcastSlotStore()
const placementStore = usePlacementStore()

const profile = computed(() => userStore.profile || {})
const isAdmin = computed(() => profile.value.role === 'ADMIN')
const isAdvertiser = computed(() => profile.value.role === 'ADVERTISER')

const cities = computed(() => cityStore.cities)
const selectedCity = ref('')
const stations = ref([])
const selectedStation = ref(null)

const currentStationId = computed(() => {
  return (selectedStation.value && selectedStation.value.id)
      || (stationStore.selectedStation && stationStore.selectedStation.id)
      || null
})

const slots = computed(() => slotStore.slots)

const showUploadModal = ref(false)
const showAdModal = ref(false)
const slotAudio = ref({})

onMounted(async () => {
  if (isAdmin.value || isAdvertiser.value) {
    await cityStore.loadAllCities()
  }
  if (profile.value.role === 'RADIO_REPRESENTATIVE') {
    await stationStore.loadStationByRepresentativeId(profile.value.id)
    selectedStation.value = stationStore.selectedStation
    await slotStore.loadFutureSlotsByStation(selectedStation.value.id)
    await loadPlacementsAndAudio()
  }
})

onUnmounted(() => {
  slotStore.$reset()
  slotAudio.value = {}
})

watch(selectedCity, async (cityId) => {
  if (cityId) {
    stations.value = await stationStore.loadStationsByCityId(cityId)
  } else {
    stations.value = []
  }
  selectedStation.value = null
})

watch(selectedStation, async (station) => {
  if (station && station.id) {
    await slotStore.loadFutureSlotsByStation(station.id)
    await loadPlacementsAndAudio()
  }
})

function onOpenUploadModal() {
  if (currentStationId.value) {
    showUploadModal.value = true
  } else {
    alert('Выберите радиостанцию прежде чем загружать пробелы')
  }
}

function onOpenAdModal() {
  if (currentStationId.value) {
    showAdModal.value = true
  }
  else {
    alert('Выберите радиостанцию прежде чем добавлять рекламу')
  }
}

async function onSlotsUploaded() {
  showUploadModal.value = false
  if (currentStationId.value) {
    await slotStore.loadFutureSlotsByStation(currentStationId.value)
    await loadPlacementsAndAudio()
  }
}

async function onAdAttached() {
  showAdModal.value = false
  if (currentStationId.value) {
    await slotStore.loadFutureSlotsByStation(currentStationId.value)
    await loadPlacementsAndAudio()
  }
}

async function loadPlacementsAndAudio() {
  const loadedSlots = slotStore.slots
  const placements = await placementStore.loadPlacementsFromSlots(loadedSlots)
  slotAudio.value = {}
  for (const p of placements) {
    try {
      const combined = await getAudioRecordingById(p.audioRecordingId)
      slotAudio.value[p.broadcastSlotId] = combined.fileContentBase64
    } catch {
      // ignore missing audio
    }
  }
}

</script>

<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.buttons {
  display: flex;
  gap: 0.5rem;
}
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  text-align: left;
  font-size: 0.95rem;
  color: var(--color-text);
}
.no-data {
  text-align: center;
  margin-top: 1rem;
  color: var(--color-text);
}
</style>
