import { ApiError } from '../utils/apiError.js'

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500
  const payload = {
    success: false,
    message: error.message || 'Internal server error',
  }

  if (process.env.NODE_ENV !== 'production' && error.stack) {
    payload.stack = error.stack
  }

  res.status(statusCode).json(payload)
}
