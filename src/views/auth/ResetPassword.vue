<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { verifyResetCode, resetPassword } from '@/services/auth'
import '@/assets/common_styles.css'

const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const router = useRouter()

async function onSubmit() {
  error.value = null

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  loading.value = true
  try {
    await verifyResetCode({ code: code.value })

    await resetPassword({
      verificationCode: code.value,
      newPassword: newPassword.value
    })

    await router.push({name: 'Login'})
  } catch (e) {
    error.value = e.response?.data || e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-wrapper">
    <h1 class="title">Смена пароля</h1>
    <form @submit.prevent="onSubmit" class="form">
      <div class="form-group">
        <label for="code">Код подтверждения</label>
        <input
            id="code"
            v-model="code"
            type="text"
            required
            autocomplete="one-time-code"
        />
      </div>
      <div class="form-group">
        <label for="newPassword">Новый пароль</label>
        <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            required
            autocomplete="new-password"
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Повторите новый пароль</label>
        <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            autocomplete="new-password"
        />
      </div>
      <button type="submit" class="submit-button" :disabled="loading">
        {{ loading ? 'Смена...' : 'Сменить пароль' }}
      </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>