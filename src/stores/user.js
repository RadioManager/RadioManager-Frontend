import { defineStore } from 'pinia'
import api from '@/services/http'

export const useUserStore = defineStore('user', {
    state: () => ({profile: null, isAuth: false, loading: false, error: null}),
    actions: {

    }
})