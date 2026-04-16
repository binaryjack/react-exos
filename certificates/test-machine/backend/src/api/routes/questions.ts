import { Router } from 'express'
import { z } from 'zod'
import * as questionService from '../../domain/question/question.service.js'
import { QuestionSchema } from '../../domain/question/question.schema.js'
import { authenticate, requireRole } from '../middleware/authenticate.js'

export const questionsRouter: Router = Router()

questionsRouter.get('/', authenticate, (req, res) => {
  const filter = {
    technologyId: req.query.technologyId as string | undefined,
    level: req.query.level as string | undefined,
    topic: req.query.topic as string | undefined,
    type: req.query.type as string | undefined
  }
  const questions = questionService.listQuestions(filter)
  res.json({ success: true, data: questions })
})

questionsRouter.get('/stats', authenticate, requireRole('admin'), (_req, res) => {
  const stats = questionService.getQuestionStats()
  res.json({ success: true, data: stats })
})

questionsRouter.get('/:id', authenticate, (req, res) => {
  const question = questionService.getQuestion(req.params.id as string)
  if (!question) {
    res.status(404).json({ success: false, error: 'Question not found' })
    return
  }
  res.json({ success: true, data: question })
})

questionsRouter.post('/', authenticate, requireRole('admin'), (req, res) => {
  const result = QuestionSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ success: false, error: result.error.issues[0].message })
    return
  }
  try {
    const question = questionService.createQuestion(result.data)
    res.status(201).json({ success: true, data: question })
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    res.status(e.status ?? 500).json({ success: false, error: e.message })
  }
})

questionsRouter.put('/:id', authenticate, requireRole('admin'), (req, res) => {
  const result = QuestionSchema.partial().safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ success: false, error: result.error.issues[0].message })
    return
  }
  try {
    const question = questionService.updateQuestion(req.params.id as string, result.data)
    res.json({ success: true, data: question })
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    res.status(e.status ?? 500).json({ success: false, error: e.message })
  }
})

questionsRouter.delete('/:id', authenticate, requireRole('admin'), (req, res) => {
  try {
    questionService.deleteQuestion(req.params.id as string)
    res.json({ success: true })
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    res.status(e.status ?? 500).json({ success: false, error: e.message })
  }
})

// Bulk import
const BulkImportSchema = z.object({
  questions: z.array(QuestionSchema).min(1)
})

questionsRouter.post('/bulk', authenticate, requireRole('admin'), (req, res) => {
  const result = BulkImportSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ success: false, error: result.error.issues[0].message })
    return
  }
  const created = result.data.questions.map(q => questionService.createQuestion(q))
  res.status(201).json({ success: true, data: created, count: created.length })
})
