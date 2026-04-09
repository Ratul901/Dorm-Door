import { Router } from 'express'
import {
  createApplication,
  getApplicationById,
  listApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js'
import { authorize, protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', listApplications)
router.get('/:id', getApplicationById)
router.post('/', authorize('student', 'admin'), createApplication)
router.patch('/:id/status', authorize('admin'), updateApplicationStatus)

export default router
