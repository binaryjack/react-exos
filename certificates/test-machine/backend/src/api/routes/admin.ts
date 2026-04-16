import { Router, Request, Response } from 'express'
import { querySql } from '../../infrastructure/database/connection.js'
import { authenticate, requireRole } from '../middleware/authenticate.js'
import { listAllUsers } from '../../domain/auth/auth.service.js'
import { getQuestionStats } from '../../domain/question/question.service.js'

export const adminRouter: Router = Router()

adminRouter.use(authenticate, requireRole('admin'))

adminRouter.get('/stats', (_req, res) => {
  const questionStats = getQuestionStats()
  const totalQuestions = questionStats.reduce((sum, s) => sum + s.count, 0)

  const sessionCount = querySql<{ count: number }>(
    'SELECT COUNT(*) as count FROM exam_sessions WHERE submittedAt IS NOT NULL'
  )[0].count

  const userCount = querySql<{ count: number }>(
    "SELECT COUNT(*) as count FROM users WHERE role = 'candidate'"
  )[0].count

  res.json({
    success: true,
    data: {
      totalQuestions,
      sessionCount,
      candidateCount: userCount,
      byTopicLevel: questionStats
    }
  })
})

adminRouter.get('/users', (_req, res) => {
  const users = listAllUsers()
  res.json({ success: true, data: users })
})
