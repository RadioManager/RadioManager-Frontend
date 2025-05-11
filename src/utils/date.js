export function toLocalISOString(date = new Date()) {
    const tzOffsetMs = date.getTimezoneOffset() * 60000
    const localDate = new Date(date.getTime() - tzOffsetMs)
    return localDate.toISOString().slice(0, -1)
}

export function formatDate(dateStr) {
    const d = new Date(dateStr);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()}`;
}