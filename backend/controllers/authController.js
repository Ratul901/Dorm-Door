import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { generateToken } from '../utils/generateToken.js'

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    studentId: user.studentId,
    phone: user.phone,
    department: user.department,
    university: user.university,
    address: user.address,
    emergencyContact: user.emergencyContact,
    settings: user.settings,
  }
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'student', studentId, phone, department, university } = req.body

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required')
  }

  const existing = await User.findOne({ email })
  if (existing) {
    throw new ApiError(409, 'Email already exists')
  }

  if (role === 'student' && !studentId) {
    throw new ApiError(400, 'studentId is required for student registration')
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    studentId,
    phone,
    department,
    university,
  })

  const token = generateToken(user._id, user.role)

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: sanitizeUser(user),
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required')
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const token = generateToken(user._id, user.role)

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: sanitizeUser(user),
  })
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  res.json({
    success: true,
    user: sanitizeUser(user),
  })
})
