import api from './http'

/**
 * Authenticate user.
 * Sends POST /auth with { login, password }.
 * Expects UserDto in response body and backend to set JWT cookie via Set-Cookie header.
 */
export async function login({ login, password }) {
    const response = await api.post('/auth', { login, password })
    return response.data
}

/**
 * Logout user.
 * Sends POST /auth/logout to clear JWT cookie and invalidate session.
 */
export async function logout() {
    const response = await api.post('/auth/logout')
    return response.data
}

/**
 * Register new user.
 * Sends POST /auth/register with UserDto.
 */
export async function register(userDto) {
    const response = await api.post('/auth/register', userDto)
    return response.data
}

/**
 * Send password reset code.
 * Sends POST /auth/send-password-reset-code with { email }.
 */
export async function sendPasswordResetCode({ email }) {
    const response = await api.post('/auth/send-password-reset-code', { email })
    return response.data
}

/**
 * Verify reset code.
 * Sends POST /auth/code-verification with { code }.
 */
export async function verifyResetCode({ code }) {
    const response = await api.post('/auth/code-verification', { code })
    return response.data
}

/**
 * Reset password.
 * Sends POST /auth/reset-password with { verificationCode, newPassword }.
 */
export async function resetPassword({ verificationCode, newPassword }) {
    const response = await api.post('/auth/reset-password', { verificationCode, newPassword })
    return response.data
}

/**
 * Get current user's profile using stored JWT in cookie (authenticated)
 * GET /auth/me
 * @returns {Promise<UserDto>}
 */
export async function getProfile() {
    const response = await api.get('/auth/me')
    return response.data
}
