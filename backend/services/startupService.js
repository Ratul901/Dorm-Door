import { env } from '../config/env.js'
import { Dorm } from '../models/Dorm.js'
import { User } from '../models/User.js'

export async function repairLegacyIndexes() {
  try {
    const dormIndexes = await Dorm.collection.indexes()
    const legacySlugIndex = dormIndexes.find((index) => index.name === 'slug_1')

    if (legacySlugIndex) {
      await Dorm.collection.dropIndex('slug_1')
      // eslint-disable-next-line no-console
      console.log('Removed legacy dorm slug_1 index.')
    }
  } catch (error) {
    if (error?.codeName === 'IndexNotFound') return
    // eslint-disable-next-line no-console
    console.warn(`Legacy index repair skipped: ${error.message}`)
  }
}

export async function ensureDefaultSuperAdmin() {
  const email = String(env.superAdminEmail || '').trim().toLowerCase()
  const password = String(env.superAdminPassword || '').trim()

  if (!email || !password) {
    // eslint-disable-next-line no-console
    console.warn('Default super admin was not checked because SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD is missing.')
    return null
  }

  const existing = await User.findOne({ email }).select('+password')
  if (!existing) {
    const created = await User.create({
      name: env.superAdminName,
      email,
      password,
      role: 'superAdmin',
      accountStatus: 'active',
    })

    // eslint-disable-next-line no-console
    console.log(`Default super admin ready: ${created.email}`)
    return created
  }

  let changed = false

  if (existing.role !== 'superAdmin') {
    existing.role = 'superAdmin'
    changed = true
  }

  if (existing.accountStatus === 'blocked') {
    existing.accountStatus = 'active'
    changed = true
  }

  if (env.superAdminResetPassword) {
    existing.password = password
    changed = true
  }

  if (changed) {
    await existing.save()
  }

  // eslint-disable-next-line no-console
  console.log(`Default super admin ready: ${existing.email}`)
  return existing
}
