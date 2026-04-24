const SAFE_PROTOCOLS = new Set(['http:', 'https:'])

export function toSafeExternalUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  try {
    const parsed = new URL(raw)
    if (!SAFE_PROTOCOLS.has(parsed.protocol)) return ''
    if (!parsed.hostname) return ''
    if (parsed.username || parsed.password) return ''
    return parsed.toString()
  } catch {
    return ''
  }
}
