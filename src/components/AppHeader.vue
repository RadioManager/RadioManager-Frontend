<template>
  <nav class="app-header">
    <router-link to="/home" class="nav-link">Home</router-link>
    <router-link to="/slots" class="nav-link">Slots</router-link>
    <router-link
        v-if="isAdminOrAdvertiser"
        to="/audio"
        class="nav-link"
    >
      Audio
    </router-link>
    <router-link to="/profile" class="nav-link">Profile</router-link>
    <button class="logout-button" @click="$emit('logout')">Logout</button>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore()

// Only show "Audio" link for ADMIN or ADVERTISER roles
const isAdminOrAdvertiser = computed(
    () => ['ADMIN', 'ADVERTISER'].includes(userStore.profile?.role)
)
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
}

.nav-link {
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
}

.nav-link.router-link-active {
  font-weight: bold;
  color: #007acc;
}

.logout-button {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 1rem;
}

.logout-button:hover {
  text-decoration: underline;
}
</style>
