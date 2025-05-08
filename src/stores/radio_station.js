import { defineStore } from 'pinia'
import * as radioStationService from '@/services/radioStation'

export const useRadioStationStore = defineStore('radioStation', {
    state: () => ({
        stations: [],
        selectedStation: null,
        loading: false,
        error: null
    }),
    actions: {
        /**
         * Load all radio stations
         * @returns {Promise<Array>}
         */
        async loadAllStations() {
            this.loading = true
            this.error = null
            try {
                this.stations = await radioStationService.getAllRadioStations()
                return this.stations
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load a radio station by its ID
         * @param {number} id
         * @returns {Promise<Object|null>}
         */
        async loadStationById(id) {
            this.loading = true
            this.error = null
            try {
                const station = await radioStationService.getRadioStationById(id)
                this.selectedStation = station
                return station
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Load a radio station by representative ID
         * @param {number} repId
         * @returns {Promise<Object|null>}
         */
        async loadStationByRepresentativeId(repId) {
            this.loading = true
            this.error = null
            try {
                const station = await radioStationService.getRadioStationByRepresentativeId(repId)
                this.selectedStation = station
                return station
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Load radio stations by name
         * @param {string} name
         * @returns {Promise<Array>}
         */
        async loadStationsByName(name) {
            this.loading = true
            this.error = null
            try {
                this.stations = await radioStationService.getRadioStationByName(name)
                return this.stations
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load radio stations by frequency
         * @param {number} frequency
         * @returns {Promise<Array>}
         */
        async loadStationsByFrequency(frequency) {
            this.loading = true
            this.error = null
            try {
                this.stations = await radioStationService.getRadioStationsByFrequency(frequency)
                return this.stations
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load radio stations by city ID
         * @param {number} cityId
         * @returns {Promise<Array>}
         */
        async loadStationsByCityId(cityId) {
            this.loading = true
            this.error = null
            try {
                this.stations = await radioStationService.getRadioStationsByCityId(cityId)
                return this.stations
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Select a radio station
         * @param {Object} station
         */
        selectStation(station) {
            this.selectedStation = station
        },
        /**
         * Create a new radio station (for RADIO_REPRESENTATIVE or ADMIN)
         * @param {Object} stationDto
         * @returns {Promise<Object|null>}
         */
        async createStation(stationDto) {
            this.loading = true
            this.error = null
            try {
                const station = await radioStationService.createRadioStation(stationDto)
                // For representative, keep only their station
                this.stations = [station]
                this.selectedStation = station
                return station
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        }
    }
})