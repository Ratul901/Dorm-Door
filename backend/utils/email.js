import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

let cachedTransporter = null

function hasSmtpConfig() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass)
}

function getTransporter() {
  if (!hasSmtpConfig()) return null
  if (cachedTransporter) return cachedTransporter

  cachedTransporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  })

  return cachedTransporter
}

export async function sendEmail({ to, subject, text, html }) {
  if (!to) {
    return { sent: false, reason: 'missing-recipient' }
  }

  const transporter = getTransporter()
  if (!transporter) {
    // eslint-disable-next-line no-console
    console.log(`[email skipped] ${subject} -> ${to}. SMTP is not configured.`)
    return { sent: false, reason: 'smtp-not-configured' }
  }

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html,
  })

  return { sent: true }
}
