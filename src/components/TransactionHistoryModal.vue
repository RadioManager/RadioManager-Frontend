<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useTransactionStore } from '@/stores/transaction'
import { formatDate } from '@/utils/date'

const emit = defineEmits(['close'])
const userStore = useUserStore()
const txStore = useTransactionStore()

const transactions = ref([])

const profile = computed(() => userStore.profile || {})

onMounted(async () => {
  if (profile.value.role === 'ADMIN') {

    const forUser = await txStore.loadTransactionsByUserId(profile.value.id)

    const byAdmin = await txStore.loadTransactionsByAdminId(profile.value.id)
    transactions.value = [...forUser, ...byAdmin]
  } else {
    transactions.value = await txStore.loadTransactionsByUserId(profile.value.id)
  }
})


function getExecutorName(adminId) {
  return adminId === 1 ? 'Система' : `Админ с ID ${adminId}`
}
</script>

<template>
  <teleport to="body">
    <div class="modal-backdrop">
      <div class="modal modal-his">
        <header class="modal-header">
          <h2 class="title">История транзакций</h2>
          <button class="close-btn" @click="emit('close')">×</button>
        </header>
        <div class="transaction-list">
          <table>
            <thead>
            <tr>
              <th class="header-cell">Исполнитель</th>
              <th class="header-cell nowrap">Сумма (₽)</th>
              <th class="header-cell">Описание</th>
              <th class="header-cell nowrap">Время</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="tx in transactions" :key="tx.id">
              <td class="nowrap">{{ getExecutorName(tx.adminId) }}</td>
              <td class="nowrap">{{ tx.amount.toFixed(2) }}</td>
              <td class="description">{{ tx.description }}</td>
              <td class="nowrap">{{ formatDate(tx.transactionDate) }}</td>
            </tr>
            </tbody>
          </table>
          <p v-if="transactions.length === 0" class="no-data">Нет транзакций</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-his {
  max-width: 90vw;
  width: auto;
  overflow-x: auto;
}

.transaction-list {
  overflow-x: auto;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid var(--color-border);
}

th, td {
  padding: 0.5rem;
  border: 2px solid var(--color-border);
  text-align: left;
  font-size: 1.1rem;
  color: var(--color-heading);
}

.header-cell {
  font-weight: 600;
  color: var(--color-heading);
}

.nowrap {
  white-space: nowrap;
}

.description {
  white-space: normal;
}

.no-data {
  text-align: center;
  margin-top: 1rem;
  color: var(--color-heading);
}

</style>