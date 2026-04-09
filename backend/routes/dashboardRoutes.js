import { Router } from 'express'
import { getAdminOverview, getStudentOverview } from '../controllers/dashboardController.js'
import { authorize, protect } from '../middleware/auth.js'

const router = Router()

router.get('/student', protect, authorize('student', 'admin'), getStudentOverview)
router.get('/admin', protect, authorize('admin'), getAdminOverview)

export default router
