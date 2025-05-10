<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import {useRoute, useRouter} from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)
const router = useRouter()
const route = useRoute()

const authPages = ['Login','Register','ForgotPassword','ResetPassword']
const showHeader = computed(() =>
    userStore.isAuth && !authPages.includes(route.name)
)

function onLogout() {
  userStore.doLogout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div id="app">
    <!-- Show header only when authenticated -->
    <AppHeader v-if="showHeader" @logout="onLogout" />

    <!-- Route outlet: renders Login, Home, etc. -->
    <router-view />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
