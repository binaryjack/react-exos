import { Router } from 'express'
import { z } from 'zod'
import * as techService from '../../domain/technology/technology.service.js'
import { authenticate } from '../middleware/authenticate.js'
import { requireRole } from '../middleware/authenticate.js'

export const technologiesRouter: Router = Router()

technologiesRouter.get('/', (_req, res) => {
  const all = techService.listTechnologies(true)
  res.json({ success: true, data: all })
})

technologiesRouter.get('/all', authenticate, requireRole('admin'), (_req, res) => {
  const all = techService.listTechnologies(false)
  res.json({ success: true, data: all })
})

technologiesRouter.get('/:id', (req, res) => {
  const tech = techService.getTechnology(req.params.id as string)
  if (!tech) {
    res.status(404).json({ success: false, error: 'Technology not found' })
    return
  }
  res.json({ success: true, data: tech })
})

const CreateSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(64),
  description: z.string().optional(),
  levels: z.array(z.string().min(1)).min(1)
})

technologiesRouter.post('/', authenticate, requireRole('admin'), (req, res) => {
  const result = CreateSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ success: false, error: result.error.issues[0].message })
    return
  }
  try {
    const tech = techService.createTechnology(result.data)
    res.status(201).json({ success: true, data: tech })
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    res.status(e.status ?? 500).json({ success: false, error: e.message })
  }
})

const UpdateSchema = z.object({
  name: z.string().min(1).max(64).optional(),
  description: z.string().optional(),
  levels: z.array(z.string().min(1)).optional(),
  isActive: z.boolean().optional()
})

technologiesRouter.patch('/:id', authenticate, requireRole('admin'), (req, res) => {
  const result = UpdateSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ success: false, error: result.error.issues[0].message })
    return
  }
  try {
    const tech = techService.updateTechnology(req.params.id as string, result.data)
    res.json({ success: true, data: tech })
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    res.status(e.status ?? 500).json({ success: false, error: e.message })
  }
})
