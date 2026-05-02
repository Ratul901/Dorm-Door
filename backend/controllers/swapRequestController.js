import mongoose from 'mongoose'
import { Application } from '../models/Application.js'
import { Dorm } from '../models/Dorm.js'
import { Notification } from '../models/Notification.js'
import { Room } from '../models/Room.js'
import { SwapRequest } from '../models/SwapRequest.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const SWAP_STATUSES = ['Pending', 'Approved', 'Rejected', 'Cancelled']

function normalizeText(value) {
  return String(value || '').trim()
}

function nextRoomStatus(room) {
  if (room.status === 'Maintenance') return 'Maintenance'
  if (room.occupiedSeats >= room.seatCount) return 'Full'
  if (room.occupiedSeats > 0) return 'Limited'
  return 'Open'
}

async function notify(userId, title, message, type = 'system') {
  try {
    await Notification.create({ user: userId, title, message, type })
  } catch {
    // Notifications should not block swap request workflows.
  }
}

function populateAssignment(query) {
  return query
    .populate('dorm', 'name block address')
    .populate('room', 'roomNumber type priceMonthly seatCount occupiedSeats status dorm')
}

async function findResidentAssignment(studentId) {
  const approvedAssignment = await populateAssignment(Application.findOne({
    student: studentId,
    status: 'Approved',
    room: { $exists: true, $ne: null },
  }).sort({ updatedAt: -1 }))

  if (approvedAssignment) {
    return approvedAssignment
  }

  return populateAssignment(Application.findOne({
    student: studentId,
    status: { $ne: 'Rejected' },
    room: { $exists: true, $ne: null },
  }).sort({ updatedAt: -1 }))
}

function ensureObjectId(value, fieldName) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `${fieldName} must be a valid id`)
  }
}

async function validateRequestedRoom(requestedRoomId, currentRoom, requestedDormId = '') {
  ensureObjectId(requestedRoomId, 'requestedRoom')

  const requestedRoom = await Room.findById(requestedRoomId).populate('dorm', 'name block address')
  if (!requestedRoom) {
    throw new ApiError(404, 'Requested room not found')
  }

  if (String(requestedRoom._id) === String(currentRoom._id)) {
    throw new ApiError(400, 'Requested room must be different from your current room')
  }

  if (requestedDormId && String(requestedRoom.dorm?._id || requestedRoom.dorm) !== String(requestedDormId)) {
    throw new ApiError(400, 'Requested room must belong to the selected dorm')
  }

  if (requestedRoom.status === 'Maintenance') {
    throw new ApiError(400, 'Requested room is currently under maintenance')
  }

  if (requestedRoom.occupiedSeats >= requestedRoom.seatCount || requestedRoom.status === 'Full') {
    throw new ApiError(400, 'Requested room has no available seats')
  }

  return requestedRoom
}

async function validateRequestedDorm(requestedDormId) {
  if (!requestedDormId) return null
  ensureObjectId(requestedDormId, 'requestedDorm')

  const dorm = await Dorm.findById(requestedDormId)
  if (!dorm) {
    throw new ApiError(404, 'Requested dorm not found')
  }

  if (dorm.status !== 'active') {
    throw new ApiError(400, 'Requested dorm is not active')
  }

  return dorm
}

async function applyApprovedSwap(swapRequest, assignedRoomId) {
  const application = await Application.findById(swapRequest.application)
  if (!application) {
    throw new ApiError(404, 'Approved application not found')
  }

  if (application.status !== 'Approved') {
    throw new ApiError(400, 'Student no longer has an approved room assignment')
  }

  if (String(application.room) !== String(swapRequest.currentRoom)) {
    throw new ApiError(400, 'Current room assignment changed before approval')
  }

  const currentRoom = await Room.findById(swapRequest.currentRoom)
  if (!currentRoom) {
    throw new ApiError(404, 'Current room not found')
  }

  if (!assignedRoomId) {
    throw new ApiError(400, 'Assign an available room before approving this swap request')
  }

  ensureObjectId(assignedRoomId, 'requestedRoom')

  const requestedRoom = await Room.findById(assignedRoomId)
  if (!requestedRoom) {
    throw new ApiError(404, 'Requested room not found')
  }

  if (requestedRoom.status === 'Maintenance') {
    throw new ApiError(400, 'Requested room is currently under maintenance')
  }

  if (requestedRoom.occupiedSeats >= requestedRoom.seatCount) {
    throw new ApiError(400, 'Requested room has no available seats')
  }

  if (
    swapRequest.requestedDorm &&
    String(requestedRoom.dorm) !== String(swapRequest.requestedDorm)
  ) {
    throw new ApiError(400, 'Assigned room must belong to the requested dorm')
  }

  currentRoom.occupiedSeats = Math.max(0, currentRoom.occupiedSeats - 1)
  currentRoom.status = nextRoomStatus(currentRoom)

  requestedRoom.occupiedSeats = Math.min(requestedRoom.seatCount, requestedRoom.occupiedSeats + 1)
  requestedRoom.status = nextRoomStatus(requestedRoom)

  application.room = requestedRoom._id
  swapRequest.requestedRoom = requestedRoom._id

  await currentRoom.save()
  await requestedRoom.save()
  await application.save()
}

async function populateSwapRequest(query) {
  return query
    .populate('student', 'name email studentId department')
    .populate('application', 'status personalInfo preferences')
    .populate({
      path: 'currentRoom',
      select: 'roomNumber type priceMonthly seatCount occupiedSeats status dorm',
      populate: { path: 'dorm', select: 'name block address' },
    })
    .populate('requestedDorm', 'name block address')
    .populate({
      path: 'requestedRoom',
      select: 'roomNumber type priceMonthly seatCount occupiedSeats status dorm',
      populate: { path: 'dorm', select: 'name block address' },
    })
    .populate('decidedBy', 'name email')
}

