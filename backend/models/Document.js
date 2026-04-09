import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    category: {
      type: String,
      enum: ['Student ID', 'Passport Photo', 'Admission Certificate', 'Health Document', 'Other'],
      default: 'Other',
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'Needs Update'],
      default: 'Pending',
    },
    reviewNote: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
)

export const Document = mongoose.model('Document', documentSchema)
