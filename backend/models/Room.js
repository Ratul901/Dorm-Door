import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema(
  {
    dorm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dorm',
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: String,
      default: 'Ground Floor',
    },
    type: {
      type: String,
      enum: ['Single Room', 'Double Room', 'Shared (4 Bed)', 'Studio Suite', 'Premium Studio'],
      default: 'Single Room',
    },
    seatCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    occupiedSeats: {
      type: Number,
      default: 0,
      min: 0,
    },
    priceMonthly: {
      type: Number,
      required: true,
      min: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Open', 'Limited', 'Full', 'Maintenance'],
      default: 'Open',
    },
  },
  {
    timestamps: true,
  },
)

roomSchema.index({ dorm: 1, roomNumber: 1 }, { unique: true })

export const Room = mongoose.model('Room', roomSchema)
