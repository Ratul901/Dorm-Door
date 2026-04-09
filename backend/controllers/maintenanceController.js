import { MaintenanceTicket } from '../models/MaintenanceTicket.js'
import { Notification } from '../models/Notification.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'

async function notify(userId, title, message) {
  try {
    await Notification.create({ user: userId, title, message, type: 'maintenance' })
  } catch {
    // intentionally non-blocking
  }
}

export const createMaintenanceTicket = asyncHandler(async (req, res) => {
  const { dorm, room, title, description, priority = 'Medium' } = req.body

  if (!title || !description) {
    throw new ApiError(400, 'title and description are required')
  }

  const ticket = await MaintenanceTicket.create({
    student: req.user.id,
    dorm,
    room,
    title,
    description,
    priority,
    updates: [{ from: 'student', message: 'Ticket created' }],
  })

  await notify(req.user.id, 'Maintenance Ticket Created', `Ticket ${ticket._id} was created successfully.`)

  res.status(201).json({
    success: true,
    message: 'Maintenance ticket created',
    ticket,
  })
})

export const listMaintenanceTickets = asyncHandler(async (req, res) => {
  const query = {}
  if (req.user.role === 'student') {
    query.student = req.user.id
  }

  const tickets = await MaintenanceTicket.find(query)
    .populate('student', 'name email studentId')
    .populate('dorm', 'name block')
    .populate('room', 'roomNumber')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })

  res.json({ success: true, tickets })
})

export const updateMaintenanceTicket = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo, message } = req.body

  const ticket = await MaintenanceTicket.findById(req.params.id)
  if (!ticket) {
    throw new ApiError(404, 'Maintenance ticket not found')
  }

  if (req.user.role === 'student' && String(ticket.student) !== req.user.id) {
    throw new ApiError(403, 'Not allowed to update this ticket')
  }

  if (status) ticket.status = status
  if (priority) ticket.priority = priority
  if (assignedTo) ticket.assignedTo = assignedTo

  if (message) {
    ticket.updates.push({
      from: req.user.role === 'admin' ? 'admin' : 'student',
      message,
    })
  }

  await ticket.save()

  await notify(ticket.student, 'Maintenance Ticket Updated', `Ticket status is now ${ticket.status}.`)

  res.json({ success: true, message: 'Ticket updated', ticket })
})
