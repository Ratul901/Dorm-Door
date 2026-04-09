import { Router } from 'express'
import {
  addSupportMessage,
  createSupportTicket,
  listSupportTickets,
  updateSupportTicket,
} from '../controllers/supportController.js'
import { authorize, protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', listSupportTickets)
router.post('/', createSupportTicket)
router.post('/:id/messages', addSupportMessage)
router.patch('/:id', authorize('admin'), updateSupportTicket)

export default router
