<template>
  <nav class="app-header">
    <div class="nav-links">
      <router-link to="/home" class="nav-link">Главная</router-link>
      <router-link to="/slots" class="nav-link">Слоты</router-link>
      <router-link v-if="isAdminOrAdvertiser" to="/audio" class="nav-link">Аудио</router-link>
      <router-link to="/profile" class="nav-link">Профиль</router-link>
    </div>
    <button class="logout-button" @click="$emit('logout')">Выход</button>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore()

const isAdminOrAdvertiser = computed(
    () => ['ADMIN', 'ADVERTISER'].includes(userStore.profile?.role)
)
</script>

<style scoped>
body {
  margin: 0;
  padding-top: 60px;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  padding: 0 2rem;
  background-color: var(--color-background-soft);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--color-heading);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link.router-link-active {
  font-weight: bold;
  color: var(--color-primary-button);
}

/* Кнопка выхода */
.logout-button {
  background: none;
  border: none;
  color: var(--color-heading);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.logout-button:hover {
  background-color: var(--color-primary-button-hover);
  color: #ffffff;
}
</style>
