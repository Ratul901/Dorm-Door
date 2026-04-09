import { Document } from '../models/Document.js'
import { Notification } from '../models/Notification.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'

async function notify(userId, title, message, type) {
  try {
    await Notification.create({ user: userId, title, message, type })
  } catch {
    // intentionally non-blocking
  }
}

export const listDocuments = asyncHandler(async (req, res) => {
  const query = {}
  if (req.user.role === 'student') {
    query.student = req.user.id
  }

  const documents = await Document.find(query)
    .populate('student', 'name email studentId')
    .populate('application', 'status dorm room')
    .sort({ createdAt: -1 })

  res.json({ success: true, documents })
})

export const uploadDocumentMetadata = asyncHandler(async (req, res) => {
  const { application, category, fileName, fileUrl } = req.body

  if (!fileName || !fileUrl) {
    throw new ApiError(400, 'fileName and fileUrl are required')
  }

  const doc = await Document.create({
    student: req.user.id,
    application,
    category,
    fileName,
    fileUrl,
  })

  await notify(req.user.id, 'Document Uploaded', `${fileName} uploaded successfully.`, 'document')

  res.status(201).json({
    success: true,
    message: 'Document metadata saved',
    document: doc,
  })
})

export const reviewDocument = asyncHandler(async (req, res) => {
  const { status, reviewNote = '' } = req.body

  const allowed = ['Pending', 'Verified', 'Rejected', 'Needs Update']
  if (!allowed.includes(status)) {
    throw new ApiError(400, `Invalid status. Allowed: ${allowed.join(', ')}`)
  }

  const doc = await Document.findById(req.params.id)
  if (!doc) {
    throw new ApiError(404, 'Document not found')
  }

  doc.status = status
  doc.reviewNote = reviewNote
  doc.reviewedBy = req.user.id
  await doc.save()

  await notify(doc.student, 'Document Review Update', `Your document ${doc.fileName} is now ${status}.`, 'document')

  res.json({
    success: true,
    message: 'Document status updated',
    document: doc,
  })
})
