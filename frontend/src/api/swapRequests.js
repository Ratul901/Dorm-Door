import { api } from './client'

export function getSwapAssignment() {
  return api.get('/swap-requests/assignment')
}

export function listSwapRequests(params = {}) {
  return api.get('/swap-requests', { params })
}

export function createSwapRequest(payload) {
  return api.post('/swap-requests', payload)
}

export function cancelSwapRequest(id) {
  return api.patch(`/swap-requests/${id}/cancel`)
}

export function decideSwapRequest(id, payload) {
  return api.patch(`/swap-requests/${id}/decision`, payload)
}