export const getMySwapAssignment = asyncHandler(async (req, res) => {
  const application = await findResidentAssignment(req.user.id)
  const rooms = application?.room?.dorm
    ? await Room.find({
        _id: { $ne: application.room._id },
        status: { $ne: 'Maintenance' },
      })
        .populate('dorm', 'name block address')
        .sort({ roomNumber: 1 })
    : []
  const dorms = application
    ? await Dorm.find({ status: 'active' }).sort({ name: 1 })
    : []

  res.json({
    success: true,
    assignment: application,
    dorms,
    rooms,
  })
})

export const createSwapRequest = asyncHandler(async (req, res) => {
  const requestedRoomId = normalizeText(req.body.requestedRoom)
  const requestedDormId = normalizeText(req.body.requestedDorm)
  const requestedDormName = normalizeText(req.body.requestedDormName)
  const reason = normalizeText(req.body.reason)

  if (!requestedRoomId && !requestedDormId && !requestedDormName) {
    throw new ApiError(400, 'Choose a dorm, type a dorm name, or choose an available room')
  }

  if (!reason) {
    throw new ApiError(400, 'reason is required')
  }

  const assignment = await findResidentAssignment(req.user.id)
  if (!assignment || !assignment.room) {
    throw new ApiError(400, 'Only residents with an assigned room can request a swap')
  }

  const existingPending = await SwapRequest.findOne({
    student: req.user.id,
    status: 'Pending',
  })

  if (existingPending) {
    throw new ApiError(400, 'You already have a pending swap request')
  }

  const requestedDorm = await validateRequestedDorm(requestedDormId)
  const requestedRoom = requestedRoomId
    ? await validateRequestedRoom(requestedRoomId, assignment.room, requestedDorm?._id)
    : null

  const finalRequestedDorm = requestedRoom?.dorm?._id || requestedRoom?.dorm || requestedDorm?._id

  const swapRequest = await SwapRequest.create({
    student: req.user.id,
    application: assignment._id,
    currentRoom: assignment.room._id,
    requestedDorm: finalRequestedDorm,
    requestedDormName: requestedDormName || requestedDorm?.name || requestedRoom?.dorm?.name || '',
    requestedRoom: requestedRoom?._id,
    reason,
  })

  await notify(req.user.id, 'Dorm Swap Requested', 'Your dorm swap request was submitted successfully.')

  const populated = await populateSwapRequest(SwapRequest.findById(swapRequest._id))

  res.status(201).json({
    success: true,
    message: 'Swap request submitted',
    swapRequest: populated,
  })
})

export const listSwapRequests = asyncHandler(async (req, res) => {
  const { status } = req.query
  const query = {}

  if (req.user.role === 'student') {
    query.student = req.user.id
  }

  if (status) {
    if (!SWAP_STATUSES.includes(status)) {
      throw new ApiError(400, `Invalid status. Allowed: ${SWAP_STATUSES.join(', ')}`)
    }
    query.status = status
  }

  const swapRequests = await populateSwapRequest(
    SwapRequest.find(query).sort({ createdAt: -1 }),
  )

  res.json({ success: true, swapRequests })
})

export const cancelSwapRequest = asyncHandler(async (req, res) => {
  const swapRequest = await SwapRequest.findById(req.params.id)
  if (!swapRequest) {
    throw new ApiError(404, 'Swap request not found')
  }

  if (String(swapRequest.student) !== req.user.id) {
    throw new ApiError(403, 'Not allowed to cancel this swap request')
  }

  if (swapRequest.status !== 'Pending') {
    throw new ApiError(400, 'Only pending swap requests can be cancelled')
  }

  swapRequest.status = 'Cancelled'
  await swapRequest.save()

  const populated = await populateSwapRequest(SwapRequest.findById(swapRequest._id))

  res.json({
    success: true,
    message: 'Swap request cancelled',
    swapRequest: populated,
  })
})

export const decideSwapRequest = asyncHandler(async (req, res) => {
  const status = normalizeText(req.body.status)
  const adminNote = normalizeText(req.body.adminNote)
  const requestedRoomId = normalizeText(req.body.requestedRoom || req.body.assignedRoom)

  if (!['Approved', 'Rejected'].includes(status)) {
    throw new ApiError(400, 'Admin decision must be Approved or Rejected')
  }

  if (status === 'Rejected' && !adminNote) {
    throw new ApiError(400, 'adminNote is required when rejecting a swap request')
  }

  const swapRequest = await SwapRequest.findById(req.params.id)
  if (!swapRequest) {
    throw new ApiError(404, 'Swap request not found')
  }

  if (swapRequest.status !== 'Pending') {
    throw new ApiError(400, 'Only pending swap requests can be updated by admin')
  }

  if (status === 'Approved') {
    await applyApprovedSwap(swapRequest, requestedRoomId || swapRequest.requestedRoom)
  }

  swapRequest.status = status
  swapRequest.adminNote = adminNote
  swapRequest.decidedBy = req.user.id
  swapRequest.decidedAt = new Date()
  await swapRequest.save()

  await notify(
    swapRequest.student,
    'Dorm Swap Updated',
    `Your dorm swap request was ${status.toLowerCase()}.`,
  )

  const populated = await populateSwapRequest(SwapRequest.findById(swapRequest._id))

  res.json({
    success: true,
    message: `Swap request ${status.toLowerCase()}`,
    swapRequest: populated,
  })
})
