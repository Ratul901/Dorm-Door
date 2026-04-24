import mongoose from 'mongoose'
import { connectDatabase } from '../config/db.js'
import { Dorm } from '../models/Dorm.js'
import { User } from '../models/User.js'
import { canonicalDormName, dormCatalog } from './dormCatalog.js'

async function syncDormCatalog() {
  await connectDatabase()

  const admin = await User.findOne({ role: 'admin' }).select('_id').lean()
  const managedBy = admin?._id

  const existingDorms = await Dorm.find({}).lean()
  const existingMap = new Map(
    existingDorms.map((dorm) => [canonicalDormName(dorm.name), dorm]),
  )

  let inserted = 0
  let updated = 0

  for (const dorm of dormCatalog) {
    const key = canonicalDormName(dorm.name)
    const existing = existingMap.get(key)

    if (!existing) {
      await Dorm.create({
        ...dorm,
        managedBy,
      })
      inserted += 1
      continue
    }

    await Dorm.findByIdAndUpdate(existing._id, {
      ...dorm,
      managedBy: existing.managedBy || managedBy,
    })
    updated += 1
  }

  // eslint-disable-next-line no-console
  console.log(`Dorm catalog sync completed. Inserted: ${inserted}, Updated: ${updated}`)
}

syncDormCatalog()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Dorm catalog sync failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.connection.close()
  })
