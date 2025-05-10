<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import '@/assets/common_styles.css'

const userStore = useUserStore()
const userName = computed(() => userStore.profile?.name || '')
</script>

<template>
  <div class="page-wrapper home-page">
    <h1 class="title welcome-text">
      Добро пожаловать, {{ userName }}!
    </h1>
    <p class="subtitle">
      Добро пожаловать на сайт для управления радиовещанием.
    </p>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 600px;
}
.welcome-text {
  font-size: 2.5rem;
  text-align: center;
  color: var()
}
.subtitle {
  margin-top: 1rem;
  font-size: 1.25rem;
  color: var(--color-heading);
  text-align: center;
}
</style>