import { Router } from 'express'
import {
  cancelSwapRequest,
  createSwapRequest,
  decideSwapRequest,
  getMySwapAssignment,
  listSwapRequests,
} from '../controllers/swapRequestController.js'
import { authorize, protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', listSwapRequests)
router.get('/assignment', authorize('student'), getMySwapAssignment)
router.post('/', authorize('student'), createSwapRequest)
router.patch('/:id/cancel', authorize('student'), cancelSwapRequest)
router.patch('/:id/decision', authorize('admin'), decideSwapRequest)

export default router
