import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { migrate } from './infrastructure/database/schema.js'
import { seed } from './infrastructure/database/seed.js'
import { authRouter } from './api/routes/auth.js'
import { technologiesRouter } from './api/routes/technologies.js'
import { questionsRouter } from './api/routes/questions.js'
import { examsRouter } from './api/routes/exams.js'
import { usersRouter } from './api/routes/users.js'
import { adminRouter } from './api/routes/admin.js'

const PORT = Number(process.env.PORT ?? 3001)
const ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5174'

const app = express()

// ── Security ─────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: ORIGIN, credentials: true }))
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 min
    max: 500,
    standardHeaders: true,
    legacyHeaders: false
  })
)

// ── Parsing / compression ─────────────────────────────────────────────────────
app.use(compression())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter)
app.use('/api/technologies', technologiesRouter)
app.use('/api/questions', questionsRouter)
app.use('/api/exams', examsRouter)
app.use('/api/users', usersRouter)
app.use('/api/admin', adminRouter)

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(err.status ?? 500).json({ success: false, error: err.message ?? 'Internal server error' })
})

// ── Boot ──────────────────────────────────────────────────────────────────────
async function start() {
  await migrate()
  await seed()
  app.listen(PORT, () => {
    console.log(`[server] Running on http://localhost:${PORT}`)
  })
}

start().catch(err => {
  console.error('[server] Fatal error during startup', err)
  process.exit(1)
})
