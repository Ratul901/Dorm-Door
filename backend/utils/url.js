import { ApiError } from './apiError.js'

const MAX_URL_LENGTH = 2048

export function normalizeHttpUrl(value, fieldName = 'url') {
  const raw = String(value || '').trim()
  if (!raw) {
    throw new ApiError(400, `${fieldName} is required`)
  }

  if (raw.length > MAX_URL_LENGTH) {
    throw new ApiError(400, `${fieldName} is too long`)
  }

  let parsed
  try {
    parsed = new URL(raw)
  } catch {
    throw new ApiError(400, `${fieldName} must be a valid URL`)
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new ApiError(400, `${fieldName} must start with http:// or https://`)
  }

  if (!parsed.hostname) {
    throw new ApiError(400, `${fieldName} must include a hostname`)
  }

  if (parsed.username || parsed.password) {
    throw new ApiError(400, `${fieldName} cannot include embedded credentials`)
  }

  return parsed.toString()
}
