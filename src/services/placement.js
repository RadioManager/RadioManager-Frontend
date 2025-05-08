import api from './http'

/**
 * @typedef {object} PlacementDto
 * @property {number} id
 * @property {number} broadcastSlotId
 * @property {number} audioRecordingId
 * @property {string} placementDate  // ISO 8601 string
 */

/**
 * Get all placements (ADMIN only).
 * GET /placement
 * @returns {Promise<PlacementDto[]>}
 */
export async function getAllPlacements() {
    const response = await api.get('/placement')
    return response.data
}

/**
 * Get a placement by its ID (authenticated).
 * GET /placement/{id}
 * @param {number} id
 * @returns {Promise<PlacementDto>}
 */
export async function getPlacementById(id) {
    const response = await api.get(`/placement/${id}`)
    return response.data
}

/**
 * Get placements by placement date (authenticated).
 * GET /placement/by-date?date={ISO_DATE}
 * @param {string} date  ISO 8601 date-time string
 * @returns {Promise<PlacementDto[]>}
 */
export async function getPlacementsByDate(date) {
    const response = await api.get('/placement/by-date', { params: { date } })
    return response.data
}

/**
 * Get placements by audio recording ID (authenticated).
 * GET /placement/by-audio-recording/{id}
 * @param {number} id  Audio recording ID
 * @returns {Promise<PlacementDto[]>}
 */
export async function getPlacementsByAudioRecordingId(id) {
    const response = await api.get(`/placement/by-audio-recording/${id}`)
    return response.data
}

/**
 * Get placement by broadcast slot ID (authenticated).
 * GET /placement/by-broadcast-slot/{id}
 * @param {number} id  Broadcast slot ID
 * @returns {Promise<PlacementDto>}
 */
export async function getPlacementByBroadcastSlotId(id) {
    const response = await api.get(`/placement/by-broadcast-slot/${id}`)
    return response.data
}

/**
 * Create a new placement (ADVERTISER, ADMIN).
 * POST /placement with PlacementDto
 * @param {PlacementDto} placementDto
 * @returns {Promise<PlacementDto>}
 */
export async function createPlacement(placementDto) {
    const response = await api.post('/placement', placementDto)
    return response.data
}

/**
 * Update an existing placement (ADVERTISER, ADMIN).
 * PUT /placement with PlacementDto
 * @param {PlacementDto} placementDto
 * @returns {Promise<PlacementDto>}
 */
export async function updatePlacement(placementDto) {
    const response = await api.put('/placement', placementDto)
    return response.data
}

/**
 * Delete a placement by its ID (ADVERTISER, ADMIN).
 * DELETE /placement/{id}
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deletePlacement(id) {
    await api.delete(`/placement/${id}`)
}

/**
 * Calculate placement price (authenticated).
 * POST /placement/price with PlacementDto in request body
 * @param {PlacementDto} placementDto
 * @returns {Promise<number>}
 */
export async function getPlacementPrice(placementDto) {
    const response = await api.post('/placement/price', placementDto)
    return response.data
}
