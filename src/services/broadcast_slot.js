import api from './http'

/**
 * /**
 * @typedef {object} BroadcastSlotDto
 * @property {number} id
 * @property {string} startTime  // ISO 8601 string
 * @property {string} endTime    // ISO 8601 string
 * @property {'AVAILABLE'|'OCCUPIED'} status
 * @property {number} radioStationId
 */

/**
 * GET all broadcast slots.
 * GET /broadcast-slot
 * @returns {Promise<BroadcastSlotDto[]>}
 */
export async function getAllBroadcastSlots() {
    const response = await api.get('/broadcast-slot')
    return response.data
}

/**
 * GET broadcast slot by ID.
 * GET /broadcast-slot/{id}
 * @param {number} id
 * @returns {Promise<BroadcastSlotDto>}
 */
export async function getBroadcastSlotById(id) {
    const response = await api.get(`/broadcast-slot/${id}`)
    return response.data
}

/**
 * GET broadcast slot by start, end time and station.
 * GET /broadcast-slot/by-time-and-station?startTime={startTime}&endTime={endTime}&radioStationId={radioStationId}
 * @param {string} startTime ISO 8601
 * @param {string} endTime ISO 8601
 * @param {number} radioStationId
 * @returns {Promise<BroadcastSlotDto>}
 */
export async function getBroadcastSlotByTimeAndStation(startTime, endTime, radioStationId) {
    const response = await api.get('/broadcast-slot/by-time-and-station', { params: { startTime, endTime, radioStationId } })
    return response.data
}

/**
 * GET broadcast slots by status.
 * GET /broadcast-slot/by-status/{status}
 * @param {'AVAILABLE'|'OCCUPIED'} status
 * @returns {Promise<BroadcastSlotDto[]>}
 */
export async function getBroadcastSlotsByStatus(status) {
    const response = await api.get(`/broadcast-slot/by-status/${status}`)
    return response.data
}

/**
 * GET broadcast slot by time.
 * GET /broadcast-slot/by-time?startTime={startTime}&endTime={endTime}
 * @param {string} startTime
 * @param {string} endTime
 * @returns {Promise<BroadcastSlotDto>}
 */
export async function getBroadcastSlotByTime(startTime, endTime) {
    const response = await api.get('/broadcast-slot/by-time', { params: { startTime, endTime } })
    return response.data
}

/**
 * GET slots for station after start time.
 * GET /broadcast-slot/station/{radioStationId}/after?startTime={startTime}
 * @param {number} radioStationId
 * @param {string} startTime
 * @returns {Promise<BroadcastSlotDto[]>}
 */
export async function getSlotsAfterStartTime(radioStationId, startTime) {
    const response = await api.get(`/broadcast-slot/station/${radioStationId}/after`, { params: { startTime } })
    return response.data
}

/**
 * GET slots by status after start time.
 * GET /broadcast-slot/station/{radioStationId}/by-status-after?status={status}&startTime={startTime}
 * @param {number} radioStationId
 * @param {'AVAILABLE'|'OCCUPIED'} status
 * @param {string} startTime
 * @returns {Promise<BroadcastSlotDto[]>}
 */
export async function getSlotsByStatusAfter(radioStationId, status, startTime) {
    const response = await api.get(`/broadcast-slot/station/${radioStationId}/by-status-after`, { params: { status, startTime } })
    return response.data
}

/**
 * GET all slots for a radio station.
 * GET /broadcast-slot/station/{radioStationId}
 * @param {number} radioStationId
 * @returns {Promise<BroadcastSlotDto[]>}
 */
export async function getSlotsByRadioStation(radioStationId) {
    const response = await api.get(`/broadcast-slot/station/${radioStationId}`)
    return response.data
}

/**
 * GET slots by station and status.
 * GET /broadcast-slot/station/{radioStationId}/status/{status}
 * @param {number} radioStationId
 * @param {'AVAILABLE'|'OCCUPIED'} status
 * @returns {Promise<BroadcastSlotDto[]>}
 */
