import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { ApiError } from '../utils/apiError.js'

export async function protect(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return next(new ApiError(401, 'Unauthorized: token is missing'))
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret)
    const user = await User.findById(decoded.userId).select('role accountStatus')
    if (!user) {
      return next(new ApiError(401, 'Unauthorized: user not found'))
    }

    if (user.accountStatus === 'blocked') {
      return next(new ApiError(403, 'Forbidden: account is blocked'))
    }

    req.user = {
      id: String(user._id),
      role: user.role,
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
