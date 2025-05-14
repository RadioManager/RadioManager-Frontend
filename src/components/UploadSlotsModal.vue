<template>
  <teleport to="body">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <h2>Загрузка пробелов из Excel</h2>
          <button class="close-btn" @click="emit('close')">×</button>
        </header>
        <div class="modal-content">
          <!-- Инструкция по форматированию файла -->
          <p>Перед загрузкой убедитесь, что Excel-файл имеет следующие колонки:</p>
          <ul>
            <li><strong>startTime</strong>: Дата и время начала (ISO 8601 или dd.MM.yyyy HH:mm)</li>
            <li><strong>endTime</strong>: Дата и время конца</li>
            <li><strong>status</strong>: AVAILABLE или OCCUPIED</li>
            <li><strong>radioStationId</strong>: ID радиостанции</li>
          </ul>
          <!-- Выбор файла -->
          <label class="submit-button" for="excelInput">Выбрать файл</label>
          <input
              id="excelInput"
              type="file"
              accept=".xlsx, .xls"
              @change="onFileSelect"
              hidden
          />
          <p v-if="file" class="file-name">Выбран файл: {{ file.name }}</p>

          <!-- Кнопка загрузки -->
          <button
              class="submit-button"
              :disabled="!file || loading"
              @click="onUpload"
          >
            {{ loading ? 'Загрузка...' : 'Загрузить' }}
          </button>

          <p v-if="error" class="error">{{ error }}</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useBroadcastSlotStore } from '@/stores/broadcast_slot'

const emit = defineEmits(['close', 'uploaded'])
const props = defineProps({ stationId: { type: Number, required: true } })

const slotStore = useBroadcastSlotStore()
const file = ref(null)
const loading = ref(false)
const error = ref(null)

function onFileSelect(event) {
  file.value = event.target.files[0] || null
  error.value = null
}

async function onUpload() {
  if (!file.value) return
  loading.value = true
  error.value = null
  try {
    await slotStore.createSlotsFromExcel(file.value, props.stationId)
    emit('uploaded')
    emit('close')
  } catch (e) {
    error.value = e.response?.data || e.message
  } finally {
    loading.value = false
  }
}
</script>