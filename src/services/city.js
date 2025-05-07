import api from './http'

/**
 * @typedef {object} CityDto
 * @property {number} id
 * @property {string} name
 * @property {string} region
 */

/**
 * Retrieve all cities.
 * GET /city
 * @returns {Promise<CityDto[]>}
 */
export async function getAllCities() {
    const response = await api.get('/city')
    return response.data
}

/**
 * Retrieve a city by its ID.
 * GET /city/{id}
 * @param {number} id
 * @returns {Promise<CityDto>}
 */
export async function getCityById(id) {
    const response = await api.get(`/city/${id}`)
    return response.data
}

/**
 * Retrieve a city by name and region.
 * GET /city/by-name-and-region?name={name}&region={region}
 * @param {string} name
 * @param {string} region
 * @returns {Promise<CityDto>}
 */
export async function getCityByNameAndRegion(name, region) {
    const response = await api.get('/city/by-name-and-region', {
        params: { name, region }
    })
    return response.data
}

/**
 * Retrieve cities by region.
 * GET /city/by-region/{region}
 * @param {string} region
 * @returns {Promise<CityDto[]>}
 */
export async function getCitiesByRegion(region) {
    const response = await api.get(`/city/by-region/${region}`)
    return response.data
}

/**
 * Retrieve cities by name.
 * GET /city/by-name/{name}
 * @param {string} name
 * @returns {Promise<CityDto[]>}
 */
export async function getCitiesByName(name) {
    const response = await api.get(`/city/by-name/${name}`)
    return response.data
}

/**
 * Create a new city.
 * POST /city
 * @param {CityDto} cityDto
 * @returns {Promise<CityDto>}
 */
export async function createCity(cityDto) {
    const response = await api.post('/city', cityDto)
    return response.data
}

/**
 * Update an existing city.
 * PUT /city
 * @param {CityDto} cityDto
 * @returns {Promise<CityDto>}
 */
export async function updateCity(cityDto) {
    const response = await api.put('/city', cityDto)
    return response.data
}

/**
 * Delete a city by its ID.
 * DELETE /city/{id}
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteCity(id) {
    const response = await api.delete(`/city/${id}`)
    return response.data
}
