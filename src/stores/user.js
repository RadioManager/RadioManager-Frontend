import {defineStore} from 'pinia'
import * as authService from '@/services/auth'
import * as userService from '@/services/user'

export const useUserStore = defineStore('user', {
    state: () => ({
        profile: null,
        isAuth: false,
        loading: false,
        error: null,
    }),
    actions: {
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
        async updateUserBalance(balance) {
            this.loading = true
            this.error = null
            try {
                const userId = this.profile?.id
                if (!userId) {
                    throw new Error('User not authenticated')
                }
                await userService.updateUserBalance(userId, balance)
                // Update balance in local state
                this.profile.balance = balance
                return true
            } catch (e) {
                this.error = e.response?.data || e.message
                return false
            } finally {
                this.loading = false
            }
        },
    }
})
