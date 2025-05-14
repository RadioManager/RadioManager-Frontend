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

<template>
  <teleport to="body">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <h2 class="title">Загрузка пробелов из Excel</h2>
          <button class="close-btn" @click="emit('close')">×</button>
        </header>
        <div class="modal-content">
          <p>Пред загрузкой убедитесь что Excel файл имеет следующие параметры:</p>
          <ul>
            <li>В нем должно быть два заполненных столбца соответственно начало и конец пробела</li>
            <li>Нужно настроить формат ячейки как ДД.MM.ГГГГ чч:мм:сс для каждой ячейки</li>
          </ul>
          <label for="excelInput" class="submit-button">Выбрать файл</label>
          <input
              id="excelInput"
              type="file"
              accept=".xlsx, .xls"
              @change="onFileSelect"
              hidden
          />

          <p v-if="file" class="file-name">Выбран файл: {{ file.name }}</p>

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

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--color-heading);
}

.file-name {
  font-size: 0.95rem;
  color: var(--color-heading);
}
</style>