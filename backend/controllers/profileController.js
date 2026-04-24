import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  res.json({ success: true, user })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name',
    'gender',
    'phone',
    'department',
    'university',
    'address',
    'profileImage',
    'emergencyContact',
    'settings',
  ]

  const updates = {}
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field]
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  })

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  res.json({
    success: true,
    message: 'Profile updated',
    user,
  })
})

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'oldPassword and newPassword are required')
  }

  const user = await User.findById(req.user.id).select('+password')
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  const valid = await user.comparePassword(oldPassword)
  if (!valid) {
    throw new ApiError(400, 'Old password is incorrect')
  }

  user.password = newPassword
  await user.save()

  res.json({
    success: true,
    message: 'Password updated successfully',
  })
})
