import api from './http'

export async function getAllCities() {
    const response = await api.get('/city')
    return response.data
}

export async function getCityById(id) {
    const response = await api.get(`/city/${id}`)
    return response.data
}

export async function getCityByNameAndRegion(name, region) {
    const response = await api.get('/city/by-name-and-region', {
        params: { name, region }
    })
    return response.data
}

export async function getCitiesByRegion(region) {
    const response = await api.get(`/city/by-region/${region}`)
    return response.data
}

export async function getCitiesByName(name) {
    const response = await api.get(`/city/by-name/${name}`)
    return response.data
}

export async function createCity(cityDto) {
    const response = await api.post('/city', cityDto)
    return response.data
}

export async function updateCity(cityDto) {
    const response = await api.put('/city', cityDto)
    return response.data
}

export async function deleteCity(id) {
    const response = await api.delete(`/city/${id}`)
    return response.data
}