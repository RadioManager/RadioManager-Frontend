import api from './http'

/**
 * @typedef {object} UserDto
 * @property {number} id
 * @property {string} login
 * @property {string} password
 * @property {string} name
 * @property {string} surname
 * @property {number} balance
 * @property {'ADVERTISER'|'RADIO_REPRESENTATIVE'|'ADMIN'} role
 */

/**
 * Get all users (ADMIN only).
 * GET /user
 * @returns {Promise<UserDto[]>}
 */
export async function getAllUsers() {
    const response = await api.get('/user')
    return response.data
}

/**
 * Get a user by ID (authenticated).
 * GET /user/{id}
 * @param {number} id
 * @returns {Promise<UserDto>}
 */
export async function getUserById(id) {
    const response = await api.get(`/user/${id}`)
    return response.data
}

/**
 * Get a user by login (authenticated).
 * GET /user/by-login?login={login}
 * @param {string} login
 * @returns {Promise<UserDto>}
 */
export async function getUserByLogin(login) {
    const response = await api.get('/user/by-login', { params: { login } })
    return response.data
}

/**
 * Get users by role (ADMIN only).
 * GET /user/by-role/{role}
 * @param {'ADVERTISER'|'RADIO_REPRESENTATIVE'|'ADMIN'} role
 * @returns {Promise<UserDto[]>}
 */
export async function getUsersByRole(role) {
    const response = await api.get(`/user/by-role/${role}`)
    return response.data
}

/**
 * Create a new user (ADMIN only).
 * POST /user
 * @param {UserDto} userDto
 * @returns {Promise<UserDto>}
 */
export async function createUser(userDto) {
    const response = await api.post('/user', userDto)
    return response.data
}

/**
 * Update an existing user (ADMIN only).
 * PUT /user
 * @param {UserDto} userDto
 * @returns {Promise<UserDto>}
 */
export async function updateUser(userDto) {
    const response = await api.put('/user', userDto)
    return response.data
}

/**
 * Delete a user by ID (ADMIN only).
 * DELETE /user/{id}
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteUser(id) {
    await api.delete(`/user/${id}`)
}

/**
 * Update user balance (authenticated).
 * PUT /user/balance?userId={userId}&balance={balance}
 * @param {number} userId
 * @param {number} balance
 * @returns {Promise<void>}
 */
export async function updateUserBalance(userId, balance) {
    await api.put('/user/balance', null, { params: { userId, balance } })
}

/**
 * Get available roles for user (authenticated).
 * GET /user/roles
 * @returns {Promise<string[]>}
 */
export async function getAvailableRoles() {
    const response = await api.get('/user/roles')
    return response.data
}
