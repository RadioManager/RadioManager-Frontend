import api from './http'

/**
 * @typedef {object} TransactionDto
 * @property {number} id
 * @property {number} userId
 * @property {number} adminId
 * @property {number} amount
 * @property {string} transactionDate  // ISO string
 * @property {string} [description]
 */

/**
 * Retrieve all transactions.
 * GET /transaction
 * @returns {Promise<TransactionDto[]>}
 */
export async function getAllTransactions() {
    const response = await api.get('/transaction')
    return response.data
}

/**
 * Retrieve a transaction by its ID.
 * GET /transaction/{id}
 * @param {number} id
 * @returns {Promise<TransactionDto>}
 */
export async function getTransactionById(id) {
    const response = await api.get(`/transaction/${id}`)
    return response.data
}

/**
 * Retrieve transactions belonging to a specific user.
 * GET /transaction/user/{userId}
 * @param {number} userId
 * @returns {Promise<TransactionDto[]>}
 */
export async function getTransactionsByUserId(userId) {
    const response = await api.get(`/transaction/user/${userId}`)
    return response.data
}

/**
 * Retrieve transactions for a specific admin.
 * GET /transaction/admin/{adminId}
 * @param {number} adminId
 * @returns {Promise<TransactionDto[]>}
 */
export async function getTransactionsByAdminId(adminId) {
    const response = await api.get(`/transaction/admin/${adminId}`)
    return response.data
}

/**
 * Retrieve transactions filtered by both admin ID and user ID.
 * GET /transaction/admin-user?adminId={adminId}&userId={userId}
 * @param {number} adminId
 * @param {number} userId
 * @returns {Promise<TransactionDto[]>}
 */
export async function getTransactionsByAdminUser(adminId, userId) {
    const response = await api.get('/transaction/admin-user', {
        params: { adminId, userId }
    })
    return response.data
}

/**
 * Retrieve transactions for the specified transaction date.
 * GET /transaction/by-date?date={ISO_DATE}
 * @param {string} date ISO 8601 date-time string
 * @returns {Promise<TransactionDto[]>}
 */
export async function getTransactionsByDate(date) {
    const response = await api.get('/transaction/by-date', {
        params: { date }
    })
    return response.data
}

/**
 * Create a system transaction.
 * POST /transaction/system
 * @param {TransactionDto} transactionDto
 * @returns {Promise<TransactionDto>}
 */
export async function createSystemTransaction(transactionDto) {
    const response = await api.post('/transaction/system', transactionDto)
    return response.data
}

/**
 * Create a new transaction (admin only).
 * POST /transaction
 * @param {TransactionDto} transactionDto
 * @returns {Promise<TransactionDto>}
 */
export async function createTransaction(transactionDto) {
    const response = await api.post('/transaction', transactionDto)
    return response.data
}

/**
 * Delete a transaction by its ID (admin only).
 * DELETE /transaction/{id}
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteTransaction(id) {
    await api.delete(`/transaction/${id}`)
}
