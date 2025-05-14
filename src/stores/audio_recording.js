import { defineStore } from 'pinia'
import * as audioService from '@/services/audio_recording'
import {useUserStore} from "@/stores/user.js";

export const useAudioRecordingStore = defineStore('audioRecording', {
    state: () => ({
        recordings: [],
        selectedRecording: null,
        loading: false,
        error: null
    }),
    actions: {
        /**
         * Load all audio recordings
         * @returns {Promise<Array>}
         */
        async loadAllRecordings() {
            this.loading = true
            this.error = null
            try {
                this.recordings = await audioService.getAllAudioRecordings()
                return this.recordings
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load a recording by its ID (includes file content)
         * @param {number} id
         * @returns {Promise<Object|null>}
         */
        async loadRecordingById(id) {
            this.loading = true
            this.error = null
            try {
                const rec = await audioService.getAudioRecordingById(id)
                this.selectedRecording = rec
                return rec
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Load recordings for a specific user
         * @param {number} userId
         * @returns {Promise<Array>}
         */
        async loadRecordingsByUser(userId) {
            this.loading = true
            this.error = null
            try {
                this.recordings = await audioService.getRecordingsByUserId(userId)
                return this.recordings
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load recordings by approval status
         * @param {'APPROVED'|'PENDING'|'REJECTED'} status
         * @returns {Promise<Array>}
         */
        async loadRecordingsByStatus(status) {
            this.loading = true
            this.error = null
            try {
                this.recordings = await audioService.getRecordingsByStatus(status)
                return this.recordings
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Create a new audio recording (upload file)
         * @param {File} file
         * @returns {Promise<Object|null>}
         */
        async createRecording(file) {
            this.loading = true
            this.error = null
            try {
                const rec = await audioService.createAudioRecording(file)
                this.recordings.push(rec)
                return rec
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Update an existing audio recording
         * @param {Object} recDto
         * @returns {Promise<Object|null>}
         */
        async updateRecording(recDto) {
            this.loading = true
            this.error = null
            try {
                const updated = await audioService.updateAudioRecording(recDto)
                const idx = this.recordings.findIndex(r => r.recording.id === updated.id)
                if (idx >= 0) this.recordings.splice(idx, 1, updated)
                return updated
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Delete a recording by its ID
         * @param {number} id
         */
        async deleteRecording(id) {
            this.loading = true
            this.error = null
            try {
                await audioService.deleteAudioRecording(id)
                this.recordings = this.recordings.filter(r => r.recording.id !== id)
            } catch (e) {
                this.error = e.response?.data || e.message
            } finally {
                this.loading = false
            }
        },
        /**
         * Update approval status of a recording
         * @param {number} id
         * @param {'APPROVED'|'PENDING'|'REJECTED'} status
         * @returns {Promise<Object|null>}
         */
        async updateRecordingStatus(id, status) {
            this.loading = true
            this.error = null
            try {
                const rec = await audioService.updateAudioRecordingStatus(id, status)
                const idx = this.recordings.findIndex(r => r.recording.id === rec.id)
                if (idx >= 0) this.recordings.splice(idx, 1, rec)
                return rec
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Select a specific recording
         * @param {Object} rec
         */
        selectRecording(rec) {
            this.selectedRecording = rec
        },
        /**
         * Load approved recordings: for ADMIN all approved, for others only their own
         */
        async loadAllowedRecordings() {
            this.loading = true
            this.error = null
            try {
                const userStore = useUserStore()
                // get all approved recordings
                const approved = await audioService.getRecordingsByStatus('APPROVED')
                if (userStore.profile?.role === 'ADMIN') {
                    this.recordings = approved
                } else {
                    // only recordings owned by user
                    this.recordings = approved.filter(r => r.recording.userId === userStore.profile.id)
                }
                return this.recordings
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
    }
})
