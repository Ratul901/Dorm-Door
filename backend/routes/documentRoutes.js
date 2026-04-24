import { Router } from 'express'
import {
  listDocuments,
  reviewDocument,
  uploadDocumentMetadata,
} from '../controllers/documentController.js'
import { authorize, protect } from '../middleware/auth.js'
import { uploadDocumentFile } from '../middleware/upload.js'

const router = Router()

router.use(protect)

router.get('/', listDocuments)
router.post('/', authorize('student'), uploadDocumentFile, uploadDocumentMetadata)
router.patch('/:id/review', authorize('admin'), reviewDocument)

export default router
