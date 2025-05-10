<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { sendPasswordResetCode } from '@/services/auth'
import '@/assets/common_styles.css'

const email = ref('')
const loading = ref(false)
const error = ref(null)
const router = useRouter()

async function onSubmit() {
  loading.value = true
  error.value = null
  try {
    await sendPasswordResetCode({ email: email.value })
    // after successful request, navigate to reset-password page
    await router.push({name: 'ResetPassword', query: {email: email.value}})
  } catch (e) {
    error.value = e.response?.data || e.message
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <div class="page-wrapper">
    <h1 class="title">Сброс пароля</h1>
    <form @submit.prevent="onSubmit" class="form">
      <div class="form-group">
        <label for="email">Email</label>
        <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
        />
      </div>
      <button type="submit" class="submit-button" :disabled="loading">
        {{ loading ? 'Отправка...' : 'Отправить код' }}
      </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>