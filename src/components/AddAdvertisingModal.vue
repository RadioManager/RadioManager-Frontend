<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAudioRecordingStore } from '@/stores/audio_recording'
import { usePlacementStore } from '@/stores/placement'
import { useTransactionStore } from '@/stores/transaction'
import * as slotService from '@/services/broadcast_slot'
import { toLocalISOString } from '@/utils/date.js'
import {getPriorityMultiplier, splitBroadcastSlot} from "@/services/broadcast_slot";

const emit = defineEmits(['close', 'attached'])
const props = defineProps({
  stationId: { type: Number, required: true }
})

const userStore = useUserStore()
const audioStore = useAudioRecordingStore()
const placementStore = usePlacementStore()
const txnStore = useTransactionStore()

const amount = ref(0)
const selectedFileId = ref('')
const highPriority = ref(false)
const loading = ref(false)
const error = ref(null)

const files = ref([])
const maxBalance = computed(() => userStore.profile?.balance || 0)
const canSubmit = computed(() =>
    amount.value > 0 &&
    amount.value <= maxBalance.value &&
    selectedFileId.value !== ''
)

onMounted(async () => {
  await audioStore.loadAllowedRecordings()
  files.value = audioStore.recordings
})

async function onAttach() {
  if (!canSubmit.value) return
  loading.value = true
  error.value = null

  try {
    const slots = await slotService.getAvailableSlotsByPriority(
        props.stationId,
        highPriority.value
    )

    const mult = await getPriorityMultiplier(highPriority.value)

    const fileObj = files.value.find(f => f.recording.id === selectedFileId.value)
    const price = fileObj.recording.cost * mult
    const maxCount = Math.floor(amount.value / price)
    if (maxCount === 0) {
      throw new Error('На эту сумму невозможно ни одного размещения')
    }

    const shuffled = slots.sort(() => Math.random() - 0.5)
    const chosen = shuffled.slice(0, maxCount)

    const now = toLocalISOString()
    const created = []
    for (const slot of chosen) {
      const dto = {
        broadcastSlotId: slot.id,
        audioRecordingId: selectedFileId.value,
        placementDate: now
      }
      const p = await placementStore.createPlacement(dto)
      if (p) {
        await splitBroadcastSlot(slot.id, selectedFileId.value)
        created.push(p)
      }
    }

    if (created.length === 0) {
      throw new Error('Нет доступных пробелов для размещения')
    }

    const charge = created.length * price
    const newBalance = (userStore.profile.balance || 0) - charge
    await userStore.updateUserBalance(newBalance)
    await txnStore.createSystemTransaction({
      id: 0,
      userId: userStore.profile.id,
      adminId: 0,
      amount: -charge,
      transactionDate: now,
      description: 'Размещение рекламы'
    })

    emit('attached')
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
          <h2>Добавить рекламу</h2>
          <button class="close-btn" @click="$emit('close')">×</button>
        </header>
        <div class="modal-content">
          <div class="form-group">
            <label>Сумма (₽)</label>
            <input
                type="number"
                v-model.number="amount"
                min="0"
                :max="maxBalance"
                placeholder="Сколько готовы заплатить?"
            />
            <p v-if="amount > maxBalance" class="error">
              Недостаточно средств (макс. {{ maxBalance }} ₽)
            </p>
          </div>
          <div class="form-group">
            <label>Файл</label>
            <select v-model="selectedFileId">
              <option disabled value="">-- Выберите файл --</option>
              <option
                  v-for="file in files"
                  :key="file.recording.id"
                  :value="file.recording.id"
              >
                {{ file.recording.filePath.split('/').pop() }}
                ({{ file.recording.cost.toFixed(2) }} ₽)
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Высокий приоритет?</label>
            <select v-model="highPriority">
              <option :value="true">Да</option>
              <option :value="false">Нет</option>
            </select>
          </div>
          <button
              class="submit-button"
              :disabled="!canSubmit"
              @click="onAttach"
          >
            {{ loading ? 'В процессе…' : 'Прикрепить рекламу' }}
          </button>
          <p v-if="error" class="error">{{ error }}</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 10000;
}
.modal {
  background: var(--color-background-soft);
  padding: 1.5rem; border-radius: 12px;
  width: 90%; max-width: 480px;
}
.modal-header {
  display: flex; justify-content: space-between;
  align-items: center; margin-bottom: 1rem;
}
.close-btn {
  background: none; border: none; font-size: 1.5rem; cursor: pointer;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block; margin-bottom: .5rem; color: var(--color-heading);
}
.form-group input,
.form-group select {
  width: 100%; padding: .75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px; font-size: 1rem;
}
.error {
  color: var(--color-danger-button);
  margin-top: .5rem; text-align: center;
}
.submit-button {
  padding: .75rem 1.25rem;
  background: var(--color-primary-button);
  color: #fff; border: none; border-radius: 6px;
  cursor: pointer; font-size: 1rem;
  transition: background-color .3s;
}
.submit-button:disabled {
  opacity: .6; cursor: not-allowed;
}
.submit-button:hover:not(:disabled) {
  background: var(--color-primary-button-hover);
}
</style>
