<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useTransactionStore } from '@/stores/transaction'
import {toLocalISOString} from "@/utils/date.js";

const emit = defineEmits(['close','completed'])
const userStore = useUserStore()
const txStore = useTransactionStore()

const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')
const amount = ref(null)
const loading = ref(false)
const error = ref(null)

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    await userStore.updateUserBalance(amount.value + userStore.profile.balance)

    const dto = {
      id: 0,
      userId: userStore.profile.id,
      adminId: 0,
      amount: amount.value,
      transactionDate: toLocalISOString(new Date()),
      description: 'Пополнение счета'
    }
    await txStore.createSystemTransaction(dto)

    emit('completed')
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
          <h2 class="title">Пополнение счета</h2>
          <button class="close-btn" @click="emit('close')">×</button>
        </header>
        <form @submit.prevent="onSubmit" class="modal-form">
          <div class="form-group">
            <label for="cardNumber">Номер карты</label>
            <input
                id="cardNumber"
                v-model="cardNumber"
                type="text"
                maxlength="19"
                placeholder="1234 5678 9012 3456"
                required
            />
          </div>
          <div class="form-group row">
            <div class="form-group small">
              <label for="expiry">Срок действия (MM/YY)</label>
              <input
                  id="expiry"
                  v-model="expiry"
                  type="text"
                  maxlength="5"
                  placeholder="MM/YY"
                  required
              />
            </div>
            <div class="form-group small">
              <label for="cvv">CVV</label>
              <input
                  id="cvv"
                  v-model="cvv"
                  type="password"
                  maxlength="3"
                  placeholder="123"
                  required
              />
            </div>
          </div>
          <div class="form-group">
            <label for="amount">Сумма (руб.)</label>
            <input
                id="amount"
                v-model.number="amount"
                type="number"
                min="1"
                step="0.01"
                required
            />
          </div>
          <button type="submit" class="submit-button" :disabled="loading">
            {{ loading ? 'Пополняем...' : 'Пополнить' }}
          </button>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.small {
  flex: 1;
  margin-right: 0.5rem;
}
.row {
  display: flex;
  gap: 0.5rem;
}
</style>
