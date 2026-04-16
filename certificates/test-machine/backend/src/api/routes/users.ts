import { Router } from 'express'
import { z } from 'zod'
import * as userService from '../../domain/user/user.service.js'
import { authenticate, AuthRequest } from '../middleware/authenticate.js'

export const usersRouter: Router = Router()

usersRouter.get('/me/profile', authenticate, (req: AuthRequest, res) => {
  try {
    const profile = userService.getProfile(req.user!.sub)
    res.json({ success: true, data: profile })
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    res.status(e.status ?? 500).json({ success: false, error: e.message })
  }
})

const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).max(64).optional()
})

usersRouter.patch('/me/profile', authenticate, (req: AuthRequest, res) => {
  const result = UpdateProfileSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ success: false, error: result.error.issues[0].message })
    return
  }
  try {
    const profile = userService.updateProfile(req.user!.sub, result.data)
    res.json({ success: true, data: profile })
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    res.status(e.status ?? 500).json({ success: false, error: e.message })
  }
})

usersRouter.get('/me/history', authenticate, (req: AuthRequest, res) => {
  const history = userService.getHistory(req.user!.sub)
  res.json({ success: true, data: history })
})

usersRouter.get('/me/stats', authenticate, (req: AuthRequest, res) => {
  const stats = userService.getUserStats(req.user!.sub)
  res.json({ success: true, data: stats })
})
