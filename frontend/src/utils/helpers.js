export function yearOptions(from = 2010) {
  const now = new Date().getFullYear()
  return Array.from({ length: now - from + 1 }, (_, i) => now - i)
}

export function cleanParams(params) {
  const out = {}
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) out[k] = v
  })
  return out
}

export function toQuery(params) {
  const s = new URLSearchParams(cleanParams(params)).toString()
  return s ? `?${s}` : ''
}

export function firstName(name = '') {
  return name.trim().split(' ')[0] || 'there'
}
