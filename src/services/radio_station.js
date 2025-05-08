import api from './http'

/**
 * @typedef {object} RadioStationDto
 * @property {number} id
 * @property {string} name
 * @property {number} frequency
 * @property {number} cityId
 * @property {number} representativeId
 */

/**
 * Retrieves all radio stations.
 * GET /radio-station
 * @returns {Promise<RadioStationDto[]>}
 */
export async function getAllRadioStations() {
    const response = await api.get('/radio-station')
    return response.data
}

/**
 * Retrieves a radio station by its ID.
 * GET /radio-station/{id}
 * @param {number} id
 * @returns {Promise<RadioStationDto>}
 */
export async function getRadioStationById(id) {
    const response = await api.get(`/radio-station/${id}`)
    return response.data
}

/**
 * Retrieves a radio station by representative ID.
 * GET /radio-station/representative/{id}
 * @param {number} id
 * @returns {Promise<RadioStationDto>}
 */
export async function getRadioStationByRepresentativeId(id) {
    const response = await api.get(`/radio-station/representative/${id}`)
    return response.data
}

/**
 * Retrieves a radio station by its name.
 * GET /radio-station/by-name?name={name}
 * @param {string} name
 * @returns {Promise<RadioStationDto>}
 */
export async function getRadioStationByName(name) {
    const response = await api.get('/radio-station/by-name', { params: { name } })
    return response.data
}

/**
 * Retrieves radio stations by frequency.
 * GET /radio-station/by-frequency?frequency={frequency}
 * @param {number} frequency
 * @returns {Promise<RadioStationDto[]>}
 */
export async function getRadioStationsByFrequency(frequency) {
    const response = await api.get('/radio-station/by-frequency', { params: { frequency } })
    return response.data
}

/**
 * Retrieves radio stations by city ID.
 * GET /radio-station/by-city/{cityId}
 * @param {number} cityId
 * @returns {Promise<RadioStationDto[]>}
 */
export async function getRadioStationsByCityId(cityId) {
    const response = await api.get(`/radio-station/by-city/${cityId}`)
    return response.data
}

/**
 * Creates a new radio station.
 * POST /radio-station
 * @param {RadioStationDto} stationDto
 * @returns {Promise<RadioStationDto>}
 */
export async function createRadioStation(stationDto) {
    const response = await api.post('/radio-station', stationDto)
    return response.data
}

/**
 * Updates an existing radio station.
 * PUT /radio-station
 * @param {RadioStationDto} stationDto
 * @returns {Promise<RadioStationDto>}
 */
export async function updateRadioStation(stationDto) {
    const response = await api.put('/radio-station', stationDto)
    return response.data
}

/**
 * Deletes a radio station by its ID.
 * DELETE /radio-station/{id}
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteRadioStation(id) {
    await api.delete(`/radio-station/${id}`)
}
