import { defineStore } from 'pinia'
import * as cityService from '@/services/city'

export const useCityStore = defineStore('city', {
    state: () => ({
        cities: [],
        selectedCity: null,
        loading: false,
        error: null
    }),
    actions: {
        /**
         * Load all cities
         * @returns {Promise<Array>}
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
         * Load a city by its ID
         * @param {number} id
         * @returns {Promise<Object|null>}
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
         * Load a city by name and region
         * @param {string} name
         * @param {string} region
         * @returns {Promise<Object|null>}
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
         * Load cities by region
         * @param {string} region
         * @returns {Promise<Array>}
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
         * Load cities by name
         * @param {string} name
         * @returns {Promise<Array>}
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
         * Set selected city
         * @param {Object} city
         */
        selectCity(city) {
            this.selectedCity = city
        }
    }
})
