import api from './http'

/**
 * @typedef {object} AudioRecordingDto
 * @property {number} id
 * @property {number} userId
 * @property {number} duration
 * @property {number} cost
 * @property {'APPROVED'|'PENDING'|'REJECTED'} approvalStatus
 * @property {string} filePath
 */

/**
 * @typedef {object} CombinedAudioRecordingResponseDto
 * @property {AudioRecordingDto} recording
 * @property {string} fileContentBase64
 */

/**
 * Get all audio recordings (ADMIN only).
 * GET /audio-recording
 * @returns {Promise<AudioRecordingDto[]>}
 */
export async function getAllAudioRecordings() {
    const response = await api.get('/audio-recording')
    return response.data
}

/**
 * Get an audio recording by ID, including base64 file content.
 * GET /audio-recording/{id}
 * @param {number} id
 * @returns {Promise<CombinedAudioRecordingResponseDto>}
 */
export async function getAudioRecordingById(id) {
    const response = await api.get(`/audio-recording/${id}`)
    return response.data
}

/**
 * Get recordings by user ID (authenticated).
 * GET /audio-recording/user/{userId}
 * @param {number} userId
 * @returns {Promise<AudioRecordingDto[]>}
 */
export async function getRecordingsByUserId(userId) {
    const response = await api.get(`/audio-recording/user/${userId}`)
    return response.data
}

/**
 * Get recordings by approval status (ADMIN only).
 * GET /audio-recording/status/{status}
 * @param {'APPROVED'|'PENDING'|'REJECTED'} status
 * @returns {Promise<AudioRecordingDto[]>}
 */
export async function getRecordingsByStatus(status) {
    const response = await api.get(`/audio-recording/status/${status}`)
    return response.data
}

/**
 * Get recordings by status and user ID (ADMIN only).
 * GET /audio-recording/status_user with headers: approvalStatus and userId
 * @param {'APPROVED'|'PENDING'|'REJECTED'} status
 * @param {number} userId
 * @returns {Promise<AudioRecordingDto[]>}
 */
export async function getRecordingsByStatusAndUserId(status, userId) {
    const response = await api.get('/audio-recording/status_user', {
        headers: { approvalStatus: status, userId }
    })
    return response.data
}

/**
 * Create a new audio recording (ADVERTISER, ADMIN).
 * Uploads file and returns created AudioRecordingDto.
 * POST /audio-recording with formData { file }
 * @param {File} file
 * @returns {Promise<AudioRecordingDto>}
 */
export async function createAudioRecording(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/audio-recording', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

/**
 * Update an existing audio recording (ADMIN).
 * PUT /audio-recording
 * @param {AudioRecordingDto} recordingDto
 * @returns {Promise<AudioRecordingDto>}
 */
export async function updateAudioRecording(recordingDto) {
    const response = await api.put('/audio-recording', recordingDto)
    return response.data
}

/**
 * Delete an audio recording by ID (ADVERTISER, ADMIN).
 * DELETE /audio-recording/{id}
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteAudioRecording(id) {
    await api.delete(`/audio-recording/${id}`)
}

/**
 * Update approval status of an audio recording (ADMIN).
 * PUT /audio-recording/{id}/status?status={status}
 * @param {number} id
 * @param {'APPROVED'|'PENDING'|'REJECTED'} status
 * @returns {Promise<AudioRecordingDto>}
 */
export async function updateAudioRecordingStatus(id, status) {
    const response = await api.put(`/audio-recording/${id}/status`, null, { params: { status } })
    return response.data
}

/**
 * Download audio file as Blob (authenticated).
 * GET /audio-recording/{id}/download
 * @param {number} id
 * @returns {Promise<Blob>}
 */
export async function downloadAudioRecording(id) {
    const response = await api.get(`/audio-recording/${id}/download`, { responseType: 'blob' })
    return response.data
}
