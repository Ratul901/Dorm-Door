import mongoose from 'mongoose'

const maintenanceUpdateSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      enum: ['student', 'admin', 'staff'],
      default: 'student',
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
)

const maintenanceTicketSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dorm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dorm',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Scheduled', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updates: {
      type: [maintenanceUpdateSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

export const MaintenanceTicket = mongoose.model('MaintenanceTicket', maintenanceTicketSchema)
