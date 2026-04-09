import app from './app.js'
import { connectDatabase } from './config/db.js'
import { env } from './config/env.js'

async function bootstrap() {
  await connectDatabase()

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${env.port}`)
  })
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error)
  process.exit(1)
})