export async function getSlotsByStationAndStatus(radioStationId, status) {
    const response = await api.get(`/broadcast-slot/station/${radioStationId}/status/${status}`)
    return response.data
}

/**
 * GET available slots by priority for a station.
 * GET /broadcast-slot/station/{radioStationId}/available?highPriority={highPriority}
 * @param {number} radioStationId
 * @param {boolean} highPriority
 * @returns {Promise<BroadcastSlotDto[]>}
 */
export async function getAvailableSlotsByPriority(radioStationId, highPriority) {
    const response = await api.get(`/broadcast-slot/station/${radioStationId}/available`, { params: { highPriority } })
    return response.data
}

/**
 * Bulk create slots from Excel file.
 * POST /broadcast-slot/excel with form data { file, radioStationId }.
 * @param {File} file
 * @param {number} radioStationId
 * @returns {Promise<BroadcastSlotDto[]>}
 */
export async function createSlotsFromExcel(file, radioStationId) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('radioStationId', radioStationId)
    const response = await api.post('/broadcast-slot/excel', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return response.data
}

/**
 * Create a new broadcast slot.
 * POST /broadcast-slot with BroadcastSlotDto.
 * @param {BroadcastSlotDto} slotDto
 * @returns {Promise<BroadcastSlotDto>}
 */
export async function createBroadcastSlot(slotDto) {
    const response = await api.post('/broadcast-slot', slotDto)
    return response.data
}

/**
 * Update an existing broadcast slot.
 * PUT /broadcast-slot with BroadcastSlotDto.
 * @param {BroadcastSlotDto} slotDto
 * @returns {Promise<BroadcastSlotDto>}
 */
export async function updateBroadcastSlot(slotDto) {
    const response = await api.put('/broadcast-slot', slotDto)
    return response.data
}

/**
 * Delete a broadcast slot by ID.
 * DELETE /broadcast-slot/{id}
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteBroadcastSlot(id) {
    await api.delete(`/broadcast-slot/${id}`)
}

/**
 * Delete slots after start time for a station.
 * DELETE /broadcast-slot/station/{radioStationId}/after?startTime={startTime}
 * @param {number} radioStationId
 * @param {string} startTime
 * @returns {Promise<void>}
 */
export async function deleteSlotsAfterStartTime(radioStationId, startTime) {
    await api.delete(`/broadcast-slot/station/${radioStationId}/after`, { params: { startTime } })
}

/**
 * Update slot status.
 * PUT /broadcast-slot/{id}/status?status={status}
 * @param {number} id
 * @param {'AVAILABLE'|'OCCUPIED'} status
 * @returns {Promise<BroadcastSlotDto>}
 */
export async function updateSlotStatus(id, status) {
    const response = await api.put(`/broadcast-slot/${id}/status`, null, { params: { status } })
    return response.data
}

/**
 * Update slot end time.
 * PUT /broadcast-slot/{id}/end-time?endTime={endTime}
 * @param {number} id
 * @param {string} endTime
 * @returns {Promise<BroadcastSlotDto>}
 */
export async function updateSlotEndTime(id, endTime) {
    const response = await api.put(`/broadcast-slot/${id}/end-time`, null, { params: { endTime } })
    return response.data
}

/**
 * Split a broadcast slot.
 * POST /broadcast-slot/split?slotId={slotId}&audioId={audioId}
 * @param {number} slotId
 * @param {number} audioId
 * @returns {Promise<BroadcastSlotDto>}
 */
export async function splitBroadcastSlot(slotId, audioId) {
    const response = await api.post('/broadcast-slot/split', null, { params: { slotId, audioId } })
    return response.data
}

/**
 * Get slots by month.
 * GET /broadcast-slot/by-month?year={year}&month={month}
 * @param {number} year
 * @param {number} month
 * @returns {Promise<BroadcastSlotDto[]>}
 */
export async function getSlotsByMonth(year, month) {
    const response = await api.get('/broadcast-slot/by-month', { params: { year, month } })
    return response.data
}
