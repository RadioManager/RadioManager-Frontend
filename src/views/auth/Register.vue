<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import CreateStationModal from '@/components/CreateStationModal.vue'
import '@/assets/common_styles.css'

const userStore = useUserStore()
const router = useRouter()

// form state
const form = reactive({
  login: '',
  password: '',
  confirmPassword: '',
  name: '',
  surname: '',
  role: ''
})

const loading = ref(false)
const error = ref(null)
const showStationModal = ref(false)

async function onSubmit() {
  error.value = null
  if (form.password !== form.confirmPassword) {
    error.value = 'Пароли не совпадают'
    return
  }
  loading.value = true
  try {
    // 1) Register
    const userDto = {
      id: 0,
      login: form.login,
      password: form.password,
      name: form.name,
      surname: form.surname,
      balance: 0,
      role: form.role
    }
    const registered = await userStore.doRegister(userDto)
    if (!registered) return

    // 2) Auto-login
    await userStore.doLogin({ login: form.login, password: form.password })

    // 3) Navigate or open modal
    if (form.role === 'RADIO_REPRESENTATIVE') {
      showStationModal.value = true
    } else {
      await router.push({name: 'Home'})
    }
  } catch (e) {
    error.value = e.response?.data || e.message
  } finally {
    loading.value = false
  }
}

function onStationCreated() {
  showStationModal.value = false
  router.push({ name: 'Home' })
}
function onModalClose() {
  showStationModal.value = false
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="page-wrapper">
    <h1 class="title">Регистрация</h1>
    <form @submit.prevent="onSubmit" class="form">
      <!-- Поля email, пароль, подтверждение, имя, фамилия, роль -->
      <div class="form-group">
        <label for="login">Email (логин)</label>
        <input id="login" v-model="form.login" type="email" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Повторите пароль</label>
        <input id="confirmPassword" v-model="form.confirmPassword" type="password" required />
      </div>
      <div class="form-group">
        <label for="name">Имя</label>
        <input id="name" v-model="form.name" type="text" required />
      </div>
      <div class="form-group">
        <label for="surname">Фамилия</label>
        <input id="surname" v-model="form.surname" type="text" required />
      </div>
      <div class="form-group">
        <label>Роль</label>
        <select v-model="form.role" required>
          <option disabled value="">-- Выберите роль --</option>
          <option value="ADVERTISER">Рекламодатель</option>
          <option value="RADIO_REPRESENTATIVE">Представитель станции</option>
        </select>
      </div>
      <button type="submit" class="submit-button" :disabled="loading">
        {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Вызов модалки для представителя -->
    <CreateStationModal
        v-if="showStationModal"
        @close="onModalClose"
        @created="onStationCreated"
    />
  </div>
</template>