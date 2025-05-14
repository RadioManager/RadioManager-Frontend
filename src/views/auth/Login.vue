<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import '@/assets/common_styles.css'

const userStore = useUserStore()
const router = useRouter()

const form = reactive({
  login: '',
  password: ''
})

const loading = computed(() => userStore.loading)
const error = computed(() => userStore.error)

async function onSubmit() {
  const success = await userStore.doLogin({
    login: form.login,
    password: form.password
  })
  if (success) {
    router.push({ name: 'Home' })
  }
}
</script>

<template>
  <div class="page-wrapper">
    <h1 class="title">Авторизация</h1>
    <form @submit.prevent="onSubmit" class="form">
      <div class="form-group">
        <label for="login">Логин</label>
        <input
            id="login"
            v-model="form.login"
            type="text"
            required
            autocomplete="username"
        />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
        />
      </div>
      <button
          type="submit"
          class="submit-button"
          :disabled="loading"
      >
        {{ loading ? 'Вход...' : 'Авторизоваться' }}
      </button>
    </form>
    <div class="links">
      <router-link to="/register">Регистрация</router-link>
      <router-link to="/forgot-password">Сменить пароль</router-link>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>