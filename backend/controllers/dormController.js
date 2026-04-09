import { Dorm } from '../models/Dorm.js'
import { Room } from '../models/Room.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'

export const listDorms = asyncHandler(async (req, res) => {
  const { search = '' } = req.query
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { block: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
        ],
      }
    : {}

  const dorms = await Dorm.find(query).sort({ createdAt: -1 }).lean()

  const dormIds = dorms.map((dorm) => dorm._id)
  const rooms = await Room.find({ dorm: { $in: dormIds } }).lean()

  const roomSummary = rooms.reduce((acc, room) => {
    const key = String(room.dorm)
    if (!acc[key]) {
      acc[key] = { rooms: 0, seats: 0, occupied: 0 }
    }
    acc[key].rooms += 1
    acc[key].seats += room.seatCount
    acc[key].occupied += room.occupiedSeats
    return acc
  }, {})

  const enriched = dorms.map((dorm) => {
    const summary = roomSummary[String(dorm._id)] || { rooms: 0, seats: 0, occupied: 0 }
    return {
      ...dorm,
      roomCount: summary.rooms,
      totalSeats: summary.seats,
      occupiedSeats: summary.occupied,
      availableSeats: Math.max(summary.seats - summary.occupied, 0),
    }
  })

  res.json({ success: true, dorms: enriched })
})

export const getDormById = asyncHandler(async (req, res) => {
  const dorm = await Dorm.findById(req.params.id)
  if (!dorm) {
    throw new ApiError(404, 'Dorm not found')
  }

  const rooms = await Room.find({ dorm: dorm._id }).sort({ roomNumber: 1 })

  res.json({
    success: true,
    dorm,
    rooms,
  })
})

export const createDorm = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    managedBy: req.user.id,
  }

  const dorm = await Dorm.create(payload)

  res.status(201).json({
    success: true,
    message: 'Dorm created',
    dorm,
  })
})

export const updateDorm = asyncHandler(async (req, res) => {
  const dorm = await Dorm.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!dorm) {
    throw new ApiError(404, 'Dorm not found')
  }

  res.json({ success: true, message: 'Dorm updated', dorm })
})

export const deleteDorm = asyncHandler(async (req, res) => {
  const dorm = await Dorm.findById(req.params.id)
  if (!dorm) {
    throw new ApiError(404, 'Dorm not found')
  }

  const roomCount = await Room.countDocuments({ dorm: dorm._id })
  if (roomCount > 0) {
    throw new ApiError(400, 'Cannot delete dorm with existing rooms')
  }

  await dorm.deleteOne()
  res.json({ success: true, message: 'Dorm deleted' })
})
