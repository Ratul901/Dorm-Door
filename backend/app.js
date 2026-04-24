import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { env } from './config/env.js'
import authRoutes from './routes/authRoutes.js'
import dormRoutes from './routes/dormRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import maintenanceRoutes from './routes/maintenanceRoutes.js'
import supportRoutes from './routes/supportRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import translateRoutes from './routes/translateRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

function parseAllowedOrigins(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const allowedOrigins = new Set([
  ...parseAllowedOrigins(env.clientUrl),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
])

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'DormDoor API is running',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/dorms', dormRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/support', supportRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/translate', translateRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
