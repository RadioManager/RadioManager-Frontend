import { defineStore } from 'pinia'
import * as placementService from '@/services/placement'

export const usePlacementStore = defineStore('placement', {
    state: () => ({
        placements: [],
        selectedPlacement: null,
        loading: false,
        error: null
    }),
    actions: {
        /**
         * Load all placements (ADMIN)
         * @returns {Promise<Array>}
         */
        async loadAllPlacements() {
            this.loading = true
            this.error = null
            try {
                this.placements = await placementService.getAllPlacements()
                return this.placements
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },

        /**
         * Load placement by its ID
         * @param {number} id
         * @returns {Promise<Object|null>}
         */
        async loadPlacementById(id) {
            this.loading = true
            this.error = null
            try {
                const p = await placementService.getPlacementByBroadcastSlotId(id)
                this.selectedPlacement = p
                return p
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },

        /**
         * Load placements for an array of slots (no extra slot fetch call needed)
         * @param {Array<Object>} slots - preloaded broadcastSlot objects
         * @returns {Promise<Array>}
         */
        async loadPlacementsFromSlots(slots) {
            this.loading = true
            this.error = null
            try {
                const promises = slots.map(slot =>
                    placementService.getPlacementByBroadcastSlotId(slot.id)
                        .catch(() => null)
                )
                const results = await Promise.all(promises)
                this.placements = results.filter(p => p)
                return this.placements
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },

        /**
         * Create a new placement
         * @param {Object} dto
         * @returns {Promise<Object|null>}
         */
        async createPlacement(dto) {
            this.loading = true
            this.error = null
            try {
                const p = await placementService.createPlacement(dto)
                this.placements.push(p)
                this.selectedPlacement = p
                return p
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },

        /**
         * Update an existing placement
         * @param {Object} dto
         * @returns {Promise<Object|null>}
         */
        async updatePlacement(dto) {
            this.loading = true
            this.error = null
            try {
                const updated = await placementService.updatePlacement(dto)
                const idx = this.placements.findIndex(p => p.id === updated.id)
                if (idx >= 0) this.placements.splice(idx, 1, updated)
                this.selectedPlacement = updated
                return updated
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },

        /**
         * Delete a placement by ID
         * @param {number} id
         */
        async deletePlacement(id) {
            this.loading = true
            this.error = null
            try {
                await placementService.deletePlacement(id)
                this.placements = this.placements.filter(p => p.id !== id)
            } catch (e) {
                this.error = e.response?.data || e.message
            } finally {
                this.loading = false
            }
        },

        /**
         * Select a placement for interface
         * @param {Object} p
         */
        selectPlacement(p) {
            this.selectedPlacement = p
        }
    }
})
