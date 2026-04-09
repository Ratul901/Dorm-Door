import { Router } from 'express'
import {
  listDocuments,
  reviewDocument,
  uploadDocumentMetadata,
} from '../controllers/documentController.js'
import { authorize, protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', listDocuments)
router.post('/', authorize('student', 'admin'), uploadDocumentMetadata)
router.patch('/:id/review', authorize('admin'), reviewDocument)

export default router
