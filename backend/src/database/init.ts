import { initDb } from './connection'

initDb()
  .then(() => {
    console.log('Database initialized successfully!')
  })
  .catch((error) => {
    console.error('Database initialization failed:', error)
    process.exit(1)
  })
