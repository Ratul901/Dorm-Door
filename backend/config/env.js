import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const isProduction = process.env.NODE_ENV === 'production'
const localMongoUri = 'mongodb://127.0.0.1:27017/dormdoor'
const localJwtSecret = 'dormdoor-local-dev-secret-change-me'
const required = isProduction ? ['MONGO_URI', 'JWT_SECRET'] : []

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

if (!process.env.MONGO_URI && !isProduction) {
  // eslint-disable-next-line no-console
  console.warn(`MONGO_URI is not set. Using local development database: ${localMongoUri}`)
}

if (!process.env.JWT_SECRET && !isProduction) {
  // eslint-disable-next-line no-console
  console.warn('JWT_SECRET is not set. Using a local development secret.')
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || localMongoUri,
  jwtSecret: process.env.JWT_SECRET || localJwtSecret,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  googleTranslateApiKey: process.env.GOOGLE_TRANSLATE_API_KEY || '',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || 'Dorm Door <no-reply@dormdoor.local>',
  superAdminName: process.env.SUPER_ADMIN_NAME || 'Super Admin',
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'superadmin@dormdoor.com',
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || 'Super123!',
  superAdminResetPassword: String(process.env.SUPER_ADMIN_RESET_PASSWORD || '').toLowerCase() === 'true',
}
