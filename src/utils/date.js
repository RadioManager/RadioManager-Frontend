export function toLocalISOString(date = new Date()) {
    const tzOffsetMs = date.getTimezoneOffset() * 60000
    const localDate = new Date(date.getTime() - tzOffsetMs)
    return localDate.toISOString().slice(0, -1)
}