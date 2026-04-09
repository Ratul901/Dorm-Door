import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/apiError.js'

export function protect(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return next(new ApiError(401, 'Unauthorized: token is missing'))
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret)
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    }
    next()
  } catch (error) {
    next(new ApiError(401, 'Unauthorized: invalid token'))
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: insufficient privileges'))
    }
    next()
  }
}
