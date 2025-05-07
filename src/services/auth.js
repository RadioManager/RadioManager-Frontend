import api from './http'

export async function login({ login, password }) {
    const response = await api.post('/auth', { login, password })
    return response.data
}

export async function logout() {
    const response = await api.post('/auth/logout')
    return response.data
}

export async function register(userDto) {
    const response = await api.post('/auth/register', userDto)
    return response.data
}

export async function sendPasswordResetCode({ email }) {
    const response = await api.post('/auth/send-password-reset-code', { email })
    return response.data
}

export async function verifyResetCode({ code }) {
    const response = await api.post('/auth/code-verification', { code })
    return response.data
}

export async function resetPassword({ verificationCode, newPassword }) {
    const response = await api.post('/auth/reset-password', { verificationCode, newPassword })
    return response.data
}