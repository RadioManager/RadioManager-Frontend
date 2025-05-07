// src/stores/user.js
import {defineStore} from 'pinia'
import * as authService from '@/services/auth'

export const useUserStore = defineStore('user', {
    state: () => ({
        profile: null,
        isAuth: false,
        loading: false,
        error: null,
    }),
    actions: {
        // Авторизация
        async doLogin({ login, password }) {
            this.loading = true
            this.error = null
            try {
                this.profile = await authService.login({login, password})
                this.isAuth = true
                return true
            } catch (e) {
                this.error = e.response?.data || e.message
                this.profile = null
                this.isAuth = false
                return false
            } finally {
                this.loading = false
            }
        },
        // Регистрация
        async doRegister(userDto) {
            this.loading = true
            this.error = null
            try {
                await authService.register(userDto)
                return true
            } catch (e) {
                this.error = e.response?.data || e.message
                return false
            } finally {
                this.loading = false
            }
        },
        // Выход
        async doLogout() {
            this.loading = true
            try {
                await authService.logout()
            } catch {
            } finally {
                this.profile = null
                this.isAuth = false
                this.loading = false
            }
        },
    }
})
