import { Router } from 'express'
import {
  createReview,
  listMyReviews,
  listReviews,
  updateReviewStatus,
} from '../controllers/reviewController.js'
import { authorize, protect } from '../middleware/auth.js'

const router = Router()

router.get('/', listReviews)
router.get('/mine', protect, authorize('student', 'admin'), listMyReviews)
router.post('/', protect, authorize('student', 'admin'), createReview)
router.patch('/:id/status', protect, authorize('admin'), updateReviewStatus)

export default router
