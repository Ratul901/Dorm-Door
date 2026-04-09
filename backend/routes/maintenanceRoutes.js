import { Router } from 'express'
import {
  createMaintenanceTicket,
  listMaintenanceTickets,
  updateMaintenanceTicket,
} from '../controllers/maintenanceController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', listMaintenanceTickets)
router.post('/', createMaintenanceTicket)
router.patch('/:id', updateMaintenanceTicket)

export default router
