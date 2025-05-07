import { defineStore } from 'pinia'
import * as cityService from '@/services/city'

export const useCityStore = defineStore('city', {
    state: () => ({
        cities: [],         // список всех городов
        selectedCity: null, // выбранный город
        loading: false,     // флаг загрузки
        error: null         // сообщение об ошибке
    }),
    actions: {
        /**
         * Загрузить все города
         */
        async loadAllCities() {
            this.loading = true
            this.error = null
            try {
                this.cities = await cityService.getAllCities()
                return this.cities
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Загрузить город по ID
         * @param {number} id
         */
        async loadCityById(id) {
            this.loading = true
            this.error = null
            try {
                const city = await cityService.getCityById(id)
                this.selectedCity = city
                return city
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Загрузить город по имени и региону
         * @param {string} name
         * @param {string} region
         */
        async loadCityByNameAndRegion(name, region) {
            this.loading = true
            this.error = null
            try {
                const city = await cityService.getCityByNameAndRegion(name, region)
                this.selectedCity = city
                return city
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Загрузить города по региону
         * @param {string} region
         */
        async loadCitiesByRegion(region) {
            this.loading = true
            this.error = null
            try {
                this.cities = await cityService.getCitiesByRegion(region)
                return this.cities
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Загрузить города по имени
         * @param {string} name
         */
        async loadCitiesByName(name) {
            this.loading = true
            this.error = null
            try {
                this.cities = await cityService.getCitiesByName(name)
                return this.cities
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Установить выбранный город
         * @param {object} city
         */
        selectCity(city) {
            this.selectedCity = city
        }
    }
})
