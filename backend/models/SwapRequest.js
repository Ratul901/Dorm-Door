import mongoose from 'mongoose'

const swapRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    currentRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    requestedDorm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dorm',
    },
    requestedDormName: {
      type: String,
      default: '',
      trim: true,
      maxlength: 160,
    },
    requestedRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 800,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    adminNote: {
      type: String,
      default: '',
      trim: true,
      maxlength: 800,
    },
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    decidedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

swapRequestSchema.index({ student: 1, status: 1 })
swapRequestSchema.index({ requestedDorm: 1, status: 1 })
swapRequestSchema.index({ requestedRoom: 1, status: 1 })

export const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema)
