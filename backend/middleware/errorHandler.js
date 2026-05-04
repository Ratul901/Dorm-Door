import { ApiError } from '../utils/apiError.js'

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || 500
  let message = error.message || 'Internal server error'

  if (error?.code === 11000) {
    statusCode = 409
    const duplicateField = Object.keys(error.keyValue || {})[0]
    const labels = {
      email: 'Email',
      studentId: 'Student ID',
      transactionId: 'Transaction ID',
    }
    message = `${labels[duplicateField] || 'Value'} already exists. Please use a different one.`
  }

  const payload = {
    success: false,
    message,
  }

  if (process.env.NODE_ENV !== 'production' && error.stack) {
    payload.stack = error.stack
  }

  res.status(statusCode).json(payload)
}
