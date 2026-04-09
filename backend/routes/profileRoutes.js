import { Router } from 'express'
import {
  changePassword,
  getProfile,
  updateProfile,
} from '../controllers/profileController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', getProfile)
router.patch('/', updateProfile)
router.patch('/password', changePassword)

export default router
