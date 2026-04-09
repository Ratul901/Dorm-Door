import { Application } from '../models/Application.js'
import { Document } from '../models/Document.js'
import { Dorm } from '../models/Dorm.js'
import { MaintenanceTicket } from '../models/MaintenanceTicket.js'
import { Notification } from '../models/Notification.js'
import { Review } from '../models/Review.js'
import { Room } from '../models/Room.js'
import { SupportTicket } from '../models/SupportTicket.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getStudentOverview = asyncHandler(async (req, res) => {
  const student = req.user.id

  const [applications, documents, maintenanceTickets, supportTickets, reviews, notifications] =
    await Promise.all([
      Application.countDocuments({ student }),
      Document.countDocuments({ student }),
      MaintenanceTicket.countDocuments({ student }),
      SupportTicket.countDocuments({ student }),
      Review.countDocuments({ student }),
      Notification.countDocuments({ user: student, read: false }),
    ])

  const recentApplications = await Application.find({ student })
    .populate('dorm', 'name block')
    .populate('room', 'roomNumber type')
    .sort({ createdAt: -1 })
    .limit(5)

  res.json({
    success: true,
    overview: {
      applications,
      documents,
      maintenanceTickets,
      supportTickets,
      reviews,
      unreadNotifications: notifications,
      recentApplications,
    },
  })
})

export const getAdminOverview = asyncHandler(async (req, res) => {
  const [dorms, rooms, applications, pendingApplications, supportOpen, maintenanceOpen] =
    await Promise.all([
      Dorm.countDocuments(),
      Room.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: { $in: ['Pending', 'Under Review'] } }),
      SupportTicket.countDocuments({ status: { $ne: 'Resolved' } }),
      MaintenanceTicket.countDocuments({ status: { $ne: 'Resolved' } }),
    ])

  const roomAggregate = await Room.aggregate([
    {
      $group: {
        _id: null,
        totalSeats: { $sum: '$seatCount' },
        occupiedSeats: { $sum: '$occupiedSeats' },
      },
    },
  ])

  const totalSeats = roomAggregate[0]?.totalSeats || 0
  const occupiedSeats = roomAggregate[0]?.occupiedSeats || 0
  const occupancyRate = totalSeats === 0 ? 0 : Number(((occupiedSeats / totalSeats) * 100).toFixed(2))

  const recentApplications = await Application.find()
    .populate('student', 'name studentId')
    .populate('dorm', 'name block')
    .populate('room', 'roomNumber type')
    .sort({ createdAt: -1 })
    .limit(10)

  res.json({
    success: true,
    overview: {
      dorms,
      rooms,
      applications,
      pendingApplications,
      supportOpen,
      maintenanceOpen,
      totalSeats,
      occupiedSeats,
      availableSeats: Math.max(totalSeats - occupiedSeats, 0),
      occupancyRate,
      recentApplications,
    },
  })
})
