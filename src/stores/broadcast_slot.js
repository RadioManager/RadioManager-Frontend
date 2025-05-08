import { defineStore } from 'pinia'
import * as broadcastSlotService from '@/services/broadcast_slot'

export const useBroadcastSlotStore = defineStore('broadcastSlot', {
    state: () => ({
        slots: [],
        selectedSlot: null,
        loading: false,
        error: null
    }),
    actions: {
        /**
         * Load all broadcast slots
         * @returns {Promise<Array>}
         */
        async loadAllSlots() {
            this.loading = true
            this.error = null
            try {
                this.slots = await broadcastSlotService.getAllBroadcastSlots()
                return this.slots
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load a slot by its ID
         * @param {number} id
         * @returns {Promise<Object|null>}
         */
        async loadSlotById(id) {
            this.loading = true
            this.error = null
            try {
                const slot = await broadcastSlotService.getBroadcastSlotById(id)
                this.selectedSlot = slot
                return slot
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Load slots by radio station ID
         * @param {number} stationId
         * @returns {Promise<Array>}
         */
        async loadSlotsByRadioStation(stationId) {
            this.loading = true
            this.error = null
            try {
                this.slots = await broadcastSlotService.getSlotsByRadioStation(stationId)
                return this.slots
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load slots by status
         * @param {'AVAILABLE'|'OCCUPIED'} status
         * @returns {Promise<Array>}
         */
        async loadSlotsByStatus(status) {
            this.loading = true
            this.error = null
            try {
                this.slots = await broadcastSlotService.getBroadcastSlotsByStatus(status)
                return this.slots
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load slots after a start time for a station
         * @param {number} stationId
         * @param {string} startTime ISO 8601 string
         * @returns {Promise<Array>}
         */
        async loadSlotsAfterStartTime(stationId, startTime) {
            this.loading = true
            this.error = null
            try {
                this.slots = await broadcastSlotService.getSlotsAfterStartTime(stationId, startTime)
                return this.slots
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load available slots by priority for a station
         * @param {number} stationId
         * @param {boolean} highPriority
         * @returns {Promise<Array>}
         */
        async loadAvailableSlotsByPriority(stationId, highPriority) {
            this.loading = true
            this.error = null
            try {
                this.slots = await broadcastSlotService.getAvailableSlotsByPriority(stationId, highPriority)
                return this.slots
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load slots by month
         * @param {number} year
         * @param {number} month
         * @returns {Promise<Array>}
         */
        async loadSlotsByMonth(year, month) {
            this.loading = true
            this.error = null
            try {
                this.slots = await broadcastSlotService.getSlotsByMonth(year, month)
                return this.slots
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Create broadcast slots from Excel file
         * @param {File} file
         * @param {number} stationId
         * @returns {Promise<Array>}
         */
        async createSlotsFromExcel(file, stationId) {
            this.loading = true
            this.error = null
            try {
                const newSlots = await broadcastSlotService.createSlotsFromExcel(file, stationId)
                this.slots = newSlots
                return newSlots
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Create a new broadcast slot
         * @param {Object} slotDto
         * @returns {Promise<Object|null>}
         */
        async createSlot(slotDto) {
            this.loading = true
            this.error = null
            try {
                const slot = await broadcastSlotService.createBroadcastSlot(slotDto)
                this.slots.push(slot)
                return slot
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Update an existing broadcast slot
         * @param {Object} slotDto
         * @returns {Promise<Object|null>}
         */
        async updateSlot(slotDto) {
            this.loading = true
            this.error = null
            try {
                const updated = await broadcastSlotService.updateBroadcastSlot(slotDto)
                const idx = this.slots.findIndex(s => s.id === updated.id)
                if (idx >= 0) this.slots.splice(idx, 1, updated)
                return updated
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Delete a broadcast slot by ID
         * @param {number} id
         */
        async deleteSlot(id) {
            this.loading = true
            this.error = null
            try {
                await broadcastSlotService.deleteBroadcastSlot(id)
                this.slots = this.slots.filter(s => s.id !== id)
            } catch (e) {
                this.error = e.response?.data || e.message
            } finally {
                this.loading = false
            }
        },
        /**
         * Update slot status
         * @param {number} id
         * @param {'AVAILABLE'|'OCCUPIED'} status
         * @returns {Promise<Object|null>}
         */
        async updateSlotStatus(id, status) {
            this.loading = true
            this.error = null
            try {
                const slot = await broadcastSlotService.updateSlotStatus(id, status)
                const idx = this.slots.findIndex(s => s.id === slot.id)
                if (idx >= 0) this.slots.splice(idx, 1, slot)
                return slot
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Update slot end time
         * @param {number} id
         * @param {string} endTime
         * @returns {Promise<Object|null>}
         */
        async updateSlotEndTime(id, endTime) {
            this.loading = true
            this.error = null
            try {
                const slot = await broadcastSlotService.updateSlotEndTime(id, endTime)
                const idx = this.slots.findIndex(s => s.id === slot.id)
                if (idx >= 0) this.slots.splice(idx, 1, slot)
                return slot
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Split a broadcast slot
         * @param {number} slotId
         * @param {number} audioId
         * @returns {Promise<Object|null>}
         */
        async splitSlot(slotId, audioId) {
            this.loading = true
            this.error = null
            try {
                const slot = await broadcastSlotService.splitBroadcastSlot(slotId, audioId)
                const idx = this.slots.findIndex(s => s.id === slot.id)
                if (idx >= 0) this.slots.splice(idx, 1, slot)
                return slot
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Delete slots after a start time for a station
         * @param {number} stationId
         * @param {string} startTime
         */
        async deleteSlotsAfterStartTime(stationId, startTime) {
            this.loading = true
            this.error = null
            try {
                await broadcastSlotService.deleteSlotsAfterStartTime(stationId, startTime)
                this.slots = this.slots.filter(s => s.radioStationId !== stationId || s.startTime <= startTime)
            } catch (e) {
                this.error = e.response?.data || e.message
            } finally {
                this.loading = false
            }
        },
        /**
         * Select a broadcast slot
         * @param {Object} slot
         */
        selectSlot(slot) {
            this.selectedSlot = slot
        }
    }
})
